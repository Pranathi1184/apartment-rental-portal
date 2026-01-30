from app import create_app
from extensions import db
from models import User, Tower, Unit, Amenity, ServiceProvider, Lease, Booking
from werkzeug.security import generate_password_hash
import uuid
import random
from datetime import date, timedelta, datetime

app = create_app()

def seed_data():
    with app.app_context():
        db.create_all()
        
        print("Seeding database...")

        # 1. Users
        admin = User.query.filter_by(email="admin@example.com").first()
        if not admin:
            print("Creating Admin user...")
            admin = User(
                email="admin@example.com",
                password_hash=generate_password_hash("admin123"),
                role="Admin",
                is_super_admin=True,
                first_name="Super",
                last_name="Admin",
                phone="1234567890"
            )
            db.session.add(admin)
        else:
            print("Updating Admin user privileges...")
            admin.is_super_admin = True
            db.session.add(admin)
        
        # Regular Admin
        regular_admin = User.query.filter_by(email="regular_admin@example.com").first()
        if not regular_admin:
            print("Creating Regular Admin user...")
            regular_admin = User(
                email="regular_admin@example.com",
                password_hash=generate_password_hash("regadmin123"),
                role="Admin",
                is_super_admin=False,
                first_name="Regular",
                last_name="Admin",
                phone="1122334455"
            )
            db.session.add(regular_admin)
        else:
            print("Regular Admin already exists, ensuring role...")
            regular_admin.role = "Admin"
            regular_admin.is_super_admin = False
            db.session.add(regular_admin)
        
        resident = User.query.filter_by(email="resident@example.com").first()
        if not resident:
            print("Creating Resident user...")
            resident = User(
                email="resident@example.com",
                password_hash=generate_password_hash("resident123"),
                role="Resident",
                first_name="John",
                last_name="Doe",
                phone="0987654321"
            )
            db.session.add(resident)
        
        db.session.flush()

        # 2. Towers
        tower_a = Tower.query.filter_by(name="Tower A").first()
        if not tower_a:
            print("Creating Tower A...")
            tower_a = Tower(name="Tower A", location="North Wing")
            db.session.add(tower_a)
            
        tower_b = Tower.query.filter_by(name="Tower B").first()
        if not tower_b:
            print("Creating Tower B...")
            tower_b = Tower(name="Tower B", location="South Wing")
            db.session.add(tower_b)
            
        db.session.flush()

        # 3. Amenities
        amenities_data = [
            {"name": "Balcony", "category": "UnitFeature", "description": "Private balcony with city view"},
            {"name": "Central AC", "category": "UnitFeature", "description": "Climate control for all seasons"},
            {"name": "Modern Kitchen", "category": "UnitFeature", "description": "Equipped with latest appliances"},
            {"name": "High-speed Internet", "category": "UnitFeature", "description": "Fiber optic connection available"},
            {"name": "Gym Access", "category": "CommonArea", "description": "24/7 access to fitness center"},
            {"name": "Swimming Pool", "category": "CommonArea", "description": "Outdoor pool with lounge area"}
        ]
        
        created_amenities = []
        for a_data in amenities_data:
            amenity = Amenity.query.filter_by(name=a_data["name"]).first()
            if not amenity:
                print(f"Creating Amenity: {a_data['name']}")
                amenity = Amenity(**a_data)
                db.session.add(amenity)
            created_amenities.append(amenity)
        
        db.session.flush()
        
        unit_features = [a for a in created_amenities if a.category == "UnitFeature"]

        # 4. Units
        sample_photos = [
            "https://placehold.co/600x400?text=Living+Room",
            "https://placehold.co/600x400?text=Bedroom", 
            "https://placehold.co/600x400?text=Kitchen"
        ]
        sample_nearby = [
            "Central Park (0.5 miles)",
            "City Mall (1.2 miles)",
            "General Hospital (2.0 miles)",
            "Subway Station (0.3 miles)"
        ]

        # Helper to create units if they don't exist
        def create_units_for_tower(tower, prefix):
            for i in range(1, 6):
                u_num = f"{prefix}-10{i}"
                unit = Unit.query.filter_by(unit_number=u_num).first()
                if not unit:
                    print(f"Creating Unit: {u_num}")
                    unit = Unit(
                        tower_id=tower.id, 
                        unit_number=u_num, 
                        floor=1, 
                        status="Vacant",
                        photos=sample_photos,
                        nearby_places=sample_nearby
                    )
                    # Assign random amenities
                    if unit_features:
                         unit.amenities.extend(random.sample(unit_features, k=random.randint(1, len(unit_features))))
                    db.session.add(unit)
        
        if tower_a: create_units_for_tower(tower_a, "A")
        if tower_b: create_units_for_tower(tower_b, "B")
        
        db.session.flush()

        # 5. Lease for Resident
        # Assign resident to first unit in Tower A
        if resident:
            # Check if resident already has a lease
            existing_lease = Lease.query.filter_by(resident_id=resident.id, status='Active').first()
            if not existing_lease:
                # Find a vacant unit
                target_unit = Unit.query.filter_by(status='Vacant').first()
                if target_unit:
                    print(f"Creating Lease for {resident.email} in Unit {target_unit.unit_number}")
                    lease = Lease(
                        unit_id=target_unit.id,
                        resident_id=resident.id,
                        start_date=date.today(),
                        end_date=date.today() + timedelta(days=365),
                        rent_amount=1500.00,
                        status='Active'
                    )
                    target_unit.status = 'Occupied'
                    db.session.add(lease)
                    db.session.add(target_unit) # Update status

                    # Create corresponding Approved Booking
                    print(f"Creating Approved Booking for {resident.email} in Unit {target_unit.unit_number}")
                    booking = Booking(
                        user_id=resident.id,
                        unit_id=target_unit.id,
                        start_time=datetime.utcnow(),
                        end_time=datetime.utcnow() + timedelta(days=365),
                        status='Approved'
                    )
                    db.session.add(booking)

        db.session.flush()

        # 6. Community Connect (Service Providers)
        providers_data = [
            {"name": "Sunita Devi", "service_type": "Maid", "phone_number": "9876543210", "rating": 4.8, "is_verified": True, "availability": "8 AM - 5 PM"},
            {"name": "Ramesh Kumar", "service_type": "Driver", "phone_number": "9876543211", "rating": 4.5, "is_verified": True, "availability": "24/7"},
            {"name": "Rajesh Gupta", "service_type": "Plumber", "phone_number": "9876543212", "rating": 4.2, "is_verified": True, "availability": "9 AM - 6 PM"},
            {"name": "Lakshmi", "service_type": "Cook", "phone_number": "9876543213", "rating": 4.9, "is_verified": True, "availability": "7 AM - 9 PM"},
            {"name": "Suresh", "service_type": "Electrician", "phone_number": "9876543214", "rating": 4.6, "is_verified": True, "availability": "10 AM - 7 PM"}
        ]
        
        for p_data in providers_data:
            exists = ServiceProvider.query.filter_by(phone_number=p_data['phone_number']).first()
            if not exists:
                print(f"Adding Service Provider: {p_data['name']}")
                provider = ServiceProvider(**p_data)
                db.session.add(provider)
        
        db.session.commit()
        print("Seeding complete!")

if __name__ == "__main__":
    seed_data()
