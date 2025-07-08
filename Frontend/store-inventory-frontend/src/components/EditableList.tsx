// src/components/EditableList.tsx
import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Item {
  id: number;
  name: string;
}

interface EditableListProps {
  endpoint: string;
  title: string;
  getItemLink: (id: number) => string; // Function to get item URL
}

const EditableList: React.FC<EditableListProps> = ({ endpoint, title, getItemLink }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [editing, setEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData(`${endpoint}?page=${currentPage}`);
  }, [currentPage]);

  const fetchData = (url: string) => {
    axios.get(url).then((response) => {
      setItems(response.data.results);
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
    });
  };

  const toggleSelectItem = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleDelete = () => {
    selectedItems.forEach((id) => {
      axios.delete(`${endpoint}${id}/`).catch((err) => console.error(err));
    });
    setItems(items.filter((item) => !selectedItems.includes(item.id)));
    setSelectedItems([]);
    setEditing(false);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button
          className="bg-blue-500 text-white py-1 px-3 rounded"
          onClick={() => setEditing(!editing)}
        >
          {editing ? "Done" : <FaEdit />}
        </button>
      </div>

      <ul>
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between p-2 border-b cursor-pointer hover:bg-gray-100"
            onClick={() => !editing && navigate(getItemLink(item.id))}
          >
            <div className="flex items-center space-x-2 w-full">
              {editing && (
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleSelectItem(item.id)}
                />
              )}
              <span className="flex-grow">{item.name}</span>
            </div>
            {editing && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSelectItem(item.id);
                }}
                className="text-red-500 hover:text-red-600"
              >
                <FaTrash />
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={!prevPage}
          className={`py-2 px-4 rounded ${prevPage ? "bg-gray-300 hover:bg-gray-400" : "bg-gray-100 cursor-not-allowed"}`}
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={!nextPage}
          className={`py-2 px-4 rounded ${nextPage ? "bg-gray-300 hover:bg-gray-400" : "bg-gray-100 cursor-not-allowed"}`}
        >
          Next
        </button>
      </div>

      {editing && (
        <button
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
          onClick={handleDelete}
          disabled={selectedItems.length === 0}
        >
          Delete Selected
        </button>
      )}
    </div>
  );
};

export default EditableList;
