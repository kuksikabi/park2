
from abc import ABC, abstractmethod

class IAccessStrategy(ABC):
    @abstractmethod
    def check_access(self, ticket, attraction):
        pass

class StandardAccessStrategy(IAccessStrategy):
    def check_access(self, ticket, attraction):
        if attraction.category == 'Extreme':
            return {"allowed": False, "message": "Standard: Доступ запрещен к Extreme", "priority": False}
        if ticket.age_category == 'Child' and attraction.min_age > 10:
            return {"allowed": False, "message": "Слишком молод для этого аттракциона", "priority": False}
        return {"allowed": True, "message": "Доступ разрешен", "priority": False}

class VIPAccessStrategy(IAccessStrategy):
    def check_access(self, ticket, attraction):
        if attraction.status != 'Open':
            return {"allowed": False, "message": "Аттракцион закрыт", "priority": False}
        return {"allowed": True, "message": "VIP: Приоритетный вход", "priority": True}

class PlatinumAccessStrategy(IAccessStrategy):
    def check_access(self, ticket, attraction):
        return {"allowed": True, "message": "Platinum: Полный доступ", "priority": True}

class AccessControlService:
    def __init__(self):
        self._strategies = {
            'Standard': StandardAccessStrategy(),
            'VIP': VIPAccessStrategy(),
            'Platinum': PlatinumAccessStrategy()
        }

    def validate_access(self, ticket, attraction):
        if not ticket.is_active or ticket.remaining_time <= 0:
            return {"allowed": False, "message": "Билет недействителен или время вышло", "priority": False}
        
        strategy = self._strategies.get(ticket.ticket_status)
        return strategy.check_access(ticket, attraction)
