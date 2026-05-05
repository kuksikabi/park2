import { Attraction, User, Visitor, Ticket, AccessRule, PriceListItem } from '../types';

export const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Иван Иванов', email: 'ivan@example.com' },
  { id: 'u2', name: 'Мария Петрова', email: 'maria@example.com' },
];

export const INITIAL_VISITORS: Visitor[] = [
  { id: 'v1', userId: 'u1', phone: '+79001112233', ageCategory: 'Adult' },
  { id: 'v2', userId: 'u2', phone: '+79004445566', ageCategory: 'Child' },
];

export const INITIAL_ATTRACTIONS: Attraction[] = [
  {
    id: '1',
    name: 'Драконьи горки',
    description: 'Высокоскоростной выброс адреналина с мертвыми петлями.',
    category: 'Extreme',
    status: 'Open',
    minAge: 12,
    maxCapacity: 24,
    currentCapacity: 0,
    imageUrl: 'https://images.unsplash.com/photo-1513889959010-653b652677fa?auto=format&fit=crop&q=80&w=800',
    price: 25,
  },
  {
    id: '2',
    name: 'Сафари в джунглях',
    description: 'Исследуйте дикую природу в нашем сафари-туре.',
    category: 'Adventure',
    status: 'Open',
    minAge: 5,
    maxCapacity: 40,
    currentCapacity: 0,
    imageUrl: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&q=80&w=800',
    price: 15,
  },
  {
    id: '3',
    name: 'Волшебная карусель',
    description: 'Красивая традиционная карусель для всех возрастов.',
    category: 'Classic',
    status: 'Open',
    minAge: 0,
    maxCapacity: 30,
    currentCapacity: 0,
    imageUrl: 'https://images.unsplash.com/photo-1563214811-007f30089859?auto=format&fit=crop&q=80&w=800',
    price: 10,
  },
  {
    id: '4',
    name: 'Космическое падение',
    description: 'Вертикальное свободное падение со 100-метровой высоты.',
    category: 'Extreme',
    status: 'Maintenance',
    minAge: 14,
    maxCapacity: 12,
    currentCapacity: 0,
    imageUrl: 'https://images.unsplash.com/photo-1502930744104-19755037d1d6?auto=format&fit=crop&q=80&w=800',
    price: 20,
  },
];

export const ACCESS_RULES: AccessRule[] = [
  { id: 'r1', ticketStatus: 'Standard', attractionCategory: 'Classic', allowed: true, priorityAccess: false },
  { id: 'r2', ticketStatus: 'Standard', attractionCategory: 'Adventure', allowed: true, priorityAccess: false },
  { id: 'r3', ticketStatus: 'Standard', attractionCategory: 'Extreme', allowed: false, priorityAccess: false },
  { id: 'r4', ticketStatus: 'VIP', attractionCategory: 'Extreme', allowed: true, priorityAccess: true },
  { id: 'r5', ticketStatus: 'Platinum', attractionCategory: 'Extreme', allowed: true, priorityAccess: true },
];

export const PRICE_LIST: PriceListItem[] = [
  { id: 'p1', ticketStatus: 'Standard', ageCategory: 'Adult', price: 50, validFrom: '2024-01-01' },
  { id: 'p2', ticketStatus: 'Standard', ageCategory: 'Child', price: 30, validFrom: '2024-01-01' },
  { id: 'p3', ticketStatus: 'VIP', ageCategory: 'Adult', price: 120, validFrom: '2024-01-01' },
  { id: 'p4', ticketStatus: 'Platinum', ageCategory: 'Adult', price: 250, validFrom: '2024-01-01' },
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 't1',
    purchaseId: 'pur1',
    ticketStatus: 'Platinum',
    ageCategory: 'Adult',
    price: 250,
    validUntil: new Date(Date.now() + 86400000).toISOString(),
    durationMinutes: 480,
    remainingTime: 480,
    isActive: true,
  },
];
