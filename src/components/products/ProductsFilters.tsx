'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';

interface ProductsFiltersProps {
  categories: { id: string; name: string }[];
  suppliers: { id: string; name: string }[];
}

export function ProductsFilters({ categories, suppliers }: ProductsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') || '');
  const [supplierId, setSupplierId] = useState(searchParams.get('supplierId') || '');
  const [isVisible, setIsVisible] = useState(searchParams.get('isVisible') || '');
  
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (value) params.set('search', value);
      else params.delete('search');
      params.set('page', '1');
      router.push(`${pathname}?${params.toString()}`);
    }, 300);
  }, [router, pathname, searchParams]);
  
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);
  
  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') params.set('categoryId', value);
    else params.delete('categoryId');
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };
  
  const handleSupplierChange = (value: string) => {
    setSupplierId(value);
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') params.set('supplierId', value);
    else params.delete('supplierId');
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };
  
  const handleVisibilityChange = (value: string) => {
    setIsVisible(value);
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') params.set('isVisible', value);
    else params.delete('isVisible');
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };
  
  const clearFilters = () => {
    setSearch('');
    setCategoryId('');
    setSupplierId('');
    setIsVisible('');
    router.push(pathname);
  };
  
  const hasFilters = search || categoryId || supplierId || isVisible;
  
  return (
    <div className="space-y-4">
      {/* Первая строка - поиск и фильтры */}
      <div className="flex flex-wrap gap-3 items-end">
        {/* Поиск - занимает больше места */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Поиск по названию..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        {/* Фильтр по видимости - самый короткий */}
        <div className="w-[140px] shrink-0">
          <Select value={isVisible} onValueChange={handleVisibilityChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Все" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все</SelectItem>
              <SelectItem value="true">Активные</SelectItem>
              <SelectItem value="false">Неактивные</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Кнопка сброса */}
        {hasFilters && (
          <Button variant="outline" onClick={clearFilters} className="shrink-0 gap-2">
            <X className="h-4 w-4" />
            Сбросить фильтры
          </Button>
        )}
      </div>
      
      {/* Вторая строка - категория и поставщик */}
      <div className="flex flex-wrap gap-3">
        <div className="w-[220px] shrink-0">
          <Select value={categoryId} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Все категории" />
            </SelectTrigger>
            <SelectContent className="max-w-[300px]">
              <SelectItem value="all">Все категории</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id} className="truncate">
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-[220px] shrink-0">
          <Select value={supplierId} onValueChange={handleSupplierChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Все поставщики" />
            </SelectTrigger>
            <SelectContent className="max-w-[300px]">
              <SelectItem value="all">Все поставщики</SelectItem>
              {suppliers.map((sup) => (
                <SelectItem key={sup.id} value={sup.id} className="truncate">
                  {sup.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export default ProductsFilters;