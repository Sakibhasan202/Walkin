import React, { useState, useMemo } from 'react';
import { InventoryItem, CartItem, PaymentMethod } from '../types.ts';
import { Search, ShoppingCart, Plus, Minus, Trash2, CreditCard, Banknote, QrCode, CheckCircle2, X } from 'lucide-react';

interface POSProps {
  items: InventoryItem[];
  onCheckout: (cartItems: CartItem[], total: number, method: PaymentMethod) => void;
}

const POS: React.FC<POSProps> = ({ items, onCheckout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('CASH');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Filter items based on search and stock availability
  const filteredItems = useMemo(() => {
    return items.filter(item => 
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       item.type.toLowerCase().includes(searchTerm.toLowerCase())) &&
      item.stock > 0
    );
  }, [items, searchTerm]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.cartQuantity, 0);

  const addToCart = (item: InventoryItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        // Check if adding exceeds stock
        if (existing.cartQuantity >= item.stock) return prev;
        return prev.map(i => i.id === item.id ? { ...i, cartQuantity: i.cartQuantity + 1 } : i);
      }
      return [...prev, { ...item, cartQuantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === itemId) {
          const newQty = item.cartQuantity + delta;
          if (newQty <= 0) return null; // Will be filtered out
          // Check stock limit
          const originalItem = items.find(i => i.id === itemId);
          if (originalItem && newQty > originalItem.stock) return item;
          return { ...item, cartQuantity: newQty };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate API call/processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onCheckout(cart, cartTotal, selectedPayment);
    setIsProcessing(false);
    setIsSuccess(true);
    
    // Reset after success animation
    setTimeout(() => {
      setIsSuccess(false);
      setIsPaymentModalOpen(false);
      setCart([]);
      setSelectedPayment('CASH');
    }, 2000);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] md:h-[calc(100vh-40px)] gap-6 animate-in fade-in duration-500">
      {/* Product Grid Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-4 sticky top-0 z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-2 pb-20">
          {filteredItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => addToCart(item)}
              className="flex flex-col bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md hover:border-indigo-200 transition-all text-left group"
            >
              <div className="h-32 overflow-hidden bg-slate-100 relative w-full">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.stock} left
                </div>
              </div>
              <div className="p-3">
                <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{item.name}</h4>
                <p className="text-slate-500 text-xs mb-2">{item.type}</p>
                <div className="font-bold text-indigo-600">${item.price.toFixed(2)}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-full md:w-96 bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col h-full sticky top-0">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-900 flex items-center">
              <ShoppingCart className="mr-2" size={20} />
              Current Order
            </h3>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full">
              {totalItems} Items
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
              <ShoppingCart size={48} className="opacity-20" />
              <p className="text-sm font-medium">Cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-indigo-100 transition-colors bg-slate-50/30">
                <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-slate-200" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{item.name}</h4>
                  <div className="text-xs text-indigo-600 font-medium">${(item.price * item.cartQuantity).toFixed(2)}</div>
                </div>
                
                <div className="flex items-center bg-white rounded-lg border border-slate-200 shadow-sm">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 hover:text-rose-500 transition-colors">
                    {item.cartQuantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                  </button>
                  <span className="w-6 text-center text-xs font-bold">{item.cartQuantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 hover:text-indigo-600 transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-5 bg-slate-50 rounded-b-2xl border-t border-slate-100 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-500">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-500">
              <span>Tax (8%)</span>
              <span>${(cartTotal * 0.08).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-200">
              <span>Total</span>
              <span>${(cartTotal * 1.08).toFixed(2)}</span>
            </div>
          </div>
          
          <button 
            onClick={() => setIsPaymentModalOpen(true)}
            disabled={cart.length === 0}
            className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-slate-900/20"
          >
            Checkout Now
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
            {!isSuccess && !isProcessing && (
              <button 
                onClick={() => setIsPaymentModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            )}

            {isSuccess ? (
              <div className="p-12 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h3>
                <p className="text-slate-500">Receipt sent to email.</p>
              </div>
            ) : (
              <div className="p-6">
                 <h3 className="text-xl font-bold text-slate-900 mb-6">Payment Method</h3>
                 
                 <div className="grid grid-cols-3 gap-3 mb-8">
                   <button 
                    onClick={() => setSelectedPayment('CASH')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${selectedPayment === 'CASH' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 hover:border-slate-200 text-slate-500'}`}
                   >
                     <Banknote size={24} className="mb-2" />
                     <span className="text-xs font-bold">Cash</span>
                   </button>
                   <button 
                    onClick={() => setSelectedPayment('CARD')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${selectedPayment === 'CARD' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 hover:border-slate-200 text-slate-500'}`}
                   >
                     <CreditCard size={24} className="mb-2" />
                     <span className="text-xs font-bold">Card</span>
                   </button>
                   <button 
                    onClick={() => setSelectedPayment('QR')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${selectedPayment === 'QR' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 hover:border-slate-200 text-slate-500'}`}
                   >
                     <QrCode size={24} className="mb-2" />
                     <span className="text-xs font-bold">QR / UPI</span>
                   </button>
                 </div>

                 <div className="bg-slate-50 p-4 rounded-xl mb-6 flex justify-between items-center border border-slate-100">
                    <span className="text-slate-500 font-medium">Total Amount</span>
                    <span className="text-2xl font-bold text-slate-900">${(cartTotal * 1.08).toFixed(2)}</span>
                 </div>

                 <button
                   onClick={handlePayment}
                   disabled={isProcessing}
                   className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-70 flex items-center justify-center"
                 >
                   {isProcessing ? (
                     <>
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></span>
                        Processing...
                     </>
                   ) : 'Pay Now'}
                 </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;