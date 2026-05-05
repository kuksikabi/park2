import React, { useState } from 'react';
import { AttractionCategory } from '../types';
import { useParkStore } from '../hooks/useParkStore';
import { Search, Shield, Zap, Compass, Info, Users as UsersIcon } from 'lucide-react';

interface AttractionsListProps {
  parkData: ReturnType<typeof useParkStore>;
}

const AttractionsList: React.FC<AttractionsListProps> = ({ parkData }) => {
  const { attractions } = parkData;
  const [filter, setFilter] = useState<AttractionCategory | 'All'>('All');
  const [search, setSearch] = useState('');

  const filtered = attractions.filter(a => {
    const matchesFilter = filter === 'All' || a.category === filter;
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || 
                          a.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categoryIcons: Record<string, React.ReactNode> = {
    Extreme: <Zap className="text-red-500" size={16} />,
    Adventure: <Compass className="text-orange-500" size={16} />,
    Classic: <Shield className="text-blue-500" size={16} />,
  };

  const categoryNames: Record<string, string> = {
    Extreme: 'Экстрим',
    Adventure: 'Приключения',
    Classic: 'Классика',
    All: 'Все',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">Инфраструктура (Блок 2)</h2>
          <p className="text-gray-500 font-medium">Каталог аттракционов и контроль вместимости.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Поиск аттракциона..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-64 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center bg-white border border-gray-300 rounded-lg p-1">
            {(['All', 'Extreme', 'Adventure', 'Classic'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${
                  filter === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                {categoryNames[cat]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((attraction) => (
          <div key={attraction.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
            <div className="relative h-48 overflow-hidden">
              <img
                src={attraction.imageUrl}
                alt={attraction.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                  attraction.status === 'Open' ? 'bg-green-100 text-green-700' : 
                  attraction.status === 'Maintenance' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {attraction.status === 'Open' ? 'Доступен' : attraction.status === 'Maintenance' ? 'Обслуживание' : 'Закрыт'}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {categoryIcons[attraction.category]}
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{categoryNames[attraction.category]}</span>
                </div>
                <div className="flex items-center space-x-1 text-xs font-bold text-indigo-600">
                  <UsersIcon size={12} />
                  <span>{attraction.currentCapacity}/{attraction.maxCapacity}</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{attraction.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">{attraction.description}</p>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Вместимость</span>
                  <span className="font-black text-gray-900">{attraction.maxCapacity} чел.</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Возраст</span>
                  <span className="font-black text-gray-900">{attraction.minAge}+ лет</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-xl font-black text-indigo-600">${attraction.price}</span>
                <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-colors">
                  <Info size={14} />
                  <span>Детали</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttractionsList;
