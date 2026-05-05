from datetime import datetime, timedelta

class TicketService:
    # Имитация price_list из Блока 5 БД
    PRICE_LIST = {
        ('Standard', 'Adult'): 50,
        ('Standard', 'Child'): 30,
        ('VIP', 'Adult'): 120,
        ('VIP', 'Child'): 80,
        ('Platinum', 'Adult'): 250,
    }

    def calculate_price(self, ticket_status, age_category):
        price = self.PRICE_LIST.get((ticket_status, age_category))
        if price is None:
            raise ValueError("Невалидный тип билета или категория")
        return price

    def create_ticket(self, purchase_id, status, age, duration):
        price = self.calculate_price(status, age)
        return {
            "purchase_id": purchase_id,
            "ticket_status": status,
            "age_category": age,
            "price": price,
            "valid_until": (datetime.now() + timedelta(days=1)).isoformat(),
            "duration_minutes": duration,
            "remaining_time": duration,
            "is_active": False  # Билет не активен до первого прохода
        }

    def activate_ticket(self, ticket):
        if ticket.is_active:
            raise Exception("Билет уже активирован")
        ticket.is_active = True
        return True

    def extend_ticket_time(self, ticket, minutes):
        if ticket.duration_minutes == -1: # Условно безлимитный
            raise ValueError("Нельзя продлить безлимитный билет")
        ticket.remaining_time += minutes
        return True

