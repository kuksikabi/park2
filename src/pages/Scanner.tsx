import { useState } from 'react';
import { useParkStore } from '../hooks/useParkStore';
import { Scan, CheckCircle2, XCircle, Timer, Users as UsersIcon, ShieldCheck } from 'lucide-react';
import { AccessControlService } from '../services/AccessControlService';

interface ScannerProps {
  parkData: ReturnType<typeof useParkStore>;
}

const accessService = new AccessControlService();

const Scanner: React.FC<ScannerProps> = ({ parkData }) => {
  const { tickets, visitors, attractions, registerVisit, visitRecords, endVisit, users } = parkData;
  const [ticketId, setTicketId] = useState('');
  const [selectedAttractionId, setSelectedAttractionId] = useState(attractions[0]?.id || '');
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'expired'>('idle');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState(false);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketId) return;

    const ticket = tickets.find((t) => t.id === ticketId);
    const attraction = attractions.find((a) => a.id === selectedAttractionId);

    if (!ticket || !attraction) {
      setStatus('error');
      setMessage('Объект не найден в базе данных.');
      return;
    }

    // Использование AccessControlService (Бизнес-логика ЛР4)
    const result = accessService.checkAccess(ticket, attraction);

    if (!result.allowed) {
      setStatus(result.message.includes('истекло') ? 'expired' : 'error');
      setMessage(result.message);
      setPriority(false);
      return;
    }

    // Регистрация в базе (Data Layer)
    registerVisit(ticket.id, selectedAttractionId);
    setStatus('success');
    setMessage(result.message);
    setPriority(result.priority);

    setTimeout(() => {
      setStatus('idle');
      setTicketId('');
    }, 3500);
  };

  const activeVisits = visitRecords.filter(r => !r.exitTime).map(record => {
    const ticket = tickets.find(t => t.id === record.ticketId);
    const visitor = visitors.find(v => v.id === ticket?.purchaseId); 
    const user = users.find(u => u.id === visitor?.userId);
    const attraction = attractions.find(a => a.id === record.attractionId);
    return { ...record, user, attraction, ticket };
  });

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-2xl overflow-hidden">
        <div className="bg-slate-900 p-8 text-white text-center relative">
          <Scan className="mx-auto mb-4 text-indigo-400" size={48} />
          <h2 className="text-3xl font-black uppercase tracking-tighter italic">Контроль доступа v4.0</h2>
          <p className="text-slate-400 font-bold text-xs mt-1 uppercase tracking-widest">Обработка через AccessControlService & Strategies</p>
          
          <div className="absolute top-4 right-4 flex space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
          </div>
        </div>

        <div className="p-10 space-y-8">
          <form onSubmit={handleScan} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Аттракцион</label>
                <select
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none transition-all font-black text-sm text-slate-700"
                  value={selectedAttractionId}
                  onChange={(e) => setSelectedAttractionId(e.target.value)}
                >
                  {attractions.map((a) => (
                    <option key={a.id} value={a.id}>{a.name} [{a.category.toUpperCase()}]</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Штрих-код билета</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="T1, T2..."
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none transition-all font-mono font-black"
                    value={ticketId}
                    onChange={(e) => setTicketId(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 px-8 bg-indigo-600 text-white rounded-xl font-black text-xs hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-200"
                  >
                    СКАН
                  </button>
                </div>
              </div>
            </div>
          </form>

          {status !== 'idle' && (
            <div className={`p-8 rounded-3xl border-2 flex items-center space-x-6 animate-in zoom-in-95 duration-300 ${
              status === 'success' ? 'bg-green-50 border-green-200 text-green-900' :
              status === 'expired' ? 'bg-amber-50 border-amber-200 text-amber-900' :
              'bg-red-50 border-red-200 text-red-900'
            }`}>
              <div className="shrink-0 p-4 bg-white rounded-2xl shadow-sm">
                {status === 'success' ? <CheckCircle2 size={48} className="text-green-500" /> :
                 status === 'expired' ? <Timer size={48} className="text-amber-500" /> :
                 <XCircle size={48} className="text-red-500" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-2xl font-black uppercase italic tracking-tighter">
                    {status === 'success' ? 'Доступ разрешен' : 'Отказ в доступе'}
                  </h4>
                  {priority && (
                    <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-bounce flex items-center space-x-1">
                      <ShieldCheck size={10} />
                      <span>PRIORITY</span>
                    </span>
                  )}
                </div>
                <p className="text-lg font-bold opacity-80 leading-tight mt-1">{message}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <UsersIcon size={20} />
            </div>
            <h3 className="font-black text-slate-800 uppercase tracking-tight">Посетители на аттракционах</h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black text-slate-400 uppercase">Активных сессий:</span>
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-black">
              {activeVisits.length}
            </span>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {activeVisits.length > 0 ? (
            activeVisits.map((rec) => (
              <div key={rec.id} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                    rec.ticket?.ticketStatus === 'Platinum' ? 'bg-slate-800 text-white' :
                    rec.ticket?.ticketStatus === 'VIP' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'
                  }`}>
                    {rec.ticket?.ticketStatus[0]}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 leading-none mb-1">{rec.user?.name || 'Посетитель'}</p>
                    <div className="flex items-center space-x-3 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                      <span className="text-indigo-600">{rec.attraction?.name}</span>
                      <span>•</span>
                      <span>Вход: {new Date(rec.entryTime).toLocaleTimeString()}</span>
                      <span>•</span>
                      <span className={rec.ticket && rec.ticket.remainingTime < 30 ? 'text-red-500' : ''}>
                        Остаток: {rec.ticket?.remainingTime}м
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => endVisit(rec.id)}
                  className="px-6 py-2.5 text-[10px] font-black text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all border-2 border-red-50 hover:border-red-600 uppercase tracking-widest active:scale-95"
                >
                  Завершить сессию
                </button>
              </div>
            ))
          ) : (
            <div className="p-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4">
                <UsersIcon size={32} />
              </div>
              <p className="font-black uppercase text-xs tracking-widest text-slate-300">Очередь пуста</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scanner;
