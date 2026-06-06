import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AdminDashboard from './admin/AdminDashboard.jsx';
import AdminLayout from './admin/AdminLayout.jsx';
import AdminLogin from './admin/AdminLogin.jsx';
import AdminProducts from './admin/AdminProducts.jsx';
import ProtectedAdminRoute from './admin/ProtectedAdminRoute.jsx';
import ClientApp from './client/ClientApp.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClientApp />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminPlaceholder title="Orders" />} />
          <Route path="customers" element={<AdminPlaceholder title="Customers" />} />
          <Route path="training" element={<AdminPlaceholder title="Training Applications" />} />
          <Route path="uniforms" element={<AdminPlaceholder title="Uniform Requests" />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function AdminPlaceholder({ title }) {
  return (
    <section className="rounded-lg border border-ink/10 bg-white p-6">
      <p className="section-kicker">Admin</p>
      <h1 className="mt-2 text-2xl font-bold">{title}</h1>
      <p className="mt-3 text-sm text-ink/65">This module is ready for the next feature phase.</p>
    </section>
  );
}
