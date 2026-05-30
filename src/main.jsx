import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  Check,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  PackagePlus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  UserRound,
  X
} from 'lucide-react';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '2348000000000';

const categories = [
  'All',
  "Men's Wear",
  "Women's Wear",
  'Fascinators',
  'Hats',
  'Bags',
  'Home Accessories',
  'Resin Art',
  'School Uniforms',
  'Training Services'
];

const fallbackProducts = [
  {
    _id: 'f1',
    name: 'Emerald Occasion Gown',
    category: "Women's Wear",
    description: 'Structured satin gown with hand-finished details for formal events.',
    price: 85000,
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80'],
    sizes: ['S', 'M', 'L', 'Custom'],
    colors: ['Emerald', 'Ivory'],
    featured: true
  },
  {
    _id: 'f2',
    name: 'Tailored Senator Set',
    category: "Men's Wear",
    description: 'Clean-cut native wear set with premium fabric and refined embroidery.',
    price: 65000,
    images: ['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=80'],
    sizes: ['M', 'L', 'XL', 'Custom'],
    colors: ['Black', 'Wine', 'Cream'],
    featured: true
  },
  {
    _id: 'f3',
    name: 'Statement Fascinator',
    category: 'Fascinators',
    description: 'Lightweight sculptural fascinator for weddings, church, and ceremonies.',
    price: 28000,
    images: ['https://images.unsplash.com/photo-1529958030586-3aae4ca485ff?auto=format&fit=crop&w=900&q=80'],
    colors: ['Blush', 'Gold', 'Navy'],
    featured: true
  },
  {
    _id: 'f4',
    name: 'Resin Serving Tray',
    category: 'Resin Art',
    description: 'Hand-poured resin tray with metallic accents for gifting or home styling.',
    price: 32000,
    images: ['https://images.unsplash.com/photo-1603204077779-bed963ea7d0e?auto=format&fit=crop&w=900&q=80'],
    colors: ['Pearl', 'Gold'],
    featured: false
  },
  {
    _id: 'f5',
    name: 'School Uniform Package',
    category: 'School Uniforms',
    description: 'Durable school uniform production for nursery, primary, and secondary schools.',
    price: 12000,
    images: ['https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80'],
    sizes: ['Bulk'],
    featured: false
  },
  {
    _id: 'f6',
    name: 'Beginner Fashion Training',
    category: 'Training Services',
    description: 'Hands-on course covering measurements, pattern drafting, cutting, and sewing.',
    price: 120000,
    images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80'],
    sizes: ['8 weeks', '12 weeks'],
    featured: false
  }
];

function money(value) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0
  }).format(value || 0);
}

async function api(path, options = {}) {
  const token = localStorage.getItem('selynToken');
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}

