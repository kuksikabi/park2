import { Ticket, Attraction } from '../types/index';
import { ACCESS_RULES } from '../data/mockData';

export interface IAccessStrategy {
  checkAccess(ticket: Ticket, attraction: Attraction): { allowed: boolean; message: string; priority: boolean };
}

export class StandardAccessStrategy implements IAccessStrategy {
  checkAccess(ticket: Ticket, attraction: Attraction): { allowed: boolean; message: string; priority: boolean } {
    const rule = ACCESS_RULES.find(
      (r) => r.ticketStatus === 'Standard' && r.attractionCategory === attraction.category
    );

    if (!rule || !rule.allowed) {
      return { 
        allowed: false, 
        message: 'Билет Standard не дает доступа к этой категории (Extreme)', 
        priority: false 
      };
    }

    const visitorAge = ticket.ageCategory === 'Adult' ? 18 : 10;
    if (visitorAge < attraction.minAge) {
      return { 
        allowed: false, 
        message: `Минимальный возраст: ${attraction.minAge} лет. Возраст посетителя: ${visitorAge}`, 
        priority: false 
      };
    }

    return { allowed: true, message: 'Доступ разрешен. Приятного посещения!', priority: false };
  }
}

export class VIPAccessStrategy implements IAccessStrategy {
  checkAccess(_ticket: Ticket, attraction: Attraction): { allowed: boolean; message: string; priority: boolean } {
    if (attraction.status !== 'Open') {
      return { allowed: false, message: 'Аттракцион закрыт на обслуживание', priority: false };
    }
    return { allowed: true, message: 'Добро пожаловать! Приоритетный вход (VIP).', priority: true };
  }
}

export class PlatinumAccessStrategy implements IAccessStrategy {
  checkAccess(_ticket: Ticket, _attraction: Attraction): { allowed: boolean; message: string; priority: boolean } {
    return { allowed: true, message: 'Полный доступ (Platinum). Все ограничения сняты.', priority: true };
  }
}

export class AccessControlService {
  private strategies: Record<string, IAccessStrategy> = {
    Standard: new StandardAccessStrategy(),
    VIP: new VIPAccessStrategy(),
    Platinum: new PlatinumAccessStrategy(),
  };

  checkAccess(ticket: Ticket, attraction: Attraction): { allowed: boolean; message: string; priority: boolean } {
    // 1. Общая проверка жизненного цикла (Service Layer)
    if (ticket.remainingTime <= 0) {
      return { allowed: false, message: 'Время действия билета истекло', priority: false };
    }

    // 2. Делегирование стратегии (Pattern: Strategy)
    const strategy = this.strategies[ticket.ticketStatus];
    if (!strategy) {
      return { allowed: false, message: 'Неизвестный тип стратегии доступа', priority: false };
    }

    return strategy.checkAccess(ticket, attraction);
  }
}
