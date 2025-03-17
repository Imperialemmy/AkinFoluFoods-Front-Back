// src/pages/CategoryList.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Category { id: number; name: string }

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get<Category[]>('http://localhost:8000/api/categories/', { auth: { username: 'admin', password: 'seun@112' } })
      .then((response) => {
        setCategories(response.data);
        setLoading(false);
      })
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl text-gray-700 mb-4">Categories</h2>
      <ul className="space-y-4">
        {categories.map((category) => (
          <li key={category.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <Link to={`/categories/${category.id}`} className="text-blue-500 hover:underline">
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;