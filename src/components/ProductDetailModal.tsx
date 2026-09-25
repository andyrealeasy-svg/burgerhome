import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, Sparkles, SlidersHorizontal, PlusCircle } from 'lucide-react';
import { Product, ProductAddon } from '../types';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { ImageWithFallback } from './ImageWithFallback';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart } = useApp();

  // State for customizing ingredients
  // Ingredients kept by default: all in defaultIngredients
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);

  // State for selected addons (toppings)
  const [selectedAddons, setSelectedAddons] = useState<ProductAddon[]>([]);

  // Track extra recommended products added directly from this modal
  const [addedRecommendedIds, setAddedRecommendedIds] = useState<string[]>([]);

  // Quantity
  const [quantity, setQuantity] = useState(1);

  // Success indicator
  const [isAdded, setIsAdded] = useState(false);

  // Find other products recommended to this product
  const recommendedProducts = React.useMemo(() => {
    if (product.recommendedProductIds && product.recommendedProductIds.length > 0) {
      return PRODUCTS.filter((p) => product.recommendedProductIds?.includes(p.id));
    }
    // Fallback: recommend items from other categories (snacks, drinks, sauces)
    return PRODUCTS.filter((p) => p.id !== product.id && p.category !== product.category).slice(0, 3);
  }, [product]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const toggleIngredient = (ingredient: string) => {
    setRemovedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((item) => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  const toggleAddon = (addon: ProductAddon) => {
    setSelectedAddons((prev) =>
      prev.some((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const handleAddRecommendedProduct = (recProduct: Product) => {
    addToCart(recProduct, [], [], 1);
    setAddedRecommendedIds((prev) => [...prev, recProduct.id]);
    setTimeout(() => {
      setAddedRecommendedIds((prev) => prev.filter((id) => id !== recProduct.id));
    }, 2000);
  };

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = product.price + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(product, removedIngredients, selectedAddons, quantity);
    setIsAdded(true);
    setTimeout(() => {
      onClose();
    }, 700);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/60 backdrop-blur-xs animate-fade-up"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-[#1A1D23] rounded-3xl border border-neutral-200/90 dark:border-white/10 shadow-2xl overflow-hidden transition-colors"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 dark:bg-neutral-800/90 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 shadow-xs border border-neutral-200/60 dark:border-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto">
          {/* Product Hero Image */}
          <div className="relative aspect-16/9 w-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
              fallbackText={product.name}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-3 left-4 flex items-center gap-2">
              {product.weight && (
                <span className="px-2.5 py-1 rounded-lg bg-neutral-900/80 backdrop-blur-xs text-xs font-semibold text-white tabular-nums">
                  {product.weight}
                </span>
              )}
              {product.calories && (
                <span className="px-2.5 py-1 rounded-lg bg-neutral-900/80 backdrop-blur-xs text-xs font-semibold text-neutral-300 tabular-nums">
                  {product.calories} ккал
                </span>
              )}
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-6">
            {/* Header: Title & Description */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
                  {product.name}
                </h2>
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-emerald-500 tabular-nums shrink-0">
                  {product.price} ₽
                </span>
              </div>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* 1. Редактирование содержимого товара */}
            {product.defaultIngredients && product.defaultIngredients.length > 0 && (
              <div className="pt-4 border-t border-neutral-100 dark:border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-white uppercase">
                    Редактирование содержимого
                  </h3>
                  <span className="text-xs text-neutral-400 dark:text-neutral-400 font-normal">
                    (снимите отметку, чтобы убрать ингредиент)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.defaultIngredients.map((ingredient) => {
                    const isRemoved = removedIngredients.includes(ingredient);
                    return (
                      <button
                        key={ingredient}
                        type="button"
                        onClick={() => toggleIngredient(ingredient)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all duration-200 text-left ${
                          isRemoved
                            ? 'bg-neutral-50 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-700 text-neutral-400 dark:text-neutral-500 line-through'
                            : 'bg-white dark:bg-neutral-800/80 border-neutral-200/80 dark:border-white/10 text-neutral-800 dark:text-neutral-200 hover:border-neutral-300 dark:hover:border-neutral-600'
                        }`}
                      >
                        <span className="truncate pr-2">{ingredient}</span>
                        <span
                          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors ${
                            !isRemoved
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700'
                          }`}
                        >
                          {!isRemoved && <Check className="w-3 h-3 stroke-[3]" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Optional Toppings / Addons */}
            {product.optionalAddons && product.optionalAddons.length > 0 && (
              <div className="pt-4 border-t border-neutral-100 dark:border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <PlusCircle className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-white uppercase">
                    Дополнительные топпинги
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {product.optionalAddons.map((addon) => {
                    const isSelected = selectedAddons.some((a) => a.id === addon.id);
                    return (
                      <button
                        key={addon.id}
                        type="button"
                        onClick={() => toggleAddon(addon)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                          isSelected
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-300 shadow-xs'
                            : 'bg-white dark:bg-neutral-800/80 border-neutral-200 dark:border-white/10 text-neutral-800 dark:text-neutral-200 hover:border-neutral-300 dark:hover:border-neutral-600'
                        }`}
                      >
                        <span>{addon.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="tabular-nums text-neutral-500 dark:text-neutral-400">
                            +{addon.price} ₽
                          </span>
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${
                              isSelected
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'border-neutral-300 dark:border-neutral-600'
                            }`}
                          >
                            {isSelected ? (
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            ) : (
                              <Plus className="w-2.5 h-2.5 text-neutral-400 dark:text-neutral-400" />
                            )}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. РЕКОМЕНДАЦИИ К ТОВАРУ */}
            {recommendedProducts.length > 0 && (
              <div className="pt-4 border-t border-neutral-100 dark:border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-white uppercase">
                    Рекомендации к товару
                  </h3>
                  <span className="text-xs text-neutral-400 dark:text-neutral-400 font-normal">
                    (отлично сочетается с этим блюдом)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {recommendedProducts.map((rec) => {
                    const isAddedJustNow = addedRecommendedIds.includes(rec.id);
                    return (
                      <div
                        key={rec.id}
                        className="bg-neutral-50/70 dark:bg-neutral-800/60 rounded-2xl border border-neutral-200 dark:border-white/10 p-2.5 flex flex-col justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-700 shrink-0">
                            <ImageWithFallback
                              src={rec.image}
                              alt={rec.name}
                              className="w-full h-full object-cover"
                              fallbackText={rec.name}
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                              {rec.name}
                            </h4>
                            <span className="text-xs font-extrabold text-neutral-700 dark:text-neutral-300 tabular-nums">
                              {rec.price} ₽
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddRecommendedProduct(rec)}
                          className={`w-full py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all active:scale-95 ${
                            isAddedJustNow
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 hover:border-emerald-500 hover:text-emerald-500 text-neutral-800 dark:text-neutral-200'
                          }`}
                        >
                          {isAddedJustNow ? (
                            <>
                              <Check className="w-3 h-3 stroke-[2.5]" />
                              <span>В заказе!</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3 stroke-[2]" />
                              <span>В корзину</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Sticky Bottom Bar */}
        <div className="p-4 sm:p-5 border-t border-neutral-100 dark:border-white/5 bg-neutral-50/70 dark:bg-[#14161A] flex items-center justify-between gap-3">
          {/* Quantity Controls */}
          <div className="flex items-center bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-1 shadow-xs">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label="Уменьшить количество"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-extrabold text-neutral-900 dark:text-white tabular-nums">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Увеличить количество"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`flex-1 py-3 px-5 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99] shadow-sm ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-neutral-950 hover:bg-neutral-800 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white dark:text-neutral-950'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Добавлено в заказ!</span>
              </>
            ) : (
              <>
                <span>Добавить в корзину</span>
                <span className="opacity-40">·</span>
                <span className="tabular-nums text-emerald-400 font-bold">
                  {totalPrice} ₽
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
