import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface VariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  wareId: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variantToEdit?: any | null;
  wareSizes: { id: number; size: string; size_unit: string }[];
}

const VariantModal: React.FC<VariantModalProps> = ({ isOpen, onClose, wareId, variantToEdit, wareSizes }) => {
  const [price, setPrice] = useState('');
  const [sizeId, setSizeId] = useState<number | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {

    if (variantToEdit) {
      setPrice(variantToEdit.price);
      setIsAvailable(variantToEdit.is_available);
      // Assume variantToEdit.size_detail has id
      setSizeId(variantToEdit.size_detail?.id ?? null);
    } else {
      setPrice('');
      setIsAvailable(true);
      setSizeId(null);
    }
  }, [variantToEdit, wareId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sizeId) {
      alert('Please select a size');
      return;
    }

    const payload = {
      ware: wareId,
      price,
      is_available: isAvailable,
      size: sizeId,
    };

    try {
      if (variantToEdit) {
        await api.patch(`/variants/${variantToEdit.id}/`, payload);
      } else {
        await api.post('/variants/', payload);
      }
      onClose();
    } catch (error) {
      console.error('Failed to submit variant:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {variantToEdit ? 'Edit Variant' : 'Add Variant'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
  value={sizeId ?? ''}
  onChange={(e) => setSizeId(Number(e.target.value))}
  className="w-full px-3 py-2 border rounded"
  required
>
  <option value="" disabled>Select size</option>
  {wareSizes.map((size) => (
    <option key={size.id} value={size.id}>
      {size.size} {size.size_unit}
    </option>
  ))}
</select>

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
            min={0}
            step="0.01"
          />

          <label className="block">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={() => setIsAvailable(!isAvailable)}
              className="mr-2"
            />
            Available
          </label>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              {variantToEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VariantModal;
