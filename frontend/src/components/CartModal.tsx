import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CartItem { id: number; name: string; brand: string; price: number; image: string; quantity: number; }

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
  isMiniApp?: boolean;
  cartTotal?: number;
  onCheckout?: () => void;
  translations?: { cartTitle: string; emptyCart: string; total: string; checkout: string };
}

export default function CartModal({ isOpen, onClose, cart, onUpdateQuantity, onRemove, isMiniApp = false, cartTotal, onCheckout, translations: t = { cartTitle: 'SHOPPING BAG', emptyCart: 'Your bag is empty', total: 'Subtotal', checkout: 'PROCEED TO CHECKOUT' }}: CartModalProps) {
  const total = cartTotal ?? cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (isOpen) { document.body.style.overflow = 'hidden'; } else { document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30 }} className="absolute right-0 top-0 h-full w-full max-w-md bg-[#0d0d0d] border-l border-gucci-700/30 shadow-2xl">
            <div className="flex flex-col h-full safe-bottom">
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gucci-700/30">
                <h2 className="text-base sm:text-lg tracking-[0.15em] text-gucci-400">{t.cartTitle}</h2>
                <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={onClose} className="text-gucci-500/60 hover:text-gucci-400 transition-colors p-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </motion.button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
                {cart.length === 0 ? (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center h-full text-center space-y-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-gucci-700/40 flex items-center justify-center">
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 text-gucci-600/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    </div>
                    <p className="text-gray-500 text-xs sm:text-sm tracking-wide">{t.emptyCart}</p>
                  </motion.div>
                ) : (
                  <AnimatePresence>
                    {cart.map((item, index) => (
                      <motion.div key={item.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ delay: index * 0.05 }} layout className="flex gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-lg bg-[#141414] border border-gucci-700/20">
                        <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-md overflow-hidden bg-[#1a1a1a] flex-shrink-0"><img src={item.image} alt={item.name} className="w-full h-full object-cover" /></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gucci-400/80 text-[8px] sm:text-[10px] tracking-[0.15em] uppercase">{item.brand}</p>
                          <p className="text-gray-200 text-xs sm:text-sm truncate mt-0.5">{item.name}</p>
                          <p className="text-gucci-500 text-xs sm:text-sm mt-1">€{item.price.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-gucci-700/40 rounded">
                              <motion.button whileTap={{ scale: 0.9 }} onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="px-2 py-0.5 sm:py-1 text-gucci-400 hover:bg-gucci-900/20 transition-colors text-sm">−</motion.button>
                              <span className="px-2 sm:px-3 py-0.5 sm:py-1 text-gray-300 text-xs sm:text-sm">{item.quantity}</span>
                              <motion.button whileTap={{ scale: 0.9 }} onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="px-2 py-0.5 sm:py-1 text-gucci-400 hover:bg-gucci-900/20 transition-colors text-sm">+</motion.button>
                            </div>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => onRemove(item.id)} className="text-gray-600 hover:text-red-500 transition-colors p-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
              {cart.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="border-t border-gucci-700/30 p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs sm:text-sm tracking-wide">{t.total}</span>
                    <span className="text-gucci-400 text-base sm:text-lg">€{total.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                  </div>
                  {!isMiniApp && <p className="text-gray-600 text-[10px] sm:text-xs tracking-wide text-center">Shipping &amp; taxes calculated at checkout</p>}
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onCheckout} className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-gucci-700 to-gucci-600 text-white text-[10px] sm:text-xs tracking-[0.1em] uppercase rounded hover:from-gucci-600 hover:to-gucci-500 transition-all duration-300 shadow-lg shadow-gucci-900/30">{t.checkout}</motion.button>
                  {!isMiniApp && <motion.button whileHover={{ scale: 1.01 }} onClick={onClose} className="w-full py-2 text-gucci-500/70 text-[10px] sm:text-xs tracking-widest hover:text-gucci-400 transition-colors">CONTINUE SHOPPING</motion.button>}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
