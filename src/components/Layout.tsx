import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Ticket as TicketIcon, MapPin, ScanLine, BarChart3, Settings } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../hooks/useAuth';
import { Shield, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { role, setRole, isAdmin } = useAuth();

  const navItems = [
    ...(isAdmin ? [{ to: '/', icon: LayoutDashboard, label: 'Панель' }] : []),
    { to: '/attractions', icon: MapPin, label: 'Аттракционы' },
    { to: '/tickets', icon: TicketIcon, label: 'Билеты' },
    { to: '/scanner', icon: ScanLine, label: 'Турникет' },
    ...(isAdmin ? [{ to: '/admin', icon: BarChart3, label: 'Отчеты' }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-indigo-800">
          <h1 className="text-2xl font-bold tracking-tight">ParkControl</h1>
          <p className="text-indigo-300 text-sm">Управление парком ЛР№2</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-indigo-700 text-white shadow-lg'
                    : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                )
              }
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-indigo-800">
          <button className="flex items-center space-x-3 px-4 py-3 w-full text-indigo-200 hover:bg-indigo-800 hover:text-white rounded-lg transition-colors">
            <Settings size={20} />
            <span className="font-medium">Настройки</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">Статус системы:</span>
            <span className="flex items-center text-green-600 text-sm font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              В сети
            </span>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button 
                onClick={() => setRole('visitor')}
                className={clsx("flex items-center space-x-2 px-3 py-1.5 rounded-lg font-bold transition-all", role === 'visitor' ? "bg-white shadow text-indigo-600" : "text-gray-400")}
              >
                <User size={14} />
                <span className="text-[10px] uppercase">Visitor</span>
              </button>
              <button 
                onClick={() => setRole('admin')}
                className={clsx("flex items-center space-x-2 px-3 py-1.5 rounded-lg font-bold transition-all", role === 'admin' ? "bg-indigo-600 shadow text-white" : "text-gray-400")}
              >
                <Shield size={14} />
                <span className="text-[10px] uppercase">Admin</span>
              </button>
            </div>
            <span className="text-gray-500 font-bold">{new Date().toLocaleDateString('ru-RU')}</span>
          </div>
        </header>
        
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
