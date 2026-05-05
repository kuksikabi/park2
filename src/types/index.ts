export type TicketStatus = 'Standard' | 'VIP' | 'Platinum';
export type AgeCategory = 'Adult' | 'Child';
export type AttractionCategory = 'Extreme' | 'Adventure' | 'Classic';

// 1. Блок управления пользователями
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
}

export interface Visitor {
  id: string;
  userId: string;
  phone: string;
  ageCategory: AgeCategory;
}

// 2. Блок инфраструктуры
export interface Attraction {
  id: string;
  name: string;
  description: string;
  category: AttractionCategory;
  status: 'Open' | 'Maintenance' | 'Closed';
  minAge: number;
  maxCapacity: number;
  currentCapacity: number;
  maintenanceNotes?: string;
  imageUrl: string;
  price: number; // reference price
}

// 3. Финансовый блок
export interface Purchase {
  id: string;
  visitorId: string;
  purchaseDate: string;
  status: 'Completed' | 'Pending' | 'Cancelled';
  totalAmount: number;
  cashierId?: string;
}

export interface Payment {
  id: string;
  purchaseId: string;
  paymentMethod: 'Card' | 'Cash' | 'Online';
  amount: number;
}

export interface Ticket {
  id: string;
  purchaseId: string;
  ticketStatus: TicketStatus;
  ageCategory: AgeCategory;
  price: number;
  validUntil: string;
  durationMinutes: number;
  remainingTime: number;
  isActive: boolean;
}

// 4. Операционный блок
export interface VisitRecord {
  id: string;
  ticketId: string;
  attractionId: string;
  entryTime: string;
  exitTime?: string;
  chargedTime: boolean;
}

// 5. Блок бизнес-правил
export interface AccessRule {
  id: string;
  ticketStatus: TicketStatus;
  attractionCategory: AttractionCategory;
  allowed: boolean;
  priorityAccess: boolean;
}

export interface PriceListItem {
  id: string;
  ticketStatus: TicketStatus;
  ageCategory: AgeCategory;
  price: number;
  validFrom: string;
}

// 6. Блок системного контроля
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
}
