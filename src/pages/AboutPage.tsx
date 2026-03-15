export function AboutPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">À propos de Hamdi Store</h1>

        <div className="prose prose-lg max-w-none">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Notre Histoire</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Hamdi Store est votre destination de confiance pour des chaussures de qualité en
              Tunisie. Nous nous engageons à offrir à nos clients une expérience d'achat
              exceptionnelle avec une large sélection de chaussures pour toute la famille.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Depuis notre création, nous avons pour mission de combiner style, confort et
              qualité dans chaque paire de chaussures que nous proposons.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Notre Mission</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Notre mission est simple : rendre les chaussures de qualité accessibles à tous en
              Tunisie. Nous sélectionnons soigneusement chaque produit pour garantir qu'il
              réponde à nos standards élevés de qualité et de style.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Pourquoi Choisir Hamdi Store?</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-gray-900 font-semibold mr-2">✓</span>
                <span className="text-gray-700">
                  Large sélection de chaussures pour homme, femme, enfant et sport
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-900 font-semibold mr-2">✓</span>
                <span className="text-gray-700">Produits de haute qualité à prix compétitifs</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-900 font-semibold mr-2">✓</span>
                <span className="text-gray-700">Service client exceptionnel</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-900 font-semibold mr-2">✓</span>
                <span className="text-gray-700">Livraison rapide partout en Tunisie</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-900 font-semibold mr-2">✓</span>
                <span className="text-gray-700">
                  Expertise et conseils pour vous aider à trouver la paire parfaite
                </span>
              </li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Notre Engagement</h2>
            <p className="text-gray-700 leading-relaxed">
              Nous nous engageons à fournir des produits authentiques, un service client de
              qualité et une expérience d'achat agréable. Votre satisfaction est notre priorité
              absolue, et nous travaillons constamment pour améliorer nos services et notre
              offre de produits.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contactez-nous</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Vous avez des questions ou besoin d'aide? Notre équipe est là pour vous aider.
            </p>
            <p className="text-gray-700">
              Email: hamditebourbi07@gmail.com<br />
              Téléphone: 20 643 066
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
