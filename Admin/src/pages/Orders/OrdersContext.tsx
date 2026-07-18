import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, Order } from "./types";

interface OrdersContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  isLoadingData: boolean;
  refreshData: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addOrder: (order: Omit<Order, 'id' | 'orderNumber'>) => Promise<Order | undefined>;
  updateOrder: (id: string, order: Partial<Order>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

// Backend API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// MongoDB _id ni id ga normalize qilish
function normalize<T extends { _id?: string; id?: string }>(doc: T): T {
  if (doc._id && !doc.id) doc.id = doc._id;
  return doc;
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Ma'lumotlarni backenddan yuklash
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoadingData(true);
    try {
      // Mahsulotlarni yuklash
      const productsRes = await fetch(`${API_URL}/api/products`);
      const productsData = await productsRes.json();
      if (productsData.success) {
        setProducts(productsData.data.map((p: Product) => normalize(p)));
      }

      // Buyurtmalarni yuklash
      const ordersRes = await fetch(`${API_URL}/api/orders`);
      const ordersData = await ordersRes.json();
      if (ordersData.success) {
        setOrders(ordersData.data.map((o: Order) => normalize(o)));
      }
    } catch (error) {
      console.error('Backend bilan bog\'lanishda xatolik:', error);
    } finally {
      setIsLoadingData(false);
    }
  }

  // Mahsulot qo'shish
  async function addProduct(product: Omit<Product, 'id'>) {
    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => [...prev, normalize(data.data)]);
      }
    } catch (error) {
      console.error('Mahsulot qo\'shishda xatolik:', error);
    }
  }

  // Mahsulotni yangilash
  async function updateProduct(id: string, product: Partial<Product>) {
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.map(p => p.id === id ? normalize(data.data) : p));
      }
    } catch (error) {
      console.error('Mahsulotni yangilashda xatolik:', error);
    }
  }

  // Mahsulotni o'chirish
  async function deleteProduct(id: string) {
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Mahsulotni o\'chirishda xatolik:', error);
    }
  }

  // Buyurtma qo'shish
  async function addOrder(order: Omit<Order, 'id' | 'orderNumber'>) {
    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => [...prev, normalize(data.data)]);
        return normalize(data.data) as Order;
      }
    } catch (error) {
      console.error('Buyurtma qo\'shishda xatolik:', error);
    }
    return undefined;
  }

  // Buyurtmani yangilash
  async function updateOrder(id: string, order: Partial<Order>) {
    try {
      const res = await fetch(`${API_URL}/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === id ? normalize(data.data) : o));
      }
    } catch (error) {
      console.error('Buyurtmani yangilashda xatolik:', error);
    }
  }

  // Buyurtmani o'chirish
  async function deleteOrder(id: string) {
    try {
      const res = await fetch(`${API_URL}/api/orders/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.filter(o => o.id !== id));
      }
    } catch (error) {
      console.error('Buyurtmani o\'chirishda xatolik:', error);
    }
  }

  return (
    <OrdersContext.Provider value={{ 
      products, 
      setProducts, 
      orders, 
      setOrders, 
      isLoadingData,
      refreshData: loadData,
      addProduct,
      updateProduct,
      deleteProduct,
      addOrder,
      updateOrder,
      deleteOrder
    }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) throw new Error("useOrders must be used within OrdersProvider");
  return context;
}
