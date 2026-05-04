// src/lib/schema.ts
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  unit: z.string().min(1, 'Единица измерения обязательна'),
  totalQuantity: z.number().int().nonnegative('Остаток ≥ 0'),
  categoryId: z.string().uuid('Неверный формат CategoryId'),
  supplierId: z.string().uuid('Неверный формат SupplierId'),
});

export type ProductFormData = z.infer<typeof productSchema>;