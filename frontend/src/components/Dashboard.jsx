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
import './Dashboard.css';

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

  const handleRestock = async (sweetId, quantity) => {
    const restockQty = prompt('Enter quantity to restock:', quantity);
    if (restockQty && parseInt(restockQty) > 0) {
      try {
        await restockSweet(sweetId, parseInt(restockQty));
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
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🍬 Sweet Shop</h1>
          <div className="user-info">
            <span>Welcome, {user?.name}!</span>
            {userIsAdmin && <span className="admin-badge">Admin</span>}
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="search-section">
          <h2>Search Sweets</h2>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchParams.name}
              onChange={(e) =>
                setSearchParams({ ...searchParams, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Category..."
              value={searchParams.category}
              onChange={(e) =>
                setSearchParams({ ...searchParams, category: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Min price..."
              value={searchParams.minPrice}
              onChange={(e) =>
                setSearchParams({ ...searchParams, minPrice: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Max price..."
              value={searchParams.maxPrice}
              onChange={(e) =>
                setSearchParams({ ...searchParams, maxPrice: e.target.value })
              }
            />
            <button type="submit" className="btn-search">
              Search
            </button>
            <button
              type="button"
              onClick={handleClearSearch}
              className="btn-clear"
            >
              Clear
            </button>
          </form>
        </div>

        {userIsAdmin && (
          <div className="admin-actions">
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-add"
            >
              + Add New Sweet
            </button>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading sweets...</div>
        ) : sweets.length === 0 ? (
          <div className="no-sweets">No sweets found</div>
        ) : (
          <div className="sweets-grid">
            {sweets.map((sweet) => (
              <SweetCard
                key={sweet._id}
                sweet={sweet}
                onPurchase={handlePurchase}
                onDelete={userIsAdmin ? handleDelete : null}
                onRestock={userIsAdmin ? handleRestock : null}
              />
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <AddSweetModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadSweets();
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;
