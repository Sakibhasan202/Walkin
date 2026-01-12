import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { Edit2, Trash2, Plus, Search, Package } from 'lucide-react';
import ItemModal from './ItemModal';

interface InventoryProps {
  items: InventoryItem[];
  onAddItem: (item: Omit<InventoryItem, 'id' | 'createdAt'>) => void;
  onUpdateItem: (id: string, item: Partial<InventoryItem>) => void;
  onDeleteItem: (id: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ items, onAddItem, onUpdateItem, onDeleteItem }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>(undefined);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent triggering any parent click events
    setItemToDelete(id);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      onDeleteItem(itemToDelete);
      setItemToDelete(null);
    }
  };

  const handleSave = (itemData: Omit<InventoryItem, 'id' | 'createdAt'>) => {
    if (editingItem) {
      onUpdateItem(editingItem.id, itemData);
    } else {
      onAddItem(itemData);
    }
    setEditingItem(undefined);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingItem(undefined);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search inventory..." 
            className="w-full sm:w-80 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 w-full sm:w-auto"
        >
          <Plus size={20} className="mr-2" />
          Add Product
        </button>
      </div>

      {/* Grid View */}
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Package size={32} className="text-slate-300" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">No items found</h3>
          <p className="text-slate-500">Add new products to your inventory.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
              <div className="aspect-square relative overflow-hidden bg-slate-100">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-slate-900 shadow-sm">
                  {item.stock} in stock
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">{item.type}</p>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">{item.name}</h3>
                  </div>
                </div>
                
                <div className="flex items-end justify-between mt-4">
                  <span className="text-xl font-bold text-indigo-600">${item.price.toFixed(2)}</span>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={(e) => handleDeleteClick(e, item.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl border border-slate-100 transform transition-all scale-100">
            <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mb-4">
                  <Trash2 className="text-rose-600" size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Delete Item?</h3>
                <p className="text-slate-500 text-sm mb-6">Are you sure you want to remove this product? This action cannot be undone.</p>
                <div className="flex space-x-3 w-full">
                  <button 
                    onClick={() => setItemToDelete(null)} 
                    className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmDelete} 
                    className="flex-1 px-4 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 shadow-lg shadow-rose-900/20 transition-all"
                  >
                    Delete
                  </button>
                </div>
            </div>
          </div>
        </div>
      )}

      <ItemModal 
        isOpen={isModalOpen}
        onClose={handleClose}
        onSave={handleSave}
        initialData={editingItem}
      />
    </div>
  );
};

export default Inventory;