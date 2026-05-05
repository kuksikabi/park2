import React, { useState } from 'react';
import { useParkStore } from '../hooks/useParkStore';
import { TicketStatus, AgeCategory } from '../types';
import { Check, User, ShieldCheck, Star, Trophy, Mail, Phone, Clock, CreditCard } from 'lucide-react';
import { TicketService } from '../services/TicketService';

interface TicketPurchaseProps {
  parkData: ReturnType<typeof useParkStore>;
}

const TicketPurchase: React.FC<TicketPurchaseProps> = ({ parkData }) => {
  const { createPurchase, visitors } = parkData;
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    ageCategory: 'Adult' as AgeCategory,
    status: 'Standard' as TicketStatus,
  });
  const [success, setSuccess] = useState(false);
  const [issuedId, setIssuedId] = useState('');

  const plans = [
    { id: 'Standard' as TicketStatus, name: 'Стандарт', icon: Star, color: 'indigo', duration: 480 },
    { id: 'VIP' as TicketStatus, name: 'VIP', icon: Trophy, color: 'amber', duration: 720 },
    { id: 'Platinum' as TicketStatus, name: 'Платинум', icon: ShieldCheck, color: 'slate', duration: 1440 },
  ];

  const currentPrice = TicketService.calculatePrice(formData.status, formData.ageCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName) return;

    // Регистрация в Data Layer через TicketService (Бизнес-логика ЛР4)
    const ticketData = TicketService.createTicketData(
      'pur_auto', 
      formData.status, 
      formData.ageCategory, 
      plans.find(p => p.id === formData.status)?.duration || 480
    );

    const { ticketId } = createPurchase(visitors[0]?.id || 'v1', ticketData);

    setIssuedId(ticketId);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        ageCategory: 'Adult',
        status: 'Standard',
      });
    }, 5000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">Магазин билетов</h2>
        <p className="text-xl text-slate-500 font-bold uppercase tracking-widest text-sm">Сервис расчета цен: TicketService.calculatePrice()</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => setFormData({ ...formData, status: plan.id })}
            className={`relative p-8 rounded-[2rem] border-4 transition-all cursor-pointer overflow-hidden ${
              formData.status === plan.id
                ? 'border-indigo-600 bg-white shadow-2xl scale-105'
                : 'border-slate-100 bg-slate-50/50 hover:border-slate-200 opacity-80'
            }`}
          >
            {formData.status === plan.id && (
              <div className="absolute top-0 right-0 bg-indigo-600 text-white px-6 py-2 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest animate-pulse">
                Выбран
              </div>
            )}
            <div className={`w-16 h-16 rounded-2xl mb-8 flex items-center justify-center ${
              plan.id === 'Standard' ? 'bg-indigo-100 text-indigo-600' :
              plan.id === 'VIP' ? 'bg-amber-100 text-amber-600' : 'bg-slate-900 text-white'
            }`}>
              <plan.icon size={32} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">{plan.name}</h3>
            <div className="flex items-baseline mb-6">
              <span className="text-5xl font-black text-slate-900">
                ${TicketService.calculatePrice(plan.id, formData.ageCategory)}
              </span>
              <span className="text-slate-400 font-bold ml-2 uppercase text-xs">/ сессия</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-black text-indigo-500 uppercase tracking-widest border-t-2 border-slate-50 pt-6">
              <Clock size={16} />
              <span>Лимит: {plan.duration / 60} часов</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border-4 border-slate-50 p-12 shadow-sm max-w-2xl mx-auto relative overflow-hidden">
        {success && (
          <div className="absolute inset-0 bg-indigo-600/95 flex flex-col items-center justify-center text-white z-20 animate-in fade-in duration-300">
            <div className="bg-white p-6 rounded-3xl mb-6 animate-bounce">
              <Check size={64} className="text-indigo-600" />
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">Билет оформлен!</h3>
            <p className="text-indigo-100 font-bold uppercase tracking-widest text-sm mb-8">Используйте этот ID на турникете:</p>
            <div className="bg-white/10 px-10 py-4 rounded-2xl border-2 border-white/20 font-mono text-4xl font-black tracking-widest">
              {issuedId}
            </div>
          </div>
        )}

        <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center space-x-4 uppercase tracking-tight">
          <div className="p-3 bg-indigo-600 rounded-2xl text-white">
            <CreditCard size={24} />
          </div>
          <span>Данные покупателя (ЛР4 TDD)</span>
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Полное имя (Visitor)</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input
                type="text"
                required
                placeholder="Иван Иванович Иванов"
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email адрес</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input
                  type="email"
                  placeholder="ivan@example.com"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Телефон</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input
                  type="tel"
                  placeholder="+7 (900) 000-00-00"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Категория посетителя</label>
            <div className="grid grid-cols-2 gap-4">
              {['Adult', 'Child'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData({ ...formData, ageCategory: cat as AgeCategory })}
                  className={`py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all border-4 ${
                    formData.ageCategory === cat 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                      : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  {cat === 'Adult' ? 'Взрослый (18+)' : 'Ребенок (до 12)'}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase text-sm tracking-[0.2em] transition-all shadow-xl shadow-indigo-100 active:scale-[0.98] mt-4"
          >
            Оплатить ${currentPrice}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TicketPurchase;
