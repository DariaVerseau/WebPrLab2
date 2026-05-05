import { Suspense } from 'react';
import Link from 'next/link';
import { ProductsTable } from '@/components/products/ProductsTable';
import { getProducts } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default async function ProductsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const params = await searchParams;
  
  const page = Number(params.page) || 1;
  const pageSize = Number(params.pageSize) || 10;
  const search = params.search?.toString();
  const categoryId = params.categoryId?.toString();
  const supplierId = params.supplierId?.toString();
  const isVisible = params.isVisible?.toString();
  const sortBy = params.sortBy?.toString();
  const sortOrder = params.sortOrder?.toString() as 'asc' | 'desc' | undefined;
  
  let isVisibleBool: boolean | undefined;
  if (isVisible === 'true') isVisibleBool = true;
  else if (isVisible === 'false') isVisibleBool = false;
  
  const productsData = await getProducts({ 
    page, 
    pageSize, 
    search, 
    categoryId, 
    supplierId,
    isVisible: isVisibleBool
  });
  
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
      
      <Suspense fallback={<div>Загрузка...</div>}>
        <ProductsTable
          initialData={productsData.items}
          totalCount={productsData.totalCount}
          page={page}
          pageSize={pageSize}
          // ❌ НЕ передавайте searchParams сюда
        />
      </Suspense>
    </div>
  );
}