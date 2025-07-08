// src/pages/Dashboard.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl text-gray-700 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> {/* Increased spacing */}
          {/* Wares Dropdown */}
          <div className="relative">
            <button
                onClick={() => toggleDropdown('wares')}
                className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300"
            >
              Products
            </button>
            {openDropdown === 'wares' && (
                <ul className="absolute z-10 bg-white border border-gray-200 rounded shadow-lg w-48 mt-2">
                  <li><Link to="/add-ware" className="block px-4 py-2 hover:bg-gray-100">Create Product</Link></li>
                  <li><Link to="/wares" className="block px-4 py-2 hover:bg-gray-100">View All Products</Link></li>
                </ul>
            )}
          </div>

          {/* Brands Dropdown */}
          <div className="relative">
            <button
                onClick={() => toggleDropdown('brands')}
                className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300"
            >
              Brands
            </button>
            {openDropdown === 'brands' && (
                <ul className="absolute z-10 bg-white border border-gray-200 rounded shadow-lg w-48 mt-2">
                  <li><Link to="/brands/add" className="block px-4 py-2 hover:bg-gray-100">Create Brand</Link></li>
                  <li><Link to="/brands" className="block px-4 py-2 hover:bg-gray-100">View All Brands</Link></li>
                </ul>
            )}
          </div>

          {/* Categories Dropdown */}
          <div className="relative">
            <button
                onClick={() => toggleDropdown('categories')}
                className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300"
            >
              Categories
            </button>
            {openDropdown === 'categories' && (
                <ul className="absolute z-10 bg-white border border-gray-200 rounded shadow-lg w-48 mt-2">
                  <li><Link to="/categories/add" className="block px-4 py-2 hover:bg-gray-100">Create Category</Link>
                  </li>
                  <li><Link to="/categories" className="block px-4 py-2 hover:bg-gray-100">View All Categories</Link>
                  </li>
                </ul>
            )}
          </div>

          {/* Sizes Dropdown */}
          <div className="relative">
            <button
                onClick={() => toggleDropdown('sizes')}
                className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300"
            >
              Sizes
            </button>
            {openDropdown === 'sizes' && (
                <ul className="absolute z-10 bg-white border border-gray-200 rounded shadow-lg w-48 mt-2">
                  <li><Link to="/sizes/add" className="block px-4 py-2 hover:bg-gray-100">Create Size</Link></li>
                  <li><Link to="/sizes" className="block px-4 py-2 hover:bg-gray-100">View All Sizes</Link></li>
                </ul>
            )}
          </div>
        </div>
      </div>
      );
      };

      export default Dashboard;