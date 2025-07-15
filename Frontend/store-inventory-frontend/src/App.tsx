// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddWare from './pages/AddWare';
import BrandList from './pages/BrandList';
import NavBar from './components/NavBar';
import CategoryList from "./pages/CategoryList.tsx";
import BrandsWithWares from "./pages/BrandsWithWares.tsx";
import WareDetail from "./pages/WareDetails.tsx";
import CategoryWares from "./pages/CategoriesWithWare.tsx";
import Wares from "./pages/Wares.tsx";
import Dashboard from './pages/Home.tsx';
import AddBrand from "./pages/AddBrand.tsx";
import AddCategory from './pages/AddCategory';
import AddSize from "./pages/AddSize.tsx";
import SizeList from "./pages/SizeList.tsx";
import UpdateStock from "./pages/UpdateStock.tsx";
import ErrorBoundary from "./pages/ErrorBoundary.tsx";
import WareVariantForm from "./pages/WareVariant.tsx";



const App: React.FC = () => {
  return (
      <Router>
        <div className="bg-gray-100 min-h-screen">
          <NavBar/>
          <div className="mt-6 px-4">
          <h1 className="text-4xl text-gray-900 text-center mb-6 font-semibold" >AkinFolu Foods </h1>
          <Routes>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/add-ware" element={<ErrorBoundary><AddWare /></ErrorBoundary>}/>
            <Route path="/brands" element={<BrandList/>}/>
            <Route path="/brands/add" element={<AddBrand />} />
            <Route path="/brands/:brandId" element={<BrandsWithWares/>}/>
            <Route path="/wares/:wareId" element={<WareDetail/>}/>
            <Route path="/categories" element={<CategoryList/>}/>
            <Route path="/categories/add" element={<AddCategory />} />
            <Route path="/categories/:categoryId" element={<CategoryWares/>}/>
            <Route path="/sizes/add" element={<AddSize />} />
            <Route path="/sizes" element={<SizeList/>}/>
            <Route path="/wares" element={<Wares/>}/>
            <Route path="/update-stock" element={<UpdateStock />} />
            <Route path="/wares/:wareId/variants/new" element={<WareVariantForm />} />
            <Route path="/wares/:wareId/variants/:variantId/edit" element={<WareVariantForm />} />
          </Routes>
          </div>
        </div>
      </Router>
);
};

export default App;