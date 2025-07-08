import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import GenericList from "../components/GenericList";
import BulkSelectToolbar from "../components/BulkSelectToolbar";

interface Category {
  id: number;
  name: string;
  // add other fields as needed
}

const CategoryList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api
      .get("/categories/")
      .then((res) => {
        setCategories(res.data.results || res.data);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
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
      await api.post("/categories/bulk-delete/", {
        ids: selectedIds,
      });
      setCategories((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <GenericList
      title="Categories"
      items={categories}
      itemKey={(item) => item.id}
      onItemClick={(id) => navigate(`/categories/${id}`)}
      enableSelection
      renderToolbar={(selectedIds, clear, toggleAll) => (
        <BulkSelectToolbar
          items={categories}
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
                id={`category-checkbox-${item.id}`}
                name={`category-checkbox-${item.id}`}
                checked={isSelected}
                onChange={toggleSelect}
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <label
              htmlFor={`category-checkbox-${item.id}`}
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

export default CategoryList;