function App() {
  const [products, setProducts] = useState(fallbackProducts);
  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    api('/products')
      .then((data) => data.length && setProducts(data))
      .catch(() => setProducts(fallbackProducts));
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category;
      const haystack = `${product.name} ${product.category} ${product.description}`.toLowerCase();
      return matchesCategory && haystack.includes(search.toLowerCase());
    });
  }, [products, category, search]);

  function addToCart(product) {
    setCart((current) => {
      const existing = current.find((item) => item._id === product._id);
      if (existing) {
        return current.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
  }

  function whatsappOrder(product) {
    const text = `Hello Selyn's Couture, I want to order ${product.name} (${product.category}) at ${money(product.price)}.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  }

  return (
    <div className="min-h-screen bg-silk text-ink">
      <Header
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        setAdminOpen={setAdminOpen}
      />
      <main>
        <Hero />
        <CatalogControls
          category={category}
          setCategory={setCategory}
          search={search}
          setSearch={setSearch}
        />
        <ProductGrid products={filteredProducts} addToCart={addToCart} whatsappOrder={whatsappOrder} />
        <ServicePanels />
        <RequestForms />
        <Cart cart={cart} setCart={setCart} />
      </main>
      <Footer />
      {adminOpen && <AdminModal onClose={() => setAdminOpen(false)} />}
      {mobileOpen && (
        <MobileMenu setMobileOpen={setMobileOpen} setAdminOpen={setAdminOpen} cartCount={cart.length} />
      )}
    </div>
  );
}

function Header({ cartCount, mobileOpen, setMobileOpen, setAdminOpen }) {
  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-silk/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#" className="font-display text-2xl font-bold tracking-normal text-berry">
          Selyn's Couture
        </a>
        <nav className="hidden items-center gap-7 text-sm font-semibold lg:flex">
          <a href="#shop">Shop</a>
          <a href="#services">Services</a>
          <a href="#requests">Requests</a>
          <a href="#cart">Cart ({cartCount})</a>
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <button className="icon-button" onClick={() => setAdminOpen(true)} aria-label="Open admin dashboard">
            <LayoutDashboard size={18} />
          </button>
          <a className="primary-button" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">
            <MessageCircle size={18} />
            WhatsApp
          </a>
        </div>
        <button className="icon-button lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Open menu">
          <Menu size={21} />
        </button>
      </div>
    </header>
  );
}

function MobileMenu({ setMobileOpen, setAdminOpen, cartCount }) {
  return (
    <div className="fixed inset-0 z-40 bg-ink/40 lg:hidden">
      <div className="ml-auto flex h-full w-72 flex-col gap-5 bg-silk p-5 shadow-soft">
        <button className="icon-button self-end" onClick={() => setMobileOpen(false)} aria-label="Close menu">
          <X size={20} />
        </button>
        {['Shop', 'Services', 'Requests'].map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="text-lg font-semibold">
            {item}
          </a>
        ))}
        <a href="#cart" onClick={() => setMobileOpen(false)} className="text-lg font-semibold">
          Cart ({cartCount})
        </a>
        <button
          className="secondary-button justify-center"
          onClick={() => {
            setAdminOpen(true);
            setMobileOpen(false);
          }}
        >
          <LayoutDashboard size={18} />
          Admin
        </button>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative isolate min-h-[680px] overflow-hidden">
      <img
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1800&q=85"
        alt="Fashion model wearing couture styling"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/85 via-ink/45 to-transparent" />
      <div className="mx-auto flex min-h-[680px] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl text-white">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold backdrop-blur">
            <Sparkles size={16} />
            Bespoke fashion, accessories, uniforms, art, and training
          </p>
          <h1 className="font-display text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
            Selyn's Couture
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/88">
            Shop ready-to-wear pieces, request custom designs, order school uniforms in bulk, or apply for practical fashion training.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="primary-button bg-champagne text-ink hover:bg-white" href="#shop">
              <ShoppingBag size={18} />
              Shop Collection
            </a>
            <a className="secondary-button border-white/35 bg-white/10 text-white hover:bg-white/20" href="#requests">
              <PackagePlus size={18} />
              Request Custom Work
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function CatalogControls({ category, setCategory, search, setSearch }) {
  return (
    <section id="shop" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="section-kicker">Collection</p>
          <h2 className="section-title">Shop Selyn's signature range</h2>
        </div>
        <label className="flex w-full items-center gap-3 rounded-md border border-ink/15 bg-white px-4 py-3 shadow-sm lg:max-w-sm">
          <Search size={18} />
          <input
            className="w-full bg-transparent text-sm outline-none"
            placeholder="Search gowns, bags, uniforms..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </div>
      <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
        {categories.map((item) => (
          <button
            key={item}
            className={`whitespace-nowrap rounded-md border px-4 py-2 text-sm font-semibold transition ${
              category === item
                ? 'border-berry bg-berry text-white'
                : 'border-ink/10 bg-white text-ink hover:border-berry/50'
            }`}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </section>
  );
}

function ProductGrid({ products, addToCart, whatsappOrder }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <article key={product._id} className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm">
            <div className="aspect-[4/3] overflow-hidden bg-champagne">
              <img className="h-full w-full object-cover transition duration-500 hover:scale-105" src={product.images?.[0]} alt={product.name} />
            </div>
            <div className="space-y-4 p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-jade">{product.category}</p>
                <h3 className="mt-1 text-xl font-bold">{product.name}</h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-ink/68">{product.description}</p>
              </div>
              <div className="flex items-center justify-between">
                <strong className="text-lg">{money(product.price)}</strong>
                {product.featured && <span className="rounded-full bg-blush/35 px-3 py-1 text-xs font-bold">Featured</span>}
              </div>
              <div className="flex gap-2">
                <button className="secondary-button flex-1 justify-center" onClick={() => addToCart(product)}>
                  <ShoppingBag size={17} />
                  Add
                </button>
                <button className="icon-button" onClick={() => whatsappOrder(product)} aria-label={`Order ${product.name} on WhatsApp`}>
                  <MessageCircle size={18} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ServicePanels() {
  const services = [
    {
      icon: BriefcaseBusiness,
      title: 'Custom couture',
      text: 'Submit measurements, event date, design notes, budget, and style references for a bespoke quote.'
    },
    {
      icon: ShieldCheck,
      title: 'School uniforms',
      text: 'Bulk production for schools with durable fabrics, sizing support, and delivery coordination.'
    },
    {
      icon: GraduationCap,
      title: 'Fashion training',
      text: 'Practical classes for beginners and improvers across drafting, cutting, finishing, and business basics.'
    }
  ];

  return (
    <section id="services" className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="section-kicker">Services</p>
        <h2 className="section-title">More than a fashion store</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {services.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-lg border border-ink/10 bg-silk p-6">
              <Icon className="text-berry" size={28} />
              <h3 className="mt-5 text-xl font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink/68">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RequestForms() {
  return (
    <section id="requests" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="section-kicker">Requests</p>
          <h2 className="section-title">Send the details once, then continue on WhatsApp</h2>
          <p className="mt-4 text-ink/70">
            Use the right form for your need. Each submission is saved for the admin dashboard and can be followed up by phone or WhatsApp.
          </p>
          <div className="mt-8 space-y-3 text-sm font-semibold">
            {['Measurements and event timelines', 'Uniform quantities and school details', 'Training level and course interest'].map((item) => (
              <p key={item} className="flex items-center gap-3">
                <Check className="text-jade" size={18} />
                {item}
              </p>
            ))}
          </div>
        </div>
        <LeadForm />
      </div>
    </section>
  );
}

function LeadForm() {
  const [type, setType] = useState('custom-order');
  const [status, setStatus] = useState('');

  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    payload.type = type;
    if (payload.studentCount) payload.studentCount = Number(payload.studentCount);

    try {
      await api('/requests', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setStatus('Request sent. Selyn\'s Couture will follow up shortly.');
      event.currentTarget.reset();
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
      <div className="mb-5 grid gap-2 sm:grid-cols-3">
        {[
          ['custom-order', 'Custom'],
          ['uniform-bulk-order', 'Uniforms'],
          ['training-application', 'Training']
        ].map(([value, label]) => (
          <button
            type="button"
            key={value}
            onClick={() => setType(value)}
            className={`rounded-md border px-3 py-2 text-sm font-bold ${
              type === value ? 'border-berry bg-berry text-white' : 'border-ink/10 bg-silk'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input name="name" label="Full name" required />
        <Input name="phone" label="Phone or WhatsApp" required />
        <Input name="email" label="Email" type="email" />
        {type === 'custom-order' && <Input name="eventDate" label="Event date" type="date" />}
        {type === 'uniform-bulk-order' && <Input name="schoolName" label="School name" />}
        {type === 'uniform-bulk-order' && <Input name="studentCount" label="Number of students" type="number" />}
        {type === 'training-application' && <Input name="course" label="Course interest" />}
        {type === 'training-application' && <Input name="experience" label="Experience level" />}
        <Input name="budget" label="Budget" />
      </div>
      <label className="mt-4 block text-sm font-bold">
        Details
        <textarea
          name="details"
          required
          rows="5"
          className="mt-2 w-full rounded-md border border-ink/15 px-3 py-3 font-normal outline-none focus:border-berry"
          placeholder="Describe fabrics, colors, quantity, measurements, deadline, or learning goals."
        />
      </label>
      <button className="primary-button mt-5 w-full justify-center">
        <BadgeCheck size={18} />
        Submit Request
      </button>
      {status && <p className="mt-3 text-sm font-semibold text-jade">{status}</p>}
    </form>
  );
}

function Input({ label, ...props }) {
  return (
    <label className="block text-sm font-bold">
      {label}
      <input
        {...props}
        className="mt-2 w-full rounded-md border border-ink/15 px-3 py-3 font-normal outline-none focus:border-berry"
      />
    </label>
  );
}

function Cart({ cart, setCart }) {
  const [status, setStatus] = useState('');
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function submitOrder(event) {
    event.preventDefault();
    if (!cart.length) {
      setStatus('Add at least one item first.');
      return;
    }

    const customer = Object.fromEntries(new FormData(event.currentTarget).entries());
    const items = cart.map((item) => ({
      product: item._id.startsWith('f') ? undefined : item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));

    try {
      await api('/orders', {
        method: 'POST',
        body: JSON.stringify({ customer, items, source: 'website' })
      });
      setStatus('Order received. You can also confirm instantly on WhatsApp.');
      setCart([]);
      event.currentTarget.reset();
    } catch (error) {
      setStatus(error.message);
    }
  }

  function checkoutWhatsapp() {
    const lines = cart.map((item) => `${item.quantity} x ${item.name} - ${money(item.price * item.quantity)}`);
    const text = `Hello Selyn's Couture, I want to order:\n${lines.join('\n')}\nTotal: ${money(total)}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  }

  return (
    <section id="cart" className="bg-ink py-16 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <div>
          <p className="section-kicker text-blush">Cart</p>
          <h2 className="section-title text-white">Review your order</h2>
          <div className="mt-7 space-y-3">
            {cart.length === 0 && <p className="text-white/70">Your cart is empty.</p>}
            {cart.map((item) => (
              <div key={item._id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.08] p-4">
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-sm text-white/65">{item.quantity} x {money(item.price)}</p>
                </div>
                <button className="icon-button border-white/15 bg-white/10 text-white" onClick={() => setCart(cart.filter((next) => next._id !== item._id))} aria-label="Remove item">
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5 text-xl font-bold">
            <span>Total</span>
            <span>{money(total)}</span>
          </div>
        </div>
        <form onSubmit={submitOrder} className="rounded-lg bg-white p-5 text-ink">
          <div className="grid gap-4">
            <Input name="name" label="Full name" required />
            <Input name="phone" label="Phone" required />
            <Input name="email" label="Email" type="email" />
            <Input name="address" label="Delivery address" />
          </div>
          <button className="primary-button mt-5 w-full justify-center">
            <ShoppingBag size={18} />
            Place Website Order
          </button>
          <button type="button" className="secondary-button mt-3 w-full justify-center" onClick={checkoutWhatsapp}>
            <MessageCircle size={18} />
            Confirm on WhatsApp
          </button>
          {status && <p className="mt-3 text-sm font-semibold text-jade">{status}</p>}
        </form>
      </div>
    </section>
  );
}

function AdminModal({ onClose }) {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem('selynUser');
    return stored ? JSON.parse(stored) : null;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/65 p-4">
      <div className="mx-auto max-w-6xl rounded-lg bg-silk shadow-soft">
        <div className="flex items-center justify-between border-b border-ink/10 p-5">
          <h2 className="text-xl font-bold">Admin dashboard</h2>
          <button className="icon-button" onClick={onClose} aria-label="Close admin dashboard">
            <X size={20} />
          </button>
        </div>
        {auth?.role === 'admin' ? <AdminPanel auth={auth} setAuth={setAuth} /> : <LoginPanel setAuth={setAuth} />}
      </div>
    </div>
  );
}

function LoginPanel({ setAuth }) {
  const [message, setMessage] = useState('');

  async function login(event) {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());

    try {
      const data = await api('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
      localStorage.setItem('selynToken', data.token);
      localStorage.setItem('selynUser', JSON.stringify(data.user));
      setAuth(data.user);
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <form onSubmit={login} className="mx-auto max-w-md p-6">
      <UserRound className="text-berry" size={32} />
      <h3 className="mt-4 text-2xl font-bold">Admin sign in</h3>
      <p className="mt-2 text-sm text-ink/65">Use the seeded admin or an admin account created in MongoDB.</p>
      <div className="mt-6 grid gap-4">
        <Input name="email" label="Email" type="email" required />
        <Input name="password" label="Password" type="password" required />
      </div>
      <button className="primary-button mt-5 w-full justify-center">Sign in</button>
      {message && <p className="mt-3 text-sm font-semibold text-berry">{message}</p>}
    </form>
  );
}

function AdminPanel({ auth, setAuth }) {
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');

  async function loadAdminData() {
    try {
      const [summaryData, orderData, requestData, productData] = await Promise.all([
        api('/dashboard/summary'),
        api('/orders'),
        api('/requests'),
        api('/products')
      ]);
      setSummary(summaryData);
      setOrders(orderData);
      setRequests(requestData);
      setProducts(productData);
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    loadAdminData();
  }, []);

  async function createProduct(event) {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget).entries());
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock || 0),
      images: form.images.split(',').map((item) => item.trim()).filter(Boolean),
      sizes: form.sizes.split(',').map((item) => item.trim()).filter(Boolean),
      colors: form.colors.split(',').map((item) => item.trim()).filter(Boolean),
      featured: form.featured === 'on'
    };

    try {
      await api('/products', { method: 'POST', body: JSON.stringify(payload) });
      setMessage('Product created.');
      event.currentTarget.reset();
      loadAdminData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  function logout() {
    localStorage.removeItem('selynToken');
    localStorage.removeItem('selynUser');
    setAuth(null);
  }

  return (
    <div className="p-5">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <p className="font-semibold">Signed in as {auth.name}</p>
        <button className="secondary-button" onClick={logout}>
          <LogOut size={17} />
          Sign out
        </button>
      </div>
      {message && <p className="mb-4 rounded-md bg-champagne px-4 py-3 text-sm font-semibold">{message}</p>}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ['Products', summary?.products || 0],
          ['Orders', summary?.orders || 0],
          ['Requests', summary?.requests || 0],
          ['Revenue', money(summary?.revenue || 0)]
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-ink/10 bg-white p-4">
            <p className="text-sm text-ink/60">{label}</p>
            <strong className="mt-2 block text-2xl">{value}</strong>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
        <form onSubmit={createProduct} className="rounded-lg border border-ink/10 bg-white p-4">
          <h3 className="mb-4 font-bold">Add product</h3>
          <div className="grid gap-3">
            <Input name="name" label="Name" required />
            <label className="text-sm font-bold">
              Category
              <select name="category" className="mt-2 w-full rounded-md border border-ink/15 px-3 py-3 font-normal">
                {categories.slice(1).map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <Input name="price" label="Price" type="number" required />
            <Input name="stock" label="Stock" type="number" />
            <Input name="images" label="Image URLs, comma separated" required />
            <Input name="sizes" label="Sizes, comma separated" />
            <Input name="colors" label="Colors, comma separated" />
            <label className="text-sm font-bold">
              Description
              <textarea name="description" rows="4" required className="mt-2 w-full rounded-md border border-ink/15 px-3 py-3 font-normal" />
            </label>
            <label className="flex items-center gap-2 text-sm font-bold">
              <input name="featured" type="checkbox" />
              Featured product
            </label>
          </div>
          <button className="primary-button mt-4 w-full justify-center">Create product</button>
        </form>
        <div className="grid gap-5">
          <AdminList icon={ShoppingBag} title="Latest orders" items={orders.map((order) => `${order.customer.name} - ${money(order.total)} - ${order.status}`)} />
          <AdminList icon={BookOpen} title="Requests" items={requests.map((request) => `${request.name} - ${request.type} - ${request.status}`)} />
          <AdminList icon={PackagePlus} title="Catalog" items={products.map((product) => `${product.name} - ${money(product.price)}`)} />
        </div>
      </div>
    </div>
  );
}

function AdminList({ icon: Icon, title, items }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white p-4">
      <h3 className="mb-3 flex items-center gap-2 font-bold">
        <Icon size={18} />
        {title}
      </h3>
      <div className="max-h-52 space-y-2 overflow-y-auto">
        {items.length === 0 && <p className="text-sm text-ink/60">No records yet.</p>}
        {items.map((item, index) => (
          <p key={`${item}-${index}`} className="rounded-md bg-silk px-3 py-2 text-sm">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-white py-8">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 text-sm text-ink/65 sm:flex-row sm:px-6 lg:px-8">
        <p className="font-semibold text-berry">Selyn's Couture</p>
        <p>Fashion retail, custom design, school uniforms, resin art, home accessories, and training.</p>
      </div>
    </footer>
  );
}

createRoot(document.getElementById('root')).render(<App />);
