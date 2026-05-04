// src/lib/api.ts
import { Product, PagedResponse } from '@/types';
import { ProductFormData } from '@/lib/schema';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE) throw new Error('NEXT_PUBLIC_API_URL is not set');

export async function getProducts(params: Record<string, string | number | boolean | undefined>) {
  const url = new URL(`${API_BASE}/products`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) throw new Error('Ошибка загрузки товаров');
  return res.json() as Promise<PagedResponse<Product>>;
}

export async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Товар не найден');
  return res.json();
}

export async function getCategories() {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error('Не удалось загрузить категории');
  return res.json() as Promise<{ id: string; name: string }[]>;
}

export async function getSuppliers() {
  const res = await fetch(`${API_BASE}/suppliers`);
  if (!res.ok) throw new Error('Не удалось загрузить поставщиков');
  return res.json() as Promise<{ id: string; name: string }[]>;
}

export async function createProduct(data: ProductFormData): Promise<Product> {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Не удалось создать товар');
  return res.json();
}

export async function updateProduct(id: string, data: ProductFormData): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Не удалось обновить товар');
  return res.json();
}