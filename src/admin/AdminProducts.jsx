import { Edit3, PackagePlus, Save, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api, money } from '../lib/api.js';

const productCategories = [
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

const emptyProduct = {
  name: '',
  description: '',
  price: '',
  category: "Women's Wear",
  stock: '',
  sizes: '',
  colors: '',
  images: '',
  featured: false
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const data = await api('/products');
      setProducts(data);
    } catch (error) {
      setMessage(error.message);
    }
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const text = `${product.name} ${product.category}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });
  }, [products, search]);

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  }

  function productToForm(product) {
    setEditingId(product._id);
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || "Women's Wear",
      stock: product.stock || '',
      sizes: product.sizes?.join(', ') || '',
      colors: product.colors?.join(', ') || '',
      images: product.images?.join(', ') || '',
      featured: Boolean(product.featured)
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyProduct);
  }

  function buildPayload() {
    return {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock || 0),
      sizes: form.sizes.split(',').map((item) => item.trim()).filter(Boolean),
      colors: form.colors.split(',').map((item) => item.trim()).filter(Boolean),
      images: form.images.split(',').map((item) => item.trim()).filter(Boolean)
    };
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const payload = buildPayload();
      if (editingId) {
        await api(`/products/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        setMessage('Product updated.');
      } else {
        await api('/products', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        setMessage('Product created.');
      }

      resetForm();
      await loadProducts();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function removeProduct(product) {
    const confirmed = window.confirm(`Delete ${product.name}?`);
    if (!confirmed) return;

    try {
      await api(`/products/${product._id}`, { method: 'DELETE' });
      setMessage('Product deleted.');
      await loadProducts();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <section>
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="section-kicker">Products</p>
          <h1 className="section-title">Product management</h1>
        </div>
        <label className="flex w-full items-center rounded-md border border-ink/15 bg-white px-3 py-3 lg:max-w-sm">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </label>
      </div>
      {message && <p className="mb-5 rounded-md bg-champagne px-4 py-3 text-sm font-semibold">{message}</p>}
      <div className="grid gap-6 xl:grid-cols-[410px_1fr]">
        <form onSubmit={submit} className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <PackagePlus size={19} />
              {editingId ? 'Edit product' : 'Add product'}
            </h2>
            {editingId && (
              <button type="button" className="icon-button" onClick={resetForm} aria-label="Cancel edit">
                <X size={18} />
              </button>
            )}
          </div>
          <div className="grid gap-4">
            <AdminInput name="name" label="Product Name" value={form.name} onChange={updateField} required />
            <label className="block text-sm font-bold">
              Category
              <select name="category" value={form.category} onChange={updateField} className="mt-2 w-full rounded-md border border-ink/15 px-3 py-3 font-normal outline-none focus:border-berry">
                {productCategories.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminInput name="price" label="Price" type="number" value={form.price} onChange={updateField} required />
              <AdminInput name="stock" label="Stock" type="number" value={form.stock} onChange={updateField} />
            </div>
            <AdminInput name="sizes" label="Sizes" value={form.sizes} onChange={updateField} placeholder="S, M, L, Custom" />
            <AdminInput name="colors" label="Colors" value={form.colors} onChange={updateField} placeholder="Black, Gold, Berry" />
            <AdminInput name="images" label="Images" value={form.images} onChange={updateField} placeholder="Multiple image URLs, comma separated" required />
            <label className="block text-sm font-bold">
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={updateField}
                rows="5"
                required
                className="mt-2 w-full rounded-md border border-ink/15 px-3 py-3 font-normal outline-none focus:border-berry"
              />
            </label>
            <label className="flex items-center gap-2 text-sm font-bold">
              <input name="featured" type="checkbox" checked={form.featured} onChange={updateField} />
              Featured product
            </label>
          </div>
          <button disabled={loading} className="primary-button mt-5 w-full justify-center disabled:opacity-60">
            <Save size={18} />
            {loading ? 'Saving...' : editingId ? 'Save Changes' : 'Create Product'}
          </button>
        </form>
        <div className="rounded-lg border border-ink/10 bg-white shadow-sm">
          <div className="border-b border-ink/10 p-5">
            <h2 className="text-lg font-bold">Catalog</h2>
            <p className="mt-1 text-sm text-ink/60">{filteredProducts.length} products shown</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-silk text-xs uppercase tracking-wide text-ink/55">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Featured</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img className="h-12 w-12 rounded-md object-cover" src={product.images?.[0]} alt={product.name} />
                        <div>
                          <p className="font-bold">{product.name}</p>
                          <p className="line-clamp-1 max-w-xs text-ink/55">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">{product.category}</td>
                    <td className="px-4 py-4 font-bold">{money(product.price)}</td>
                    <td className="px-4 py-4">{product.stock || 0}</td>
                    <td className="px-4 py-4">{product.featured ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button className="icon-button" onClick={() => productToForm(product)} aria-label={`Edit ${product.name}`}>
                          <Edit3 size={17} />
                        </button>
                        <button className="icon-button" onClick={() => removeProduct(product)} aria-label={`Delete ${product.name}`}>
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!filteredProducts.length && (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-ink/60">No products found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function AdminInput({ label, ...props }) {
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
