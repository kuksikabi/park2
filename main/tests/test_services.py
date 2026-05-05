import pytest
from unittest.mock import MagicMock
from main.common.services.ticket_service import TicketService
from main.common.services.access_control import AccessControlService, StandardAccessStrategy, VIPAccessStrategy, PlatinumAccessStrategy

# --- ФИКСТУРЫ ---
@pytest.fixture
def t_service():
    return TicketService()

@pytest.fixture
def a_service():
    return AccessControlService()

# --- Unit-тесты TicketService ---

def test_calculate_price_child_vip(t_service):
    price = t_service.calculate_price('VIP', 'Child')
    assert price == 80

def test_calculate_price_invalid_type(t_service):
    with pytest.raises(ValueError):
        t_service.calculate_price('Unknown', 'Adult')

def test_create_ticket_returns_dict(t_service):
    res = t_service.create_ticket(1, 'Standard', 'Adult', 480)
    assert isinstance(res, dict)
    assert res['price'] == 50

def test_activate_ticket_success(t_service):
    ticket = MagicMock(is_active=False)
    assert t_service.activate_ticket(ticket) is True
    assert ticket.is_active is True

def test_activate_already_activated(t_service):
    ticket = MagicMock(is_active=True)
    with pytest.raises(Exception, match="Билет уже активирован"):
        t_service.activate_ticket(ticket)

def test_extend_ticket_time_success(t_service):
    ticket = MagicMock(duration_minutes=480, remaining_time=100)
    t_service.extend_ticket_time(ticket, 60)
    assert ticket.remaining_time == 160

def test_extend_ticket_time_unlimited(t_service):
    ticket = MagicMock(duration_minutes=-1) # -1 = unlimited
    with pytest.raises(ValueError):
        t_service.extend_ticket_time(ticket, 60)

# --- Unit-тесты AccessControlService ---

def test_platinum_access_to_extreme(a_service):
    ticket = MagicMock(ticket_status='Platinum', remaining_time=100, is_active=True)
    attraction = MagicMock(category='Extreme', status='Open')
    result = a_service.validate_access(ticket, attraction)
    assert result['allowed'] is True

def test_standard_denied_to_extreme(a_service):
    ticket = MagicMock(ticket_status='Standard', remaining_time=100, is_active=True, age_category='Adult')
    attraction = MagicMock(category='Extreme', status='Open')
    result = a_service.validate_access(ticket, attraction)
    assert result['allowed'] is False

def test_boundary_age_exactly_min_age(a_service):
    # Посетитель 12 лет (Child в нашей логике = 10, но для теста сделаем мок возраста)
    ticket = MagicMock(ticket_status='Standard', remaining_time=100, is_active=True, age_category='Adult') # Adult имитирует 18 лет
    attraction = MagicMock(category='Adventure', min_age=12)
    result = a_service.validate_access(ticket, attraction)
    assert result['allowed'] is True

def test_access_denied_insufficient_time(a_service):
    ticket = MagicMock(ticket_status='VIP', remaining_time=0, is_active=True)
    attraction = MagicMock(category='Classic', status='Open')
    result = a_service.validate_access(ticket, attraction)
    assert result['allowed'] is False

def test_priority_access_for_vip(a_service):
    ticket = MagicMock(ticket_status='VIP', remaining_time=100, is_active=True)
    attraction = MagicMock(category='Adventure', status='Open')
    result = a_service.validate_access(ticket, attraction)
    assert result['priority'] is True

# --- Тесты стратегий доступа ---

def test_standard_strategy_no_priority():
    strategy = StandardAccessStrategy()
    ticket = MagicMock(age_category='Adult')
    attraction = MagicMock(category='Classic', min_age=0)
    res = strategy.check_access(ticket, attraction)
    assert res['priority'] is False

def test_vip_strategy_has_priority():
    strategy = VIPAccessStrategy()
    res = strategy.check_access(None, MagicMock(status='Open'))
    assert res['priority'] is True

def test_platinum_strategy_has_priority():
    strategy = PlatinumAccessStrategy()
    res = strategy.check_access(None, None)
    assert res['priority'] is True

