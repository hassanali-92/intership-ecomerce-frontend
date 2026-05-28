import React, { useState, useEffect } from 'react'; 
import { Search, MessageSquare, Heart, ShoppingCart, Menu, ChevronDown, PlusCircle, LogOut, User } from 'lucide-react'; 
import logo from '../assets/Layout/Brand/logo-colored.png';
import flagDE from '../assets/Layout1/Image/flags/DE@2x.png';
import AddProductModal from './AddProductModal'; 

const Header = ({ setPage, refetchProducts, user, handleLogout, searchQuery, setSearchQuery, setSelectedCategory }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Local state taake user jab type kare toh har key stroke par direct API render crash na ho
  const [searchInput, setSearchInput] = useState(searchQuery || '');

  // Sync internal input when search tag is cleared from listing page
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const getUserInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  // 🌟 Search Execution Handler
  const handleSearchSubmit = () => {
    setSearchQuery(searchInput); // Global search state update
    setPage('listing');          // Direct route layout switch to listing page
  };

  // Listen for keyboard Enter press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  return (
    <>
      <header className="bg-white border-b border-shade-border lg:sticky top-0 z-50 shadow-sm">
        {/* Top Header */}
        <div className="container py-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setSearchQuery(''); setSelectedCategory(''); setPage('home'); }}>
            <img src={logo} alt="Brand" className="h-[46px]" />
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl flex border-2 border-primary rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-4 py-2 outline-none"
            />
            <div className="flex items-center border-l px-4 py-2 bg-white cursor-pointer hover:bg-gray-50 select-none">
              <span className="text-sm text-secondary">All category</span>
              <ChevronDown className="w-4 h-4 ml-2 opacity-75" />
            </div>
            <button
              className="bg-primary hover:bg-primary-dark text-white px-8 py-2 font-medium transition-colors"
              onClick={handleSearchSubmit}
            >
              Search
            </button>
          </div>

          {/* Icons Layout */}
          <div className="flex items-center gap-6">
            
            {/* USER AUTH SECTION WITH AVATAR */}
            {user ? (
              <div className="flex items-center gap-3 border-r pr-4 border-shade-border">
                <div 
                  className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow-sm border border-primary-dark select-none cursor-pointer"
                  onClick={() => setPage('profile')}
                  title={`View Profile: ${user.name}`}
                >
                  {getUserInitials(user.name)}
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-dark max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-[11px] font-medium text-red-500 hover:text-red-700 transition-colors bg-transparent border-none p-0 cursor-pointer text-left"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div 
                className="flex flex-col items-center cursor-pointer text-secondary hover:text-primary transition-colors" 
                onClick={() => setPage('login')}
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-secondary hover:bg-gray-200 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <span className="text-[11px] mt-0.5 font-medium">Sign In</span>
              </div>
            )}

            <div className="flex flex-col items-center cursor-pointer text-secondary hover:text-primary transition-colors" onClick={() => setPage('message')}>
              <MessageSquare className="w-5 h-5 mb-1" />
              <span className="text-xs">Message</span>
            </div>
            <div className="flex flex-col items-center cursor-pointer text-secondary hover:text-primary transition-colors" onClick={() => setPage('orders')}>
              <Heart className="w-5 h-5 mb-1" />
              <span className="text-xs">Orders</span>
            </div>
            <div className="flex flex-col items-center cursor-pointer text-secondary hover:text-primary transition-colors" onClick={() => setPage('cart')}>
              <ShoppingCart className="w-5 h-5 mb-1" />
              <span className="text-xs">My cart</span>
            </div>
          </div>
        </div>

        {/* Bottom Header */}
        <div className="border-t border-shade-border bg-white overflow-x-auto lg:overflow-visible no-scrollbar">
          <div className="container py-3 flex items-center justify-between whitespace-nowrap gap-4">
            <nav className="flex items-center gap-6 font-medium text-dark">
              <div className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors" onClick={() => { setSelectedCategory(''); setSearchQuery(''); setPage('listing'); }}>
                <Menu className="w-5 h-5" />
                <span>All category</span>
              </div>
              <a href="#" className="hover:text-primary transition-colors" onClick={(e) => { e.preventDefault(); setSelectedCategory('Mobile accessory'); setPage('listing'); }}>Hot offers</a>
              <a href="#" className="hover:text-primary transition-colors" onClick={(e) => { e.preventDefault(); setSelectedCategory('Modern tech'); setPage('listing'); }}>Gift boxes</a>
              <a href="#" className="hover:text-primary transition-colors" onClick={(e) => { e.preventDefault(); setSelectedCategory('Electronics'); setPage('listing'); }}>Projects</a>
              <a href="#" className="hover:text-primary transition-colors" onClick={(e) => { e.preventDefault(); setSelectedCategory('Smartphones'); setPage('listing'); }}>Menu item</a>
              <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                <span>Help</span>
                <ChevronDown className="w-4 h-4" />
              </div>

              {/* Add Product for Admin */}
              {user && user.isAdmin && (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-3 py-1.5 rounded-md transition-all shadow-sm ml-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              )}
            </nav>

            <div className="flex items-center gap-6 font-medium text-dark">
              <div className="flex items-center gap-1 cursor-pointer">
                <span>English, USD</span>
                <ChevronDown className="w-4 h-4 text-secondary" />
              </div>
              <div className="flex items-center gap-1 cursor-pointer">
                <span>Ship to</span>
                <img src={flagDE} alt="DE" className="w-5 h-3 rounded-sm shadow-sm" />
                <ChevronDown className="w-4 h-4 text-secondary" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Modal Component Setup */}
      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        refetch={refetchProducts} 
      />
    </>
  );
};

export default Header;