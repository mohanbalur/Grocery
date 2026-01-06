import { Outlet, NavLink } from "react-router-dom";
import "./admin.css";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2 className="admin-logo">Admin Panel</h2>

        <nav className="admin-nav">
          <NavLink to="/admin/dashboard">Dashboard</NavLink>
          <NavLink to="/admin/categories" className="nav-link">Categories</NavLink>
          <NavLink to="/admin/products" className="nav-link"> Update Products</NavLink>
          <NavLink to="/admin/orders" className="nav-link">Orders</NavLink>
          
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
