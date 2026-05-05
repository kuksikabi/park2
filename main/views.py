from flask import jsonify, request, render_template
from main import app, db
from main.common.models import Attraction, Ticket, User
from main.common.services.access_control import AccessControlService
from main.common.services.ticket_service import TicketService

# Инициализация сервисов (ЛР4)
access_service = AccessControlService()
ticket_service = TicketService()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/attractions', methods=['GET'])
def get_attractions():
    items = Attraction.query.all()
    return jsonify([{
        'id': i.id, 'name': i.name, 'category': i.category,
        'current_capacity': i.current_capacity, 'max_capacity': i.max_capacity,
        'status': i.status
    } for i in items])

@app.route('/api/tickets/calculate', methods=['POST'])
def calculate_price():
    data = request.json
    price = ticket_service.calculate_price(data['status'], data['age'])
    return jsonify({"price": price})

@app.route('/api/scan', methods=['POST'])
def scan_ticket():
    data = request.json
    ticket = Ticket.query.get(data['ticket_id'])
    attraction = Attraction.query.get(data['attraction_id'])
    
    if not ticket or not attraction:
        return jsonify({"allowed": False, "message": "Объект не найден"}), 404
        
    result = access_service.validate_access(ticket, attraction)
    return jsonify(result)
