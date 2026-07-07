export type OrderStatus = "Jo'natilgan" | "Jo'natilmagan" | "Bekor qilindi";

export interface Product {
  id: number;
  name: string;
  image: string;
  stock: number;
  price: number;
  category: string;
  weight: number; // gramda
  packQuantity: number; // quti ichida nechta dona
}

export interface OrderLine {
  id: number;
  productId: number;
  name: string;
  image: string;
  qty: number;
  price: number;
  discount: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  customer: string;
  phone: string;
  date: string;
  status: OrderStatus;
  warehouse: string;
  address: string;
  comment: string;
  currency: string;
  lines: OrderLine[];
}
