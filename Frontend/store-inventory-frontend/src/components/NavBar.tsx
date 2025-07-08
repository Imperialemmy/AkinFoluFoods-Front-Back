// src/components/NavBar.tsx
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
  
  return (
    <nav className="bg-white p-3 text-black border-b border-gray-200">
  <div className="max-w-6xl mx-auto flex justify-center">
    <div className="flex space-x-20">
      <Link to="/" className="text-sm text-gray-800 hover:text-black transition-colors duration-200">Home</Link>
      <Link to="/brands" className="text-sm text-gray-800 hover:text-black transition-colors duration-200">Brands</Link>
      <Link to="/categories" className="text-sm text-gray-800 hover:text-black transition-colors duration-200">Categories</Link>
      <Link to="/wares" className="text-sm text-gray-800 hover:text-black transition-colors duration-200">Products</Link>
    </div>
  </div>
</nav>

  );
};

export default NavBar;