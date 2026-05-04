export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  description?: string;
  isActive: boolean;
};

export type PagedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};