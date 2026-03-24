import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { CheckCircle, XCircle, AlertCircle, Copy } from 'lucide-react';

export function DiagnosticPage() {
  const [results, setResults] = useState({
    envVars: { status: 'checking', message: '' },
    connection: { status: 'checking', message: '' },
    categories: { status: 'checking', message: '', count: 0 },
    products: { status: 'checking', message: '', count: 0 },
    auth: { status: 'checking', message: '' }
  });
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  async function runDiagnostics() {
    const newResults = { ...results };

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const configured = isSupabaseConfigured();

    if (!configured) {
      newResults.envVars = {
        status: 'error',
        message: `Variables manquantes! URL: ${supabaseUrl ? 'OK' : 'MANQUANTE'}, Key: ${supabaseKey ? 'OK' : 'MANQUANTE'}`
      };
    } else {
      newResults.envVars = {
        status: 'success',
        message: `Configuration correcte`
      };
    }

    try {
      const { error } = await supabase.from('categories').select('count', { count: 'exact', head: true });
      if (error) {
        newResults.connection = {
          status: 'error',
          message: error.message
        };
      } else {
        newResults.connection = {
          status: 'success',
          message: 'Connected to Supabase'
        };
      }
    } catch (err: any) {
      newResults.connection = {
        status: 'error',
        message: err.message || 'Connection failed'
      };
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*');

      if (error) {
        newResults.categories = {
          status: 'error',
          message: error.message,
          count: 0
        };
      } else {
        newResults.categories = {
          status: data && data.length > 0 ? 'success' : 'warning',
          message: data ? `Found ${data.length} categories` : 'No categories found',
          count: data?.length || 0
        };
      }
    } catch (err: any) {
      newResults.categories = {
        status: 'error',
        message: err.message,
        count: 0
      };
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) {
        newResults.products = {
          status: 'error',
          message: error.message,
          count: 0
        };
      } else {
        newResults.products = {
          status: data && data.length > 0 ? 'success' : 'warning',
          message: data ? `Found ${data.length} products` : 'No products found',
          count: data?.length || 0
        };
      }
    } catch (err: any) {
      newResults.products = {
        status: 'error',
        message: err.message,
        count: 0
      };
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      newResults.auth = {
        status: user ? 'success' : 'warning',
        message: user ? `Logged in as ${user.email}` : 'Not logged in'
      };
    } catch (err: any) {
      newResults.auth = {
        status: 'error',
        message: err.message
      };
    }

    setResults(newResults);
  }

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'success') return <CheckCircle className="w-6 h-6 text-green-600" />;
    if (status === 'error') return <XCircle className="w-6 h-6 text-red-600" />;
    if (status === 'warning') return <AlertCircle className="w-6 h-6 text-yellow-600" />;
    return <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Diagnostic Supabase</h1>

          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <StatusIcon status={results.envVars.status} />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Variables d'environnement</h3>
                <p className="text-sm text-gray-600 mt-1">{results.envVars.message}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <StatusIcon status={results.connection.status} />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Connexion Supabase</h3>
                <p className="text-sm text-gray-600 mt-1">{results.connection.message}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <StatusIcon status={results.categories.status} />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Catégories</h3>
                <p className="text-sm text-gray-600 mt-1">{results.categories.message}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <StatusIcon status={results.products.status} />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Produits</h3>
                <p className="text-sm text-gray-600 mt-1">{results.products.message}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <StatusIcon status={results.auth.status} />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Authentification</h3>
                <p className="text-sm text-gray-600 mt-1">{results.auth.message}</p>
              </div>
            </div>
          </div>

          <button
            onClick={runDiagnostics}
            className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Relancer le diagnostic
          </button>
        </div>
      </div>
    </div>
  );
}
