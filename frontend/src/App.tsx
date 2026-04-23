import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import Footer from './components/Footer';
import CartModal from './components/CartModal';
import AdminPanel from './components/AdminPanel';
import { products as defaultProducts, categories, brands } from './data/products';
import type { Product } from './data/products';
import { useTelegram } from './hooks/useTelegram';

interface CartItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  quantity: number;
}

const API_URL = 'https://muse-store.onrender.com';

const translations = {
  it: {
    curatedSelection: 'Selezione Curata',
    ourCollection: 'La Nostra Collezione',
    collectionDesc: 'Esplora la nostra selezione di pezzi di lusso più desiderati dalle case di moda più iconiche.',
    bestSellers: 'I Più Venduti',
    bestSellersDesc: 'I preferiti dei nostri clienti - qualità e stile senza compromessi.',
    shopAll: 'Vedi Tutto',
    authenticity: 'Autenticità Garantita',
    authenticityDesc: 'Ogni pezzo è verificato dai nostri esperti autenticatori.',
    expressShipping: 'Spedizione Express',
    expressShippingDesc: 'Spedizione express gratuita su tutti gli ordini.',
    whiteGlove: 'Servizio Premium',
    whiteGloveDesc: "Assistenza personalizzata per un'esperienza di lusso.",
    stayConnected: 'Resta Connesso',
    innerCircle: 'Entra nel Circolo Interiore',
    newsletterDesc: 'Iscriviti per accesso esclusivo ai nuovi arrivi, vendite private e ispirazione.',
    subscribe: 'Iscriviti',
    emailPlaceholder: 'La tua email',
    shippingBanner: 'SPEDIZIONE GRATUITA IN TUTTA ITALIA',
    lang: 'IT',
    order: 'Ordina su Telegram',
    cartTitle: 'Carrello',
    emptyCart: 'Il carrello è vuoto',
    total: 'Totale',
    checkout: 'Invia Ordine Telegram',
    orderSent: 'Ordine inviato!',
    orderError: 'Errore invio ordine.',
  },
  en: {
    curatedSelection: 'Curated Selection',
    ourCollection: 'Our Collection',
    collectionDesc: 'Explore our handpicked selection of the most coveted luxury pieces from iconic fashion houses.',
    bestSellers: 'Best Sellers',
    bestSellersDesc: "Our customers' favorites - uncompromised quality and style.",
    shopAll: 'View All',
    authenticity: 'Authenticity Guaranteed',
    authenticityDesc: 'Every piece is verified by our expert authenticators.',
    expressShipping: 'Express Shipping',
    expressShippingDesc: 'Complimentary express shipping on all orders.',
    whiteGlove: 'White Glove Service',
    whiteGloveDesc: 'Personal assistance for the ultimate luxury experience.',
    stayConnected: 'Stay Connected',
    innerCircle: 'Join the Inner Circle',
    newsletterDesc: 'Subscribe for exclusive access to new arrivals, private sales, and style inspiration.',
    subscribe: 'Subscribe',
    emailPlaceholder: 'Your email address',
    shippingBanner: 'FREE SHIPPING ACROSS ITALY',
    lang: 'EN',
    order: 'Order on Telegram',
    cartTitle: 'Cart',
    emptyCart: 'Your cart is empty',
    total: 'Total',
    checkout: 'Send Telegram Order',
    orderSent: 'Order sent!',
    orderError: 'Error sending order.',
  },
};

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [addedNotification, setAddedNotification] = useState<string | null>(null);
  const [language] = useState<'it' | 'en'>('it');
  const [adminHash, setAdminHash] = useState(() => {
    const isAdminMode =
      window.location.hash === '#admin' ||
      new URLSearchParams(window.location.search).get('admin') === '1';
    if (isAdminMode) console.log('Admin mode detected:', window.location.href);
    return isAdminMode;
  });

  const { isMiniApp, haptic, notify } = useTelegram();

  const t = translations[language];

  const isAdminMode = () =>
    window.location.hash === '#admin' ||
    new URLSearchParams(window.location.search).get('admin') === '1';

  useEffect(() => {
    setAdminHash(isAdminMode());
    const handler = () => setAdminHash(isAdminMode());
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const [productList, setProductList] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem('muse-products');
      if (stored) return JSON.parse(stored) as Product[];
    } catch { /* ignore */ }
    return defaultProducts;
  });

  const [categoryList] = useState<{ id: string; name: string }[]>(() => {
    try {
      const stored = localStorage.getItem('muse-categories');
      if (stored) return JSON.parse(stored) as { id: string; name: string }[];
    } catch { /* ignore */ }
    return categories;
  });

  useEffect(() => {
    localStorage.setItem('muse-products', JSON.stringify(productList));
  }, [productList]);

  useEffect(() => {
    localStorage.setItem('muse-categories', JSON.stringify(categoryList));
  }, [categoryList]);

  const allCategories = useMemo(() => [{ id: 'all', name: 'Tutti' }, ...categoryList], [categoryList]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return productList;
    return productList.filter((p: Product) => p.category === activeCategory);
  }, [activeCategory, productList]);

  const bestSellers = useMemo(() => {
    return productList.filter((p: Product) => p.badge === 'Best Seller').slice(0, 4);
  }, [productList]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = (product: Product) => {
    haptic('light');
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    setAddedNotification(product.name);
    setTimeout(() => setAddedNotification(null), 2500);
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    const order = {
      items: cart.map((c) => ({ name: c.name, brand: c.brand, qty: c.quantity, price: c.price })),
      total: cartTotal,
    };

    // 1) Prova POST al backend API
    try {
      const res = await fetch(`${API_URL}/api/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      if (res.ok) {
        notify('success');
        setAddedNotification(t.orderSent);
        setCart([]);
        setCartOpen(false);
        return;
      }
    } catch {
      // backend non raggiungibile, fallback su tg.sendData()
    }

    // 2) Fallback: tg.sendData() (funziona solo se il bot è avviato e in ascolto)
    if (isMiniApp) {
      notify('success');
      (window as any).Telegram?.WebApp?.sendData?.(JSON.stringify(order));
      setCart([]);
      setCartOpen(false);
    } else {
      // Se non siamo in Telegram e il backend è down, mostra alert
      setAddedNotification(t.orderError);
      notify('error');
    }
  };

  if (adminHash) {
    return <AdminPanel onProductsChange={setProductList} />;
  }

  return (
    <div className={`min-h-screen bg-[#0a0a0a] text-white ${isMiniApp ? 'pb-[80px]' : ''}`}>
      {!isMiniApp && (
        <motion.div
          initial={{ y: -30 }}
          animate={{ y: 0 }}
          className="bg-gradient-to-r from-gucci-800 via-gucci-700 to-gucci-800 text-white text-[9px] sm:text-[10px] tracking-[0.15em] uppercase py-2 text-center"
        >
          <div className="max-w-7xl mx-auto px-4">{t.shippingBanner}</div>
        </motion.div>
      )}

      {!isMiniApp && <Navbar cartCount={cartCount} onCartClick={() => setCartOpen(true)} language={language} setLanguage={() => {}} />}
      <Hero language={language} />

      {!isMiniApp && (
        <section className="py-6 sm:py-8 border-y border-gucci-700/20 bg-[#0d0d0d] overflow-hidden">
          <div className="flex items-center gap-12 sm:gap-16 animate-scroll">
            {[...brands, ...brands].map((brand, i) => (
              <span key={i} className="text-xl sm:text-2xl md:text-3xl tracking-[0.1em] text-gray-700 whitespace-nowrap">{brand}</span>
            ))}
          </div>
        </section>
      )}

      <section className="py-8 sm:py-12 bg-gradient-to-b from-[#0a0a0a] to-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl text-white tracking-[0.08em] mb-2">{t.bestSellers}</h2>
          </motion.div>
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {bestSellers.map((product: Product, index: number) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.1 }}>
                <ProductCard product={product} onAddToCart={addToCart} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="all" className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl text-white tracking-[0.08em] mb-2">{t.ourCollection}</h2>
            <p className="text-gray-500 max-w-md mx-auto text-xs sm:text-sm">{t.collectionDesc}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            {allCategories.map((cat, index: number) => (
              <motion.button key={cat.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: index * 0.05 }} whileTap={{ scale: 0.95 }} onClick={() => setActiveCategory(cat.id)}
                className={`px-4 sm:px-5 py-1.5 sm:py-2 text-[10px] sm:text-xs tracking-[0.1em] uppercase rounded-full transition-all duration-300 ${ activeCategory === cat.id ? 'bg-gucci-600 text-white shadow-lg' : 'text-gray-500 border border-gucci-700/30 hover:border-gucci-600/50 hover:text-gucci-400'}`}
              >
                {cat.name}
              </motion.button>
            ))}
          </motion.div>

          <motion.div layout className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product: Product, index: number) => (
                <motion.div key={product.id} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4, delay: index * 0.03 }}>
                  <ProductCard product={product} onAddToCart={addToCart} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {!isMiniApp && (
        <>
          <section className="py-12 sm:py-16 border-t border-gucci-700/10 bg-[#0d0d0d]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: t.authenticity, desc: t.authenticityDesc },
                { title: t.expressShipping, desc: t.expressShippingDesc },
                { title: t.whiteGlove, desc: t.whiteGloveDesc },
              ].map((feature, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }} className="text-center">
                  <h3 className="text-white text-sm tracking-wide mb-2">{feature.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>
          <Footer />
        </>
      )}

      <CartModal
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        isMiniApp={isMiniApp}
        cartTotal={cartTotal}
        onCheckout={handleCheckout}
        translations={{ cartTitle: t.cartTitle, emptyCart: t.emptyCart, total: t.total, checkout: t.checkout }}
      />

      {isMiniApp && cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 py-3 bg-[#111] border-t border-gucci-700/20">
          <button onClick={() => { handleCheckout(); }} className="w-full py-2 bg-gucci-600 text-white text-xs tracking-[0.1em] uppercase rounded">
            {t.checkout}: €{cartTotal.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
          </button>
        </div>
      )}

      <AnimatePresence>
        {addedNotification && (
          <motion.div initial={{ opacity: 0, y: 50, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 50, x: '-50%' }} transition={{ type: 'spring', damping: 25 }} className="fixed bottom-6 sm:bottom-8 left-1/2 z-50 px-4">
            <div className="px-5 py-3 bg-[#1a1a1a] border border-gucci-700/30 rounded-lg shadow-2xl flex items-center gap-3">
              <span className="text-gray-300 text-xs"><span className="text-gucci-400 font-semibold">{addedNotification}</span></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
