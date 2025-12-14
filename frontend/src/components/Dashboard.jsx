import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getCurrentUser, isAdmin } from '../services/authService';
import {
  getAllSweets,
  searchSweets,
  purchaseSweet,
  deleteSweet,
  restockSweet
} from '../services/sweetService';
import SweetCard from './SweetCard';
import AddSweetModal from './AddSweetModal';
import EditSweetModal from './EditSweetModal';

function Dashboard() {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useState({
    name: '',
    category: '',
    minPrice: '',
    maxPrice: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSweet, setSelectedSweet] = useState(null);
  const navigate = useNavigate();
  const user = getCurrentUser();
  const userIsAdmin = isAdmin();

  useEffect(() => {
    loadSweets();
  }, []);

  const loadSweets = async () => {
    try {
      setLoading(true);
      const data = await getAllSweets();
      setSweets(data);
      setError('');
    } catch (err) {
      setError('Failed to load sweets');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const params = {};
      if (searchParams.name) params.name = searchParams.name;
      if (searchParams.category) params.category = searchParams.category;
      if (searchParams.minPrice) params.minPrice = searchParams.minPrice;
      if (searchParams.maxPrice) params.maxPrice = searchParams.maxPrice;

      const data = await searchSweets(params);
      setSweets(data);
      setError('');
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (sweetId, quantity) => {
    try {
      await purchaseSweet(sweetId, quantity);
      alert('Purchase successful!');
      loadSweets();
    } catch (err) {
      alert(err.response?.data?.message || 'Purchase failed');
    }
  };

  const handleDelete = async (sweetId) => {
    if (window.confirm('Are you sure you want to delete this sweet?')) {
      try {
        await deleteSweet(sweetId);
        alert('Sweet deleted successfully');
        loadSweets();
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  const handleEdit = (sweet) => {
    setSelectedSweet(sweet);
    setShowEditModal(true);
  };

  const handleRestock = async (sweetId, quantity) => {
    const restockQty = prompt('Enter quantity to restock (in kg):', quantity);
    if (restockQty && parseFloat(restockQty) > 0) {
      try {
        await restockSweet(sweetId, parseFloat(restockQty));
        alert('Restock successful!');
        loadSweets();
      } catch (err) {
        alert(err.response?.data?.message || 'Restock failed');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleClearSearch = () => {
    setSearchParams({
      name: '',
      category: '',
      minPrice: '',
      maxPrice: ''
    });
    loadSweets();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">🍬</span>
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Sweet Shop
                </h1>
                <p className="text-xs text-gray-500">Your favorite treats await</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-700">{user?.name}</p>
                {userIsAdmin && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                    👑 Admin
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all"
              >
                <span>Logout</span>
                <span>🚪</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-bold text-gray-800 flex items-center">
              <span className="mr-2">🔍</span>
              Search Sweets
            </h2>
            {userIsAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <span>➕</span>
                <span>Add Sweet</span>
              </button>
            )}
          </div>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Sweet name..."
              value={searchParams.name}
              onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Category..."
              value={searchParams.category}
              onChange={(e) => setSearchParams({ ...searchParams, category: e.target.value })}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Min price..."
              value={searchParams.minPrice}
              onChange={(e) => setSearchParams({ ...searchParams, minPrice: e.target.value })}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Max price..."
              value={searchParams.maxPrice}
              onChange={(e) => setSearchParams({ ...searchParams, maxPrice: e.target.value })}
              className="input-field"
            />
            <div className="flex space-x-2">
              <button type="submit" className="btn-primary flex-1">
                Search
              </button>
              <button
                type="button"
                onClick={handleClearSearch}
                className="btn-secondary"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
            <div className="flex items-center">
              <span className="text-xl mr-2">⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-semibold">Loading delicious sweets...</p>
            </div>
          </div>
        ) : sweets.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4">🍬</div>
            <h3 className="text-2xl font-display font-bold text-gray-800 mb-2">No sweets found</h3>
            <p className="text-gray-600 mb-6">
              {userIsAdmin
                ? 'Get started by adding your first sweet!'
                : 'Check back soon for new treats!'}
            </p>
            {userIsAdmin && (
              <button onClick={() => setShowAddModal(true)} className="btn-primary">
                Add Your First Sweet
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sweets.map((sweet) => (
              <SweetCard
                key={sweet._id}
                sweet={sweet}
                onPurchase={handlePurchase}
                onEdit={userIsAdmin ? handleEdit : null}
                onDelete={userIsAdmin ? handleDelete : null}
                onRestock={userIsAdmin ? handleRestock : null}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {showAddModal && (
        <AddSweetModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadSweets();
          }}
        />
      )}

      {showEditModal && selectedSweet && (
        <EditSweetModal
          sweet={selectedSweet}
          onClose={() => {
            setShowEditModal(false);
            setSelectedSweet(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedSweet(null);
            loadSweets();
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;
