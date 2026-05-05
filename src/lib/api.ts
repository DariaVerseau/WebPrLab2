// src/lib/api.ts
import { ProductFormData } from '@/lib/schema';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE) throw new Error('NEXT_PUBLIC_API_URL is not set');

// Получение списка товаров с фильтрацией
export async function getProducts(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: string;
  supplierId?: string;
  isVisible?: boolean;
  // удалены sortBy, sortOrder
}) {
  const url = new URL(`${API_BASE}/products/filtered`);
  
  if (params.page) url.searchParams.set('page', String(params.page));
  if (params.pageSize) url.searchParams.set('pageSize', String(params.pageSize));
  if (params.search) url.searchParams.set('search', params.search);
  if (params.categoryId) url.searchParams.set('categoryId', params.categoryId);
  if (params.supplierId) url.searchParams.set('supplierId', params.supplierId);
  if (params.isVisible !== undefined) url.searchParams.set('isVisible', String(params.isVisible));
  
  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) throw new Error('Ошибка загрузки товаров');
  return res.json();
}

// Получение одного товара
export async function getProduct(id: string) {
  const res = await fetch(`${API_BASE}/products/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Товар не найден');
  return res.json();
}

// Получение категорий
export async function getCategories() {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error('Не удалось загрузить категории');
  return res.json();
}

// Получение поставщиков
export async function getSuppliers() {
  const res = await fetch(`${API_BASE}/suppliers`);
  if (!res.ok) throw new Error('Не удалось загрузить поставщиков');
  return res.json();
}

// Создание товара
export async function createProduct(data: ProductFormData) {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Не удалось создать товар');
  }
  return res.json();
}

// Обновление товара
export async function updateProduct(id: string, data: Partial<ProductFormData>) {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, id }),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Не удалось обновить товар');
  }
  return res.json();
}

// Удаление товара
export async function deleteProduct(id: string) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Не удалось удалить товар');
  return res.json();
}