// src/pages/AddSize.tsx
import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const username = import.meta.env.VITE_API_USERNAME;
const password = import.meta.env.VITE_API_PASSWORD;

const AddSize: React.FC = () => {
  const [formData, setFormData] = useState({ size: '', size_unit: '' });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    api
      .post(
        '/sizes/',
        { size: formData.size, size_unit: formData.size_unit },
        { auth: { username, password } }
      )
      .then(() => navigate('/sizes'))
      .catch((error) => console.error('Error adding size:', error.response?.data || error.message));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl text-gray-700 mb-4">Add Size</h2>
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 max-w-lg mx-auto shadow-sm">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Size:</label>
          <input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="e.g. 500, 1.1, 2.2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Unit:</label>
          <input
            type="text"
            name="size_unit"
            value={formData.size_unit}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="e.g. g, kg, l, ml"
          />
        </div>
        <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
          Add Size
        </button>
      </form>
    </div>
  );
};

export default AddSize;