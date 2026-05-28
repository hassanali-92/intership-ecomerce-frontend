import React, { useState } from 'react';
import axios from 'axios';
import { X, UploadCloud } from 'lucide-react'; 
import { useQueryClient } from '@tanstack/react-query'; // 🌟 TanStack Query se client ko import kiya

const AddProductModal = ({ isOpen, onClose }) => { // 🌟 Prop se 'refetch' hata diya kyunki ab iski zaroorat nahi
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); 
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient(); // 🌟 QueryClient ka instance banaya global cache refresh ke liye

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 🌟 LocalStorage se token nikalain jo login ke waqt save hua tha
    const token = localStorage.getItem('shop_token'); 

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('image', image); 

    try {
      // 🌟 Headers ke andar Authorization Bearer Token pass kiya
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/products/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // 🔥 Yeh line backend authorization check ko pass karegi
        },
      });

      if (response.data.success || response.status === 201 || response.status === 200) {
        alert('Product Added Successfully! 🎉');
        
        setName('');
        setPrice('');
        setCategory('');
        setImage(null);
        setImagePreview(null);
        
        // 🔥 MAGIC LINE: Yeh poore project mein jahan bhi 'products' ka data hai usay bina page reload kiye automatic refresh kar dega
        queryClient.invalidateQueries({ queryKey: ['products'] });
        
        onClose();
      }
    } catch (error) {
      console.error('Error adding product:', error);
      // Backend se aane wala error alert mein dikhega
      alert(error.response?.data?.message || 'Product add karne mein koi error aaya hai.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden relative border border-shade-border">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-shade-border bg-gray-50">
          <h2 className="text-lg font-bold text-dark">Add New Product</h2>
          <button onClick={onClose} className="text-secondary hover:text-dark p-1 rounded-lg hover:bg-gray-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark mb-1">Product Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. T-Shirt" 
              required 
              className="w-full px-3 py-2 border border-shade-border rounded-lg outline-none focus:border-primary text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Price ($)</label>
              <input 
                type="number" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                placeholder="0.00" 
                min="1" 
                required 
                className="w-full px-3 py-2 border border-shade-border rounded-lg outline-none focus:border-primary text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Category</label>
              <input 
                type="text" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                placeholder="e.g. Gadgets" 
                required 
                className="w-full px-3 py-2 border border-shade-border rounded-lg outline-none focus:border-primary text-sm"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-dark mb-1">Product Image</label>
            <div className="border-2 border-dashed border-shade-border rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100/50 relative cursor-pointer group">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                required 
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {imagePreview ? (
                <div className="w-full flex flex-col items-center gap-2">
                  <img src={imagePreview} alt="Preview" className="h-24 object-contain rounded-md" />
                  <span className="text-xs text-secondary truncate max-w-xs">{image?.name}</span>
                </div>
              ) : (
                <div className="text-center">
                  <UploadCloud className="w-8 h-8 text-secondary group-hover:text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-dark">Click to upload image</p>
                  <p className="text-xs text-secondary mt-1">PNG, JPG up to 5MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-shade-border">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-shade-border rounded-lg text-sm font-medium text-dark hover:bg-gray-50">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-5 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium disabled:bg-primary/50"
            >
              {loading ? 'Uploading...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;