import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { Product } from '../lib/database.types';
import { ProductCard } from '../components/ProductCard';
import { useSettings } from '../contexts/SettingsContext';

interface ShopPageProps {
  onNavigate: (path: string) => void;
  searchQuery?: string;
}

export function ShopPage({ onNavigate, searchQuery }: ShopPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { settings } = useSettings();

  useEffect(() => {
    loadProducts();
  }, [searchQuery, selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      if (searchQuery) {
        const data = await api.products.search(searchQuery);
        setProducts(data);
      } else if (selectedCategory) {
        const data = await api.products.getByCategoryName(selectedCategory);
        setProducts(data);
      } else {
        const data = await api.products.getAll();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-20 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 uppercase tracking-wide">Collections</h2>
          </div>
          <div className="grid grid-cols-4 gap-3 md:flex md:justify-center md:items-center md:gap-12 mb-16">
            {[
              {
                label: 'MEN',
                category: 'homme',
                image: '/WhatsApp_Image_2026-02-28_at_12.jpeg'
              },
              {
                label: 'WOMEN',
                category: 'femme',
                image: '/WhatsApp_Image_2026-02-28_at_12.jpeg'
              },
              {
                label: 'SPORT',
                category: 'sport',
                image: '/WhatsApp_Image_2026-02-28_at_12.jpeg'
              },
              {
                label: 'ENFANT',
                category: 'enfant',
                image: '/WhatsApp_Image_2026-02-28_at_12.jpeg'
              },
            ].map((category) => (
              <button
                key={category.category}
                onClick={() => setSelectedCategory(category.category)}
                className="flex flex-col items-center gap-2 md:gap-3 group"
              >
                <div className={`relative w-16 h-16 md:w-32 md:h-32 rounded-full overflow-hidden border-4 transition-all duration-300 transform group-hover:scale-105 ${
                  selectedCategory === category.category ? 'border-gray-900' : 'border-gray-200 group-hover:border-gray-900'
                }`}>
                  <img
                    src={category.image}
                    alt={category.label}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className={`text-xs md:text-sm font-bold uppercase tracking-wider ${
                  selectedCategory === category.category ? 'text-gray-900' : 'text-gray-600'
                }`}>
                  {category.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {searchQuery
              ? 'Résultats de recherche'
              : selectedCategory
                ? selectedCategory === 'homme'
                  ? 'MEN'
                  : selectedCategory === 'femme'
                    ? 'WOMEN'
                    : selectedCategory === 'enfant'
                      ? 'ENFANT'
                      : 'SPORT'
                : 'Tous les produits'}
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900"></div>
            </div>
          ) : products.length > 0 ? (
            <div
              className="grid gap-3 sm:gap-4"
              style={{
                gridTemplateColumns: `repeat(${settings?.products_per_row_mobile || 2}, minmax(0, 1fr))`,
              }}
            >
              <style>
                {`
                  @media (min-width: 768px) {
                    .grid {
                      grid-template-columns: repeat(${settings?.products_per_row_tablet || 3}, minmax(0, 1fr)) !important;
                    }
                  }
                  @media (min-width: 1024px) {
                    .grid {
                      grid-template-columns: repeat(${settings?.products_per_row_desktop || 4}, minmax(0, 1fr)) !important;
                    }
                  }
                `}
              </style>
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
              <p className="text-gray-500 text-lg">
                {searchQuery ? 'Aucun produit trouvé' : 'Aucun produit disponible'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
