import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { api } from '../lib/api';
import type { Product } from '../lib/database.types';
import { useCart } from '../contexts/CartContext';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (path: string) => void;
}

export function ProductDetailPage({ productId, onNavigate }: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await api.products.getById(productId);
      setProduct(data);
      if (data && data.sizes && data.sizes.length > 0) {
        const availableSize = data.sizes.find((s: { stock: number }) => s.stock > 0);
        if (availableSize) {
          setSelectedSize(availableSize.size);
        }
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;

    addItem({
      product,
      size: selectedSize,
      quantity,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const getSizeStock = (size: string): number => {
    if (!product || !product.sizes) return 0;
    const sizeData = product.sizes.find((s: { size: string }) => s.size === size);
    return sizeData ? sizeData.stock : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Produit introuvable</h1>
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

  const images = product.images && product.images.length > 0 ? product.images : [];

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate('/shop')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Retour à la boutique
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 group">
              {images.length > 0 ? (
                <>
                  <img
                    src={images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full p-3 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={() => setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full p-3 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Pas d'image
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-gray-900' : 'border-transparent'
                    }`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-3xl font-bold text-gray-900 mb-6">{product.price.toFixed(2)} TND</p>

            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description || 'Aucune description disponible.'}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Pointure</h3>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes && product.sizes.map((sizeData: { size: string; stock: number }) => {
                  const stock = sizeData.stock;
                  const isAvailable = stock > 0;
                  const isSelected = selectedSize === sizeData.size;

                  return (
                    <button
                      key={sizeData.size}
                      onClick={() => isAvailable && setSelectedSize(sizeData.size)}
                      disabled={!isAvailable}
                      className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                        isSelected
                          ? 'bg-gray-900 text-white'
                          : isAvailable
                          ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {sizeData.size}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Quantité</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition-colors"
                >
                  -
                </button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => {
                    const maxStock = getSizeStock(selectedSize);
                    setQuantity(Math.min(maxStock, quantity + 1));
                  }}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Disponibilité</h3>
              {selectedSize ? (
                getSizeStock(selectedSize) > 0 ? (
                  <p className="text-green-600 font-medium">En stock</p>
                ) : (
                  <p className="text-red-600 font-medium">Rupture de stock</p>
                )
              ) : (
                <p className="text-gray-500">Sélectionnez une pointure</p>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || getSizeStock(selectedSize) === 0}
              className={`w-full py-4 rounded-lg font-semibold transition-all flex items-center justify-center ${
                addedToCart
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed'
              }`}
            >
              {addedToCart ? (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  Ajouté au panier
                </>
              ) : (
                'Ajouter au panier'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
