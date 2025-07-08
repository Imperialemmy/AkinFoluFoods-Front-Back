import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import GenericList from "../components/GenericList";
import BulkSelectToolbar from "../components/BulkSelectToolbar";

interface Ware {
  id: number;
  name: string;
  // add other fields as needed
}

const WaresList = () => {
  const navigate = useNavigate();
  const [wares, setWares] = useState<Ware[]>([]);

  useEffect(() => {
    api
      .get("/wares/")
      .then((res) => {
        setWares(res.data.results || res.data);
      })
      .catch((err) => {
        console.error("Error fetching wares:", err);
      });
  }, []);

  // Remove local selected state here

  // Modify handleDeleteSelected to accept selectedIds from toolbar
  const handleDeleteSelected = async (selectedIds: number[]) => {
    if (selectedIds.length === 0) {
      console.warn("No items selected for deletion");
      return;
    }
    if (!window.confirm("Are you sure you want to delete the selected items?")) {
      return;
    }
    try {
      await api.post("/wares/bulk-delete/", {
        ids: selectedIds,
      });

      setWares((prev) => prev.filter((w) => !selectedIds.includes(w.id)));
      // No need to clear selection here; GenericList handles it internally
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <GenericList
      title="Wares"
      items={wares}
      itemKey={(item) => item.id}
      onItemClick={(id) => navigate(`/wares/${id}`)}
      enableSelection
      renderToolbar={(selectedIds, clear, toggleAll) => (
        <BulkSelectToolbar
          items={wares}
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
                id={`ware-checkbox-${item.id}`}
                name={`ware-checkbox-${item.id}`}
                checked={isSelected}
                onChange={toggleSelect}
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <label
              htmlFor={`ware-checkbox-${item.id}`}
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

export default WaresList;
