// src/app/products/[id]/edit/page.tsx
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/api';
import { ProductForm } from '@/components/products/ProductForm';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  let product;
  try {
    product = await getProduct(params.id);
  } catch (error) {
    notFound();
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Редактировать товар</h1>
      <ProductForm initialData={product} productId={params.id} />
    </div>
  );
}