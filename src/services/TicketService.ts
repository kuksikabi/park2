import { Ticket, TicketStatus, AgeCategory } from '../types/index';
import { PRICE_LIST } from '../data/mockData';

export class TicketService {
  /**
   * Рассчитывает стоимость билета. 
   * Изменено: больше не выбрасывает Error, возвращает 0 при неверных данных.
   */
  static calculatePrice(status: TicketStatus | string, ageCategory: AgeCategory | string): number {
    // Если данные еще не выбраны пользователем, просто возвращаем 0
    if (!status || !ageCategory) {
      return 0;
    }

    const priceItem = PRICE_LIST.find(
      (p) => p.ticketStatus === status && p.ageCategory === ageCategory
    );

    if (!priceItem) {
      // Вместо throw new Error используем console.warn для отладки
      console.warn(`Цена не найдена для комбинации: статус "${status}", категория "${ageCategory}"`);
      return 0; 
    }

    return priceItem.price;
  }

  /**
   * Проверка валидности билета (срок действия, статус, время)
   */
  static validateTicket(ticket: Ticket): { isValid: boolean; reason?: string } {
    if (!ticket.isActive) {
      return { isValid: false, reason: 'Билет деактивирован' };
    }
    
    // Сравнение дат
    const expirationDate = new Date(ticket.validUntil);
    const now = new Date();
    
    if (expirationDate < now) {
      return { isValid: false, reason: 'Срок действия билета истек' };
    }

    if (ticket.remainingTime <= 0) {
      return { isValid: false, reason: 'На билете закончилось оплаченное время' };
    }

    return { isValid: true };
  }

  /**
   * Подготовка данных для создания нового билета
   */
  static createTicketData(
    purchaseId: string,
    status: TicketStatus,
    ageCategory: AgeCategory,
    durationMinutes: number
  ): Omit<Ticket, 'id'> {
    // Используем наш безопасный метод расчета цены
    const price = this.calculatePrice(status, ageCategory);
    
    return {
      purchaseId,
      ticketStatus: status,
      ageCategory,
      price,
      // Установка срока действия на 24 часа вперед
      validUntil: new Date(Date.now() + 86400000).toISOString(),
      durationMinutes,
      remainingTime: durationMinutes,
      isActive: true,
    };
  }
}