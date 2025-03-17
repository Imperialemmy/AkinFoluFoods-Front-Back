// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddWare from './pages/AddWare';
import BrandList from './pages/BrandList';
import NavBar from './components/NavBar';
import CategoryList from "./pages/CategoryList.tsx";
import BrandsWithWares from "./pages/BrandsWithWares.tsx";
import WareDetail from "./pages/WareDetails.tsx";
import CategoryWares from './pages/CategoryWares';
import Wares from "./pages/Wares.tsx";
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  return (
      <Router>
        <div className="bg-gray-100 min-h-screen">
          <NavBar/>
          <h1 className="text-4xl text-gray-800 text-center mb-6 " >AkinFolu Foods </h1>
          <Routes>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/add-ware" element={<AddWare/>}/>
            <Route path="/brands" element={<BrandList/>}/>
            <Route path="/brands/:brandId" element={<BrandsWithWares/>}/>
            <Route path="/wares/:wareId" element={<WareDetail/>}/>
            <Route path="/categories" element={<CategoryList/>}/>
            <Route path="/categories/:categoryId" element={<CategoryWares/>}/>
            <Route path="/wares" element={<Wares/>}/>
          </Routes>
          </div>
      </Router>
);
};

export default App;