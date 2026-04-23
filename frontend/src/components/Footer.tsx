import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] border-t border-gucci-700/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Top decorative line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center mb-10 sm:mb-12"
        >
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gucci-700/30 to-transparent" />
          <motion.div
            whileHover={{ scale: 1.1, rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-gucci-500 to-gucci-700 flex items-center justify-center mx-3 sm:mx-4"
          >
            <span className="text-white text-[10px] sm:text-xs">M</span>
          </motion.div>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gucci-700/30 to-transparent" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0 }}
            className="col-span-2 md:col-span-1 text-center md:text-left"
          >
            <h3 className="text-lg sm:text-xl tracking-[0.1em] text-gucci-400 mb-2 sm:mb-3">
              MUSE
            </h3>
            <p className="text-[8px] sm:text-[10px] tracking-[0.25em] text-gucci-600/60 uppercase mb-3 sm:mb-4">
              Exclusive Store
            </p>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
              Curating the finest luxury pieces from the world's most iconic fashion houses.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center md:text-left"
          >
            <h4 className="text-gucci-500/70 text-[9px] sm:text-[10px] tracking-[0.2em] uppercase mb-4 sm:mb-5">
              Collection
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {['Designer Bags', 'Luxury Wallets', 'Fine Bracelets', 'Accessories'].map((item) => (
                <li key={item}>
                  <motion.a
                    whileHover={{ x: 5 }}
                    href="#"
                    className="text-gray-500 text-xs sm:text-sm hover:text-gucci-400 transition-colors duration-300 inline-block"
                  >
                    {item}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Brands */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center md:text-left"
          >
            <h4 className="text-gucci-500/70 text-[9px] sm:text-[10px] tracking-[0.2em] uppercase mb-4 sm:mb-5">
              Brands
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {['Gucci', 'Louis Vuitton', 'Prada', 'Dior', 'Saint Laurent'].map((item) => (
                <li key={item}>
                  <motion.a
                    whileHover={{ x: 5 }}
                    href="#"
                    className="text-gray-500 text-xs sm:text-sm hover:text-gucci-400 transition-colors duration-300 inline-block"
                  >
                    {item}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="col-span-2 md:col-span-1 text-center md:text-left"
          >
            <h4 className="text-gucci-500/70 text-[9px] sm:text-[10px] tracking-[0.2em] uppercase mb-4 sm:mb-5">
              Contact
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              <li className="text-gray-500 text-xs sm:text-sm">Via Monte Napoleone, 12</li>
              <li className="text-gray-500 text-xs sm:text-sm">20121 Milano, Italy</li>
              <li className="text-gray-500 text-xs sm:text-sm">+39 02 1234 5678</li>
              <li>
                <a href="mailto:info@muse-exclusive.com" className="text-gucci-500/70 text-xs sm:text-sm hover:text-gucci-400 transition-colors">
                  info@muse-exclusive.com
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="border-t border-gucci-700/10 mt-10 sm:mt-12 pt-6 sm:pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-gray-600 text-[10px] sm:text-xs tracking-wider text-center md:text-left">
            © {currentYear} MUSE EXCLUSIVE STORE. All rights reserved.
          </p>
          <div className="flex items-center gap-4 sm:gap-6">
            {['Privacy', 'Terms', 'Shipping'].map((item) => (
              <motion.a
                key={item}
                whileHover={{ y: -2 }}
                href="#"
                className="text-gray-600 text-[10px] sm:text-xs tracking-wider hover:text-gucci-500 transition-colors"
              >
                {item}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
