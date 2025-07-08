import React, { useState } from "react";

const EllipsisDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-200"
      >
        ...
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded p-2 z-50"
        >
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
            Edit
          </button>
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default EllipsisDropdown;
