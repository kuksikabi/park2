import { Ticket, TicketStatus, AgeCategory } from '../types/index';
import { PRICE_LIST } from '../data/mockData';

export class TicketService {
  static calculatePrice(status: TicketStatus, ageCategory: AgeCategory): number {
    const priceItem = PRICE_LIST.find(
      (p) => p.ticketStatus === status && p.ageCategory === ageCategory
    );
    if (!priceItem) throw new Error('Невалидный тип билета или возрастная категория');
    return priceItem.price;
  }

  static validateTicket(ticket: Ticket): { isValid: boolean; reason?: string } {
    if (!ticket.isActive) {
      return { isValid: false, reason: 'Билет деактивирован' };
    }
    if (new Date(ticket.validUntil) < new Date()) {
      return { isValid: false, reason: 'Срок действия билета истек' };
    }
    if (ticket.remainingTime <= 0) {
      return { isValid: false, reason: 'На билете закончилось оплаченное время' };
    }
    return { isValid: true };
  }

  static createTicketData(
    purchaseId: string,
    status: TicketStatus,
    ageCategory: AgeCategory,
    durationMinutes: number
  ): Omit<Ticket, 'id'> {
    const price = this.calculatePrice(status, ageCategory);
    return {
      purchaseId,
      ticketStatus: status,
      ageCategory,
      price,
      validUntil: new Date(Date.now() + 86400000).toISOString(),
      durationMinutes,
      remainingTime: durationMinutes,
      isActive: true,
    };
  }
}
