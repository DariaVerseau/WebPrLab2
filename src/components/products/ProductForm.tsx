'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { productSchema, type ProductFormData } from '@/lib/schema';
import { createProduct, updateProduct, getCategories, getSuppliers } from '@/lib/api';

interface ProductFormProps {
  initialData?: {
    id?: string;
    name: string;
    unit: string;
    totalQuantity: number;
    categoryId: string;
    supplierId: string;
    description?: string | null;
    isVisible?: boolean;
  };
  productId?: string;
}

export function ProductForm({ initialData, productId }: ProductFormProps) {
  const router = useRouter();
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
      description: initialData?.description ?? '',
      isVisible: initialData?.isVisible ?? true,
    },
  });

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
      router.push('/products');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Ошибка сохранения');
    }
  }

  if (isLoading) {
    return <div className="flex justify-center py-8">Загрузка...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название *</FormLabel>
              <FormControl>
                <Input placeholder="Введите название товара" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Единица измерения *</FormLabel>
                <FormControl>
                  <Input placeholder="шт, кг, л, м" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="totalQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Количество *</FormLabel>
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
        </div>

        <div className="grid grid-cols-2 gap-4">
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
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Описание товара (необязательно)" 
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isVisible"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Активность</FormLabel>
                <div className="text-sm text-gray-500">
                  Отображать товар в каталоге
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Сохранение...' : productId ? 'Обновить' : 'Создать'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/products')}
          >
            Отмена
          </Button>
        </div>
      </form>
    </Form>
  );
}