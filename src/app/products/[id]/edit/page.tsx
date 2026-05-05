import { getProduct, getCategories, getSuppliers } from '@/lib/api';
import { ProductForm } from '@/components/products/ProductForm';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const [product, categories, suppliers] = await Promise.all([
    getProduct(id),
    getCategories(),
    getSuppliers(),
  ]);
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Редактирование товара</h1>
        <p className="text-gray-500 mt-1">Измените данные товара</p>
      </div>
      
      <ProductForm
        initialData={product}
        productId={id}
      />
    </div>
  );
}