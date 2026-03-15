import { useEffect, useState } from 'react';
import { ArrowRight, Truck, Shield, CreditCard, Star, TrendingUp, Heart, Award } from 'lucide-react';
import { api } from '../lib/api';
import type { Product } from '../lib/database.types';
import { ProductCarousel } from '../components/ProductCarousel';
import { useSettings } from '../contexts/SettingsContext';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();
  const heroImage = settings?.hero_image_url || '/WhatsApp_Image_2026-02-28_at_19.24.51.jpeg';
  const sectionFemmeImage = settings?.section_femme_image_url || '/4.1.webp';
  const sectionHommeImage = settings?.section_homme_image_url || '/4.6.webp';
  const sectionCollectionImage = settings?.section_collection_image_url || '/WhatsApp_Image_2026-02-28_at_19.24.51.jpeg';

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const products = await api.products.getFeatured();
      setFeaturedProducts(products);
    } catch (error) {
      console.error('Error loading featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-[700px] flex items-end pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${heroImage}')` }}></div>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
              Style et Confort <br />
              <span className="text-blue-400">Pour Tous</span>
            </h1>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onNavigate('/shop')}
                className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all transform hover:scale-105 shadow-lg"
              >
                Découvrir la Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button
                onClick={() => onNavigate('/about')}
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-all border-2 border-gray-900"
              >
                En savoir plus
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 uppercase tracking-wide">Collections</h2>
          </div>
          <div className="grid grid-cols-4 gap-4 md:gap-12 max-w-4xl mx-auto">
            {[
              {
                label: 'HOMME',
                category: 'homme',
                image: '/4.6.webp'
              },
              {
                label: 'FEMME',
                category: 'femme',
                image: '/4.1.webp'
              },
              {
                label: 'SPORT',
                category: 'sport',
                image: '/1.webp'
              },
              {
                label: 'ENFANT',
                category: 'enfant',
                image: '/11.0.webp'
              },
            ].map((category) => (
              <button
                key={category.category}
                onClick={() => onNavigate(`/category/${category.category}`)}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="relative w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-gray-200 group-hover:border-gray-900 transition-all duration-300 transform group-hover:scale-105">
                  <img
                    src={category.image}
                    alt={category.label}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs md:text-sm font-bold text-gray-900 uppercase tracking-wider">
                  {category.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${sectionFemmeImage}')` }}></div>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-2xl">
              Pour Elle
            </h2>
            <p className="text-xl text-white/95 leading-relaxed mb-8 drop-shadow-lg">
              Style, confort et élégance à chaque pas.
            </p>
            <button
              onClick={() => onNavigate('/category/femme')}
              className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
            >
              Découvrir la Collection
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <TrendingUp className="h-4 w-4" />
              Tendances du Moment
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Produits en Vedette</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez notre sélection exclusive des modèles les plus populaires
            </p>
          </div>
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600"></div>
              <p className="mt-4 text-gray-600">Chargement des produits...</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            <>
              <ProductCarousel
                products={featuredProducts}
                onNavigate={onNavigate}
                autoScroll={true}
                autoScrollInterval={5000}
              />
              <div className="text-center mt-16">
                <button
                  onClick={() => onNavigate('/shop')}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
                >
                  Voir Toute la Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <p className="text-gray-500 text-lg">Aucun produit en vedette pour le moment</p>
            </div>
          )}
        </div>
      </section>

      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${sectionHommeImage}')` }}></div>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-2xl">
              Pour Lui
            </h2>
            <p className="text-xl text-white/95 leading-relaxed mb-8 drop-shadow-lg">
              Découvrez nos modèles tendance pour hommes.
            </p>
            <button
              onClick={() => onNavigate('/category/homme')}
              className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
            >
              Découvrir la Collection
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
            <div className="order-2 md:order-1">
              <img
                src={sectionCollectionImage}
                alt="Collection 2024"
                className="rounded-2xl shadow-2xl w-full object-cover h-[300px] md:h-[400px]"
              />
            </div>
            <div className="order-1 md:order-2 space-y-4 md:space-y-6">
              <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-xs md:text-sm font-semibold">
                Collection Exclusive
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                Style Unique pour Chaque Occasion
              </h2>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                De la décontraction du quotidien à l'élégance des grandes occasions, trouvez la paire parfaite qui correspond à votre style et à votre personnalité.
              </p>
              <ul className="space-y-2 md:space-y-3">
                {[
                  'Matériaux de haute qualité',
                  'Confort optimal toute la journée',
                  'Designs modernes et intemporels',
                  'Prix compétitifs'
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 md:gap-3">
                    <div className="bg-blue-600 text-white rounded-full p-1">
                      <Star className="h-3 w-3 md:h-4 md:w-4" />
                    </div>
                    <span className="text-gray-700 text-sm md:text-base">{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onNavigate('/shop')}
                className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all transform hover:scale-105 text-sm md:text-base"
              >
                Explorer Maintenant
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">Pourquoi Choisir Hamdi Store ?</h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
              Votre satisfaction est notre priorité
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {[
              {
                icon: Award,
                title: 'Qualité Garantie',
                description: 'Tous nos produits sont authentiques et sélectionnés avec soin pour vous garantir la meilleure qualité.',
                color: 'from-yellow-400 to-orange-500'
              },
              {
                icon: Heart,
                title: 'Satisfaction Client',
                description: 'Plus de 10,000 clients satisfaits nous font confiance. Rejoignez notre communauté aujourd\'hui.',
                color: 'from-pink-400 to-red-500'
              },
              {
                icon: TrendingUp,
                title: 'Nouveautés Régulières',
                description: 'Suivez les dernières tendances avec nos nouvelles collections ajoutées chaque semaine.',
                color: 'from-blue-400 to-blue-600'
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gray-800 p-6 md:p-8 rounded-2xl hover:bg-gray-750 transition-all duration-300 transform hover:scale-105 border border-gray-700"
              >
                <div className={`inline-flex p-3 md:p-4 rounded-xl bg-gradient-to-br ${item.color} mb-4 md:mb-6`}>
                  <item.icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">{item.title}</h3>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 gap-3 md:gap-8">
            {[
              {
                icon: Truck,
                title: 'Livraison Rapide',
                description: 'Partout en Tunisie en 48h',
                color: 'text-blue-600'
              },
              {
                icon: Shield,
                title: 'Livraison Nationale',
                description: 'Livré partout en Tunisie',
                color: 'text-green-600'
              },
              {
                icon: CreditCard,
                title: 'Paiement à la Livraison',
                description: 'Payez en espèces lors de la réception',
                color: 'text-purple-600'
              },
              {
                icon: Star,
                title: 'Service Client',
                description: 'Support 7j/7 pour vous aider',
                color: 'text-orange-600'
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-3 md:p-6 rounded-xl hover:bg-gray-50 transition-all group"
              >
                <feature.icon className={`h-8 w-8 md:h-12 md:w-12 mx-auto mb-2 md:mb-4 ${feature.color} group-hover:scale-110 transition-transform`} />
                <h3 className="text-xs md:text-lg font-bold text-gray-900 mb-1 md:mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-[10px] md:text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-br from-gray-900 to-gray-800 text-white" data-newsletter-section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Rejoignez la Communauté Hamdi Store</h2>
          <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
            Inscrivez-vous à notre newsletter pour recevoir les dernières nouveautés et offres exclusives
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-5 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg transition-colors whitespace-nowrap">
              S'inscrire
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
