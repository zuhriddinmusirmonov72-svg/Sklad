export type OrderStatus = "Jo'natilgan" | "Jo'natilmagan" | "Bekor qilindi";

export interface Product {
  id: string;       // MongoDB _id
  _id?: string;
  name: string;
  image: string;
  stock: number;
  price: number;
  category: string;
  weight: number;
  packQuantity: number;
}

export interface OrderLine {
  id: string | number;
  productId: string;  // MongoDB _id
  name: string;
  image: string;
  qty: number;
  price: number;
  discount: number;
}

export interface Order {
  id: string;       // MongoDB _id
  _id?: string;
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
  isWarehousePrinted?: boolean;
}
