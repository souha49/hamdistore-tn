import type { Product } from '../lib/database.types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const hasStock = product.stock_quantity > 0;

  return (
    <button
      onClick={onClick}
      className="group bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 text-left w-full border border-gray-100"
    >
      <div className="aspect-square bg-gray-100 overflow-hidden relative">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            Pas d'image
          </div>
        )}
        {!hasStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm sm:text-base">Rupture de stock</span>
          </div>
        )}
      </div>
      <div className="p-2 sm:p-3">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-gray-700 transition-colors text-sm sm:text-base">
          {product.name}
        </h3>
        <p className="text-base sm:text-lg font-bold text-gray-900">{product.price.toFixed(2)} TND</p>
        <p className={`text-xs sm:text-sm font-medium mt-0.5 ${hasStock ? 'text-green-600' : 'text-red-600'}`}>
          {hasStock ? 'En stock' : 'Rupture de stock'}
        </p>
      </div>
    </button>
  );
}
