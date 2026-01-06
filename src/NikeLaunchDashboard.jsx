import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Calendar, DollarSign, Package, Activity, ChevronRight, Star, ArrowUpRight } from 'lucide-react';

const NikeLaunchDashboard = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Simulated API data - in real implementation, this would come from backend
  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      const mockProducts = [
        {
          id: 1,
          name: 'Air Max Pulse',
          category: 'Running',
          price: 150,
          releaseDate: '2025-02-15',
          status: 'upcoming',
          demand: 'high',
          stock: 2500,
          image: '🏃',
          description: 'Revolutionary cushioning technology',
          views: 45000,
          saves: 12000
        },
        {
          id: 2,
          name: 'ZoomX Vaporfly',
          category: 'Running',
          price: 250,
          releaseDate: '2025-01-20',
          status: 'live',
          demand: 'very-high',
          stock: 1200,
          image: '⚡',
          description: 'Elite racing performance',
          views: 89000,
          saves: 34000
        },
        {
          id: 3,
          name: 'Dunk Low Retro',
          category: 'Lifestyle',
          price: 110,
          releaseDate: '2025-01-10',
          status: 'live',
          demand: 'high',
          stock: 5000,
          image: '👟',
          description: 'Classic basketball heritage',
          views: 125000,
          saves: 56000
        },
        {
          id: 4,
          name: 'Pegasus Trail 5',
          category: 'Trail',
          price: 140,
          releaseDate: '2025-03-01',
          status: 'upcoming',
          demand: 'medium',
          stock: 3500,
          image: '🏔️',
          description: 'All-terrain adventure ready',
          views: 23000,
          saves: 8900
        },
        {
          id: 5,
          name: 'Metcon 9',
          category: 'Training',
          price: 150,
          releaseDate: '2025-02-08',
          status: 'upcoming',
          demand: 'high',
          stock: 4200,
          image: '💪',
          description: 'Ultimate training stability',
          views: 34000,
          saves: 15000
        },
        {
          id: 6,
          name: 'Air Jordan 1 High',
          category: 'Lifestyle',
          price: 170,
          releaseDate: '2025-01-25',
          status: 'live',
          demand: 'very-high',
          stock: 800,
          image: '🏀',
          description: 'Iconic basketball legacy',
          views: 234000,
          saves: 98000
        }
      ];
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    let filtered = products;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category.toLowerCase() === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  const categories = ['all', 'running', 'lifestyle', 'training', 'trail'];
  
  const stats = {
    totalProducts: products.length,
    liveProducts: products.filter(p => p.status === 'live').length,
    avgDemand: products.filter(p => p.demand === 'very-high' || p.demand === 'high').length,
    totalViews: products.reduce((sum, p) => sum + p.views, 0)
  };

  const getDemandColor = (demand) => {
    switch(demand) {
      case 'very-high': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getStatusColor = (status) => {
    return status === 'live' ? 'bg-green-400' : 'bg-blue-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl font-bold">Loading Innovation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 sticky top-0 bg-black z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="text-3xl font-black">NIKE</div>
              <div className="text-sm font-semibold px-3 py-1 bg-white text-black rounded">
                PRODUCT LAUNCH SYSTEM
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white text-black font-semibold rounded hover:bg-gray-200 transition">
                Analytics
              </button>
              <button className="px-4 py-2 border border-white font-semibold rounded hover:bg-white hover:text-black transition">
                Settings
              </button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:border-white transition"
            />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Package size={24} className="text-blue-400" />
              <ArrowUpRight size={16} className="text-green-400" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.totalProducts}</div>
            <div className="text-gray-400 text-sm">Total Products</div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Activity size={24} className="text-green-400" />
              <ArrowUpRight size={16} className="text-green-400" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.liveProducts}</div>
            <div className="text-gray-400 text-sm">Live Now</div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp size={24} className="text-orange-400" />
              <ArrowUpRight size={16} className="text-green-400" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.avgDemand}</div>
            <div className="text-gray-400 text-sm">High Demand</div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <Star size={24} className="text-yellow-400" />
              <ArrowUpRight size={16} className="text-green-400" />
            </div>
            <div className="text-3xl font-bold mb-1">{(stats.totalViews / 1000).toFixed(0)}K</div>
            <div className="text-gray-400 text-sm">Total Views</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-white text-black'
                  : 'bg-gray-900 border border-gray-700 hover:border-white'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-white transition cursor-pointer group"
            >
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-8xl group-hover:scale-110 transition">
                {product.image}
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-2 h-2 rounded-full ${getStatusColor(product.status)}`}></span>
                      <span className="text-xs font-semibold text-gray-400 uppercase">
                        {product.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-400">{product.category}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${getDemandColor(product.demand)}`}></div>
                </div>
                
                <p className="text-sm text-gray-400 mb-4">{product.description}</p>
                
                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Star size={14} />
                      <span>{(product.views / 1000).toFixed(1)}K</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Package size={14} />
                      <span>{product.stock}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-lg">
                    <DollarSign size={18} />
                    {product.price}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar size={14} />
                    <span>{product.releaseDate}</span>
                  </div>
                  <ChevronRight size={20} className="text-gray-400 group-hover:text-white transition" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <Package size={64} className="mx-auto mb-4 text-gray-700" />
            <p className="text-xl text-gray-400">No products found</p>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-6"
          onClick={() => setSelectedProduct(null)}
        >
          <div 
            className="bg-gray-900 rounded-lg max-w-2xl w-full border border-gray-700 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-9xl">
              {selectedProduct.image}
            </div>
            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{selectedProduct.name}</h2>
                  <p className="text-gray-400">{selectedProduct.category}</p>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <p className="text-gray-300 mb-6">{selectedProduct.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800 p-4 rounded">
                  <div className="text-2xl font-bold">${selectedProduct.price}</div>
                  <div className="text-sm text-gray-400">Price</div>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <div className="text-2xl font-bold">{selectedProduct.stock}</div>
                  <div className="text-sm text-gray-400">Stock Available</div>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <div className="text-2xl font-bold">{(selectedProduct.views / 1000).toFixed(1)}K</div>
                  <div className="text-sm text-gray-400">Views</div>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <div className="text-2xl font-bold">{selectedProduct.releaseDate}</div>
                  <div className="text-sm text-gray-400">Release Date</div>
                </div>
              </div>
              
              <button className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-gray-200 transition">
                View Full Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NikeLaunchDashboard;