import { ProductForm } from '@/components/products/ProductForm';

export default function CreateProductPage() {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Создать товар</h1>
      <ProductForm />
    </div>
  );
}