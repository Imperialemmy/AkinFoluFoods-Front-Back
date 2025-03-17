// src/pages/WareDetail.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Variant { id: number; size_detail: { size: string; size_unit: string }; price: string; stock: number; is_available: boolean }
interface Ware { id: number; name: string; brand_detail: { name: string }; category_detail: { name: string }; description: string; variants: Variant[] }

const WareDetail: React.FC = () => {
  const { wareId } = useParams<{ wareId: string }>();
  const [ware, setWare] = useState<Ware | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get<Ware>(`http://localhost:8000/api/wares/${wareId}/`, { auth: { username: 'admin', password: 'seun@112' } })
      .then((response) => {
        setWare(response.data);
        setLoading(false);
      })
      .catch((error) => console.error('Error fetching ware:', error));
  }, [wareId]);

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (!ware) return <p className="text-center text-red-600">Ware not found</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl text-gray-700 mb-4">{ware.name}</h2>
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <p><strong>Brand:</strong> {ware.brand_detail.name}</p>
        <p><strong>Category:</strong> {ware.category_detail.name}</p>
        <p><strong>Description:</strong> {ware.description}</p>
        <h3 className="text-lg text-gray-700 mt-4">Variants</h3>
        <ul className="space-y-2">
          {ware.variants.map((variant) => (
            <li key={variant.id} className="text-gray-600">
              {variant.size_detail.size} {variant.size_detail.size_unit} - ${variant.price} - Stock: {variant.stock}
              <span className={variant.is_available ? 'text-green-500' : 'text-red-500'}>
                {variant.is_available ? ' (In Stock)' : ' (Out)'}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WareDetail;