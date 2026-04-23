import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroProps {
  language: 'it' | 'en';
}

const slides = {
  it: [
    {
      image: '/images/model-bag.jpg',
      title: 'L\'ARTE DEL',
      subtitle: 'LUSSO',
      description: 'Borse iconiche che definiscono eleganza e sofisticazione.',
    },
    {
      image: '/images/model-accessories.jpg',
      title: 'DETTAGLI',
      subtitle: 'RAFFINATI',
      description: 'Accessori esclusivi che completano il tuo stile firmato.',
    },
    {
      image: '/images/hero-bg.jpg',
      title: 'ELEGANZA',
      subtitle: 'TEMPORALE',
      description: 'Collezioni curate dalle maison di moda più prestigiose al mondo.',
    },
  ],
  en: [
    {
      image: '/images/model-bag.jpg',
      title: 'THE ART OF',
      subtitle: 'LUXURY',
      description: 'Iconic handbags that define elegance and sophistication.',
    },
    {
      image: '/images/model-accessories.jpg',
      title: 'REFINED',
      subtitle: 'DETAILS',
      description: 'Exquisite accessories that complete your signature style.',
    },
    {
      image: '/images/hero-bg.jpg',
      title: 'TIMELESS',
      subtitle: 'ELEGANCE',
      description: 'Curated collections from the world\'s most prestigious maisons.',
    },
  ],
};

const buttons = {
  it: { shop: 'Shop Collezione', explore: 'Esplora Brand' },
  en: { shop: 'Shop Collection', explore: 'Explore Brands' },
};

export default function Hero({ language }: HeroProps) {
  const [current, setCurrent] = useState(0);
  const currentSlides = slides[language];
  const currentButtons = buttons[language];

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % currentSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [currentSlides.length]);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={currentSlides[current].image}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#0a0a0a]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
        </motion.div>
      </AnimatePresence>

      {/* Decorative lines */}
      <div className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gucci-700/20 to-transparent z-10" />
      <div className="absolute bottom-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gucci-700/10 to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 w-full py-20 sm:py-32">
        <div className="max-w-xl sm:max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8"
          >
            <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-gucci-500 to-transparent" />
            <span className="text-gucci-400/80 text-[8px] sm:text-[10px] tracking-[0.25em] uppercase">
              Dal 2024
            </span>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white leading-tight sm:leading-none mb-4 sm:mb-6">
                <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl tracking-[0.2em] text-gucci-500/60 mb-2 sm:mb-3">
                  {currentSlides[current].title}
                </span>
                <span className="block tracking-[0.08em] text-white">
                  {currentSlides[current].subtitle}
                </span>
              </h1>

              <p className="text-gray-400 text-sm sm:text-lg md:text-xl leading-relaxed max-w-md sm:max-w-lg mb-8 sm:mb-10">
                {currentSlides[current].description}
              </p>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3 sm:gap-4"
          >
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="#all"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-gucci-700 to-gucci-600 text-white text-[10px] sm:text-xs tracking-[0.1em] uppercase rounded hover:from-gucci-600 hover:to-gucci-500 transition-all duration-300 shadow-lg shadow-gucci-900/30"
            >
              {currentButtons.shop}
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="#all"
              className="px-6 sm:px-8 py-3 sm:py-4 border border-gucci-700/50 text-gucci-400 text-[10px] sm:text-xs tracking-[0.1em] uppercase rounded hover:bg-gucci-900/20 hover:border-gucci-600/50 transition-all duration-300"
            >
              {currentButtons.explore}
            </motion.a>
          </motion.div>

          {/* Brand strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4 sm:gap-8 mt-10 sm:mt-16 flex-wrap"
          >
            {['GUCCI', 'LOUIS VUITTON', 'PRADA', 'DIOR'].map((brand) => (
              <span
                key={brand}
                className="text-[9px] sm:text-[10px] md:text-xs tracking-[0.15em] text-gray-600 hover:text-gucci-500 transition-colors duration-300 cursor-default"
              >
                {brand}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-16 sm:bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-3">
        {currentSlides.map((_, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => goTo(index)}
            className={`h-1 rounded-full transition-all duration-500 ${
              index === current
                ? 'w-6 sm:w-8 bg-gucci-500'
                : 'w-2 bg-gucci-700/40 hover:bg-gucci-600/60'
            }`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-[8px] sm:text-[10px] tracking-[0.2em] text-gray-600 uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-6 sm:h-10 bg-gradient-to-b from-gucci-600/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}
