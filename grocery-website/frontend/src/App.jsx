import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import Navbar from "./components/Navbar.jsx";

/* User pages */
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Cart from "./pages/Cart.jsx"
import Orders from "./pages/Orders.jsx";
import CategoryProducts from "./pages/CategoryProducts.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
/* Admin pages */
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AddProduct from "./pages/admin/AddProduct.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import EditProduct from "./pages/admin/EditProduct.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminCategories from "./pages/admin/AdminCategories.jsx";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* ========== USER ROUTES ========== */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<PrivateRoute><Cart/></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
        <Route path="/category/:categoryId" element={<CategoryProducts />} />
        <Route path="/profile" element={<PrivateRoute><MyProfile /></PrivateRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      {/* ========== ADMIN ROUTES ========== */}
        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="products" element={<AdminProducts />} />      
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="categories" element={<AdminCategories />} />
        </Route>
    </Routes>
    </>
  );
}

export default App;
