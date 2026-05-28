import React, { useState } from 'react';
import { ChevronRight, Grid, List, ChevronDown, Star, Heart, X, PackageOpen } from 'lucide-react'; 
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// 🌟 UPDATE: Fetcher function mein ab pageNumber ke sath searchQuery aur category bhi pass hogi
const fetchProducts = async (pageNumber, searchQuery, category) => {
 let url = `https://intership-ecomerce-backend.onrender.com/api/products?pageNumber=${pageNumber}`;
  
  if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
  if (category) url += `&category=${encodeURIComponent(category)}`;

  const { data } = await axios.get(url);
  return data;
};

// 🌟 Props mein search aur category ke states accept kiye hain (jo aapke Navbar ya App.jsx se aa rahe honge)
const ProductListing = ({ setPage, setSelectedProduct, searchQuery = '', setSearchQuery, selectedCategory = '', setSelectedCategory }) => {
  const [viewMode, setViewMode] = useState('grid'); 
  const [currentPage, setCurrentPage] = useState(1); 

  // 🌟 TanStack Query: queryKey mein searchQuery aur selectedCategory daal di taake inke change hote hi fetch trigger ho jaye
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products', currentPage, searchQuery, selectedCategory],
    queryFn: () => fetchProducts(currentPage, searchQuery, selectedCategory),
    keepPreviousData: true, 
  });

  // Mock data for hardcoded filters visualization
  const activeFilters = [
    ...(selectedCategory ? [selectedCategory] : []),
    ...(searchQuery ? [searchQuery] : [])
  ];

  // 🌟 Database se unique categories nikalne ki logic (Sidebar ke liye)
  // Agar aapke backend response mein categories alag se nahi aa rahi, toh hum data?.products se dynamic nikal sakte hain
  const staticCategories = ["Mobile accessory", "Electronics", "Smartphones", "Modern tech"];

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[400px] text-lg font-semibold text-primary">Loading customized products...</div>;
  }

  if (isError) {
    return <div className="flex justify-center items-center min-h-[400px] text-lg font-semibold text-red-500">Error: {error.message}</div>;
  }

  const products = data?.products || [];
  const totalPages = data?.pages || 1;
  const hasProducts = products.length > 0; 

  return (
    <div className="container py-4">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[#8B96A5] text-sm mb-6">
        <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => setPage('home')}>Home</span>
        <ChevronRight className="w-4 h-4" />
        <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => setSelectedCategory('')}>Products</span>
        {selectedCategory && (
          <>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#1C1C1C] font-normal capitalize">{selectedCategory}</span>
          </>
        )}
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <aside className="w-[240px] flex-shrink-0 space-y-2">
          {/* Category Sidebar */}
          <div className="border-t border-[#DEE2E7] py-3">
            <h4 className="font-bold text-[#1C1C1C] mb-3 flex justify-between items-center cursor-pointer">
              Category <ChevronDown className="w-4 h-4 opacity-50" />
            </h4>
            <ul className="space-y-3 text-[#505050] text-sm">
              {/* All Products Option */}
              <li 
                className={`hover:text-primary cursor-pointer ${!selectedCategory ? 'text-primary font-semibold' : ''}`}
                onClick={() => { setSelectedCategory(''); setCurrentPage(1); }}
              >
                All Categories
              </li>
              {staticCategories.map((cat, idx) => (
                <li 
                  key={idx}
                  className={`hover:text-primary cursor-pointer capitalize ${selectedCategory === cat ? 'text-primary font-semibold' : ''}`}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1); // Filter badalne par page 1 par reset karein
                  }}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>

          {/* Brands */}
          <div className="border-t border-[#DEE2E7] py-3">
            <h4 className="font-bold text-[#1C1C1C] mb-3 flex justify-between items-center cursor-pointer">
              Brands <ChevronDown className="w-4 h-4 opacity-50" />
            </h4>
            <div className="space-y-2">
              {["Samsung", "Apple", "Huawei", "Pocco", "Lenovo"].map(brand => (
                <label key={brand} className="flex items-center gap-3 text-[#1C1C1C] text-sm cursor-pointer group">
                  <input type="checkbox" defaultChecked={["Samsung", "Apple", "Pocco"].includes(brand)} className="w-4 h-4 rounded border-[#DEE2E7] text-primary focus:ring-primary" />
                  <span className="group-hover:text-primary transition-colors">{brand}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          {/* Top Bar */}
          <div className="bg-white border border-[#DEE2E7] rounded-lg p-4 flex items-center justify-between mb-4">
            <span className="text-[#1C1C1C] text-sm">
              {data?.totalProducts || products.length} items in <span className="font-bold">Products Database</span>
            </span>
            <div className="flex items-center gap-4">
              <div className="flex border border-[#DEE2E7] rounded-md overflow-hidden">
                <div
                  className={`p-2 border-r border-[#DEE2E7] cursor-pointer transition-colors ${viewMode === 'grid' ? 'bg-[#EFF2F4]' : 'hover:bg-shade'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid size={18} className="text-[#1C1C1C]" />
                </div>
                <div
                  className={`p-2 cursor-pointer transition-colors ${viewMode === 'list' ? 'bg-[#EFF2F4]' : 'hover:bg-shade'}`}
                  onClick={() => setViewMode('list')}
                >
                  <List size={18} className="text-[#1C1C1C]" />
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters / Tags */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {activeFilters.map((filter, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 border border-primary rounded-md bg-white text-dark text-sm capitalize">
                  <span>{filter}</span>
                  <X 
                    size={14} 
                    className="text-[#8B96A5] cursor-pointer hover:text-dark" 
                    onClick={() => {
                      if (filter === selectedCategory) setSelectedCategory('');
                      if (filter === searchQuery) setSearchQuery('');
                      setCurrentPage(1);
                    }}
                  />
                </div>
              ))}
              <button 
                className="text-primary text-sm font-normal hover:underline ml-2"
                onClick={() => {
                  setSelectedCategory('');
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
              >
                Clear all filter
              </button>
            </div>
          )}

          {/* Products Render Block */}
          {!hasProducts ? (
            <div className="bg-white border border-[#DEE2E7] rounded-lg p-12 flex flex-col items-center justify-center text-center min-h-[355px]">
              <PackageOpen size={56} className="text-[#8B96A5] mb-3 stroke-[1.5]" />
              <h3 className="text-[#1C1C1C] text-lg font-bold mb-1">No Product Found</h3>
              <p className="text-[#8B96A5] text-sm max-w-xs">
                Aapki search ya filter ke mutabik koi product nahi mila. Please doosra term check karein!
              </p>
            </div>
          ) : viewMode === 'list' ? (
            /* List View */
            <div className="space-y-3">
              {products.map((product) => (
                <div 
                  key={product._id} 
                  className="bg-white border border-[#DEE2E7] rounded-lg p-5 flex gap-6 hover:shadow-md transition-shadow group cursor-pointer relative" 
                  onClick={() => {
                    setSelectedProduct(product);
                    setPage('details');
                  }}
                >
                  <div className="w-[210px] h-[210px] lg:w-[240px] lg:h-[240px] flex-shrink-0 flex items-center justify-center bg-[#F7F7F7] rounded-lg p-6 relative overflow-hidden group">
                    <img 
                      src={
                        product.image && product.image.startsWith('uploads')
                          ? `https://intership-ecomerce-backend.onrender.com/${product.image}` 
                          : new URL(`../assets/Image/${product.image}`, import.meta.url).href 
                      } 
                      alt={product.name} 
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300" 
                    />
                  </div>

                  <div className="flex-1 py-1">
                    <h3 className="text-[#1C1C1C] text-base font-semibold group-hover:text-primary transition-colors mb-3">{product.name}</h3>
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-xl font-bold text-[#1C1C1C]">${product.price}</span>
                    </div>
                    <p className="text-[#505050] text-sm leading-relaxed mb-4 line-clamp-2 max-w-2xl">{product.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white border border-[#DEE2E7] rounded-lg p-4 hover:shadow-[0px_8px_25px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 group flex flex-col items-center cursor-pointer"
                  onClick={() => {
                    setSelectedProduct(product);
                    setPage('details');
                  }}
                >
                  <div className="w-full aspect-square flex items-center justify-center mb-4 bg-[#F7F7F7] rounded-md p-6 overflow-hidden">
                    <img 
                      src={
                        product.image && product.image.startsWith('uploads')
                          ? `https://intership-ecomerce-backend.onrender.com/${product.image}` 
                          : new URL(`../assets/Image/${product.image}`, import.meta.url).href      
                      } 
                      alt={product.name} 
                      className="max-w-[85%] max-h-[85%] object-contain group-hover:scale-110 transition-transform duration-300" 
                    />
                  </div>
                  <div className="w-full">
                    <span className="text-lg font-bold text-[#1C1C1C]">${product.price}</span>
                    <h3 className="text-[#505050] text-[13px] mt-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {hasProducts && (
            <div className="flex justify-end mt-8">
              <div className="flex border border-[#DEE2E7] rounded-md overflow-hidden bg-white">
                <button 
                  className="px-4 py-2 border-r border-[#DEE2E7] hover:bg-shade disabled:opacity-30"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  {"<"}
                </button>
                <div className="px-4 py-2 border-r border-[#DEE2E7] bg-primary text-white font-bold">{currentPage}</div>
                <button 
                  className="px-4 py-2 hover:bg-shade disabled:opacity-30"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  {">"}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductListing;