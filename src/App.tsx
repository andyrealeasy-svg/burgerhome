/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ProfilePage } from './pages/ProfilePage';
import { AddressSelectionPage } from './pages/AddressSelectionPage';
import { ProductDetailModal } from './components/ProductDetailModal';

const AppContent: React.FC = () => {
  const { currentPage, selectedProduct, closeProductModal } = useApp();

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#121417] text-[#0F172A] dark:text-white flex flex-col selection:bg-emerald-500 selection:text-white transition-colors duration-250">
      {/* Navigation (Sidebar for Desktop, Header & Bottom Bar for Mobile) */}
      <Navigation />

      {/* Main Content Area */}
      <main className="flex-1 md:pl-64 lg:pl-72 pt-18 md:pt-6 pb-20 md:pb-10 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {currentPage === 'home' && <HomePage />}
          {currentPage === 'menu' && <MenuPage />}
          {currentPage === 'cart' && <CartPage />}
          {currentPage === 'checkout' && <CheckoutPage />}
          {currentPage === 'profile' && <ProfilePage />}
          {currentPage === 'address' && <AddressSelectionPage />}
        </div>
      </main>

      {/* Global Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal product={selectedProduct} onClose={closeProductModal} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
