// src/pages/BrandWares.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

interface Ware { id: number; name: string }

const BrandWares: React.FC = () => {
  const { brandId } = useParams<{ brandId: string }>();
  const [wares, setWares] = useState<Ware[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get<Ware[]>(`http://localhost:8000/api/wares/?brand=${brandId}`, { auth: { username: 'admin', password: 'seun@112' } })
      .then((response) => {
        setWares(response.data);
        setLoading(false);
      })
      .catch((error) => console.error('Error fetching wares:', error));
  }, [brandId]);

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl text-gray-700 mb-4">Wares for Brand</h2>
      {wares.length > 0 ? (
        <ul className="space-y-4">
          {wares.map((ware) => (
            <li key={ware.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <Link to={`/wares/${ware.id}`} className="text-blue-500 hover:underline">
                {ware.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-600">No wares found for this brand.</p>
      )}
    </div>
  );
};

export default BrandWares;