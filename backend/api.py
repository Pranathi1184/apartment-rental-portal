from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from datetime import datetime, date, timedelta
from sqlalchemy import func
from extensions import db
from models import User, Tower, Unit, Amenity, Booking, Lease, Payment, UnitAmenity, ServiceProvider
from auth import admin_required

api_bp = Blueprint('api', __name__)



# --- Dashboard Stats (Admin) ---
@api_bp.route('/stats', methods=['GET'])
@admin_required()
def get_stats():
    total_units = Unit.query.count()
    occupied_units = Unit.query.filter_by(status='Occupied').count()
    available_units = Unit.query.filter_by(status='Vacant').count()
    occupancy_rate = (occupied_units / total_units * 100) if total_units > 0 else 0
    
    return jsonify({
        "total_units": total_units,
        "occupied_units": occupied_units,
        "available_units": available_units,
        "occupancy_rate": round(occupancy_rate, 2)
    })

# --- Towers ---
@api_bp.route('/towers', methods=['GET'])
@jwt_required()
def get_towers():
    towers = Tower.query.all()
    return jsonify([{
        'id': str(t.id),
        'name': t.name,
        'location': t.location
    } for t in towers])

@api_bp.route('/towers', methods=['POST'])
@admin_required()
def create_tower():
    data = request.get_json()
    tower = Tower(name=data['name'], location=data.get('location'))
    db.session.add(tower)
    db.session.commit()
    return jsonify({'msg': 'Tower created', 'id': str(tower.id)}), 201

# --- Units ---
@api_bp.route('/units', methods=['GET'])
@jwt_required()
def get_units():
    claims = get_jwt()
    role = claims.get('role')
    
    query = Unit.query
    # Residents only see Vacant units usually, but requirements say "Browse Flats"
    # Step 5.2 says "Shows only AVAILABLE units" for User.
    # Step 6.2 says "Shows ALL units" for Admin.
    
    if role != 'Admin':
        query = query.filter_by(status='Vacant')
        
    units = query.all()
    
    results = []
    for u in units:
        results.append({
            'id': str(u.id),
            'tower_id': str(u.tower_id) if u.tower_id else None,
            'unit_number': u.unit_number,
            'floor': u.floor,
            'status': u.status,
            'tower_name': u.tower.name if u.tower else 'N/A',
            'amenities': [a.name for a in u.amenities],
            'amenity_ids': [str(a.id) for a in u.amenities],
            'photos': u.photos,
            'nearby_places': u.nearby_places
        })
    return jsonify(results)

@api_bp.route('/units', methods=['POST'])
@admin_required()
def create_unit():
    data = request.get_json()
    unit = Unit(
        tower_id=data['tower_id'],
        unit_number=data['unit_number'],
        floor=data['floor'],
        status=data.get('status', 'Vacant'),
        photos=data.get('photos'),
        nearby_places=data.get('nearby_places')
    )
    
    # Handle Amenities
    if 'amenities' in data and isinstance(data['amenities'], list):
        for amenity_id in data['amenities']:
            amenity = Amenity.query.get(amenity_id)
            if amenity:
                unit.amenities.append(amenity)

    db.session.add(unit)
    db.session.commit()
    return jsonify({'msg': 'Unit created', 'id': str(unit.id)}), 201

@api_bp.route('/units/<unit_id>', methods=['PUT'])
@admin_required()
def update_unit(unit_id):
    unit = Unit.query.get_or_404(unit_id)
    data = request.get_json()
    
    if 'unit_number' in data:
        unit.unit_number = data['unit_number']
    if 'floor' in data:
        unit.floor = data['floor']
    if 'status' in data:
        unit.status = data['status']
    if 'photos' in data:
        unit.photos = data['photos']
    if 'nearby_places' in data:
        unit.nearby_places = data['nearby_places']
    
    # Handle Amenities (Replace existing)
    if 'amenities' in data and isinstance(data['amenities'], list):
        unit.amenities = [] # Clear existing
        for amenity_id in data['amenities']:
            amenity = Amenity.query.get(amenity_id)
            if amenity:
                unit.amenities.append(amenity)
        
    db.session.commit()
    return jsonify({'msg': 'Unit updated'}), 200

# --- Amenities ---
@api_bp.route('/amenities', methods=['GET'])
@jwt_required()
def get_amenities():
    amenities = Amenity.query.all()
    return jsonify([{
        'id': str(a.id),
        'name': a.name,
        'category': a.category,
        'description': a.description
    } for a in amenities])

