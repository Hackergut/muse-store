import { motion } from 'framer-motion';
import type { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative bg-[#111] border border-gucci-700/10 rounded-lg overflow-hidden hover:border-gucci-600/40 transition-all duration-500 hover:shadow-2xl hover:shadow-gucci-900/10"
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10">
          <span className="px-2 sm:px-3 py-0.5 sm:py-1 text-[8px] sm:text-[10px] tracking-[0.1em] uppercase bg-gucci-600/90 text-white rounded-full">
            {product.badge}
          </span>
        </div>
      )}

      {/* Discount */}
      {product.originalPrice && (
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10">
          <span className="px-2 sm:px-3 py-0.5 sm:py-1 text-[8px] sm:text-[10px] tracking-[0.1em] uppercase bg-red-900/80 text-red-200 rounded-full">
            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </span>
        </div>
      )}

      {/* Image */}
      <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden bg-[#0d0d0d]">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Quick add overlay */}
        <div className="absolute inset-0 flex items-end justify-center pb-4 sm:pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAddToCart(product)}
            className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gucci-600/95 text-white text-[9px] sm:text-[10px] tracking-[0.1em] uppercase hover:bg-gucci-500 transition-colors duration-300 rounded shadow-lg backdrop-blur-sm"
          >
            Add to Bag
          </motion.button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4 lg:p-5">
        <p className="text-gucci-500/70 text-[8px] sm:text-[10px] tracking-[0.2em] uppercase mb-1 sm:mb-2">
          {product.brand}
        </p>
        <h3 className="text-gray-200 text-xs sm:text-sm mb-2 sm:mb-3 leading-snug line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-gucci-400 text-sm sm:text-base lg:text-lg">
            €{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-gray-600 line-through text-xs sm:text-sm">
              €{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
