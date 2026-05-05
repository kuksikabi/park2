import { useParkStore } from '../hooks/useParkStore';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart as RePieChart, Pie } from 'recharts';
import { FileText, Download, Filter, Calendar, Users, DollarSign, Activity, BarChart as BarChartIcon, PieChart as PieChartIcon } from 'lucide-react';

interface AdminReportsProps {
  parkData: ReturnType<typeof useParkStore>;
}

const AdminReports: React.FC<AdminReportsProps> = ({ parkData }) => {
  const { visitRecords, tickets, attractions, purchases, users, visitors } = parkData;

  // Data for Visits by Attraction
  const visitData = attractions.map(attr => ({
    name: attr.name,
    visits: visitRecords.filter(rec => rec.attractionId === attr.id).length
  })).sort((a, b) => b.visits - a.visits);

  // Data for Ticket Distribution
  const ticketDist = [
    { name: 'Стандарт', value: tickets.filter(t => t.ticketStatus === 'Standard').length, color: '#6366f1' },
    { name: 'VIP', value: tickets.filter(t => t.ticketStatus === 'VIP').length, color: '#f59e0b' },
    { name: 'Платинум', value: tickets.filter(t => t.ticketStatus === 'Platinum').length, color: '#1e293b' },
  ];

  const totalRevenue = purchases.reduce((acc, p) => acc + p.totalAmount, 0);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Системные отчеты</h2>
          <p className="text-gray-500 font-medium">Агрегированные данные всех блоков БД.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 uppercase tracking-widest">
            <Calendar size={14} />
            <span>Период</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 rounded-lg text-xs font-bold text-white hover:bg-indigo-700 shadow-md uppercase tracking-widest">
            <Download size={14} />
            <span>Экспорт</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <DollarSign size={24} />
            </div>
            <span className="text-green-500 text-[10px] font-black bg-green-50 px-2 py-1 rounded">БЛОК 3</span>
          </div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Общая выручка</p>
          <p className="text-3xl font-black text-gray-900 leading-none mt-1">${totalRevenue}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Users size={24} />
            </div>
            <span className="text-indigo-500 text-[10px] font-black bg-indigo-50 px-2 py-1 rounded">БЛОК 1</span>
          </div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Пользователей</p>
          <p className="text-3xl font-black text-gray-900 leading-none mt-1">{users.length}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Activity size={24} />
            </div>
            <span className="text-purple-500 text-[10px] font-black bg-purple-50 px-2 py-1 rounded">БЛОК 4</span>
          </div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Посещений</p>
          <p className="text-3xl font-black text-gray-900 leading-none mt-1">{visitRecords.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-gray-900 flex items-center space-x-2 uppercase tracking-tight">
              <BarChartIcon size={20} className="text-indigo-600" />
              <span>Популярность (Блок 2)</span>
            </h3>
            <Filter size={18} className="text-gray-400 cursor-pointer" />
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={visitData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="visits" radius={[6, 6, 0, 0]}>
                  {visitData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#c7d2fe'} />
                  ))}
                </Bar>
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
          <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center space-x-2 uppercase tracking-tight">
            <PieChartIcon size={20} className="text-indigo-600" />
            <span>Сегментация билетов</span>
          </h3>
          <div className="h-80 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={ticketDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {ticketDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Всего</p>
              <p className="text-3xl font-black text-gray-900 leading-none">{tickets.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="text-xl font-black text-gray-900 flex items-center space-x-2 uppercase tracking-tight">
            <FileText size={20} className="text-indigo-600" />
            <span>Операционный журнал (VisitRecords)</span>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Билет</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Пользователь</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Аттракцион</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Вход</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Выход</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Учет времени</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visitRecords.slice().reverse().map((rec) => {
                const ticket = tickets.find(t => t.id === rec.ticketId);
                const visitor = visitors.find(v => v.id === ticket?.purchaseId); // Link in mock
                const user = users.find(u => u.id === visitor?.userId);
                const attraction = attractions.find(a => a.id === rec.attractionId);
                
                return (
                  <tr key={rec.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono font-bold text-indigo-600">{rec.ticketId}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{user?.name || 'Системный'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{attraction?.name}</td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-bold">{new Date(rec.entryTime).toLocaleTimeString()}</td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-bold">
                      {rec.exitTime ? new Date(rec.exitTime).toLocaleTimeString() : '---'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                        rec.chargedTime ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {rec.chargedTime ? 'Charged' : 'Free'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
