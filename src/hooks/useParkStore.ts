import { useState, useEffect } from 'react';
import { Attraction, Visitor, User, Ticket, VisitRecord, Purchase, Payment, AuditLog, Notification } from '../types/index';
import { INITIAL_ATTRACTIONS, INITIAL_USERS, INITIAL_VISITORS, INITIAL_TICKETS } from '../data/mockData';

export const useParkStore = () => {
  // 1. Состояние пользователей
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('park_users_v3');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });
  const [visitors, setVisitors] = useState<Visitor[]>(() => {
    const saved = localStorage.getItem('park_visitors_v3');
    return saved ? JSON.parse(saved) : INITIAL_VISITORS;
  });

  // 2. Инфраструктура
  const [attractions, setAttractions] = useState<Attraction[]>(() => {
    const saved = localStorage.getItem('park_attractions_v3');
    return saved ? JSON.parse(saved) : INITIAL_ATTRACTIONS;
  });

  // 3. Финансы
  const [purchases, setPurchases] = useState<Purchase[]>(() => {
    const saved = localStorage.getItem('park_purchases_v3');
    return saved ? JSON.parse(saved) : [];
  });
  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem('park_payments_v3');
    return saved ? JSON.parse(saved) : [];
  });
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem('park_tickets_v3');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  // 4. Операции
  const [visitRecords, setVisitRecords] = useState<VisitRecord[]>(() => {
    const saved = localStorage.getItem('park_visit_records_v3');
    return saved ? JSON.parse(saved) : [];
  });

  // 6. Системный контроль
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('park_audit_logs_v3');
    return saved ? JSON.parse(saved) : [];
  });
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('park_notifications_v3');
    return saved ? JSON.parse(saved) : [];
  });

  // Авто-сохранение
  useEffect(() => {
    localStorage.setItem('park_users_v3', JSON.stringify(users));
    localStorage.setItem('park_visitors_v3', JSON.stringify(visitors));
    localStorage.setItem('park_attractions_v3', JSON.stringify(attractions));
    localStorage.setItem('park_purchases_v3', JSON.stringify(purchases));
    localStorage.setItem('park_payments_v3', JSON.stringify(payments));
    localStorage.setItem('park_tickets_v3', JSON.stringify(tickets));
    localStorage.setItem('park_visit_records_v3', JSON.stringify(visitRecords));
    localStorage.setItem('park_audit_logs_v3', JSON.stringify(auditLogs));
    localStorage.setItem('park_notifications_v3', JSON.stringify(notifications));
  }, [users, visitors, attractions, purchases, payments, tickets, visitRecords, auditLogs, notifications]);

  // Методы
  const addAuditLog = (userId: string, action: string, entityType: string) => {
    const newLog: AuditLog = {
      id: `audit${Date.now()}`,
      userId,
      action,
      entityType,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [...prev, newLog]);
  };

  const createPurchase = (visitorId: string, ticketData: Omit<Ticket, 'id' | 'purchaseId' | 'isActive' | 'remainingTime'>) => {
    const purchaseId = `pur${Date.now()}`;
    const ticketId = `t${Date.now()}`;
    
    const newPurchase: Purchase = {
      id: purchaseId,
      visitorId,
      purchaseDate: new Date().toISOString(),
      status: 'Completed',
      totalAmount: ticketData.price,
    };

    const newTicket: Ticket = {
      ...ticketData,
      id: ticketId,
      purchaseId,
      isActive: true,
      remainingTime: ticketData.durationMinutes,
    };

    setPurchases(prev => [...prev, newPurchase]);
    setTickets(prev => [...prev, newTicket]);
    addAuditLog('system', `Purchase created: ${purchaseId}`, 'Purchase');
    return { purchaseId, ticketId };
  };

  const registerVisit = (ticketId: string, attractionId: string) => {
    const attraction = attractions.find(a => a.id === attractionId);
    const ticket = tickets.find(t => t.id === ticketId);
    
    if (!attraction || !ticket) return;

    const newRecord: VisitRecord = {
      id: `vrec${Date.now()}`,
      ticketId,
      attractionId,
      entryTime: new Date().toISOString(),
      chargedTime: true, // По умолчанию время списывается
    };

    setVisitRecords(prev => [...prev, newRecord]);
    setAttractions(prev => prev.map(a => 
      a.id === attractionId ? { ...a, currentCapacity: a.currentCapacity + 1 } : a
    ));
    addAuditLog('system', `Visit registered: Ticket ${ticketId} to Attraction ${attractionId}`, 'VisitRecord');
  };

  const endVisit = (recordId: string) => {
    const record = visitRecords.find(r => r.id === recordId);
    if (!record) return;

    const exitTime = new Date().toISOString();
    const duration = Math.round((new Date(exitTime).getTime() - new Date(record.entryTime).getTime()) / 60000);

    setVisitRecords(prev => prev.map(r => 
      r.id === recordId ? { ...r, exitTime } : r
    ));

    // Списание времени с билета
    if (record.chargedTime) {
      setTickets(prev => prev.map(t => 
        t.id === record.ticketId 
          ? { ...t, remainingTime: Math.max(0, t.remainingTime - duration) } 
          : t
      ));
    }

    setAttractions(prev => prev.map(a => 
      a.id === record.attractionId ? { ...a, currentCapacity: Math.max(0, a.currentCapacity - 1) } : a
    ));
    
    addAuditLog('system', `Visit ended: Record ${recordId}, Duration: ${duration}m`, 'VisitRecord');
  };

  return {
    users, visitors, attractions, purchases, payments, tickets, visitRecords, auditLogs, notifications,
    createPurchase, registerVisit, endVisit, setAttractions
  };
};
