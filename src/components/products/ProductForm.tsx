'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { productSchema, type ProductFormData } from '@/lib/schema';
import { createProduct, updateProduct, getCategories, getSuppliers } from '@/lib/api';

export function ProductForm({
  initialData,
  productId,
}: {
  initialData?: any;
  productId?: string;
}) {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      unit: initialData?.unit ?? '',
      totalQuantity: initialData?.totalQuantity ?? 0,
      categoryId: initialData?.categoryId ?? '',
      supplierId: initialData?.supplierId ?? '',
    },
  });

  // Загружаем категории и поставщиков при монтировании
  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, sups] = await Promise.all([getCategories(), getSuppliers()]);
        setCategories(cats);
        setSuppliers(sups);
      } catch (error: any) {
        toast.error(error.message || 'Ошибка загрузки справочников');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  async function onSubmit(values: ProductFormData) {
    try {
      if (productId) {
        await updateProduct(productId, values);
        toast.success('Товар обновлён!');
      } else {
        await createProduct(values);
        toast.success('Товар создан!');
      }
      // Перенаправление можно сделать через router.push
    } catch (error: any) {
      toast.error(error.message || 'Ошибка сохранения');
    }
  }

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название *</FormLabel>
              <FormControl>
                <Input placeholder="Ноутбук Dell" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Unit */}
        <FormField
          control={form.control}
          name="unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Единица измерения *</FormLabel>
              <FormControl>
                <Input placeholder="шт, кг, л" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Total Quantity */}
        <FormField
          control={form.control}
          name="totalQuantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Общее количество *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Категория *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Supplier */}
        <FormField
          control={form.control}
          name="supplierId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Поставщик *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите поставщика" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {suppliers.map((sup) => (
                    <SelectItem key={sup.id} value={sup.id}>
                      {sup.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Сохранение...' : productId ? 'Обновить' : 'Создать'}
        </Button>
      </form>
    </Form>
  );
}