import { useAuth } from '../contexts/AuthContext';
import { User, Mail, LogOut, ShoppingBag } from 'lucide-react';

interface AccountPageProps {
  onNavigate: (path: string) => void;
}

export function AccountPage({ onNavigate }: AccountPageProps) {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    onNavigate('/');
  };

  if (!user) {
    onNavigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-blue-600" />
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold mb-2">Mon Compte</h1>
                <p className="text-blue-100">Gérez vos informations personnelles</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations du compte</h2>
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">ID utilisateur</p>
                      <p className="font-medium text-gray-900 text-xs">{user.id}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Mes commandes</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                  <ShoppingBag className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                  <p className="text-gray-700 mb-4">Vous n'avez pas encore de commandes</p>
                  <button
                    onClick={() => onNavigate('/shop')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Découvrir nos produits
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
