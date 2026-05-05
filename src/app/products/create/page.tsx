import { ProductForm } from '@/components/products/ProductForm';

export default function CreateProductPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Добавление товара</h1>
        <p className="text-gray-500 mt-1">Заполните данные нового товара</p>
      </div>
      
      <ProductForm />
    </div>
  );
}