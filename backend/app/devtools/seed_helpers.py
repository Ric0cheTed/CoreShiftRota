import random
from datetime import date, timedelta, datetime
from faker import Faker
from app.models.client import Client
from app.models.employee import Employee
from app.models.visit import Visit
from app.models.user import User
from app.models.tag import Tag
from app.core.security import get_password_hash

fake = Faker("en_GB")

tag_pool = ["meds", "dementia", "hoist", "mobility", "overnight", "companionship", "catheter"]
common_notes = [
    "Key under the bin",
    "Double-up required",
    "Prefers female carer",
    "Has a dog — friendly",
    "Medication in kitchen cupboard",
    "Check blood pressure",
]

def run_reset(db):
    db.query(Visit).delete()
    db.query(Client).delete()
    db.query(Employee).delete()
    db.query(Tag).delete()
    db.query(User).delete()
    db.commit()

    dev_user = User(
        username="ric_admin",
        hashed_password=get_password_hash("admin123"),
        role="admin",
        is_active=True,
    )
    db.add(dev_user)
    db.commit()

def run_seed(db):
    run_reset(db)

    # Tags
    tag_objs = [Tag(name=tag) for tag in set(tag_pool)]
    db.add_all(tag_objs)
    db.commit()

    # Clients
    clients = []
    for _ in range(10):
        client = Client(
            full_name=fake.name(),
            address=fake.address(),
            safeguarding_info=fake.sentence(),
            access_details=fake.sentence(),
            care_notes=fake.sentence(),
            contact_method=random.choice(["phone", "email", "text"]),
        )
        clients.append(client)
        db.add(client)
    db.commit()

    # Employees
    employees = []
    for i in range(5):
        emp = Employee(
            full_name=fake.name(),
            role="carer",
            status="active",
            car_access=random.choice([True, False]),
            capacity=random.choice([1, 2]),
            availability_summary=fake.sentence(),
            notes=fake.sentence(),
        )
        emp.tags = random.sample(tag_objs, k=random.randint(1, 3))
        emp.client_preferences = random.sample(clients, k=random.randint(0, 3))
        db.add(emp)
        employees.append(emp)
    db.commit()

    # Visits (some valid, some intentionally broken)
    for _ in range(10):
        employee = random.choice(employees)
        client = random.choice(clients)
        visit = Visit(
            date=date.today(),
            start_time="10:00:00",
            end_time="11:00:00",
            employee_id=employee.id,
            client_id=client.id,
            notes=random.choice(common_notes),
        )
        db.add(visit)

    # Conflict cases
    conflict_day = date.today() + timedelta(days=1)
    db.add(Visit(
        date=conflict_day,
        start_time="09:00:00",
        end_time="10:00:00",
        employee_id=employees[0].id,
        client_id=clients[0].id,
        notes="⛔ Overlap visit 1",
    ))
    db.add(Visit(
        date=conflict_day,
        start_time="09:30:00",
        end_time="10:30:00",
        employee_id=employees[0].id,
        client_id=clients[1].id,
        notes="⛔ Overlap visit 2",
    ))
    db.add(Visit(
        date=conflict_day,
        start_time="08:00:00",
        end_time="08:30:00",
        employee_id=None,
        client_id=clients[2].id,
        notes="⛔ Unassigned visit",
    ))
    db.commit()
