from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(255))

class Visitor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    phone = db.Column(db.String(30))
    age_category = db.Column(db.String(20)) # Adult/Child

class Attraction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    category = db.Column(db.String(50)) # Extreme/Adventure/Classic
    status = db.Column(db.String(30)) # Open/Maintenance
    min_age = db.Column(db.Integer)
    max_capacity = db.Column(db.Integer)
    current_capacity = db.Column(db.Integer, default=0)

class Ticket(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    purchase_id = db.Column(db.Integer, db.ForeignKey('purchase.id'))
    ticket_status = db.Column(db.String(30)) # Standard/VIP/Platinum
    age_category = db.Column(db.String(20))
    price = db.Column(db.Numeric(10, 2))
    valid_until = db.Column(db.DateTime)
    duration_minutes = db.Column(db.Integer)
    remaining_time = db.Column(db.Integer)
    is_active = db.Column(db.Boolean, default=True)

class Purchase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    visitor_id = db.Column(db.Integer, db.ForeignKey('visitor.id'))
    purchase_date = db.Column(db.DateTime, default=datetime.utcnow)
    total_amount = db.Column(db.Numeric(10, 2))

class VisitRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ticket_id = db.Column(db.Integer, db.ForeignKey('ticket.id'))
    attraction_id = db.Column(db.Integer, db.ForeignKey('attraction.id'))
    entry_time = db.Column(db.DateTime, default=datetime.utcnow)
    exit_time = db.Column(db.DateTime)
    charged_time = db.Column(db.Boolean, default=True)

class AccessRule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ticket_status = db.Column(db.String(30))
    attraction_category = db.Column(db.String(50))
    allowed = db.Column(db.Boolean)
    priority_access = db.Column(db.Boolean)

