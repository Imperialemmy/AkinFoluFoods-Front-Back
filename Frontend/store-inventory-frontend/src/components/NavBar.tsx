// src/components/NavBar.tsx
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
  
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex space-x-6">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/brands" className="hover:text-gray-300">Brands</Link>
          <Link to="/categories" className="hover:text-gray-300">Categories</Link>
          <Link to="/update-stock" className="hover:text-gray-300">Update stock</Link>
          <Link to="/wares" className="hover:text-gray-300">Products</Link>
          <Link to="/wares" className="hover:text-gray-300">Batches</Link>
        </div>
        {/*<form onSubmit={handleSearch} className="flex">*/}
        {/*  <input*/}
        {/*    type="text"*/}
        {/*    value={search}*/}
        {/*    onChange={(e) => setSearch(e.target.value)}*/}
        {/*    placeholder="Search..."*/}
        {/*    className="p-2 rounded-l text-black"*/}
        {/*  />*/}
        {/*  <button type="submit" className="bg-blue-500 p-2 rounded-r hover:bg-blue-600">*/}
        {/*    Search*/}
        {/*  </button>*/}
        {/*</form>*/}
      </div>
    </nav>
  );
};

export default NavBar;