// src/lib/schema.ts
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  unit: z.string().min(1, 'Единица измерения обязательна'),
  totalQuantity: z.number().int().nonnegative('Количество не может быть отрицательным'),
  categoryId: z.string().min(1, 'Выберите категорию'),
  supplierId: z.string().min(1, 'Выберите поставщика'),
  description: z.string().nullable().optional(),
  isVisible: z.boolean(), // убираем .default() - делаем обязательным
});

export type ProductFormData = z.infer<typeof productSchema>;