import React, { useState } from 'react';
import { InventoryItem } from '../types.ts';
import { Search, PackagePlus, ArrowDownToLine, History } from 'lucide-react';

interface PurchaseProps {
  items: InventoryItem[];
  onPurchase: (itemId: string, quantity: number, cost: number) => void;
}

const Purchase: React.FC<PurchaseProps> = ({ items, onPurchase }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // State to track inputs for each item row independently
  const [inputs, setInputs] = useState<Record<string, { qty: string, cost: string }>>({});

  const handleInputChange = (id: string, field: 'qty' | 'cost', value: string) => {
    setInputs(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const handleRestock = (item: InventoryItem) => {
    const input = inputs[item.id];
    if (!input) return;
    
    const qty = parseInt(input.qty);
    const cost = parseFloat(input.cost);

    if (qty > 0 && cost >= 0) {
        onPurchase(item.id, qty, cost);
        // Reset inputs
        setInputs(prev => ({ ...prev, [item.id]: { qty: '', cost: '' } }));
        // Optional feedback could be added here
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
         <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center">
              <PackagePlus className="mr-2 text-indigo-600" size={24} />
              Stock In / Purchase Order
            </h2>
            <p className="text-slate-500 text-sm">Add inventory stock and record costs.</p>
         </div>
         <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
                type="text" 
                placeholder="Search inventory..." 
                className="w-full sm:w-80 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Current Stock</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-32">Add Qty</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-40">Unit Cost ($)</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {filteredItems.map(item => {
                    const input = inputs[item.id] || { qty: '', cost: '' };
                    return (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                    <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                                        <p className="text-xs text-slate-500">{item.type}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.stock < 10 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'}`}>
                                    {item.stock} Units
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <input 
                                    type="number"
                                    min="1"
                                    placeholder="0"
                                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
                                    value={input.qty}
                                    onChange={(e) => handleInputChange(item.id, 'qty', e.target.value)}
                                />
                            </td>
                            <td className="px-6 py-4">
                                <input 
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
                                    value={input.cost}
                                    onChange={(e) => handleInputChange(item.id, 'cost', e.target.value)}
                                />
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button 
                                    onClick={() => handleRestock(item)}
                                    disabled={!input.qty || !input.cost}
                                    className="inline-flex items-center justify-center px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <ArrowDownToLine size={16} className="mr-2" />
                                    Restock
                                </button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
        {filteredItems.length === 0 && (
             <div className="p-12 text-center text-slate-500">
                 No items found to restock.
             </div>
        )}
      </div>
    </div>
  );
};

export default Purchase;