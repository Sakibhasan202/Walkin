import React, { useState, useEffect } from 'react';
import { X, Wand2, Loader2, Image as ImageIcon } from 'lucide-react';
import { InventoryItem, NewItemData } from '../types';
import { generateProductImage } from '../services/geminiService';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<InventoryItem, 'id' | 'createdAt'>) => void;
  initialData?: InventoryItem;
}

const ItemModal: React.FC<ItemModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<NewItemData>({
    name: '',
    type: '',
    price: 0,
    stock: 0,
  });
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        type: initialData.type,
        price: initialData.price,
        stock: initialData.stock,
      });
      setImageUrl(initialData.imageUrl);
    } else {
      setFormData({ name: '', type: '', price: 0, stock: 0 });
      setImageUrl('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalImageUrl = imageUrl;

    // If no image exists, automatically generate one (Smart feature)
    if (!finalImageUrl && formData.name && formData.type) {
      setIsGenerating(true);
      try {
        finalImageUrl = await generateProductImage(formData.name, formData.type);
        setImageUrl(finalImageUrl);
      } catch (error) {
        console.error("Failed to generate image automatically");
        finalImageUrl = `https://picsum.photos/seed/${formData.name}/400/400`;
      } finally {
        setIsGenerating(false);
      }
    }

    onSave({ ...formData, imageUrl: finalImageUrl || `https://picsum.photos/seed/${formData.name}/400/400` });
    onClose();
  };

  const handleGenerateImage = async () => {
    if (!formData.name || !formData.type) return;
    setIsGenerating(true);
    try {
      const url = await generateProductImage(formData.name, formData.type);
      setImageUrl(url);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-900">
            {initialData ? 'Edit Item' : 'Add New Item'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Image Preview / Generation Area */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative w-48 h-48 bg-slate-100 rounded-xl overflow-hidden border-2 border-dashed border-slate-300 flex items-center justify-center group">
              {isGenerating ? (
                <div className="flex flex-col items-center text-indigo-600">
                  <Loader2 size={32} className="animate-spin mb-2" />
                  <span className="text-xs font-medium">Designing...</span>
                </div>
              ) : imageUrl ? (
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <ImageIcon size={32} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-xs text-slate-400">Image will appear here</p>
                </div>
              )}
            </div>
            
            <button
              type="button"
              onClick={handleGenerateImage}
              disabled={isGenerating || !formData.name || !formData.type}
              className={`mt-3 flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                !formData.name || !formData.type 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              {isGenerating ? 'Generating...' : <><Wand2 size={12} className="mr-1.5" /> Regenerate AI Image</>}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Item Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                placeholder="e.g. Walkin Aero Sneakers"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Type/Category</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                placeholder="e.g. Footwear"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
               {/* Spacer or additional field */}
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Stock Qty</label>
              <input
                type="number"
                required
                min="0"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100"
            >
              {isGenerating ? 'Creating...' : initialData ? 'Update Item' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemModal;