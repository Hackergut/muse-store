import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  language: 'it' | 'en';
  setLanguage: (lang: 'it' | 'en') => void;
}

export default function Navbar({ cartCount, onCartClick, language, setLanguage }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['Home', 'Bags', 'Wallets', 'Bracelets', 'Accessories'];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-8 sm:top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-gucci-700/20 shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Mobile menu button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="lg:hidden text-gucci-400 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </motion.button>

          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 sm:gap-3"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-gucci-500 to-gucci-700 flex items-center justify-center">
              <span className="text-white text-[10px] sm:text-xs">M</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base sm:text-lg tracking-[0.15em] text-gucci-400 leading-none">
                MUSE
              </h1>
              <p className="text-[7px] sm:text-[9px] tracking-[0.25em] text-gucci-600/60 uppercase">
                Exclusive Store
              </p>
            </div>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navItems.map((item, i) => (
              <motion.a
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                href={`#${item.toLowerCase()}`}
                className="text-[10px] xl:text-xs tracking-[0.1em] text-gray-400 hover:text-gucci-400 transition-colors duration-300 uppercase"
              >
                {item}
              </motion.a>
            ))}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-400 hover:text-gucci-400 transition-colors p-1.5 sm:p-2 hidden sm:block"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-400 hover:text-gucci-400 transition-colors p-1.5 sm:p-2 hidden sm:block"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </motion.button>

            {/* Language Selector */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="hidden sm:flex items-center gap-1 px-2 py-1 border border-gucci-700/30 rounded"
            >
              <button
                onClick={() => setLanguage('it')}
                className={`text-[9px] tracking-wider px-2 py-1 rounded transition-colors ${
                  language === 'it'
                    ? 'bg-gucci-600 text-white'
                    : 'text-gray-400 hover:text-gucci-400'
                }`}
              >
                IT
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`text-[9px] tracking-wider px-2 py-1 rounded transition-colors ${
                  language === 'en'
                    ? 'bg-gucci-600 text-white'
                    : 'text-gray-400 hover:text-gucci-400'
                }`}
              >
                EN
              </button>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onCartClick}
              className="relative text-gray-400 hover:text-gucci-400 transition-colors p-1.5 sm:p-2"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gucci-600 rounded-full flex items-center justify-center text-white text-[9px] sm:text-[10px]"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-gucci-700/20 overflow-hidden"
            >
              <div className="py-3 sm:py-4 space-y-1">
                {navItems.map((item, i) => (
                  <motion.a
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2.5 px-2 text-[10px] sm:text-xs tracking-[0.1em] text-gray-400 hover:text-gucci-400 transition-colors uppercase"
                  >
                    {item}
                  </motion.a>
                ))}
                {/* Mobile Language Selector */}
                <div className="flex items-center gap-2 px-2 py-3 mt-2 border-t border-gucci-700/20">
                  <span className="text-gray-500 text-[10px] uppercase">Language</span>
                  <button
                    onClick={() => setLanguage('it')}
                    className={`text-[9px] tracking-wider px-3 py-1 rounded transition-colors ${
                      language === 'it'
                        ? 'bg-gucci-600 text-white'
                        : 'text-gray-400 border border-gucci-700/30'
                    }`}
                  >
                    IT
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`text-[9px] tracking-wider px-3 py-1 rounded transition-colors ${
                      language === 'en'
                        ? 'bg-gucci-600 text-white'
                        : 'text-gray-400 border border-gucci-700/30'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
