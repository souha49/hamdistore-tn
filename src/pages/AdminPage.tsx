import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Package, ShoppingBag, Upload, X, Settings } from 'lucide-react';
import { api } from '../lib/api';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Product, Category, Order, OrderItem } from '../lib/database.types';
import { AdminSettingsPage } from './AdminSettingsPage';

export function AdminPage() {
  const { loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    images: '',
    sizes: '36,37,38,39,40,41,42,43,44,45',
    stock_per_size: '10',
    is_featured: false,
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, ordersData, categoriesData] = await Promise.all([
        api.products.getAll(),
        api.orders.getAll(),
        api.categories.getAll(),
      ]);

      setProducts(productsData);
      setOrders(ordersData);
      setCategories(categoriesData);

      const itemsMap: Record<string, OrderItem[]> = {};
      for (const order of ordersData) {
        const items = await api.orderItems.getByOrderId(order.id);
        itemsMap[order.id] = items;
      }
      setOrderItems(itemsMap);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        return data.publicUrl;
      });

      const urls = await Promise.all(uploadPromises);
      setUploadedImages((prev) => [...prev, ...urls]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Erreur lors du téléchargement des images');
    } finally {
      setUploading(false);
    }
  };

  const removeUploadedImage = (url: string) => {
    setUploadedImages((prev) => prev.filter((img) => img !== url));
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const manualImages = formData.images
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url);

    const images = [...uploadedImages, ...manualImages];

    const sizeList = formData.sizes.split(',').map((s) => s.trim());
    const stockPerSize = parseInt(formData.stock_per_size) || 0;
    const sizes = sizeList.map((size) => ({ size, stock: stockPerSize }));

    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category_id: formData.category_id || null,
      images,
      sizes,
      stock_quantity: sizes.reduce((sum, s) => sum + s.stock, 0),
      is_featured: formData.is_featured,
    };

    try {
      if (editingProduct) {
        await api.products.update(editingProduct.id, productData);
      } else {
        await api.products.create(productData);
      }

      setShowProductForm(false);
      setEditingProduct(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Erreur lors de l\'enregistrement du produit');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    const imageList = Array.isArray(product.images) ? product.images : [];
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category_id: product.category_id || '',
      images: imageList.join('\n'),
      sizes: product.sizes.map((s: { size: string }) => s.size).join(','),
      stock_per_size: product.sizes[0]?.stock.toString() || '0',
      is_featured: product.is_featured,
    });
    setUploadedImages([]);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) return;

    try {
      await api.products.delete(id);
      loadData();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Erreur lors de la suppression du produit');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.orders.updateStatus(orderId, status);
      loadData();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Erreur lors de la mise à jour de la commande');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: '',
      images: '',
      sizes: '36,37,38,39,40,41,42,43,44,45',
      stock_per_size: '10',
      is_featured: false,
    });
    setUploadedImages([]);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Administration</h1>
          <p className="text-gray-600">Gérez facilement votre boutique en ligne</p>
        </div>

        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('products')}
                className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                  activeTab === 'products'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Package className="inline h-5 w-5 mr-2" />
                Produits
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                  activeTab === 'orders'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <ShoppingBag className="inline h-5 w-5 mr-2" />
                Commandes
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                  activeTab === 'settings'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Settings className="inline h-5 w-5 mr-2" />
                Paramètres
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Gestion des produits</h2>
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      resetForm();
                      setShowProductForm(true);
                    }}
                    className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Ajouter un produit
                  </button>
                </div>

                {showProductForm && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
                    </h3>
                    <form onSubmit={handleSubmitProduct} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom du produit *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Prix (TND) *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            required
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Catégorie
                          </label>
                          <select
                            value={formData.category_id}
                            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                          >
                            <option value="">Sélectionner une catégorie</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pointures (séparées par des virgules)
                          </label>
                          <input
                            type="text"
                            value={formData.sizes}
                            onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stock par pointure
                          </label>
                          <input
                            type="number"
                            value={formData.stock_per_size}
                            onChange={(e) => setFormData({ ...formData, stock_per_size: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="is_featured"
                            checked={formData.is_featured}
                            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                            className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                          />
                          <label htmlFor="is_featured" className="ml-2 text-sm font-medium text-gray-700">
                            Produit en vedette
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Images du produit
                        </label>

                        <div className="space-y-4">
                          <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-10 h-10 mb-2 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-600">
                                  <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG ou WEBP</p>
                              </div>
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading}
                                className="hidden"
                              />
                            </label>
                          </div>

                          {uploading && (
                            <div className="flex items-center justify-center">
                              <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900"></div>
                              <span className="ml-2 text-sm text-gray-600">Téléchargement...</span>
                            </div>
                          )}

                          {uploadedImages.length > 0 && (
                            <div className="grid grid-cols-4 gap-4">
                              {uploadedImages.map((url, index) => (
                                <div key={index} className="relative group">
                                  <img
                                    src={url}
                                    alt={`Upload ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeUploadedImage(url)}
                                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="border-t border-gray-200 pt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Ou ajoutez des URLs d'images (une par ligne)
                            </label>
                            <textarea
                              rows={3}
                              value={formData.images}
                              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                              placeholder="https://example.com/image1.jpg"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <button
                          type="submit"
                          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          {editingProduct ? 'Mettre à jour' : 'Créer'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowProductForm(false);
                            setEditingProduct(null);
                            resetForm();
                          }}
                          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Annuler
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center border border-gray-200 rounded-lg p-4">
                      <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            Pas d'image
                          </div>
                        )}
                      </div>
                      <div className="flex-1 ml-4">
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-600">
                          {product.price.toFixed(2)} TND - {product.stock_quantity > 0 ? 'En stock' : 'Rupture de stock'}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestion des commandes</h2>
                <div className="space-y-4">
                  {orders.map((order) => {
                    const items = orderItems[order.id] || [];
                    return (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg mb-2">
                              Commande #{order.id.slice(0, 8)}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Client: {order.customer_name}
                            </p>
                            <p className="text-sm text-gray-600">Téléphone: {order.phone}</p>
                            <p className="text-sm text-gray-600">
                              Adresse: {order.address}, {order.city}
                            </p>
                            {order.notes && (
                              <p className="text-sm text-gray-600 mt-1">Notes: {order.notes}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-gray-900 mb-2">
                              {order.total_amount.toFixed(2)} TND
                            </p>
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                order.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : order.status === 'confirmed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : order.status === 'shipped'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              <option value="pending">En attente</option>
                              <option value="confirmed">Confirmée</option>
                              <option value="shipped">Expédiée</option>
                              <option value="delivered">Livrée</option>
                            </select>
                          </div>
                        </div>
                        <div className="border-t border-gray-200 pt-4">
                          <h4 className="font-medium text-gray-900 mb-2">Produits:</h4>
                          <ul className="space-y-1">
                            {items.map((item) => (
                              <li key={item.id} className="text-sm text-gray-600">
                                {item.product_name} (Pointure {item.size}) x{item.quantity} -{' '}
                                {(item.price * item.quantity).toFixed(2)} TND
                              </li>
                            ))}
                          </ul>
                        </div>
                        <p className="text-xs text-gray-500 mt-4">
                          {new Date(order.created_at).toLocaleString('fr-FR')}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <AdminSettingsPage />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
