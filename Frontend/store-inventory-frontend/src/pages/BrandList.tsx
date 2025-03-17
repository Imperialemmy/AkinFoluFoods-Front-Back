// src/pages/BrandList.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Brand { id: number; name: string }

const BrandList: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get<Brand[]>('http://localhost:8000/api/brands/', { auth: { username: 'admin', password: 'seun@112' } })
      .then((response) => {
        setBrands(response.data);
        setLoading(false);
      })
      .catch((error) => console.error('Error fetching brands:', error));
  }, []);

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl text-gray-700 mb-4">Brands</h2>
      <ul className="space-y-4">
        {brands.map((brand) => (
          <li key={brand.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <Link to={`/brands/${brand.id}`} className="text-blue-500 hover:underline">
              {brand.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BrandList;