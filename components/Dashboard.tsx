import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { KPIStats } from '../types';
import { ArrowUpRight, DollarSign, ShoppingBag, CreditCard, TrendingUp } from 'lucide-react';

interface DashboardProps {
  stats: KPIStats;
}

const data = [
  { name: 'Mon', sales: 4000, buy: 2400 },
  { name: 'Tue', sales: 3000, buy: 1398 },
  { name: 'Wed', sales: 2000, buy: 9800 },
  { name: 'Thu', sales: 2780, buy: 3908 },
  { name: 'Fri', sales: 1890, buy: 4800 },
  { name: 'Sat', sales: 2390, buy: 3800 },
  { name: 'Sun', sales: 3490, buy: 4300 },
];

const KPICard: React.FC<{ title: string; value: string; trend: string; icon: React.ReactNode; color: string }> = ({ title, value, trend, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between transition-all hover:shadow-md">
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      <div className="flex items-center mt-2 text-emerald-600 text-sm font-medium">
        <ArrowUpRight size={16} className="mr-1" />
        <span>{trend}</span>
        <span className="text-slate-400 font-normal ml-1">vs last week</span>
      </div>
    </div>
    <div className={`p-3 rounded-xl ${color}`}>
      {icon}
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
          title="Total Revenue" 
          value={`$${stats.totalRevenue.toLocaleString()}`} 
          trend="+12.5%" 
          icon={<DollarSign size={24} className="text-indigo-600" />}
          color="bg-indigo-50"
        />
        <KPICard 
          title="Total Sales" 
          value={stats.totalSales.toString()} 
          trend="+8.2%" 
          icon={<ShoppingBag size={24} className="text-blue-600" />}
          color="bg-blue-50"
        />
        <KPICard 
          title="Total Buy (Cost)" 
          value={`$${stats.totalBuy.toLocaleString()}`} 
          trend="+2.1%" 
          icon={<CreditCard size={24} className="text-amber-600" />}
          color="bg-amber-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center">
              <TrendingUp size={20} className="mr-2 text-indigo-500" />
              Revenue Analytics
            </h3>
            <select className="text-sm border-slate-200 border rounded-lg px-3 py-1 bg-slate-50 text-slate-600 outline-none focus:ring-2 focus:ring-indigo-100">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`$${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Sales vs Buy</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-slate-800 mr-2"></div>
                <span className="text-xs text-slate-500">Sales</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-slate-200 mr-2"></div>
                <span className="text-xs text-slate-500">Buy</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                   cursor={{fill: '#f8fafc'}}
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="sales" fill="#1e293b" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="buy" fill="#e2e8f0" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;