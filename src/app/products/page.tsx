import { getProducts, getCategories, getSuppliers } from '@/lib/api';
import { ProductsTable } from '@/components/products/ProductsTable';
import { ProductsFilters } from '@/components/products/ProductsFilters';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // ✅ Await для searchParams (требование Next.js 15)
  const params = await searchParams;
  
  const page = Number(params.page) || 1;
  const pageSize = Number(params.pageSize) || 10;
  const search = params.search?.toString();
  const categoryId = params.categoryId?.toString();
  const supplierId = params.supplierId?.toString();
  const isVisible = params.isVisible?.toString();
  const sortBy = params.sortBy?.toString();
  const sortOrder = params.sortOrder?.toString() as 'asc' | 'desc' | undefined;
  
  // Преобразуем isVisible в boolean для API
  let isVisibleBool: boolean | undefined;
  if (isVisible === 'true') isVisibleBool = true;
  else if (isVisible === 'false') isVisibleBool = false;
  
  const [productsData, categories, suppliers] = await Promise.all([
    getProducts({ 
      page, 
      pageSize, 
      search, 
      categoryId, 
      supplierId,
      isVisible: isVisibleBool
    }),
    getCategories(),
    getSuppliers(),
  ]);
  
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Товары</h1>
          <p className="text-gray-500 mt-1">Управление товарами в системе</p>
        </div>
        <Link href="/products/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Добавить товар
          </Button>
        </Link>
      </div>
      
      <ProductsFilters categories={categories} suppliers={suppliers} />
      
      <ProductsTable
        initialData={productsData.items}
        totalCount={productsData.totalCount}
        page={page}
        pageSize={pageSize}
      />
    </div>
  );
}