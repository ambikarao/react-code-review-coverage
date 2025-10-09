import { Product } from "../models/types";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const DEMO_PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Wireless Headphones",
    description: "Noise-cancelling over-ear headphones",
    price: 129.99,
    imageUrl: "/logo192.png",
  },
  {
    id: "p2",
    title: "Smart Watch",
    description: "Fitness tracking with heart rate monitor",
    price: 89.99,
    imageUrl: "/logo192.png",
  },
  {
    id: "p3",
    title: "Portable Speaker",
    description: "Water-resistant Bluetooth speaker",
    price: 49.99,
    imageUrl: "/logo192.png",
  },
];

export async function fetchProducts(): Promise<Product[]> {
  await delay(200);
  return DEMO_PRODUCTS;
}

export async function getProductById(productId: string): Promise<Product | undefined> {
  await delay(100);
  return DEMO_PRODUCTS.find(p => p.id === productId);
}


