import { Banknote, Clock3, PackagePlus, ShoppingBag, UsersRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import DashboardCard from './components/DashboardCard.jsx';
import { api, money } from '../lib/api.js';

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    Promise.all([api('/dashboard/summary'), api('/orders')])
      .then(([summaryData, ordersData]) => {
        setSummary(summaryData);
        setOrders(ordersData);
      })
      .catch((error) => setMessage(error.message));
  }, []);

  const pendingOrders = orders.filter((order) => ['new', 'pending', 'processing'].includes(String(order.status).toLowerCase())).length;
  const maxRevenueBar = Math.max(summary?.revenue || 1, 1);

  return (
    <section>
      <div className="mb-6">
        <p className="section-kicker">Dashboard</p>
        <h1 className="section-title">Business overview</h1>
      </div>
      {message && <p className="mb-5 rounded-md bg-blush/20 px-4 py-3 text-sm font-semibold text-berry">{message}</p>}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <DashboardCard icon={PackagePlus} label="Total Products" value={summary?.products || 0} helper="Active catalog items" />
        <DashboardCard icon={ShoppingBag} label="Total Orders" value={summary?.orders || 0} helper="Website orders" />
        <DashboardCard icon={UsersRound} label="Total Customers" value={summary?.customers || 0} helper="Unique order contacts" />
        <DashboardCard icon={Clock3} label="Pending Orders" value={summary?.pendingOrders ?? pendingOrders} helper="Need attention" />
        <DashboardCard icon={Banknote} label="Revenue" value={money(summary?.revenue || 0)} helper="Recorded order value" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        <article className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold">Revenue statistics</h2>
          <div className="mt-6 space-y-4">
            {['Orders', 'Products', 'Revenue'].map((label, index) => {
              const value = index === 0 ? summary?.orders || 0 : index === 1 ? summary?.products || 0 : summary?.revenue || 0;
              const width = index === 2 ? Math.min(100, (value / maxRevenueBar) * 100) : Math.min(100, value * 14);
              return (
                <div key={label}>
                  <div className="mb-2 flex justify-between text-sm font-bold">
                    <span>{label}</span>
                    <span>{index === 2 ? money(value) : value}</span>
                  </div>
                  <div className="h-3 rounded-full bg-silk">
                    <div className="h-3 rounded-full bg-berry" style={{ width: `${Math.max(width, 8)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </article>
        <article className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold">Recent orders</h2>
          <div className="mt-4 space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order._id} className="rounded-md bg-silk px-3 py-3 text-sm">
                <p className="font-bold">{order.customer?.name || 'Customer'}</p>
                <p className="text-ink/62">{money(order.total)} - {order.status}</p>
              </div>
            ))}
            {!orders.length && <p className="text-sm text-ink/60">No orders yet.</p>}
          </div>
        </article>
      </div>
    </section>
  );
}
