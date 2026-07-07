import { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "react-router";
import * as XLSX from "xlsx";
import PageMeta from "../../components/common/PageMeta";
import { Product, OrderLine, OrderStatus } from "./types";
import { useOrders } from "./OrdersContext";

export default function NewOrder() {
  const { id } = useParams();
  const { products, orders, addOrder, updateOrder, updateProduct } = useOrders();
  
  const existingOrder = id ? orders.find(o => o.id === Number(id)) : null;

  const [status, setStatus] = useState<OrderStatus>(existingOrder?.status || "Jo'natilmagan");
  const [customer, setCustomer] = useState(existingOrder?.customer || "");
  const [phone, setPhone] = useState(existingOrder?.phone || "");
  const [address, setAddress] = useState(existingOrder?.address || "");
  const [warehouse, setWarehouse] = useState(existingOrder?.warehouse || "Склад");
  const [comment, setComment] = useState(existingOrder?.comment || "");
  const [currency, setCurrency] = useState<string>(existingOrder?.currency || "USD"); // Default currency USD
  const [lines, setLines] = useState<OrderLine[]>(existingOrder?.lines || []);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSug, setShowSug] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1); // Arrow key navigation uchun
  const [saved, setSaved] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [hoverImageTimer, setHoverImageTimer] = useState<number | null>(null);
  const [customerSuggestions, setCustomerSuggestions] = useState<string[]>([]);
  const [showCustomerSug, setShowCustomerSug] = useState(false);
  const [focusedLineId, setFocusedLineId] = useState<number | null>(null); // Qaysi qatorga fokus berish kerakligi
  const searchRef = useRef<HTMLDivElement>(null);
  const customerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null); // Mahsulot qidirish input uchun
  const lineQtyRefs = useRef<Map<number, HTMLInputElement>>(new Map()); // Jadval ichidagi miqdor inputlar

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSug(false);
      if (customerRef.current && !customerRef.current.contains(e.target as Node)) setShowCustomerSug(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Mijoz ismlarini lokal orderlardan qidirish
  const searchCustomers = useCallback((query: string) => {
    if (!query.trim()) {
      setCustomerSuggestions([]);
      setShowCustomerSug(false);
      return;
    }
    
    // Orderlardan unique mijoz ismlarini olish
    const uniqueCustomers = Array.from(new Set(orders.map(o => o.customer).filter(c => c && c.trim())));
    
    // Kiritilgan harf bilan boshlanuvchi ismlarni filter qilish
    const filtered = uniqueCustomers.filter(name => 
      name.toLowerCase().startsWith(query.toLowerCase())
    ).sort();
    
    setCustomerSuggestions(filtered);
    setShowCustomerSug(filtered.length > 0);
  }, [orders]);

  // Mijoz ismi yozilganda qidirish
  useEffect(() => {
    if (customer.trim()) {
      searchCustomers(customer);
    } else {
      setCustomerSuggestions([]);
      setShowCustomerSug(false);
    }
  }, [customer, searchCustomers]);

  const handleSearch = (val: string) => {
    setSearch(val);
    if (val.trim()) {
      setSuggestions(products.filter(p => p.name.toLowerCase().includes(val.toLowerCase())));
      setShowSug(true);
      setSelectedSuggestionIndex(-1); // Har safar qidirganda indexni qayta boshlash
    } else {
      setShowSug(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  const selectProduct = (p: Product) => {
    setSearch("");
    setShowSug(false);
    setSelectedSuggestionIndex(-1);
    
    // Mahsulotni jadvalga qo'shish
    const newLineId = Date.now();
    setLines(l => {
      const existing = l.find(x => x.productId === p.id);
      if (existing) {
        // Agar mavjud bo'lsa, fokus shu qatorga
        setFocusedLineId(existing.id);
        return l;
      }
      // Yangi qator qo'shish (Miqdor = 0)
      setFocusedLineId(newLineId);
      return [...l, { id: newLineId, productId: p.id, name: p.name, image: p.image, qty: 0, price: p.price, discount: 0 }];
    });
  };

  // Fokusni jadval ichidagi miqdor inputiga o'tkazish
  useEffect(() => {
    if (focusedLineId !== null) {
      const inputRef = lineQtyRefs.current.get(focusedLineId);
      if (inputRef) {
        setTimeout(() => {
          inputRef.focus();
          inputRef.select();
        }, 100);
      }
      setFocusedLineId(null);
    }
  }, [focusedLineId, lines]);

  const removeLine = (id: number) => setLines(l => l.filter(x => x.id !== id));
  const updateLineQty = (id: number, q: number) => setLines(l => l.map(x => x.id === id ? { ...x, qty: q } : x));

  const subtotal = lines.reduce((s, l) => s + l.qty * l.price * (1 - l.discount / 100), 0);

  // Valyuta kurslari (USD bazasida - 1 USD ga nisbatan)
  const exchangeRates: Record<string, number> = {
    'USD': 1,        // Baza valyuta
    'UZS': 12000,    // 1 USD = 12,000 UZS (12 ming so'm)
    'EUR': 0.84,     // 1 USD = 0.84 EUR
    'RUB': 77.4,     // 1 USD = 77.4 RUB
    'KZT': 522,      // 1 USD = 522 KZT
    'CNY': 7.0       // 1 USD = 7.0 CNY
  };

  // Valyuta belgisini qaytarish
  const getCurrencySymbol = (curr: string) => {
    const symbols: Record<string, string> = {
      'UZS': 'so\'m',
      'USD': '$',
      'EUR': '€',
      'RUB': '₽',
      'KZT': '₸',
      'CNY': '¥'
    };
    return symbols[curr] || curr;
  };

  // Narxlarni to'g'ridan-to'g'ri tanlangan valyutada konvertatsiya qilish
  const convertPrice = (priceInUSD: number, targetCurrency: string): number => {
    // Narxlar USD da saqlangan, keyin boshqa valyutaga konvertatsiya
    const rate = exchangeRates[targetCurrency];
    return priceInUSD * rate;
  };

  // Formatlangan narxni qaytarish
  const formatPrice = (priceInUSD: number, targetCurrency: string): string => {
    // Agar narx 0 yoki yo'q bo'lsa
    if (!priceInUSD || priceInUSD === 0) {
      return '0';
    }
    
    const converted = convertPrice(priceInUSD, targetCurrency);
    
    // USD, EUR, CNY uchun 2 ta o'nlik raqam (vergul bilan format)
    if (targetCurrency === 'USD' || targetCurrency === 'EUR' || targetCurrency === 'CNY') {
      return converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    
    // UZS, RUB, KZT uchun butun son (vergul bilan format)
    return Math.round(converted).toLocaleString('en-US');
  };

  const saveOrder = async () => {
    if (!customer || lines.length === 0) return;
    
    // Yaratish rejimida bo'lsa (yangi), mahsulotlar sonini kamaytirish va saqlash
    if (!existingOrder) {
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
        date: new Date().toISOString(),
        status: "Jo'natilgan" as OrderStatus, // Saqlanganda avtomatik Jo'natilgan bo'ladi
        warehouse, 
        address, 
        comment, 
        currency, 
        lines,
      };
      
      await addOrder(newOrder);
      
      // Formani tozalash lekin o'sha sahifada qolish
      setCustomer("");
      setPhone("");
      setAddress("");
      setComment("");
      setLines([]);
      setSearch("");
      
      // Success message
      setSaved(true);
      setTimeout(() => { setSaved(false); }, 1500);
      
      // Fokusni mijoz ismi inputiga qaytarish
      setTimeout(() => {
        const customerInput = document.querySelector('input[placeholder="Mijoz ismi"]') as HTMLInputElement;
        if (customerInput) {
          customerInput.focus();
        }
      }, 200);
    } else {
      // Tahrirlash rejimi (statusni yoki boshqa narsani saqlash)
      await updateOrder(existingOrder.id, { 
        status, 
        customer, 
        phone, 
        warehouse, 
        address, 
        comment, 
        currency, 
        lines 
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const exportExcel = () => {
    if (lines.length === 0 && !customer) return;
    
    // Excel workbook yaratish
    const wb = XLSX.utils.book_new();
    
    // ==================== RASMGA 100% MOS FORMAT ====================
    
    // Zakas raqami (dinamik)
    const orderNumber = Date.now().toString().slice(-5); // Oxirgi 5 raqam
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;
    
    // Header (rasmga mos)
    const headerData = [
      [`Сборочный лист – Заказ № ${orderNumber} от ${formattedDate}`],
      [""],
      [`Клиент ${customer}`],
      [`Склад: ${warehouse}`],
      [""],
    ];
    
    // Jadval sarlavhasi (rasmga mos)
    const tableHeaders = [["№", "Наименование", "Кол-во уп.", "Тип упаковки", "Кол-во шт.", "Ед. изм."]];
    
    // Mahsulotlar ma'lumotlari (RASMGA MOS)
    const tableData = lines.map((l, i) => {
      const product = products.find(p => p.id === l.productId);
      const packQty = product?.packQuantity || 1;
      const weight = product?.weight || 0;
      
      // MUHIM: Mahsulot nomini rasmga mos formatlash
      // Format: "Mahsulot nomi og'irligi xpaketga_soni" (masalan: "Coca Cola 500g x24")
      const productNameFormatted = weight > 0 
        ? `${l.name} ${weight}г x${packQty}` 
        : `${l.name} x${packQty}`;
      
      // MUHIM: "Kol-vo sht." = Kol-vo upakovok × packQuantity (jami dona soni)
      const totalPieces = l.qty * packQty;
      
      return [
        i,                          // № (0, 1, 2...)
        productNameFormatted,       // Naimenovaniye (rasmga mos: "Coca Cola 500г x24")
        l.qty,                      // Kol-vo upakovok (zakas miqdori: 1.0, 10.0, 2.0...)
        "Упаковка",                 // Tip upakovki
        totalPieces,                // Kol-vo sht. (jami dona: 120, 240, 20...)
        "шт"                        // Ed. izm.
      ];
    });
    
    // "Obshchee kol-vo upakovok" qatori (rasmga mos)
    const totalPackages = lines.reduce((sum, l) => sum + l.qty, 0);
    const footerRow = ["", "", `Общее кол-во уп.`, totalPackages, "", ""];
    
    // Barcha ma'lumotlarni birlashtirish
    const allData = [...headerData, ...tableHeaders, ...tableData, [""], [footerRow]];
    
    const ws = XLSX.utils.aoa_to_sheet(allData);
    
    // Ustunlar kengligi (rasmga mos)
    ws["!cols"] = [
      { wch: 5 },   // №
      { wch: 55 },  // Naimenovaniye (keng - chunki batafsil ma'lumot)
      { wch: 13 },  // Kol-vo up.
      { wch: 18 },  // Tip upakovki
      { wch: 13 },  // Kol-vo sht.
      { wch: 10 }   // Ed. izm.
    ];
    
    // Qatorlar balandligi
    ws["!rows"] = [
      { hpt: 25 },  // Title
      { hpt: 15 },  // Bo'sh
      { hpt: 20 },  // Klient
      { hpt: 20 },  // Sklad
    ];
    
    // Raqamlarni to'g'ri formatda ko'rsatish
    const startRow = 6; // Ma'lumotlar 6-qatordan boshlanadi
    for (let i = 0; i < tableData.length; i++) {
      const rowNum = startRow + i;
      
      // Kol-vo upakovok (C ustuni) - desimal raqam formati (1.0, 10.0)
      const cellC = `C${rowNum}`;
      if (ws[cellC]) {
        ws[cellC].t = 'n'; // number type
        ws[cellC].z = '0.0'; // format: 1.0
      }
      
      // Kol-vo sht. (E ustuni) - butun raqam formati (120, 240)
      const cellE = `E${rowNum}`;
      if (ws[cellE]) {
        ws[cellE].t = 'n'; // number type
      }
    }
    
    XLSX.utils.book_append_sheet(wb, ws, "Заказ");
    
    // ==================== FAYLNI AVTOMATIK YUKLAB OLISH ====================
    
    const fileName = `Заказ_${orderNumber}_${customer.replace(/\s+/g, "_")}_${formattedDate.replace(/\./g, "-")}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <>
      <PageMeta title="Yangi Zakas" description="Yangi zakas qo'shish" />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-visible">
        <div className="p-5">
          <div className="flex flex-wrap items-center gap-2 mb-5 pb-4 border-b border-gray-200 dark:border-gray-800">
            <button 
              type="button" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                saveOrder();
              }} 
              disabled={!customer || lines.length === 0} 
              className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Saqlash
            </button>
            <button 
              type="button" 
              onClick={(e) => {
                e.preventDefault();
                setCustomer(""); 
                setPhone(""); 
                setAddress(""); 
                setComment(""); 
                setLines([]);
              }} 
              className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 transition-colors"
            >
              Tozalash
            </button>
            {saved && <span className="text-sm text-green-600 font-medium">✓ Zakas saqlandi!</span>}
            <div className="flex items-center gap-1.5 ml-1">
              {(["Jo'natilgan", "Jo'natilmagan", "Bekor qilindi"] as OrderStatus[]).map(s => (
                <button key={s} onClick={() => setStatus(s)} className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${status === s ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 text-gray-600 hover:border-blue-400"}`}>
                  {s}
                </button>
              ))}
            </div>
            <button onClick={exportExcel} title="Excel yuklab olish" className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-green-300 px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-50 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9,15 12,18 15,15"/></svg>
              Excel
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-5">
            <div className="space-y-3">
              <div ref={customerRef} className="relative">
                <label className="block text-xs font-medium text-red-500 mb-1">* Mijoz ismi</label>
                <input 
                  value={customer} 
                  onChange={e => setCustomer(e.target.value)} 
                  onFocus={() => customer && setShowCustomerSug(true)}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      // Enter bosilganda avtomatik saqlash
                      if (customer.trim() && lines.length > 0) {
                        await saveOrder();
                      }
                    }
                  }}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-white focus:border-blue-500 focus:outline-none" 
                  placeholder="Ism familiya (A yozib A harifli odamlar chiqadi)" 
                  autoComplete="off"
                  id="customer-input"
                />
                {showCustomerSug && customerSuggestions.length > 0 && (
                  <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white shadow-lg overflow-hidden dark:bg-gray-800">
                    {customerSuggestions.map((name, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => {
                          setCustomer(name);
                          setShowCustomerSug(false);
                        }} 
                        className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-blue-50 text-left transition-colors dark:hover:bg-blue-500/10"
                      >
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          👤
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Sklad nomi</label>
                <input value={warehouse} onChange={e => setWarehouse(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-white focus:border-blue-500 focus:outline-none" />
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Valyuta</label>
                <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-white focus:border-blue-500 focus:outline-none">
                  <option value="USD">🇺🇸 USD - US Dollar</option>
                  <option value="UZS">🇺🇿 UZS - O'zbek so'm</option>
                  <option value="EUR">🇪🇺 EUR - Euro</option>
                  <option value="RUB">🇷🇺 RUB - Russian Ruble</option>
                  <option value="KZT">🇰🇿 KZT - Tenge</option>
                  <option value="CNY">🇨🇳 CNY - Yuan</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Izoh</label>
                <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-white focus:border-blue-500 focus:outline-none resize-none" placeholder="Qo'shimcha ma'lumot..." />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Mahsulot qidirish</label>
            <div className="relative" ref={searchRef} style={{ zIndex: 100 }}>
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" /></svg>
              <input 
                ref={searchInputRef}
                value={search} 
                onChange={e => handleSearch(e.target.value)} 
                onFocus={() => search && setShowSug(true)} 
                onKeyDown={e => {
                  // Arrow Down - pastga tushish
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    if (suggestions.length > 0) {
                      setSelectedSuggestionIndex(prev => 
                        prev < suggestions.length - 1 ? prev + 1 : 0
                      );
                    }
                  }
                  // Arrow Up - tepaga ko'tarilish
                  else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    if (suggestions.length > 0) {
                      setSelectedSuggestionIndex(prev => 
                        prev > 0 ? prev - 1 : suggestions.length - 1
                      );
                    }
                  }
                  // Enter - mahsulotni jadvalga qo'shish
                  else if (e.key === "Enter") {
                    e.preventDefault();
                    if (suggestions.length > 0) {
                      const selectedProductItem = selectedSuggestionIndex >= 0 
                        ? suggestions[selectedSuggestionIndex] 
                        : suggestions[0];
                      selectProduct(selectedProductItem);
                    }
                  }
                }}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white pl-9 pr-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white" 
                placeholder="Mahsulot nomini kiriting..." 
              />
              {showSug && suggestions.length > 0 && (
                <div 
                  className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white shadow-xl dark:bg-gray-800 overflow-auto"
                  style={{ 
                    maxHeight: '500px',
                    minHeight: 'auto'
                  }}
                >
                  {suggestions.map((p, idx) => {
                    const productInDB = products.find(prod => prod.id === p.id);
                    const isSelected = idx === selectedSuggestionIndex;
                    return (
                      <button 
                        key={p.id}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          selectProduct(p);
                        }}
                        className={`flex items-center gap-3 w-full px-4 py-3 text-left transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                          isSelected 
                            ? "bg-blue-50 dark:bg-blue-500/20" 
                            : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        }`}
                      >
                        {p.image ? (
                          <img 
                            src={p.image} 
                            alt={p.name} 
                            className="h-12 w-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600 flex-shrink-0" 
                            onError={e => { e.currentTarget.style.display = "none"; }} 
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xl flex-shrink-0">📦</div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{p.name}</p>
                          <div className="flex items-center gap-3 text-xs">
                            <span className="font-bold text-green-600 dark:text-green-400">
                              {formatPrice(p.price, currency)} {getCurrencySymbol(currency)}
                            </span>
                            {productInDB && productInDB.weight > 0 && (
                              <span className="text-gray-600 dark:text-gray-400">• {productInDB.weight}g</span>
                            )}
                            {productInDB && productInDB.packQuantity > 0 && (
                              <span className="text-blue-600 dark:text-blue-400 font-semibold">• {productInDB.packQuantity} dona</span>
                            )}
                          </div>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
                          p.stock === 0 
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" 
                            : p.stock < 10 
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" 
                              : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        }`}>
                          {p.stock} ta
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 dark:bg-gray-800/40 dark:border-gray-800">
                <tr>
                  {["Rasm", "Mahsulot", "Miqdor", "Narx", "Gramm", "Jami", ""].map(h => <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {lines.length === 0 ? <tr><td colSpan={7} className="py-8 text-center text-gray-400 text-sm">Mahsulot qidiring va tanlang</td></tr> : lines.map(line => {
                    const productInDB = products.find(p => p.id === line.productId);
                    const weight = productInDB?.weight || 0;
                    return (
                      <tr key={line.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                        <td className="px-4 py-2.5">
                          {line.image ? (
                            <img 
                              src={line.image} 
                              alt={line.name} 
                              className="h-10 w-10 rounded-lg object-cover cursor-pointer" 
                              onMouseEnter={() => {
                                const timer = window.setTimeout(() => {
                                  setZoomedImage(line.image);
                                }, 2000); // 2 soniya
                                setHoverImageTimer(timer);
                              }}
                              onMouseLeave={() => {
                                if (hoverImageTimer !== null) {
                                  window.clearTimeout(hoverImageTimer);
                                  setHoverImageTimer(null);
                                }
                                setZoomedImage(null);
                              }}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">📦</div>
                          )}
                        </td>
                        <td className="px-4 py-2.5 font-medium text-gray-800 dark:text-white">{line.name}</td>
                        <td className="px-4 py-2.5">
                          <input 
                            type="number" 
                            min={0} 
                            value={line.qty} 
                            ref={(el) => {
                              if (el) {
                                lineQtyRefs.current.set(line.id, el);
                              } else {
                                lineQtyRefs.current.delete(line.id);
                              }
                            }}
                            onChange={e => updateLineQty(line.id, Number(e.target.value))} 
                            onKeyDown={e => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                e.stopPropagation();
                                // Enter bosilganda qidirish joyiga qaytish
                                if (searchInputRef.current) {
                                  searchInputRef.current.focus();
                                }
                              }
                            }}
                            className="w-20 rounded border border-gray-300 px-2 py-1 text-sm text-center text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white" 
                          />
                        </td>
                        <td className="px-4 py-2.5 text-gray-600 dark:text-gray-300">{formatPrice(line.price, currency)} {getCurrencySymbol(currency)}</td>
                        <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400">{weight > 0 ? `${weight}g` : "—"}</td>
                        <td className="px-4 py-2.5 font-semibold text-gray-800 dark:text-white">{formatPrice(Math.round(line.qty * line.price * (1 - line.discount / 100)), currency)} {getCurrencySymbol(currency)}</td>
                        <td className="px-4 py-2.5"><button type="button" onClick={() => removeLine(line.id)} className="p-1 text-gray-400 hover:text-red-500"><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {lines.length > 0 && (
            <div className="mt-4 flex justify-end">
              <div className="w-64 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="flex justify-between px-4 py-2.5 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-sm text-gray-500">Oraliq jami:</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white">{formatPrice(Math.round(subtotal), currency)} {getCurrencySymbol(currency)}</span>
                </div>
                <div className="flex justify-between px-4 py-3 bg-blue-50 dark:bg-blue-500/10">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Jami:</span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{formatPrice(Math.round(subtotal), currency)} {getCurrencySymbol(currency)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
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
    </>
  );
}
