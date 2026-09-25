import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { ImageWithFallback } from './ImageWithFallback';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { openProductModal, addToCart } = useApp();
  const [justAdded, setJustAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, [], [], 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article
      onClick={() => openProductModal(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openProductModal(product);
        }
      }}
      style={{ animationDelay: `${Math.min(index * 60, 360)}ms` }}
      className="group relative flex flex-col justify-between bg-white dark:bg-[#1A1D23] rounded-2xl border border-neutral-200/80 dark:border-white/10 p-3.5 sm:p-4 text-left transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-md cursor-pointer animate-fade-up focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
    >
      <div>
        {/* Product Photo */}
        <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 mb-3">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            fallbackText={product.name}
          />
          {product.weight && (
            <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-neutral-900/70 backdrop-blur-xs text-[11px] font-medium text-white tabular-nums">
              {product.weight}
            </span>
          )}
        </div>

        {/* Product Details */}
        <h3 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight leading-snug group-hover:text-emerald-500 transition-colors duration-200">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-300 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Footer: Price & Add Button */}
      <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between gap-2">
        <div>
          <span className="text-xs text-neutral-400 dark:text-neutral-400 font-medium block">Цена</span>
          <span className="text-base sm:text-lg font-extrabold text-neutral-950 dark:text-white tracking-tight tabular-nums">
            {product.price} ₽
          </span>
        </div>

        <button
          onClick={handleQuickAdd}
          aria-label={`Добавить ${product.name} в корзину`}
          className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ${
            justAdded
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-200 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white'
          }`}
        >
          {justAdded ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Добавлено</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>В корзину</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
};
