import React, { useState } from 'react';
import { LayoutDashboard, Package, Settings, LogOut, Menu, X, ShoppingCart, Truck, History as HistoryIcon } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import POS from './components/POS';
import Purchase from './components/Purchase';
import History from './components/History';
import { InventoryItem, ViewState, KPIStats, CartItem, PaymentMethod, Transaction } from './types';

// Initial Mock Data
const INITIAL_ITEMS: InventoryItem[] = [
  {
    id: '1',
    name: 'Walkin Aero Sneakers',
    type: 'Footwear',
    price: 129.99,
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400&h=400',
    createdAt: Date.now()
  },
  {
    id: '2',
    name: 'Urban Backpack',
    type: 'Accessories',
    price: 89.50,
    stock: 22,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400&h=400',
    createdAt: Date.now() - 100000
  },
  {
    id: '3',
    name: 'Classic Tee White',
    type: 'Apparel',
    price: 35.00,
    stock: 120,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400&h=400',
    createdAt: Date.now() - 200000
  }
];

// Initial Stats Calculation
const calculateInitialStats = (items: InventoryItem[]): KPIStats => ({
  totalRevenue: 24500, // Mock historical data
  totalSales: 154,
  totalBuy: 12400,
  salesGrowth: 12.5
});

// Mock Transactions
const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    type: 'SALE',
    date: Date.now() - 3600000,
    items: [{ name: 'Urban Backpack', quantity: 1, price: 89.50 }],
    totalAmount: 96.66,
    paymentMethod: 'CARD'
  },
  {
    id: 'tx-2',
    type: 'PURCHASE',
    date: Date.now() - 86400000,
    items: [{ name: 'Classic Tee White', quantity: 50, price: 15.00 }],
    totalAmount: 750.00
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_ITEMS);
  const [stats, setStats] = useState<KPIStats>(() => calculateInitialStats(INITIAL_ITEMS));
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAddItem = (newItemData: Omit<InventoryItem, 'id' | 'createdAt'>) => {
    const newItem: InventoryItem = {
      ...newItemData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now()
    };
    setItems(prev => [newItem, ...prev]);
  };

  const handleUpdateItem = (id: string, updatedData: Partial<InventoryItem>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updatedData } : item));
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handlePOSCheckout = (cartItems: CartItem[], total: number, method: PaymentMethod) => {
    // 1. Deduct Stock
    setItems(prevItems => {
       return prevItems.map(item => {
         const cartItem = cartItems.find(c => c.id === item.id);
         if (cartItem) {
           return { ...item, stock: Math.max(0, item.stock - cartItem.cartQuantity) };
         }
         return item;
       });
    });

    // 2. Add Transaction Record
    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'SALE',
      date: Date.now(),
      items: cartItems.map(i => ({ name: i.name, quantity: i.cartQuantity, price: i.price })),
      totalAmount: total * 1.08, // Including Tax
      paymentMethod: method
    };
    setTransactions(prev => [newTransaction, ...prev]);

    // 3. Update KPI Stats
    setStats(prev => ({
      ...prev,
      totalRevenue: prev.totalRevenue + total,
      totalSales: prev.totalSales + cartItems.reduce((acc, i) => acc + i.cartQuantity, 0),
      salesGrowth: prev.salesGrowth + 0.1
    }));
  };

  const handlePurchaseRestock = (itemId: string, quantity: number, cost: number) => {
     // 1. Find Item Info for record
     const item = items.find(i => i.id === itemId);
     const itemName = item ? item.name : 'Unknown Item';

     // 2. Add Stock
     setItems(prevItems => {
        return prevItems.map(item => 
          item.id === itemId ? { ...item, stock: item.stock + quantity } : item
        );
     });

     // 3. Add Transaction Record
     const newTransaction: Transaction = {
       id: `tx-${Date.now()}`,
       type: 'PURCHASE',
       date: Date.now(),
       items: [{ name: itemName, quantity: quantity, price: cost }],
       totalAmount: quantity * cost
     };
     setTransactions(prev => [newTransaction, ...prev]);

     // 4. Update KPI Stats
     setStats(prev => ({
       ...prev,
       totalBuy: prev.totalBuy + (quantity * cost)
     }));
  };

  const NavItem: React.FC<{ view: ViewState; icon: React.ReactNode; label: string }> = ({ view, icon, label }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        currentView === view 
          ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 font-medium' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-full p-6 z-10">
        <div className="flex items-center mb-10 px-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg mr-3 flex items-center justify-center">
            <span className="text-white font-bold text-xl">W</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Walkin.</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem view={ViewState.DASHBOARD} icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem view={ViewState.POS} icon={<ShoppingCart size={20} />} label="POS / Sell" />
          <NavItem view={ViewState.INVENTORY} icon={<Package size={20} />} label="Inventory" />
          <NavItem view={ViewState.PURCHASE} icon={<Truck size={20} />} label="Purchase" />
          <NavItem view={ViewState.HISTORY} icon={<HistoryIcon size={20} />} label="History" />
          <NavItem view={ViewState.SETTINGS} icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <button className="flex items-center space-x-3 text-slate-400 hover:text-rose-500 transition-colors px-4 py-2 w-full">
            <LogOut size={20} />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header & Menu Overlay */}
      <div className="md:hidden fixed top-0 w-full bg-white z-20 border-b border-slate-200 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-slate-900 rounded-lg mr-3 flex items-center justify-center">
            <span className="text-white font-bold text-xl">W</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Walkin.</h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-10 bg-white pt-20 px-6">
          <nav className="space-y-4">
             <NavItem view={ViewState.DASHBOARD} icon={<LayoutDashboard size={20} />} label="Dashboard" />
             <NavItem view={ViewState.POS} icon={<ShoppingCart size={20} />} label="POS / Sell" />
             <NavItem view={ViewState.INVENTORY} icon={<Package size={20} />} label="Inventory" />
             <NavItem view={ViewState.PURCHASE} icon={<Truck size={20} />} label="Purchase" />
             <NavItem view={ViewState.HISTORY} icon={<HistoryIcon size={20} />} label="History" />
             <NavItem view={ViewState.SETTINGS} icon={<Settings size={20} />} label="Settings" />
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-full pt-20 md:pt-0 p-6 md:p-10 scroll-smooth">
        <header className="mb-8 hidden md:block">
           <h2 className="text-2xl font-bold text-slate-900">
             {currentView === ViewState.DASHBOARD && 'Dashboard Overview'}
             {currentView === ViewState.POS && 'Point of Sale'}
             {currentView === ViewState.INVENTORY && 'Inventory Management'}
             {currentView === ViewState.PURCHASE && 'Stock Purchasing'}
             {currentView === ViewState.HISTORY && 'Transaction History'}
             {currentView === ViewState.SETTINGS && 'System Settings'}
           </h2>
           <p className="text-slate-500 text-sm mt-1">
             {currentView === ViewState.DASHBOARD && `Welcome back! Here's what's happening today.`}
             {currentView === ViewState.POS && `Process sales and manage checkout.`}
             {currentView === ViewState.INVENTORY && `Manage your products and stock levels.`}
             {currentView === ViewState.PURCHASE && `Record new stock arrivals and costs.`}
             {currentView === ViewState.HISTORY && `View detailed logs of all sales and purchases.`}
           </p>
        </header>

        {currentView === ViewState.DASHBOARD && (
          <Dashboard stats={stats} />
        )}

        {currentView === ViewState.POS && (
          <POS items={items} onCheckout={handlePOSCheckout} />
        )}

        {currentView === ViewState.INVENTORY && (
          <Inventory 
            items={items} 
            onAddItem={handleAddItem}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
          />
        )}
        
        {currentView === ViewState.PURCHASE && (
          <Purchase 
            items={items} 
            onPurchase={handlePurchaseRestock} 
          />
        )}

        {currentView === ViewState.HISTORY && (
          <History transactions={transactions} />
        )}

        {currentView === ViewState.SETTINGS && (
          <div className="bg-white rounded-2xl p-10 border border-slate-100 flex flex-col items-center justify-center text-center">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Settings size={40} className="text-slate-300" />
             </div>
             <h3 className="text-lg font-bold text-slate-900">Settings</h3>
             <p className="text-slate-500 max-w-sm mt-2">Global system settings would go here. For now, enjoy the dashboard and inventory management features.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;