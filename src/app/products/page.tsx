import { Suspense } from 'react';
import Link from 'next/link';
import { ProductTable } from '@/components/products/ProductTable';
import { getProducts } from '@/lib/api';

export default async function ProductsPage({ searchParams }: { searchParams: any }) {
  const page = Number(searchParams.page) || 1;
  const pageSize = Number(searchParams.pageSize) || 10;
  const isActive = searchParams.isActive === 'true' ? true : undefined;

  let data;
  try {
    data = await getProducts({
      page,
      pageSize,
      search: searchParams.search,
      sortBy: searchParams.sortBy,
      sortOrder: searchParams.sortOrder,
      isActive,
    });
  } catch (error) {
    console.error(error);
    return <div className="p-6 text-red-600">Ошибка загрузки данных</div>;
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Товары</h1>
        <Link href="/products/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          + Новый товар
        </Link>
      </div>
      <Suspense fallback={<div>Загрузка...</div>}>
        <ProductTable initialData={data} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}