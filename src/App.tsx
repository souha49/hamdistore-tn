import { useState } from 'react';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { useRouter } from './hooks/useRouter';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CategoryPage } from './pages/CategoryPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminSettingsPage } from './pages/AdminSettingsPage';
import { AdminProductsPage } from './pages/AdminProductsPage';
import { AdminCategoriesPage } from './pages/AdminCategoriesPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { AccountPage } from './pages/AccountPage';

function App() {
  const { route, navigate } = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    navigate('/shop');
  };

  const renderPage = () => {
    if (route === '/' || route === '') {
      return <HomePage onNavigate={navigate} />;
    }

    if (route === '/shop') {
      return <ShopPage onNavigate={navigate} searchQuery={searchQuery} />;
    }

    if (route.startsWith('/product/')) {
      const productId = route.split('/product/')[1];
      return <ProductDetailPage productId={productId} onNavigate={navigate} />;
    }

    if (route.startsWith('/category/')) {
      const categorySlug = route.split('/category/')[1];
      return <CategoryPage categorySlug={categorySlug} onNavigate={navigate} />;
    }

    if (route === '/cart') {
      return <CartPage onNavigate={navigate} />;
    }

    if (route === '/checkout') {
      return <CheckoutPage onNavigate={navigate} />;
    }

    if (route === '/about') {
      return <AboutPage />;
    }

    if (route === '/contact') {
      return <ContactPage />;
    }

    if (route === '/admin') {
      return <AdminPage />;
    }

    if (route === '/admin/dashboard') {
      return <AdminDashboard onNavigate={navigate} />;
    }

    if (route === '/admin/settings') {
      return <AdminSettingsPage />;
    }

    if (route === '/admin/products') {
      return <AdminProductsPage />;
    }

    if (route === '/admin/categories') {
      return <AdminCategoriesPage />;
    }

    if (route === '/login') {
      return <LoginPage onNavigate={navigate} />;
    }

    if (route === '/signup') {
      return <SignupPage onNavigate={navigate} />;
    }

    if (route === '/account') {
      return <AccountPage onNavigate={navigate} />;
    }

    return <HomePage onNavigate={navigate} />;
  };

  return (
    <AuthProvider>
      <SettingsProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Header onNavigate={navigate} onSearch={handleSearch} />
            <main className="flex-1">{renderPage()}</main>
            <Footer onNavigate={navigate} />
          </div>
        </CartProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
