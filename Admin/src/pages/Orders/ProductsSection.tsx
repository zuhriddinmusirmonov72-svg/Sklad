import { useState } from "react";
import { Product } from "./types";

interface Props {
  products: Product[];
  onAdd: (p: Omit<Product, 'id'>) => Promise<void>;
  onUpdate: (id: string, p: Partial<Product>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onRefresh: () => Promise<void>;
  isLoading: boolean;
}

export default function ProductsSection({ products, onAdd, onUpdate, onDelete, onRefresh, isLoading }: Props) {
  const [open, setOpen] = useState(true);
  const [form, setForm] = useState({ name: "", image: "", stock: 0, price: 0, category: "", weight: 0, packQuantity: 1 });
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAdd = async () => {
    // Validatsiya
    if (!form.name) {
      setError("Mahsulot nomini kiriting!");
      return;
    }
    if (!form.weight || form.weight <= 0) {
      setError("Mahsulot gramini kiriting! (0 dan katta bo'lishi kerak)");
      return;
    }
    
    setError("");
    await onAdd(form);
    // Formani tozalash lekin ochiq qoldirish
    setForm({ name: "", image: "", stock: 0, price: 0, category: "", weight: 0, packQuantity: 1 });
    // setAdding(false); ni o'chirdik - forma ochiq qoladi
  };

  const handleEdit = (product: Product) => {
    setEditing(product.id);
    setForm({
      name: product.name,
      image: product.image || "",
      stock: product.stock,
      price: product.price,
      category: product.category || "",
      weight: product.weight || 0,
      packQuantity: product.packQuantity || 1
    });
    setAdding(true);
    setOpen(true);
  };

  const handleUpdate = async () => {
    if (!editing) return;
    
    // Validatsiya
    if (!form.name) {
      setError("Mahsulot nomini kiriting!");
      return;
    }
    if (!form.weight || form.weight <= 0) {
      setError("Mahsulot gramini kiriting! (0 dan katta bo'lishi kerak)");
      return;
    }
    
    setError("");
    await onUpdate(editing, form);
    // Yangilashdan keyin formani tozalash lekin ochiq qoldirish
    setForm({ name: "", image: "", stock: 0, price: 0, category: "", weight: 0, packQuantity: 1 });
    // setAdding(false); va setEditing(null); ni o'chirdik - forma ochiq qoladi
    setEditing(null); // Editing mode'ni to'xtatish
  };

  const handleCancel = () => {
    setAdding(false);
    setEditing(null);
    setError("");
    setForm({ name: "", image: "", stock: 0, price: 0, category: "", weight: 0, packQuantity: 1 });
  };

  // Qidiruv funksiyasi
  const filteredProducts = products.filter(p => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(query) ||
      (p.category && p.category.toLowerCase().includes(query))
    );
  });

  return (
    <div className="mb-4 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden"
      onKeyDown={e => { if (e.key === 'Enter') e.preventDefault(); }}
    >
      <div
        className="flex items-center justify-between px-5 py-3 cursor-pointer select-none bg-gray-50 dark:bg-gray-800/40"
        onClick={() => setOpen(v => !v)}
      >
        <div className="flex items-center gap-2">
          <svg className={`w-4 h-4 text-gray-500 transition-transform ${open ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="font-semibold text-gray-700 dark:text-gray-200">Mahsulotlar</span>
          <span className="bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400 text-xs font-bold px-2 py-0.5 rounded-full">{products.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={e => { e.stopPropagation(); onRefresh(); }}
            disabled={isLoading}
            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Mahsulotlarni yangilash"
          >
            <svg className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isLoading ? 'Yuklanmoqda...' : 'Yangilash'}
          </button>
          <button
            onClick={e => { e.stopPropagation(); setOpen(true); setAdding(true); }}
            className="inline-flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700 transition-colors"
          >
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Yangi mahsulot
          </button>
        </div>
      </div>

      {open && (
        <div className="p-4">
          {/* Qidiruv qutisi */}
          <div className="mb-4">
            <div className="relative">
              <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                width="16" 
                height="16" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Mahsulot yoki kategoriya nomini kiriting..."
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 pl-10 pr-10 py-2.5 text-sm text-gray-800 dark:text-white focus:border-violet-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Tozalash"
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="mt-2 text-xs text-gray-500">
                {filteredProducts.length} ta mahsulot topildi ({products.length} tadan)
              </p>
            )}
          </div>

          {adding && (
            <div className="mb-4 rounded-xl border border-violet-200 dark:border-violet-800/50 bg-violet-50/50 dark:bg-violet-500/5 p-4">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                {editing ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
              </p>
              
              {error && (
                <div className="mb-3 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">⚠️ {error}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-medium text-red-500 mb-1">* Nomi (majburiy)</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-white focus:border-violet-500 focus:outline-none" placeholder="Mahsulot nomi" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Kategoriya</label>
                  <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-white focus:border-violet-500 focus:outline-none" placeholder="Masalan: Telefon" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-red-500 mb-1">* Grammi (majburiy)</label>
                  <input 
                    type="number" 
                    min={1} 
                    value={form.weight || ""} 
                    onChange={e => setForm(f => ({ ...f, weight: Number(e.target.value) }))} 
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-white focus:border-violet-500 focus:outline-none" 
                    placeholder="gram"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-red-500 mb-1">* Quti ichida nechta?</label>
                  <input 
                    type="number" 
                    min={1} 
                    value={form.packQuantity || ""} 
                    onChange={e => setForm(f => ({ ...f, packQuantity: Number(e.target.value) }))} 
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-white focus:border-violet-500 focus:outline-none" 
                    placeholder="dona"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Narx (USD)</label>
                  <input 
                    type="number" 
                    min={0} 
                    step="0.01"
                    value={form.price} 
                    onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} 
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-white focus:border-violet-500 focus:outline-none" 
                    placeholder="1.00"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Sklad miqdori</label>
                  <input type="number" min={0} value={form.stock} onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))} className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-white focus:border-violet-500 focus:outline-none" />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-xs text-gray-500 mb-1">Rasm URL</label>
                  <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-white focus:border-violet-500 focus:outline-none" placeholder="https://..." />
                </div>
              </div>
              {form.image && (
                <div className="mt-3">
                  <p className="text-xs text-gray-400 mb-1">Ko'rinish:</p>
                  <img 
                    src={form.image} 
                    alt="preview" 
                    className="h-16 w-16 rounded-lg object-cover border border-gray-200 cursor-pointer" 
                    onMouseEnter={() => setZoomedImage(form.image)}
                    onMouseLeave={() => setZoomedImage(null)}
                    onError={e => (e.currentTarget.style.display = "none")} 
                  />
                </div>
              )}
              <div className="flex gap-2 mt-3">
                <button 
                  type="button"
                  onClick={editing ? handleUpdate : handleAdd} 
                  className="px-4 py-1.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors"
                >
                  {editing ? "Yangilash" : "Saqlash"}
                </button>
                <button 
                  type="button"
                  onClick={handleCancel} 
                  className="px-4 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Bekor
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  {["Rasm", "Nomi", "Kategoriya", "Gramm", "Quti ichida", "Narx", "Sklad", ""].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredProducts.length === 0 ? (
                  <tr><td colSpan={8} className="py-8 text-center text-gray-400 text-sm">
                    {searchQuery ? `"${searchQuery}" bo'yicha mahsulot topilmadi` : "Hali mahsulot yo'q"}
                  </td></tr>
                ) : filteredProducts.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                    <td className="px-4 py-2.5">
                      {p.image ? (
                        <img 
                          src={p.image} 
                          alt={p.name} 
                          className="h-10 w-10 rounded-lg object-cover border border-gray-200 cursor-pointer" 
                          onMouseEnter={() => setZoomedImage(p.image)}
                          onMouseLeave={() => setZoomedImage(null)}
                          onError={e => { e.currentTarget.style.display = "none"; }} 
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 text-lg">📦</div>
                      )}
                    </td>
                    <td className="px-4 py-2.5 font-medium text-gray-800 dark:text-white">{p.name}</td>
                    <td className="px-4 py-2.5 text-gray-500">{p.category || "—"}</td>
                    <td className="px-4 py-2.5 text-gray-600 dark:text-gray-300">
                      <span className="inline-flex items-center gap-1">
                        {p.weight ? `${p.weight} g` : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-gray-600 dark:text-gray-300">
                      <span className="inline-flex items-center gap-1 font-semibold text-blue-600">
                        {p.packQuantity || 1} dona
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-gray-600 dark:text-gray-300">${p.price.toFixed(2)}</td>
                    <td className="px-4 py-2.5">
                      <span className={`font-semibold ${p.stock === 0 ? "text-red-500" : p.stock < 10 ? "text-amber-500" : "text-green-600"}`}>
                        {p.stock} ta
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEdit(p)} 
                          className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                          title="Tahrirlash"
                        >
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => onDelete(p.id)} 
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          title="O'chirish"
                        >
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Rasm kattalashtirish modali - hover da 5x katta */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none"
        >
          <div className="relative">
            <img 
              src={zoomedImage} 
              alt="Katta rasm" 
              className="w-[250px] h-[250px] rounded-xl shadow-2xl object-cover animate-in fade-in zoom-in duration-150 border-4 border-white"
            />
          </div>
        </div>
      )}
    </div>
  );
}
