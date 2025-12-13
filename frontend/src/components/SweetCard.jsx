import { useState } from 'react';
import './SweetCard.css';

function SweetCard({ sweet, onPurchase, onDelete, onRestock }) {
  const [quantity, setQuantity] = useState(1);

  const handlePurchase = () => {
    if (quantity > 0 && quantity <= sweet.quantity) {
      onPurchase(sweet._id, quantity);
      setQuantity(1);
    } else {
      alert('Invalid quantity');
    }
  };

  return (
    <div className="sweet-card">
      <div className="sweet-image">
        {sweet.imageUrl ? (
          <img src={sweet.imageUrl} alt={sweet.name} />
        ) : (
          <div className="sweet-placeholder">🍬</div>
        )}
      </div>
      <div className="sweet-info">
        <h3>{sweet.name}</h3>
        <p className="sweet-category">{sweet.category}</p>
        {sweet.description && (
          <p className="sweet-description">{sweet.description}</p>
        )}
        <div className="sweet-details">
          <span className="sweet-price">₹{sweet.price}</span>
          <span
            className={`sweet-stock ${
              sweet.quantity === 0 ? 'out-of-stock' : ''
            }`}
          >
            {sweet.quantity > 0
              ? `${sweet.quantity} in stock`
              : 'Out of stock'}
          </span>
        </div>
      </div>
      <div className="sweet-actions">
        {sweet.quantity > 0 && (
          <div className="purchase-section">
            <input
              type="number"
              min="1"
              max={sweet.quantity}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="quantity-input"
            />
            <button onClick={handlePurchase} className="btn-purchase">
              Purchase
            </button>
          </div>
        )}
        {onRestock && (
          <button
            onClick={() => onRestock(sweet._id, sweet.quantity)}
            className="btn-restock"
          >
            Restock
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(sweet._id)}
            className="btn-delete"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default SweetCard;
