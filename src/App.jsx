// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import POS from "./pages/POS";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Stocks from "./pages/Stocks";
import Categories from "./pages/Categories";
import SalesHistory from "./pages/SalesHistory";
import SaleDetail from "./pages/SaleDetail";
import ProductsList from "./pages/ProductsList";
import ProductForm from "./pages/ProductForm";
import ProductDetail from "./pages/ProductDetail";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import UserForm from "./pages/UserForm";
import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <Routes>
        {/* หน้า Login */}
        <Route path="/" element={<Login />} />

        {/* กลุ่มหน้า Dashboard */}
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="pos" element={<POS />} />
          <Route path="pos/checkout" element={<Checkout />} /> 
          <Route path="stocks" element={<Stocks />} />
          <Route path="categories" element={<Categories />} />
          <Route path="saleshistory" element={<SalesHistory />} />
          <Route path="saleshistory/:id" element={<SaleDetail />} />
          <Route path="products" element={<ProductsList />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="reports" element={<Reports />} />
          <Route path="users" element={<Users />} />
          <Route path="users/new" element={<UserForm mode="create" />} />
          <Route path="users/:id/edit" element={<UserForm mode="edit" />} />
          <Route path="settings" element={<Settings />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
