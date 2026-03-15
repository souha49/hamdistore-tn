import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { Product, Category } from '../lib/database.types';
import { ProductCard } from '../components/ProductCard';

interface CategoryPageProps {
  onNavigate: (path: string) => void;
  categorySlug: string;
}

export function CategoryPage({ onNavigate, categorySlug }: CategoryPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoryProducts();
  }, [categorySlug]);

  const loadCategoryProducts = async () => {
    try {
      setLoading(true);
      const categories = await api.categories.getAll();
      const currentCategory = categories.find((c) => c.slug === categorySlug);

      if (currentCategory) {
        setCategory(currentCategory);
        const productsData = await api.products.getByCategory(currentCategory.id);
        setProducts(productsData);
      }
    } catch (error) {
      console.error('Error loading category products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Catégorie introuvable</h1>
          <button
            onClick={() => onNavigate('/shop')}
            className="text-gray-600 hover:text-gray-900"
          >
            Retour à la boutique
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{category.name}</h1>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => onNavigate(`/product/${product.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucun produit dans cette catégorie</p>
          </div>
        )}
      </div>
    </div>
  );
}
