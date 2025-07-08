// src/components/SearchComponent.tsx
import React, { useState } from 'react';

interface SearchComponentProps {
  onSearch: (query: string) => void; // Callback to update parent state
  placeholder?: string; // Optional custom placeholder
}

const Search: React.FC<SearchComponentProps> = ({ onSearch, placeholder = 'Search...' }) => {
  const [query, setQuery] = useState<string>('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // Trigger search in parent
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder={placeholder}
        className="w-full max-w-md p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default Search;