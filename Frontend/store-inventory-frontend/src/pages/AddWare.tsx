import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const username = import.meta.env.VITE_API_USERNAME;
const password = import.meta.env.VITE_API_PASSWORD;

interface Brand { id: number; name: string }
interface Category { id: number; name: string }
interface Size { id: number; size: string; size_unit: string }

const AddWare: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', brand: '', category: '', sizes: [] as number[], description: '' });
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get<Brand[]>('/brands/', { auth: { username, password } }),
      api.get<Category[]>('/categories/', { auth: { username, password } }),
      api.get<Size[]>('/sizes/', { auth: { username, password } }),
    ])
      .then(([brandsRes, catsRes, sizesRes]) => {
        setBrands(brandsRes.data);
        setCategories(catsRes.data);
        setSizes(sizesRes.data);
      })
      .catch((error) => console.error('Error fetching dropdowns:', error));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'sizes' ? Array.from((e.target as HTMLSelectElement).selectedOptions, option => Number(option.value)) : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      brand: formData.brand ? Number(formData.brand) : null,
      category: formData.category ? Number(formData.category) : null,
      size: formData.sizes,
      description: formData.description,
    };

    api
      .post('/wares/', payload, {
        auth: { username, password },
      })
      .then(() => navigate('/'))
      .catch((error) => {
        console.error('Error adding ware:', error.response?.data || error.message);
      });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl text-gray-700 mb-4">Add Ware</h2>
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 max-w-lg mx-auto shadow-sm">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" placeholder={"Product name"} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Brand:</label>
          <select name="brand" value={formData.brand} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded">
            <option value="">Select Brand</option>
            {brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Category:</label>
          <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded">
            <option value="">Select Category</option>
            {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Sizes:</label>
          <select name="sizes" multiple value={formData.sizes.map(String)} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded h-32">
            {sizes.map((size) => <option key={size.id} value={size.id}>{size.size} {size.size_unit}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" placeholder={"About Product"} />
        </div>
        <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Add Ware</button>
      </form>
    </div>
  );
};

export default AddWare;