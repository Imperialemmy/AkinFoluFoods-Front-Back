// src/pages/WareDetail.tsx
import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useParams } from 'react-router-dom';
import VariantModal from '../components/VariantModal';
import BatchModal from '../components/BatchModal';

interface Batch {
  id: number;
  quantity: number;
  lot_number: string;
  manufacturing_date: string;
  expiry_date: string;
  is_expired: boolean;
}

interface Variant {
  id: number;
  price: string;
  is_available: boolean;
  size_detail: {
    size: string;
    size_unit: string;
  };
  batches?: Batch[];
}

interface Ware {
  id: number;
  name: string;
  brand_detail: { name: string };
  category_detail: { name: string };
  description: string;
  size_detail: { id: number; size: string; size_unit: string }[];
  variants: Variant[];
}

const WareDetail: React.FC = () => {
  const { wareId } = useParams<{ wareId: string }>();
  const [ware, setWare] = useState<Ware | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);

  // Edit mode states
  const [variantToEdit, setVariantToEdit] = useState<Variant | null>(null);
  const [batchToEdit, setBatchToEdit] = useState<Batch | null>(null);

  const fetchWare = useCallback(async () => {
  try {
    setLoading(true);
    const res = await api.get<Ware>(`/wares/${wareId}/`);
    setWare(res.data);
  } catch (error) {
    console.error('Failed to fetch ware:', error);
  } finally {
    setLoading(false);
  }
}, [wareId]);

useEffect(() => {
  fetchWare();
}, [fetchWare]);

  const formatPrice = (price: string) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(Number(price));

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat('en-NG', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(date));

  const handleDeleteVariant = async (variantId: number) => {
    if (!confirm('Are you sure you want to delete this variant?')) return;
    try {
      await api.delete(`/variants/${variantId}/`);
      await fetchWare();
    } catch (error) {
      console.error('Failed to delete variant:', error);
    }
  };

  const handleDeleteBatch = async (batchId: number) => {
    if (!confirm('Are you sure you want to delete this batch?')) return;
    try {
      await api.delete(`/batches/${batchId}/`);
      await fetchWare();
    } catch (error) {
      console.error('Failed to delete batch:', error);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (!ware) return <p className="text-center text-red-600">Ware not found.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">{ware.name}</h2>

      <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
        {/* Ware Info */}
        <p><strong>Brand:</strong> {ware.brand_detail.name}</p>
        <p><strong>Category:</strong> {ware.category_detail.name}</p>
        <p className="mb-4"><strong>Description:</strong> {ware.description}</p>

        <p className="mb-6">
          <strong>Sizes:</strong>{' '}
          {ware.size_detail.length > 0 ? (
            ware.size_detail.map((s, index) => (
              <span
                key={index}
                className="inline-block mr-2 mb-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {s.size}{s.size_unit}
              </span>
            ))
          ) : (
            <span className="text-sm italic text-gray-500">Not updated yet.</span>
          )}
        </p>

        {/* Add Variant Button */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => {
              setVariantToEdit(null);
              setShowVariantModal(true);
            }}
            className="px-5 py-2 rounded text-white font-semibold bg-blue-500 hover:bg-blue-600 transition"
          >
            Add Variant
          </button>
        </div>

        {/* Variants */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Variants</h3>

          {ware.variants.length === 0 ? (
            <p className="text-gray-500 italic">Not updated yet.</p>
          ) : (
            ware.variants.map((variant) => (
              <div
                key={variant.id}
                className="border rounded p-4 mb-4 bg-gray-50"
              >
                {/* Flex container for variant info and buttons */}
                <div className="flex items-center justify-between mb-4">
                  {/* Left side: variant details */}
                  <div className="space-x-6 whitespace-nowrap">
                    <span><strong>Size:</strong> {variant.size_detail.size}{variant.size_detail.size_unit}</span>
                    <span><strong>Price:</strong> {formatPrice(variant.price)}</span>
                    <span><strong>Available:</strong> {variant.is_available ? 'Yes' : 'No'}</span>
                  </div>

                  {/* Right side: buttons */}
                  <div className="flex gap-3 flex-shrink-0">
                    <button
                      onClick={() => {
                        setVariantToEdit(variant);
                        setShowVariantModal(true);
                      }}
                      className="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Edit Variant
                    </button>

                    <button
                      onClick={() => handleDeleteVariant(variant.id)}
                      className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                    >
                      Delete Variant
                    </button>

                    <button
                      onClick={() => {
                        setSelectedVariantId(variant.id);
                        setBatchToEdit(null);
                        setShowBatchModal(true);
                      }}
                      className="px-3 py-1 text-sm rounded bg-green-500 text-white hover:bg-green-600"
                    >
                      Add Batch
                    </button>
                  </div>
                </div>

                {/* Batches */}
                <div className="ml-4">
                  <h4 className="text-md font-semibold text-gray-700 mb-2">Batches:</h4>
                  {variant.batches && variant.batches.length > 0 ? (
                    <ul className="list-disc ml-5 space-y-2 text-gray-700">
                      {variant.batches.map((batch) => (
                        <li key={batch.id}>
                          <p><strong>Batch Number:</strong> {batch.lot_number}</p>
                          <p><strong>Quantity:</strong> {batch.quantity}</p>
                          <p><strong>Manufacture Date:</strong> {formatDate(batch.manufacturing_date)}</p>
                          <p><strong>Expiry Date:</strong> {formatDate(batch.expiry_date)}</p>
                          <p><strong>Expired:</strong> {batch.is_expired ? 'Yes' : 'No'}</p>

                          {/* Edit & Delete buttons for Batch */}
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => {
                                setBatchToEdit(batch);
                                setSelectedVariantId(variant.id);
                                setShowBatchModal(true);
                              }}
                              className="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
                            >
                              Edit Batch
                            </button>

                            <button
                              onClick={() => handleDeleteBatch(batch.id)}
                              className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                            >
                              Delete Batch
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm italic text-gray-500">No batches added yet.</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      <VariantModal
        isOpen={showVariantModal}
        onClose={() => {
          setShowVariantModal(false);
          setVariantToEdit(null);
          fetchWare();
        }}
        wareId={ware.id}
        variantToEdit={variantToEdit}
        wareSizes={ware.size_detail}
      />

      <BatchModal
        isOpen={showBatchModal}
        onClose={() => {
          setShowBatchModal(false);
          setBatchToEdit(null);
          setSelectedVariantId(null);
          fetchWare();
        }}
        wareId={ware.id}
        variantId={selectedVariantId}
        batchToEdit={batchToEdit}
      />
    </div>
  );
};

export default WareDetail;
