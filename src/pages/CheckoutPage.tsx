import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { api } from '../lib/api';
import { Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CheckoutPageProps {
  onNavigate: (path: string) => void;
}

export function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      return;
    }

    setLoading(true);

    try {
      const order = await api.orders.create({
        customer_name: formData.customerName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        notes: formData.notes,
        total_amount: totalPrice,
        status: 'pending',
      });

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        size: item.size,
        quantity: item.quantity,
        price: item.product.price,
      }));

      await api.orderItems.create(orderItems);

      // Send order notification email
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-order-notification`;

        const orderNotificationData = {
          orderId: order.id,
          customerName: formData.customerName,
          customerEmail: session?.user?.email || 'N/A',
          customerPhone: formData.phone,
          shippingAddress: `${formData.address}, ${formData.city}`,
          items: items.map((item) => ({
            name: `${item.product.name} (Pointure ${item.size})`,
            quantity: item.quantity,
            price: item.product.price,
          })),
          total: totalPrice,
        };

        await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderNotificationData),
        });
      } catch (emailError) {
        console.error('Error sending notification email:', emailError);
        // Don't fail the order if email fails
      }

      clearCart();
      setOrderComplete(true);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Une erreur est survenue lors de la création de votre commande.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !orderComplete) {
    onNavigate('/cart');
    return null;
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
              <Check className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Commande confirmée!</h1>
            <p className="text-gray-600 mb-2">
              Merci pour votre commande. Nous vous contacterons bientôt pour confirmer les détails.
            </p>
            <p className="text-gray-600 mb-8">
              Un membre de notre équipe vous contactera au {formData.phone}.
            </p>
            <button
              onClick={() => onNavigate('/')}
              className="inline-block px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Finaliser la commande</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  id="customerName"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de téléphone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse *
                </label>
                <input
                  type="text"
                  id="address"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  Ville *
                </label>
                <input
                  type="text"
                  id="city"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optionnel)
                </label>
                <textarea
                  id="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Traitement...' : 'Confirmer la commande'}
              </button>
            </form>
          </div>

          <div>
            <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Résumé de la commande</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.size}`} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product.name} (Pointure {item.size}) x{item.quantity}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {(item.product.price * item.quantity).toFixed(2)} TND
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>{totalPrice.toFixed(2)} TND</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
