import { Users, Ticket as TicketIcon, MapPin, TrendingUp, AlertCircle, ShieldAlert } from 'lucide-react';
import { useParkStore } from '../hooks/useParkStore';

interface DashboardProps {
  parkData: ReturnType<typeof useParkStore>;
}

const Dashboard: React.FC<DashboardProps> = ({ parkData }) => {
  const { attractions, tickets, visitRecords, auditLogs } = parkData;

  const stats = [
    { label: 'Билеты в обороте', value: tickets.filter(t => t.isActive).length, icon: TicketIcon, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Люди на аттракционах', value: visitRecords.filter(r => !r.exitTime).length, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Статус парка', value: attractions.filter(a => a.status === 'Open').length + '/' + attractions.length, icon: MapPin, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'События аудита', value: auditLogs.length, icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">Оперативный контроль (Блок 4 & 6)</h2>
        <p className="text-gray-500 font-medium">Мониторинг посещений и лог аудита в реальном времени.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className={`${stat.bg} ${stat.color} p-3 rounded-lg`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-tighter">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Attraction Status */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-800 flex items-center space-x-2">
              <MapPin size={18} className="text-indigo-600" />
              <span>Инфраструктура парка (Блок 2)</span>
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {attractions.map((attraction) => (
              <div key={attraction.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${attraction.status === 'Open' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div>
                    <p className="font-bold text-gray-900">{attraction.name}</p>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{attraction.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-8">
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase">Загрузка</p>
                    <p className="font-black text-indigo-600">{attraction.currentCapacity} / {attraction.maxCapacity}</p>
                  </div>
                  <div className="w-24 bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full transition-all duration-500" 
                      style={{ width: `${(attraction.currentCapacity / attraction.maxCapacity) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log / Notifications */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 className="font-bold text-gray-800 flex items-center space-x-2">
              <ShieldAlert size={18} className="text-red-600" />
              <span>Журнал аудита (Блок 6)</span>
            </h3>
            <TrendingUp size={16} className="text-gray-400" />
          </div>
          <div className="p-6 flex-1 overflow-auto max-h-[400px]">
            {auditLogs.length > 0 ? (
              <div className="space-y-4">
                {auditLogs.slice(-10).reverse().map((log) => (
                  <div key={log.id} className="text-xs border-l-2 border-indigo-500 pl-3 py-1">
                    <p className="font-black text-gray-900 uppercase tracking-tighter">{log.action}</p>
                    <div className="flex justify-between text-gray-400 mt-1">
                      <span>Сущность: {log.entityType}</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                <AlertCircle size={32} />
                <p>Лог пуст</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