@api_bp.route('/amenities', methods=['POST'])
@admin_required()
def create_amenity():
    data = request.get_json()
    amenity = Amenity(
        name=data['name'],
        category=data.get('category', 'UnitFeature'),
        description=data.get('description'),
        is_bookable=data.get('is_bookable', False)
    )
    db.session.add(amenity)
    db.session.commit()
    return jsonify({'msg': 'Amenity created', 'id': str(amenity.id)}), 201

@api_bp.route('/units/<unit_id>/amenities', methods=['POST'])
@admin_required()
def assign_amenity(unit_id):
    data = request.get_json()
    amenity_id = data['amenity_id']
    
    # Check if exists
    exists = UnitAmenity.query.filter_by(unit_id=unit_id, amenity_id=amenity_id).first()
    if exists:
        return jsonify({'msg': 'Already assigned'}), 400
        
    assignment = UnitAmenity(unit_id=unit_id, amenity_id=amenity_id)
    db.session.add(assignment)
    db.session.commit()
    return jsonify({'msg': 'Amenity assigned'}), 201

# --- Bookings (For Flats/Units - Interpreting "Booking Flats" from Step 5.4) ---
# Note: The 'Booking' model in models.py has 'amenity_id' which suggests it's for amenity bookings.
# However, the requirements Step 5.4 says "User can request booking for an available flat".
# AND Step 6.7 says "Approving booking... Creates lease... Marks unit as OCCUPIED".
# This implies there is a "Unit Booking" concept.
# The current 'Booking' model links to 'Amenity'. I should probably adjust it or overload it.
# OR, maybe 'Amenity' can be 'None' for Unit bookings? Or I should add a 'unit_id' to Booking.
# Let's Modify the Booking model to support Unit bookings as well. 
# BUT, I cannot easily change the DB schema without migration or dropping tables. 
# Since I am in early dev, I will modify models.py to add unit_id to Booking and make amenity_id nullable.
# I will do this in a separate step. For now, let's assume I will fix the model.

@api_bp.route('/bookings', methods=['GET'])
@jwt_required()
def get_bookings():
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    
    if claims.get('role') == 'Admin':
        bookings = Booking.query.all()
    else:
        bookings = Booking.query.filter_by(user_id=current_user_id).all()
        
    results = []
    for b in bookings:
        item = {
            'id': str(b.id),
            'status': b.status,
            'start_time': b.start_time.isoformat() if b.start_time else None,
            'end_time': b.end_time.isoformat() if b.end_time else None,
            'user_email': b.resident.email
        }
        # Handle if it's a unit booking or amenity booking
        if hasattr(b, 'unit') and b.unit:
             item['type'] = 'Unit'
             item['target_name'] = b.unit.unit_number
             item['unit_id'] = str(b.unit.id)
        elif b.amenity:
             item['type'] = 'Amenity'
             item['target_name'] = b.amenity.name
        
        results.append(item)
    return jsonify(results)

@api_bp.route('/bookings', methods=['POST'])
@jwt_required()
def create_booking():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # "Booking Flats"
    if 'unit_id' in data:
        unit = Unit.query.get(data['unit_id'])
        if not unit or unit.status != 'Vacant':
            return jsonify({'msg': 'Unit not available'}), 400
            
        # Check active bookings
        existing = Booking.query.filter_by(user_id=current_user_id, status='Pending').join(Unit).filter(Unit.id == unit.id).first()
        # Note: The above query assumes I fix the relationship. 
        
        booking = Booking(
            user_id=current_user_id,
            unit_id=data['unit_id'],
            start_time=datetime.utcnow(), # Placeholder for request time
            end_time=datetime.utcnow() + timedelta(days=365), # Default 1 year lease request?
            status='Pending'
        )
        db.session.add(booking)
        db.session.commit()
        return jsonify({'msg': 'Booking requested', 'id': str(booking.id)}), 201

    return jsonify({'msg': 'Invalid booking request'}), 400

