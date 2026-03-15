import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload, ImagePlus, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Product, Category } from '../lib/database.types';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category_id: string;
  images: string[];
  sizes: { size: string; stock: number }[];
  stock_quantity: number;
  is_featured: boolean;
}

const SHOE_SIZES = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];

export function AdminProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    category_id: '',
    images: [''],
    sizes: SHOE_SIZES.map(size => ({ size, stock: 0 })),
    stock_quantity: 0,
    is_featured: false
  });

  useEffect(() => {
    loadData();
    checkAdminStatus();
  }, [user]);

  async function checkAdminStatus() {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      setIsAdmin(!!data && !error);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  }

  async function loadData() {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name')
      ]);

      if (productsRes.error) throw productsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;

      setProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: '',
      images: [''],
      sizes: SHOE_SIZES.map(size => ({ size, stock: 0 })),
      stock_quantity: 0,
      is_featured: false
    });
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(product: Product) {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category_id: product.category_id || '',
      images: product.images.length > 0 ? product.images : [''],
      sizes: product.sizes.length > 0 ? product.sizes : SHOE_SIZES.map(size => ({ size, stock: 0 })),
      stock_quantity: product.stock_quantity,
      is_featured: product.is_featured
    });
    setEditingId(product.id);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');

    const filteredImages = formData.images.filter(img => img.trim() !== '');
    const totalStock = formData.sizes.reduce((sum, s) => sum + s.stock, 0);

    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category_id: formData.category_id || null,
      images: filteredImages,
      sizes: formData.sizes,
      stock_quantity: totalStock,
      is_featured: formData.is_featured
    };

    try {
      if (editingId) {
        const { error } = await supabase
          .from('products')
          .update({ ...productData, updated_at: new Date().toISOString() })
          .eq('id', editingId);

        if (error) throw error;
        setMessage('Product updated successfully!');
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
        setMessage('Product created successfully!');
      }

      await loadData();
      resetForm();
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      console.error('Error saving product:', error);
      if (error?.message?.includes('row-level security policy')) {
        setMessage('Error: You must be logged in as an admin to manage products.');
      } else {
        setMessage('Error saving product. Please try again.');
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMessage('Product deleted successfully!');
      await loadData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting product:', error);
      setMessage('Error deleting product. Please try again.');
    }
  }

  function addImageField() {
    setFormData({ ...formData, images: [...formData.images, ''] });
  }

  function removeImageField(index: number) {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages.length > 0 ? newImages : [''] });
  }

  function updateImage(index: number, value: string) {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  }

  function updateSize(index: number, stock: number) {
    const newSizes = [...formData.sizes];
    newSizes[index].stock = stock;
    setFormData({ ...formData, sizes: newSizes });
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage('Please select a valid image file');
      return;
    }

    setUploadingImage(true);
    setMessage('Uploading image...');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      updateImage(index, publicUrl);
      setMessage('Image uploaded successfully!');
      setTimeout(() => setMessage(''), 2000);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      if (error?.message?.includes('row-level security policy')) {
        setMessage('Error: You must be logged in as an admin to upload images.');
      } else {
        setMessage('Error uploading image. Please try again.');
      }
    } finally {
      setUploadingImage(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <button
            onClick={() => setShowForm(true)}
            disabled={!isAdmin}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {!isAdmin && user && (
          <div className="mb-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-800 font-medium">Access limité</p>
              <p className="text-yellow-700 text-sm mt-1">
                Vous devez être admin pour gérer les produits. Contactez l'administrateur pour obtenir les droits d'accès.
              </p>
            </div>
          </div>
        )}

        {!user && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">Non connecté</p>
              <p className="text-red-700 text-sm mt-1">
                Vous devez vous connecter en tant qu'administrateur pour gérer les produits.
              </p>
            </div>
          </div>
        )}

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {message}
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg p-6 max-w-3xl w-full my-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingId ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (TND)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Product Images</label>
                  {formData.images.map((img, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex gap-2 mb-2">
                        <div className="flex-1">
                          <label
                            htmlFor={`file-upload-${index}`}
                            className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                          >
                            <Upload className="w-5 h-5 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {uploadingImage ? 'Uploading...' : 'Upload Image'}
                            </span>
                            <input
                              id={`file-upload-${index}`}
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, index)}
                              className="hidden"
                              disabled={uploadingImage}
                            />
                          </label>
                        </div>
                        {formData.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImageField(index)}
                            className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>

                      {img && (
                        <div className="mt-2">
                          <img
                            src={img}
                            alt={`Product preview ${index + 1}`}
                            className="w-full h-40 object-cover rounded-lg border border-gray-200"
                          />
                          <input
                            type="url"
                            value={img}
                            onChange={(e) => updateImage(index, e.target.value)}
                            placeholder="Or paste image URL"
                            className="w-full mt-2 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addImageField}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <ImagePlus className="w-4 h-4" />
                    Add Another Image
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Available Sizes & Stock</label>
                  <div className="grid grid-cols-6 sm:grid-cols-11 gap-2">
                    {formData.sizes.map((sizeObj, index) => (
                      <div key={sizeObj.size} className="text-center">
                        <label className="block text-xs font-medium text-gray-700 mb-1">{sizeObj.size}</label>
                        <input
                          type="number"
                          min="0"
                          value={sizeObj.stock}
                          onChange={(e) => updateSize(index, parseInt(e.target.value) || 0)}
                          className="w-full px-1 py-2 border border-gray-300 rounded text-center text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">
                      Total Stock: {formData.sizes.reduce((sum, s) => sum + s.stock, 0)} pairs
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                    Featured Product
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {editingId ? 'Update Product' : 'Create Product'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {product.images.length > 0 && (
                        <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded object-cover mr-3" />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.description.substring(0, 50)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.price.toFixed(2)} TND
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock_quantity} pairs
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.is_featured && (
                      <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded">Featured</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No products yet. Click "Add Product" to create your first product.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
