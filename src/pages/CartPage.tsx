import { Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface CartPageProps {
  onNavigate: (path: string) => void;
}

export function CartPage({ onNavigate }: CartPageProps) {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Votre panier est vide</h1>
            <p className="text-gray-600 mb-8">
              Découvrez notre collection et ajoutez des articles à votre panier
            </p>
            <button
              onClick={() => onNavigate('/shop')}
              className="inline-block px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              Continuer vos achats
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.size}`}
                className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  {item.product.images && item.product.images.length > 0 ? (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      Pas d'image
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">Pointure: {item.size}</p>
                  <p className="text-lg font-bold text-gray-900">
                    {item.product.price.toFixed(2)} TND
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.size, item.quantity - 1)
                    }
                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded font-semibold transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.size, item.quantity + 1)
                    }
                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded font-semibold transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.product.id, item.size)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          <div>
            <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Résumé de la commande</h2>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}`}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-gray-600">
                      {item.product.name} x{item.quantity}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {(item.product.price * item.quantity).toFixed(2)} TND
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>{totalPrice.toFixed(2)} TND</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('/checkout')}
                className="w-full py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors mb-3"
              >
                Passer la commande
              </button>

              <button
                onClick={() => onNavigate('/shop')}
                className="w-full py-4 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Continuer vos achats
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
