'use client';

import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Pencil,
} from 'lucide-react';
import { Product } from '@/types';
import { updateProduct } from '@/lib/api';
import { toast } from 'sonner';

interface ProductsTableProps {
  initialData: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export function ProductsTable({ initialData, totalCount, page, pageSize }: ProductsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const totalPages = Math.ceil(totalCount / pageSize);
  
  const updateParams = (updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  };
  
  const goToPage = (newPage: number) => {
    updateParams({ page: newPage });
  };
  
  const handleToggleVisibility = async (product: Product) => {
    try {
      await updateProduct(product.id, {
        name: product.name,
        unit: product.unit,
        totalQuantity: product.totalQuantity,
        categoryId: product.categoryId,
        supplierId: product.supplierId,
        isVisible: !product.isVisible,
      });
      toast.success(`Товар ${!product.isVisible ? 'активирован' : 'деактивирован'}`);
      router.refresh();
    } catch {
      toast.error('Ошибка при изменении статуса');
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[150px]">Название</TableHead>
              <TableHead className="min-w-[80px]">Ед. изм.</TableHead>
              <TableHead className="min-w-[120px]">Категория</TableHead>
              <TableHead className="min-w-[150px]">Поставщик</TableHead>
              <TableHead className="min-w-[100px] text-right">Количество</TableHead>
              <TableHead className="min-w-[100px]">Статус</TableHead>
              <TableHead className="min-w-[120px] text-right">Дата создания</TableHead>
              <TableHead className="min-w-[100px] text-center">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  Товары не найдены
                </TableCell>
              </TableRow>
            ) : (
              initialData.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.unit}</TableCell>
                  <TableCell>{product.category?.name || '-'}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={product.supplier?.name}>
                    {product.supplier?.name || '-'}
                  </TableCell>
                  <TableCell className="text-right">{product.totalQuantity}</TableCell>
                  <TableCell>
                    <Badge variant={product.isVisible ? 'default' : 'secondary'}>
                      {product.isVisible ? 'Активен' : 'Неактивен'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Switch
                        checked={product.isVisible}
                        onCheckedChange={() => handleToggleVisibility(product)}
                      />
                      <Link href={`/products/${product.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 0 && (
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="text-sm text-gray-500">
            Всего: {totalCount} товаров
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => goToPage(1)} disabled={page === 1}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => goToPage(page - 1)} disabled={page === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="flex items-center px-4 text-sm whitespace-nowrap">
              Страница {page} из {totalPages}
            </span>
            <Button variant="outline" size="sm" onClick={() => goToPage(page + 1)} disabled={page === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => goToPage(totalPages)} disabled={page === totalPages}>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsTable;