import { Search, ShoppingCart, Menu, User, LogOut, UserCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { api } from '../lib/api';
import type { Category } from '../lib/database.types';

interface HeaderProps {
  onNavigate: (path: string) => void;
  onSearch: (query: string) => void;
}

export function Header({ onNavigate, onSearch }: HeaderProps) {
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();
  const { settings } = useSettings();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await api.categories.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setSearchQuery('');
      setMobileSearchOpen(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    onNavigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[60px] py-3">
          <div className="flex items-center gap-2 md:flex-shrink-0">
            <div className="relative">
              <button
                onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Menu des catégories"
              >
                <Menu className="h-6 w-6" />
              </button>

              {categoryMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setCategoryMenuOpen(false)}
                  />
                  <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-3 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Navigation</h3>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={() => {
                          onNavigate('/');
                          setCategoryMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors font-medium"
                      >
                        Accueil
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('/shop');
                          setCategoryMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors font-medium"
                      >
                        Boutique
                        {categories.length > 0 && (
                          <div className="ml-6 mt-2 space-y-1">
                            {categories.map((category) => (
                              <button
                                key={category.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onNavigate(`/category/${category.slug}`);
                                  setCategoryMenuOpen(false);
                                }}
                                className="block w-full text-left px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded transition-colors"
                              >
                                {category.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('/about');
                          setCategoryMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors font-medium"
                      >
                        À propos
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('/contact');
                          setCategoryMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors font-medium"
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Recherche"
            >
              <Search className="h-6 w-6" />
            </button>
          </div>

          <button
            onClick={() => onNavigate('/')}
            className="absolute left-1/2 transform -translate-x-1/2 text-xl md:text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors truncate max-w-[50%]"
            style={{ fontFamily: '"Rubik Bubbles", cursive' }}
          >
            {settings?.store_name || 'Hamdi Store'}
          </button>

          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0 ml-2">
            <form onSubmit={handleSearch} className="hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </form>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Compte utilisateur"
              >
                <User className="h-6 w-6" />
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-200">
                          <p className="text-sm text-gray-600">Connecté en tant que</p>
                          <p className="font-medium text-gray-900 truncate">{user.email}</p>
                        </div>
                        <button
                          onClick={() => {
                            onNavigate('/account');
                            setUserMenuOpen(false);
                          }}
                          className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <UserCircle className="h-5 w-5" />
                          <span>Mon compte</span>
                        </button>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-5 w-5" />
                          <span>Se déconnecter</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            onNavigate('/login');
                            setUserMenuOpen(false);
                          }}
                          className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <User className="h-5 w-5" />
                          <span>Se connecter</span>
                        </button>
                        <button
                          onClick={() => {
                            onNavigate('/signup');
                            setUserMenuOpen(false);
                          }}
                          className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <UserCircle className="h-5 w-5" />
                          <span>Créer un compte</span>
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => onNavigate('/cart')}
              className="relative p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  autoFocus
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
