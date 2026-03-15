import { Facebook, Instagram, Mail, Phone, MapPin, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Hamdi Store</h3>
            <p className="text-gray-400 text-sm">
              Votre destination pour les chaussures de qualité en Tunisie.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Liens Rapides</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('/shop')}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Boutique
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  À propos
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div>
            <button
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className="font-semibold mb-4 flex items-center gap-2 hover:text-gray-300 transition-colors"
            >
              Catégories
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isCategoriesOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            <ul className={`space-y-2 overflow-hidden transition-all duration-300 ${
              isCategoriesOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <li>
                <button
                  onClick={() => onNavigate('/category/homme')}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  MEN
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/category/femme')}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  WOMEN
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/category/enfant')}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  WINTER-DROP
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/category/enfant')}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  ENFANT
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400 text-sm">
                <MapPin className="h-4 w-4 mr-2" />
                Tunisie
              </li>
              <li className="flex items-center text-gray-400 text-sm">
                <Phone className="h-4 w-4 mr-2" />
                +216 20 643 066
              </li>
              <li className="flex items-center text-gray-400 text-sm">
                <Mail className="h-4 w-4 mr-2" />
                hamditebourbi07@gmail.com
              </li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://www.facebook.com/people/hamdii-store/61585692938832/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Hamdi Store. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
