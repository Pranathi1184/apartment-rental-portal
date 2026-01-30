
import uuid
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import ForeignKey
from extensions import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False)  # 'Admin', 'Resident'
    is_super_admin = db.Column(db.Boolean, default=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    leases = db.relationship('Lease', backref='resident', lazy=True)
    bookings = db.relationship('Booking', backref='resident', lazy=True)

    def to_dict(self):
        return {
            'id': str(self.id),
            'email': self.email,
            'role': self.role,
            'is_super_admin': self.is_super_admin,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'phone': self.phone
        }

class Tower(db.Model):
    __tablename__ = 'towers'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(100), nullable=False, unique=True)
    location = db.Column(db.String(255))
    
    # Relationships
    units = db.relationship('Unit', backref='tower', lazy=True)

class Unit(db.Model):
    __tablename__ = 'units'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tower_id = db.Column(UUID(as_uuid=True), ForeignKey('towers.id'), nullable=False)
    unit_number = db.Column(db.String(20), nullable=False)
    floor = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(50), default='Vacant')  # Vacant, Occupied, Maintenance
    photos = db.Column(db.JSON, nullable=True) # List of image URLs
    nearby_places = db.Column(db.JSON, nullable=True) # List of places or text description
    
    # Relationships
    leases = db.relationship('Lease', backref='unit', lazy=True)
    amenities = db.relationship('Amenity', secondary='unit_amenities', backref='units')

class Amenity(db.Model):
    __tablename__ = 'amenities'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text)
    category = db.Column(db.String(50), default='UnitFeature') # UnitFeature, CommonArea
    is_bookable = db.Column(db.Boolean, default=False)

class UnitAmenity(db.Model):
    __tablename__ = 'unit_amenities'

    unit_id = db.Column(UUID(as_uuid=True), ForeignKey('units.id'), primary_key=True)
    amenity_id = db.Column(UUID(as_uuid=True), ForeignKey('amenities.id'), primary_key=True)

class Booking(db.Model):
    __tablename__ = 'bookings'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    # Flexible booking: can be for amenity or unit
    amenity_id = db.Column(UUID(as_uuid=True), ForeignKey('amenities.id'), nullable=True)
    unit_id = db.Column(UUID(as_uuid=True), ForeignKey('units.id'), nullable=True)
    
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(50), default='Pending') # Pending, Confirmed, Cancelled, Approved, Rejected
    
    amenity = db.relationship('Amenity', backref='bookings')
    unit = db.relationship('Unit', backref='bookings')

class Lease(db.Model):
    __tablename__ = 'leases'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    unit_id = db.Column(UUID(as_uuid=True), ForeignKey('units.id'), nullable=False)
    resident_id = db.Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    rent_amount = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(50), default='Active') # Active, Terminated, Expired
    
    payments = db.relationship('Payment', backref='lease', lazy=True)

class Payment(db.Model):
    __tablename__ = 'payments'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lease_id = db.Column(UUID(as_uuid=True), ForeignKey('leases.id'), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    payment_date = db.Column(db.DateTime, default=datetime.utcnow)
    payment_type = db.Column(db.String(50), nullable=False) # Rent, Deposit, Fee
    status = db.Column(db.String(50), default='Completed') # Pending, Completed, Failed

class ServiceProvider(db.Model):
    __tablename__ = 'service_providers'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(100), nullable=False)
    service_type = db.Column(db.String(50), nullable=False) # 'Maid', 'Cook', 'Driver', 'Cleaner', 'Plumber'
    phone_number = db.Column(db.String(20), nullable=False)
    rating = db.Column(db.Float, default=4.5)
    is_verified = db.Column(db.Boolean, default=True)
    photo_url = db.Column(db.String(255))
    availability = db.Column(db.String(100), default="9 AM - 6 PM")

    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'service_type': self.service_type,
            'phone_number': self.phone_number,
            'rating': self.rating,
            'is_verified': self.is_verified,
            'photo_url': self.photo_url,
            'availability': self.availability
        }

class AuditLog(db.Model):
    __tablename__ = 'audit_logs'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    admin_id = db.Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    action = db.Column(db.String(50), nullable=False) # 'CREATE_ADMIN', 'CREATE_HELPER', etc.
    target_id = db.Column(UUID(as_uuid=True), nullable=True) # ID of the created/modified entity
    details = db.Column(db.JSON, nullable=True) # Snapshot of data or details
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    admin = db.relationship('User', backref='audit_logs')

    def to_dict(self):
        return {
            'id': str(self.id),
            'admin_id': str(self.admin_id),
            'action': self.action,
            'target_id': str(self.target_id) if self.target_id else None,
            'details': self.details,
            'timestamp': self.timestamp.isoformat()
        }
