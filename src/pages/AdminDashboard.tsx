import { Settings, Package, FolderTree, ShoppingBag } from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const menuItems = [
    {
      title: 'Site Settings',
      description: 'Customize your store appearance, colors, and layout',
      icon: Settings,
      path: '/admin/settings',
      color: 'bg-blue-500'
    },
    {
      title: 'Products',
      description: 'Add, edit, and manage your product catalog',
      icon: Package,
      path: '/admin/products',
      color: 'bg-green-500'
    },
    {
      title: 'Categories',
      description: 'Organize products into categories',
      icon: FolderTree,
      path: '/admin/categories',
      color: 'bg-purple-500'
    },
    {
      title: 'Orders',
      description: 'View and manage customer orders',
      icon: ShoppingBag,
      path: '/admin',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your Hamdi Store without coding</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className={`${item.color} p-3 rounded-lg text-white group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Guide</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-gray-900 min-w-[120px]">Site Settings:</span>
              <span>Change your store name, logo, colors, and product grid layout</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-gray-900 min-w-[120px]">Products:</span>
              <span>Add new shoes with images, descriptions, prices, sizes, and stock</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-gray-900 min-w-[120px]">Categories:</span>
              <span>Create categories like "Running Shoes", "Casual", "Sports", etc.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-gray-900 min-w-[120px]">Orders:</span>
              <span>View customer orders and update their status</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
