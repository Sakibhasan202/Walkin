export interface InventoryItem {
  id: string;
  name: string;
  type: string;
  price: number;
  stock: number;
  imageUrl: string;
  createdAt: number;
}

export interface KPIStats {
  totalRevenue: number;
  totalSales: number;
  totalBuy: number;
  salesGrowth: number;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  POS = 'POS',
  INVENTORY = 'INVENTORY',
  PURCHASE = 'PURCHASE',
  HISTORY = 'HISTORY',
  SETTINGS = 'SETTINGS'
}

export type NewItemData = Omit<InventoryItem, 'id' | 'createdAt' | 'imageUrl'>;

export interface CartItem extends InventoryItem {
  cartQuantity: number;
}

export type PaymentMethod = 'CASH' | 'CARD' | 'QR';

export interface TransactionItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Transaction {
  id: string;
  type: 'SALE' | 'PURCHASE';
  date: number;
  items: TransactionItem[];
  totalAmount: number;
  paymentMethod?: PaymentMethod;
}