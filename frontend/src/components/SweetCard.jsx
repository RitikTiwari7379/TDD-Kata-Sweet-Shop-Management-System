import { useState } from 'react';

function SweetCard({ sweet, onPurchase, onEdit, onDelete, onRestock }) {
  const [quantity, setQuantity] = useState(0.5);

  const handlePurchase = () => {
    if (quantity > 0 && quantity <= sweet.quantity) {
      onPurchase(sweet._id, quantity);
      setQuantity(0.5);
    } else {
      alert('Invalid quantity (must be between 0.5 and ' + sweet.quantity + ' kg)');
    }
  };

  return (
    <div className="card overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
        {sweet.imageUrl ? (
          <img
            src={sweet.imageUrl}
            alt={sweet.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-7xl">🍬</span>
          </div>
        )}
        {sweet.quantity === 0 && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
            <span className="badge bg-red-500 text-white text-lg px-4 py-2">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="p-4">
        <h3 className="text-xl font-display font-bold text-gray-800 mb-1 line-clamp-1">
          {sweet.name}
        </h3>
        <p className="badge bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 inline-block mb-2">
          {sweet.category}
        </p>
        {sweet.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {sweet.description}
          </p>
        )}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <div>
            <p className="text-2xl font-bold text-purple-600">
              ₹{sweet.price}
              <span className="text-sm text-gray-500 font-normal">/kg</span>
            </p>
          </div>
          <div className="text-right">
            {sweet.quantity > 0 ? (
              <p className="text-sm">
                <span className="font-semibold text-green-600">{sweet.quantity} kg</span>
                <br />
                <span className="text-gray-500">available</span>
              </p>
            ) : (
              <p className="text-sm text-red-600 font-semibold">Out of stock</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {!onEdit && sweet.quantity > 0 && (
            <>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0.5"
                  max={sweet.quantity}
                  step="0.5"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value) || 0.5)}
                  className="input-field flex-1 text-center font-semibold"
                />
                <span className="badge bg-gray-100 text-gray-700">kg</span>
              </div>
              <button
                onClick={handlePurchase}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                <span>🛒</span>
                <span>Purchase</span>
              </button>
            </>
          )}

          {onEdit && (
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onEdit(sweet)}
                className="btn-warning text-xs py-2"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => onRestock(sweet._id, sweet.quantity)}
                className="btn-success text-xs py-2"
              >
                📦 Stock
              </button>
              <button
                onClick={() => onDelete(sweet._id)}
                className="btn-danger text-xs py-2"
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SweetCard;
