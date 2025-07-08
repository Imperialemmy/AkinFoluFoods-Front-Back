import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import GenericList from "../components/GenericList";
import BulkSelectToolbar from "../components/BulkSelectToolbar";

interface Brand {
  id: number;
  name: string;
  // add other fields as needed
}

const BrandList = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    api
      .get("/brands/")
      .then((res) => {
        setBrands(res.data.results || res.data);
      })
      .catch((err) => {
        console.error("Error fetching brands:", err);
      });
  }, []);

  const handleDeleteSelected = async (selectedIds: number[]) => {
    if (selectedIds.length === 0) {
      console.warn("No items selected for deletion");
      return;
    }
    if (!window.confirm("Are you sure you want to delete the selected items?")) {
      return;
    }
    try {
      await api.post("/brands/bulk-delete/", {
        ids: selectedIds,
      });
      setBrands((prev) => prev.filter((b) => !selectedIds.includes(b.id)));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <GenericList
      title="Brands"
      items={brands}
      itemKey={(item) => item.id}
      onItemClick={(id) => navigate(`/brands/${id}`)}
      enableSelection
      renderToolbar={(selectedIds, clear, toggleAll) => (
        <BulkSelectToolbar
          items={brands}
          selectedIds={selectedIds as number[]}
          onToggleAll={toggleAll}
          onClearSelection={clear}
          onDeleteSelected={() => handleDeleteSelected(selectedIds as number[])}
        />
      )}
      renderItem={(item, isSelected, toggleSelect, selectionMode) => (
        <div
          className="flex justify-between items-center p-4 border rounded-md shadow-sm bg-white hover:bg-gray-100 transition cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            {selectionMode && (
              <input
                type="checkbox"
                id={`brand-checkbox-${item.id}`}
                name={`brand-checkbox-${item.id}`}
                checked={isSelected}
                onChange={toggleSelect}
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <label
              htmlFor={`brand-checkbox-${item.id}`}
              className="text-gray-700 cursor-pointer"
            >
              {item.name}
            </label>
          </div>
        </div>
      )}
    />
  );
};

export default BrandList;
