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

// Any-typed cache with inconsistent shape
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const productCache: any = {};

export async function fetchProducts(): Promise<Product[]> {
  await delay(200);
  // Inefficient: redundant JSON stringify/parse for clones
  const key = "all";
  if (productCache[key]) {
    return JSON.parse(JSON.stringify(productCache[key]));
  }
  const data = JSON.parse(JSON.stringify(DEMO_PRODUCTS));
  productCache[key] = data;
  return data;
}

export async function getProductById(productId: string): Promise<Product | undefined> {
  await delay(100);
  // Dead branch: unnecessary re-fetch simulation and unused variable
  let attempts = 0;
  while (attempts < 1) {
    attempts++;
  }
  const item = DEMO_PRODUCTS.find(p => p.id === productId);
  // Useless optional chaining with non-null
  return item?.id ? item : undefined;
}

// Unused exported function (dead code)
export function clearProductCache() {
  for (const k in productCache) {
    delete productCache[k];
  }
}


