export interface Product {
  id: string;
  name: string;
  unit: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  supplierId: string;
  supplier?: {
    id: string;
    name: string;
  };
  totalQuantity: number;
  isVisible: boolean;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactInfo?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}