
from flask import Blueprint, request, jsonify
from extensions import db
from models import User, ServiceProvider, AuditLog
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from werkzeug.security import generate_password_hash
from functools import wraps
import uuid

admin_bp = Blueprint('admin_bp', __name__)

def admin_required():
    def wrapper(fn):
        @wraps(fn)
        @jwt_required()
        def decorator(*args, **kwargs):
            claims = get_jwt()
            if claims.get("role") != "Admin":
                return jsonify({"msg": "Admins only!"}), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper

def log_admin_action(admin_id, action, target_id=None, details=None):
    try:
        log = AuditLog(
            admin_id=admin_id,
            action=action,
            target_id=target_id,
            details=details
        )
        db.session.add(log)
        # We don't commit here to allow the caller to commit as part of the transaction
    except Exception as e:
        print(f"Failed to create audit log: {e}")

@admin_bp.route('/users', methods=['POST'])
@admin_required()
def create_user():
    data = request.get_json()
    
    # Validation
    required_fields = ['email', 'password', 'role', 'first_name', 'last_name']
    for field in required_fields:
        if field not in data:
            return jsonify({"msg": f"Missing field: {field}"}), 400
            
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"msg": "Email already exists"}), 409

    if data['role'] not in ['Admin', 'Resident', 'Staff']: 
        return jsonify({"msg": "Invalid role"}), 400

    # Hierarchical Admin Check
    if data['role'] == 'Admin':
        current_user_id = get_jwt_identity()
        current_admin = User.query.get(current_user_id)
        if not current_admin or not current_admin.is_super_admin:
            return jsonify({"msg": "Unauthorized: Only Super Admins can create new Admins"}), 403

    try:
        new_user = User(
            email=data['email'],
            password_hash=generate_password_hash(data['password']),
            role=data['role'],
            is_super_admin=False, # New admins are never super admins
            first_name=data['first_name'],
            last_name=data['last_name'],
            phone=data.get('phone')
        )
        
        db.session.add(new_user)
        db.session.flush() # Get ID
        
        current_user_id = get_jwt_identity()
        log_admin_action(
            admin_id=current_user_id,
            action='CREATE_USER',
            target_id=new_user.id,
            details={'email': new_user.email, 'role': new_user.role}
        )
        
        db.session.commit()
        return jsonify({"msg": "User created successfully", "id": str(new_user.id)}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": str(e)}), 500

@admin_bp.route('/users', methods=['GET'])
@admin_required()
def get_users():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user:
        return jsonify({"msg": "User not found"}), 404

    query = User.query
    
    # Filter out admins if the requester is not a super admin
    if not current_user.is_super_admin:
        query = query.filter(User.role != 'Admin')
    
    users = query.all()
    return jsonify([u.to_dict() for u in users]), 200

@admin_bp.route('/service-providers', methods=['POST'])
@admin_required()
def create_service_provider():
    data = request.get_json()
    
    # Validation
    required_fields = ['name', 'service_type', 'phone_number']
    for field in required_fields:
        if field not in data:
            return jsonify({"msg": f"Missing field: {field}"}), 400

    valid_types = ['Maid', 'Cook', 'Driver', 'Cleaner', 'Plumber', 'Electrician', 'Carpenter']
    if data['service_type'] not in valid_types:
        return jsonify({"msg": f"Invalid service type. Must be one of {valid_types}"}), 400

    try:
        new_provider = ServiceProvider(
            name=data['name'],
            service_type=data['service_type'],
            phone_number=data['phone_number'],
            rating=data.get('rating', 4.5),
            is_verified=True, # Admins creating them implies verification
            photo_url=data.get('photo_url'),
            availability=data.get('availability', '9 AM - 6 PM')
        )
        
        db.session.add(new_provider)
        db.session.flush()
        
        current_user_id = get_jwt_identity()
        log_admin_action(
            admin_id=current_user_id,
            action='CREATE_SERVICE_PROVIDER',
            target_id=new_provider.id,
            details={'name': new_provider.name, 'type': new_provider.service_type}
        )
        
        db.session.commit()
        return jsonify({"msg": "Service provider created successfully", "id": str(new_provider.id)}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": str(e)}), 500
