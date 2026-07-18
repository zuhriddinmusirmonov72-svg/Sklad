import { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import Badge from "../../components/ui/badge/Badge";
import PageMeta from "../../components/common/PageMeta";
import ProductsSection from "./ProductsSection";
import { Product, OrderLine, OrderStatus } from "./types";
import { useOrders } from "./OrdersContext";

const statusColor: Record<OrderStatus, "success" | "warning" | "primary" | "error"> = {
  "Jo'natilmagan": "primary", "Jo'natilgan": "success", "Bekor qilindi": "error",
};

export default function Orders() {
  const { products, orders, addProduct, deleteProduct, updateProduct, addOrder, refreshData, isLoadingData } = useOrders();
  const [orderOpen, setOrderOpen] = useState(false);
  const [status, setStatus] = useState<OrderStatus>("Jo'natilmagan");
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [currency, setCurrency] = useState("UZS");
  const [lines, setLines] = useState<OrderLine[]>([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSug, setShowSug] = useState(false);
  const [qty, setQty] = useState(1);
  const [saved, setSaved] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSug(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (val: string) => {
    setSearch(val);
    if (val.trim()) {
      setSuggestions(products.filter(p => p.name.toLowerCase().includes(val.toLowerCase())));
      setShowSug(true);
    } else {
      setShowSug(false);
    }
  };

  const addLine = (p: Product) => {
    setLines(l => {
      const existing = l.find(x => x.productId === p.id);
      if (existing) {
        return l.map(x => x.productId === p.id ? { ...x, qty: x.qty + qty } : x);
      }
      return [...l, { id: Date.now(), productId: p.id, name: p.name, image: p.image, qty, price: p.price, discount: 0 }];
    });
    setSearch("");
    setQty(1);
    setShowSug(false);
  };

  const removeLine = (id: string | number) => setLines(l => l.filter(x => x.id !== id));

  const updateLineQty = (id: string | number, q: number) => setLines(l => l.map(x => x.id === id ? { ...x, qty: q } : x));
  const updateLineDiscount = (id: string | number, d: number) => setLines(l => l.map(x => x.id === id ? { ...x, discount: d } : x));

  const subtotal = lines.reduce((s, l) => s + l.qty * l.price * (1 - l.discount / 100), 0);

  const saveOrder = async () => {
    if (!customer || lines.length === 0) return;
    
    // Mahsulotlar sonini kamaytirish
    for (const line of lines) {
      const product = products.find(p => p.id === line.productId);
      if (product) {
        await updateProduct(product.id, { 
          stock: Math.max(0, product.stock - line.qty) 
        });
      }
    }
    
    const newOrder = {
      customer, 
      phone, 
      date: new Date().toISOString().slice(0, 16),
      status, 
      warehouse: "Asosiy sklad", 
      address, 
      comment, 
      currency, 
      lines,
    };
    
    await addOrder(newOrder);
    setCustomer(""); setPhone(""); setAddress(""); setComment(""); setLines([]);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const exportExcel = () => {
    if (lines.length === 0 && !customer) return;
    const data = lines.map((l, i) => ({
      "№": i + 1,
      "Mahsulot": l.name,
      "Miqdor": l.qty,
      "Narx": l.price,
      "Chegirma %": l.discount,
      "Jami": Math.round(l.qty * l.price * (1 - l.discount / 100)),
      "Valyuta": currency,
    }));
    data.push({ "№": "", "Mahsulot": "JAMI SUMMA", "Miqdor": "", "Narx": "", "Chegirma %": "", "Jami": Math.round(subtotal), "Valyuta": currency } as never);

    const ws = XLSX.utils.json_to_sheet(data);
    ws["!cols"] = [{ wch: 4 }, { wch: 25 }, { wch: 10 }, { wch: 15 }, { wch: 12 }, { wch: 18 }, { wch: 8 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Zakas");

    // Info sheet
    const info = [
      ["Mijoz", customer],
      ["Telefon", phone],
      ["Manzil", address],
      ["Sana", new Date().toLocaleString("uz-UZ")],
      ["Holat", status],
      ["Izoh", comment],
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(info);
    ws2["!cols"] = [{ wch: 12 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, ws2, "Mijoz ma'lumotlari");

    XLSX.writeFile(wb, `zakas-${customer || "yangi"}-${Date.now()}.xlsx`);
  };

  return (
    <>
      <PageMeta title="Zakazlar" description="Zakazlar va mahsulotlar boshqaruvi" />

      {/* Products Section */}
      <ProductsSection
        products={products}
        onAdd={addProduct}
        onUpdate={updateProduct}
        onDelete={deleteProduct}
        onRefresh={refreshData}
        isLoading={isLoadingData}
      />

      {/* Orders Section */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3 cursor-pointer select-none bg-gray-50 dark:bg-gray-800/40"
          onClick={() => setOrderOpen(v => !v)}
        >
          <div className="flex items-center gap-2">
            <svg className={`w-4 h-4 text-gray-500 transition-transform ${orderOpen ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="font-semibold text-gray-700 dark:text-gray-200">Yangi zakas</span>
            {orders.length > 0 && <span className="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 text-xs font-bold px-2 py-0.5 rounded-full">{orders.length} ta saqlangan</span>}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); refreshData(); }}
            disabled={isLoadingData}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Ma'lumotlarni yangilash"
          >
            <svg className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isLoadingData ? 'Yuklanmoqda...' : 'Yangilash'}
          </button>
        </div>

        {orderOpen && (
          <div className="p-5">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 mb-5 pb-4 border-b border-gray-200 dark:border-gray-800">
              <button onClick={saveOrder} disabled={!customer || lines.length === 0} className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Saqlash
              </button>
              <button onClick={() => { setCustomer(""); setPhone(""); setAddress(""); setComment(""); setLines([]); }} className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Tozalash
              </button>
              {saved && <span className="text-sm text-green-600 font-medium">✓ Zakas saqlandi!</span>}

              <div className="flex items-center gap-1.5 ml-1">
                {(["Jo'natilgan", "Jo'natilmagan", "Bekor qilindi"] as OrderStatus[]).map(s => (
                  <button key={s} onClick={() => setStatus(s)} className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${status === s ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-400"}`}>
                    {s}
                  </button>
                ))}
              </div>

              {/* Excel download */}
              <button
                onClick={exportExcel}
                title="Excel yuklab olish"
                className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-green-300 dark:border-green-700 px-3 py-1.5 text-sm font-medium text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="12" y1="18" x2="12" y2="12"/>
                  <polyline points="9,15 12,18 15,15"/>
                </svg>
                Excel
              </button>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-5">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-red-500 mb-1">* Mijoz ismi</label>
                  <input value={customer} onChange={e => setCustomer(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-white focus:border-blue-500 focus:outline-none" placeholder="Ism familiya" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Telefon</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-white focus:border-blue-500 focus:outline-none" placeholder="+998 90 000 00 00" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Valyuta</label>
                  <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-white focus:border-blue-500 focus:outline-none">
                    <option>UZS</option><option>USD</option><option>EUR</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Yetkazish manzili</label>
                  <textarea value={address} onChange={e => setAddress(e.target.value)} rows={3} className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-white focus:border-blue-500 focus:outline-none resize-none" placeholder="Shahar, tuman, ko'cha..." />
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Izoh</label>
                  <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-white focus:border-blue-500 focus:outline-none resize-none" placeholder="Qo'shimcha ma'lumot..." />
                </div>
              </div>
            </div>

            {/* Product search */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Mahsulot qidirish</label>
              <div className="flex gap-2">
                <div className="relative flex-1" ref={searchRef}>
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" /></svg>
                  <input
                    value={search}
                    onChange={e => handleSearch(e.target.value)}
                    onFocus={() => search && setShowSug(true)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 pl-9 pr-3 py-2 text-sm text-gray-800 dark:text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Mahsulot nomini kiriting..."
                  />
                  {showSug && suggestions.length > 0 && (
                    <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
                      {suggestions.map(p => (
                        <button
                          key={p.id}
                          onClick={() => addLine(p)}
                          className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-left transition-colors"
                        >
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover border border-gray-100" onError={e => { e.currentTarget.style.display = "none"; }} />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg">📦</div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{p.name}</p>
                            <p className="text-xs text-gray-400">{p.price.toLocaleString()} so'm</p>
                          </div>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.stock === 0 ? "bg-red-100 text-red-600" : p.stock < 10 ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-600"}`}>
                            {p.stock} ta
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                  {showSug && suggestions.length === 0 && search && (
                    <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg px-4 py-3 text-sm text-gray-400">
                      Mahsulot topilmadi
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-400">Miqdor:</span>
                  <input type="number" min={1} value={qty} onChange={e => setQty(Number(e.target.value))} className="w-20 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-2 text-sm text-center text-gray-800 dark:text-white focus:border-blue-500 focus:outline-none" />
                </div>
              </div>
            </div>

            {/* Lines table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    {["Rasm", "Mahsulot", "Miqdor", "Narx", "Chegirma %", "Jami", ""].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {lines.length === 0 ? (
                    <tr><td colSpan={7} className="py-8 text-center text-gray-400 text-sm">Mahsulot qidiring va tanlang</td></tr>
                  ) : lines.map(line => (
                    <tr key={line.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                      <td className="px-4 py-2.5">
                        {line.image ? (
                          <img src={line.image} alt={line.name} className="h-10 w-10 rounded-lg object-cover border border-gray-100" onError={e => { e.currentTarget.style.display = "none"; }} />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">📦</div>
                        )}
                      </td>
                      <td className="px-4 py-2.5 font-medium text-gray-800 dark:text-white">{line.name}</td>
                      <td className="px-4 py-2.5">
                        <input type="number" min={1} value={line.qty} onChange={e => updateLineQty(line.id, Number(e.target.value))} className="w-20 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-sm text-center text-gray-800 dark:text-white focus:border-blue-500 focus:outline-none" />
                      </td>
                      <td className="px-4 py-2.5 text-gray-600 dark:text-gray-300">{line.price.toLocaleString()}</td>
                      <td className="px-4 py-2.5">
                        <input type="number" min={0} max={100} value={line.discount} onChange={e => updateLineDiscount(line.id, Number(e.target.value))} className="w-16 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-sm text-center text-gray-800 dark:text-white focus:border-blue-500 focus:outline-none" />
                      </td>
                      <td className="px-4 py-2.5 font-semibold text-gray-800 dark:text-white">
                        {Math.round(line.qty * line.price * (1 - line.discount / 100)).toLocaleString()} {currency}
                      </td>
                      <td className="px-4 py-2.5">
                        <button onClick={() => removeLine(line.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            {lines.length > 0 && (
              <div className="mt-4 flex justify-end">
                <div className="w-64 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <div className="flex justify-between px-4 py-2.5 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-sm text-gray-500">Oraliq jami:</span>
                    <span className="text-sm font-medium text-gray-800 dark:text-white">{Math.round(subtotal).toLocaleString()} {currency}</span>
                  </div>
                  <div className="flex justify-between px-4 py-3 bg-blue-50 dark:bg-blue-500/10">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Jami:</span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{Math.round(subtotal).toLocaleString()} {currency}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Saved Orders */}
            {orders.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Saqlangan zakazlar</h4>
                <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800">
                      <tr>
                        {["Zakaz №", "Mijoz", "Sana", "Jami", "Holat"].map(h => (
                          <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {orders.map(o => {
                        const total = o.lines.reduce((s, l) => s + l.qty * l.price * (1 - l.discount / 100), 0);
                        return (
                          <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                            <td className="px-4 py-3 font-mono font-semibold text-blue-600 dark:text-blue-400">{o.orderNumber}</td>
                            <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">{o.customer}</td>
                            <td className="px-4 py-3 text-gray-500">{o.date.slice(0, 10)}</td>
                            <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">
                              {o.isWarehousePrinted ? `${Math.round(total).toLocaleString()} ${o.currency}` : "-"}
                            </td>
                            <td className="px-4 py-3">
                              {o.isWarehousePrinted ? <Badge size="sm" color={statusColor[o.status]}>{o.status}</Badge> : "-"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
