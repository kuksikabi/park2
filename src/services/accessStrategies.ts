import { Ticket, Attraction } from '../types';

export interface AccessStrategy {
  checkAccess(ticket: Ticket, attraction: Attraction): { allowed: boolean; reason?: string };
}

export class StandardAccessStrategy implements AccessStrategy {
  checkAccess(_ticket: Ticket, attraction: Attraction): { allowed: boolean; reason?: string } {
    if (attraction.category === 'Extreme') {
      return { allowed: false, reason: 'Билеты категории Standard не дают доступа к экстремальным аттракционам' };
    }
    return { allowed: true };
  }
}

export class VIPAccessStrategy implements AccessStrategy {
  checkAccess(_ticket: Ticket, _attraction: Attraction): { allowed: boolean; reason?: string } {
    return { allowed: true };
  }
}

export class PlatinumAccessStrategy implements AccessStrategy {
  checkAccess(_ticket: Ticket, _attraction: Attraction): { allowed: boolean; reason?: string } {
    return { allowed: true };
  }
}

export const getAccessStrategy = (status: Ticket['ticketStatus']): AccessStrategy => {
  switch (status) {
    case 'VIP':
      return new VIPAccessStrategy();
    case 'Platinum':
      return new PlatinumAccessStrategy();
    default:
      return new StandardAccessStrategy();
  }
};
