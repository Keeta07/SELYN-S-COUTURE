import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  PackagePlus,
  School,
  ShoppingBag,
  UsersRound,
  X
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  ['/admin/dashboard', 'Dashboard', LayoutDashboard],
  ['/admin/products', 'Products', PackagePlus],
  ['/admin/orders', 'Orders', ShoppingBag],
  ['/admin/customers', 'Customers', UsersRound],
  ['/admin/training', 'Training', GraduationCap],
  ['/admin/uniforms', 'Uniforms', School]
];

export default function AdminSidebar({ open, setOpen }) {
  return (
    <>
      {open && <button className="fixed inset-0 z-40 bg-ink/45 lg:hidden" onClick={() => setOpen(false)} aria-label="Close admin menu" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-ink text-white transition lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex min-h-16 items-center justify-between border-b border-white/10 px-5">
          <div>
            <p className="font-display text-xl font-bold text-champagne">Selyn's Couture</p>
            <p className="text-xs font-bold uppercase tracking-wide text-white/50">Admin Panel</p>
          </div>
          <button className="icon-button border-white/15 bg-white/10 text-white lg:hidden" onClick={() => setOpen(false)} aria-label="Close admin menu">
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-5">
          {navItems.map(([to, label, Icon]) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-3 text-sm font-bold transition ${
                  isActive ? 'bg-champagne text-ink' : 'text-white/72 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4 text-sm text-white/55">
          <BookOpen size={18} />
          <p className="mt-2">Products and requests are private to authenticated admins.</p>
        </div>
      </aside>
    </>
  );
}
