'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function ProductTable({ initialData, searchParams }: { initialData: any; searchParams: any }) {
  const router = useRouter();
  const pathname = usePathname();
  const currentParams = useSearchParams();

  const updateUrl = (newParams: Record<string, string | undefined>) => {
    const params = new URLSearchParams(currentParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value == null) params.delete(key);
      else params.set(key, value);
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {/* Поиск и фильтры */}
      <div className="flex gap-2">
        <input
          placeholder="Поиск..."
          defaultValue={searchParams.search}
          onChange={(e) => updateUrl({ search: e.target.value || undefined, page: '1' })}
          className="border p-2 rounded"
        />
        <select
          value={searchParams.isActive ?? ''}
          onChange={(e) => updateUrl({ isActive: e.target.value || undefined, page: '1' })}
          className="border p-2 rounded"
        >
          <option value="">Все</option>
          <option value="true">Активные</option>
          <option value="false">Неактивные</option>
        </select>
      </div>

      {/* Таблица */}
      <div className="rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Название</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Цена</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Остаток</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {initialData.items.map((item: any) => (
              <tr key={item.id}>
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4">{item.price} ₽</td>
                <td className="px-6 py-4">{item.stock}</td>
                <td className="px-6 py-4">
                  <Button variant="link" asChild>
                    <Link href={`/products/${item.id}/edit`}>Редактировать</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Пагинация */}
      <div className="flex justify-center gap-1">
        {Array.from({ length: initialData.totalPages }, (_, i) => i + 1).map((pageNum) => (
          <Button
            key={pageNum}
            size="sm"
            variant={pageNum === initialData.page ? 'default' : 'outline'}
            onClick={() => updateUrl({ page: String(pageNum) })}
          >
            {pageNum}
          </Button>
        ))}
      </div>
    </div>
  );
}