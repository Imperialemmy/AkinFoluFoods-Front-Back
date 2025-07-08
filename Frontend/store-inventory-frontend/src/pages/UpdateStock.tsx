// src/pages/UpdateStock.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Variant { id: number; ware_name: string; size_detail: { size: string; size_unit: string }; stock: number; last_updated: string | null }
interface Batch { id: number; variant: number; lot_number: string; expiry_date: string; stock: number; quantity: number }

const UpdateStock: React.FC = () => {
  const [variants, setVariants] = useState<Variant[]>([]); // Already an array, good
  const [batches, setBatches] = useState<{ [key: number]: Batch[] }>({});
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [stockChange, setStockChange] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const url = search
      ? `http://localhost:8000/api/variants/?search=${search}&page=${page}`
      : `http://localhost:8000/api/variants/?ordering=-last_updated&page=${page}`;
    axios
      .get(url, { auth: { username: 'admin', password: 'seun@112' } })
      .then((response) => {
        // Handle paginated vs non-paginated response
        const data = response.data.results || response.data;
        setVariants(Array.isArray(data) ? data : []);
        setTotalPages(response.data.count ? Math.ceil(response.data.count / 10) : 1);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching variants:', error);
        setVariants([]); // Fallback to empty array
        setLoading(false);
      });
  }, [page, search]);

  const fetchBatches = (variantId: number) => {
    if (!batches[variantId]) {
      axios
        .get<Batch[]>(`http://localhost:8000/api/batches/?variant=${variantId}`, { auth: { username: 'admin', password: 'seun@112' } })
        .then((response) => setBatches((prev) => ({ ...prev, [variantId]: response.data })))
        .catch((error) => console.error('Error fetching batches:', error));
    }
    setSelectedVariant(selectedVariant === variantId ? null : variantId);
  };

  const handleStockChange = (batchId: number, value: number) => {
    setStockChange((prev) => ({ ...prev, [batchId]: value }));
  };

  const saveStock = (batchId: number) => {
    const change = stockChange[batchId] || 0;
    const batch = batches[selectedVariant!].find((b) => b.id === batchId);
    if (batch) {
      axios
        .patch(
          `http://localhost:8000/api/batches/${batchId}/`,
          { quantity: batch.quantity + change },
          { auth: { username: 'admin', password: 'seun@112' } }
        )
        .then((response) => {
          setBatches((prev) => ({
            ...prev,
            [selectedVariant!]: prev[selectedVariant!].map((b) =>
              b.id === batchId ? { ...b, quantity: b.quantity + change } : b
            ),
          }));
          setVariants((prev) =>
            prev.map((v) =>
              v.id === selectedVariant ? { ...v, stock: v.stock + change, last_updated: new Date().toISOString() } : v
            )
          );
          setStockChange((prev) => ({ ...prev, [batchId]: 0 }));
        })
        .catch((error) => console.error('Error updating stock:', error));
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl text-gray-700 mb-4">Update Stock</h2>
      <input
        type="text"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        placeholder="Search wares..."
        className="w-full max-w-md p-2 mb-4 border border-gray-300 rounded"
      />
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2 text-left">Ware</th>
            <th className="border border-gray-300 p-2 text-left">Size</th>
            <th className="border border-gray-300 p-2 text-left">Stock</th>
            <th className="border border-gray-300 p-2 text-left">Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {variants.length > 0 ? (
            variants.map((variant) => (
              <React.Fragment key={variant.id}>
                <tr
                  onClick={() => fetchBatches(variant.id)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <td className="border border-gray-300 p-2">{variant.ware_name}</td>
                  <td className="border border-gray-300 p-2">{variant.size_detail.size} {variant.size_detail.size_unit}</td>
                  <td className="border border-gray-300 p-2">{variant.stock}</td>
                  <td className="border border-gray-300 p-2">
                    {variant.last_updated ? new Date(variant.last_updated).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
                {selectedVariant === variant.id && batches[variant.id] && (
                  <tr>
                    <td colSpan={4} className="border border-gray-300 p-2">
                      <ul className="space-y-2">
                        {batches[variant.id].map((batch) => (
                            <li key={batch.id} className="flex items-center space-x-4">
                              <span>Lot: {batch.lot_number}</span>
                              <span>Expiry: {batch.expiry_date}</span>
                              <span>Stock: {batch.stock}</span>
                              <input
                                  type="number"
                                  value={stockChange[batch.id] || 0}
                                  onChange={(e) => handleStockChange(batch.id, Number(e.target.value))}
                                  className="w-20 p-1 border border-gray-300 rounded"
                              />
                              <button
                                  onClick={() => saveStock(batch.id)}
                                  className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
                              >
                                Save
                              </button>
                              <span>Quantity left: {batch.quantity}</span>
                            </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="border border-gray-300 p-2 text-center text-gray-600">
                No variants found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="bg-gray-300 py-2 px-4 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="bg-gray-300 py-2 px-4 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UpdateStock;