@api_bp.route('/bookings/<booking_id>/approve', methods=['PUT'])
@admin_required()
def approve_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    
    if booking.status != 'Pending':
        return jsonify({'msg': 'Booking not pending'}), 400
        
    # Logic for Unit Booking Approval
    if hasattr(booking, 'unit_id') and booking.unit_id:
        # 1. Create Lease
        lease = Lease(
            unit_id=booking.unit_id,
            resident_id=booking.user_id,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=365),
            rent_amount=1000.00, # Should probably come from Unit or Booking
            status='Active'
        )
        db.session.add(lease)
        
        # 2. Update Unit Status
        unit = Unit.query.get(booking.unit_id)
        unit.status = 'Occupied'
        
        # 3. Update Booking Status
        booking.status = 'Approved'
        
        db.session.commit()
        return jsonify({'msg': 'Booking approved, Lease created'}), 200
        
    return jsonify({'msg': 'Not a unit booking'}), 400

@api_bp.route('/bookings/<booking_id>/reject', methods=['PUT'])
@admin_required()
def reject_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    booking.status = 'Rejected'
    db.session.commit()
    return jsonify({'msg': 'Booking rejected'}), 200

# --- Leases ---
@api_bp.route('/leases/current', methods=['GET'])
@jwt_required()
def get_current_lease():
    current_user_id = get_jwt_identity()
    lease = Lease.query.filter_by(resident_id=current_user_id, status='Active').first()
    
    if not lease:
        return jsonify({'msg': 'No active lease found'}), 404
        
    return jsonify({
        'id': str(lease.id),
        'unit_number': lease.unit.unit_number,
        'rent_amount': str(lease.rent_amount),
        'start_date': lease.start_date.isoformat(),
        'end_date': lease.end_date.isoformat()
    })

@api_bp.route('/leases', methods=['GET'])
@jwt_required()
def get_leases():
    current_user_id = get_jwt_identity()
    leases = Lease.query.filter_by(resident_id=current_user_id, status='Active').all()
    
    results = []
    for lease in leases:
        results.append({
            'id': str(lease.id),
            'unit_number': lease.unit.unit_number,
            'tower_name': lease.unit.tower.name if lease.unit.tower else 'N/A',
            'rent_amount': str(lease.rent_amount),
            'start_date': lease.start_date.isoformat(),
            'end_date': lease.end_date.isoformat()
        })
    return jsonify(results)

# --- Payments ---
@api_bp.route('/payments', methods=['GET'])
@jwt_required()
def get_payments():
    claims = get_jwt()
    current_user_id = get_jwt_identity()
    
    if claims.get('role') == 'Admin':
        payments = Payment.query.all()
    else:
        # User sees payments for their leases
        payments = Payment.query.join(Lease).filter(Lease.resident_id == current_user_id).all()
        
    return jsonify([{
        'id': str(p.id),
        'lease_id': str(p.lease_id),
        'amount': str(p.amount),
        'date': p.payment_date.isoformat(),
        'type': p.payment_type,
        'status': p.status,
        'resident_email': p.lease.resident.email if p.lease and p.lease.resident else 'Unknown',
        'unit_number': p.lease.unit.unit_number if p.lease and p.lease.unit else 'Unknown',
        'tower_name': p.lease.unit.tower.name if p.lease and p.lease.unit and p.lease.unit.tower else 'N/A'
    } for p in payments])

@api_bp.route('/payments', methods=['POST'])
@jwt_required()
def make_payment():
    data = request.get_json()
    # Mock payment
    payment = Payment(
        lease_id=data['lease_id'],
        amount=data['amount'],
        payment_type=data.get('type', 'Rent'),
        status='Completed'
    )
    db.session.add(payment)
    db.session.commit()
    return jsonify({'msg': 'Payment successful'}), 201

# --- Tenants (Admin) ---
@api_bp.route('/tenants', methods=['GET'])
@admin_required()
def get_tenants():
    # Active leases
    leases = Lease.query.filter_by(status='Active').all()
    return jsonify([{
        'id': str(l.resident.id),
        'name': f"{l.resident.first_name} {l.resident.last_name}",
        'email': l.resident.email,
        'unit': l.unit.unit_number,
        'lease_start': l.start_date.isoformat(),
        'lease_end': l.end_date.isoformat()
    } for l in leases])

# --- Community Connect ---
@api_bp.route('/service-providers', methods=['GET'])
@jwt_required()
def get_service_providers():
    type_filter = request.args.get('type')
    
    query = ServiceProvider.query
    if type_filter and type_filter != 'All':
        query = query.filter_by(service_type=type_filter)
        
    providers = query.all()
    return jsonify([p.to_dict() for p in providers])
