import { LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { clearStoredAdmin, getStoredAdmin } from '../lib/authStorage.js';
import AdminSidebar from './components/AdminSidebar.jsx';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const session = getStoredAdmin();

  function logout() {
    clearStoredAdmin();
    navigate('/admin/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-silk text-ink">
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-ink/10 bg-silk/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button className="icon-button lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open admin menu">
              <Menu size={20} />
            </button>
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-berry">Admin System</p>
              <p className="font-bold">{session?.user?.name || 'Selyn Admin'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NavLink className="hidden text-sm font-bold text-ink/65 hover:text-berry sm:inline" to="/">
              View Store
            </NavLink>
            <button className="secondary-button" onClick={logout}>
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
