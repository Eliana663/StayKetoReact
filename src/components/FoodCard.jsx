import { useState } from 'react';
import { PlusCircle } from 'lucide-react';

export default function FoodCard({ item, onAdd }) {
  const [amount, setAmount] = useState(item.quantity || 1);
  const factor = amount / item.quantity;

  const baseUrl = "http://localhost:8081";
  const imagePath = item.image_url || '';
  const fullImageUrl = imagePath.startsWith('http')
    ? imagePath
    : `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;

  console.log('URL imagen:', fullImageUrl);

  return (
    <div
      className="card mb-3 shadow-sm"
      style={{
        transition: 'box-shadow 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 12px rgba(0,0,0,0.15)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 0 6px rgba(0,0,0,0.05)')}
    >
      <div className="row g-0 align-items-center">
        {/* Imagen */}
        <div className="col-md-3 text-center">
          <img
            src={fullImageUrl}
            alt={item.name}
            className="img-fluid rounded-start"
            style={{ maxHeight: '120px', objectFit: 'cover' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'http://localhost:8081/images/default.jpg'; 
            }}
          />
        </div>

        {/* Info */}
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title mb-1">{item.name}</h5>
            <p className="card-text mb-1 text-muted">{item.commonName}</p>
            <div className="mb-2 small">
              <strong>{item.isKeto ? 'Keto' : 'No keto'}</strong> — {item.unit} ({item.unitType})
            </div>

            <div className="row small">
              <div className="col"><strong>Calorías:</strong> {(item.calories * factor).toFixed(1)} kcal</div>
              <div className="col"><strong>Carbs:</strong> {(item.carbohydrates * factor).toFixed(1)} g</div>
              <div className="col"><strong>Grasas:</strong> {(item.fat * factor).toFixed(1)} g</div>
              <div className="col"><strong>Proteínas:</strong> {(item.proteins * factor).toFixed(1)} g</div>
            </div>

            <div className="mt-2 d-flex align-items-center gap-2">
              <input
                type="number"
                className="form-control form-control-sm"
                style={{ width: '100px' }}
                min="0"
                step="0.1"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              />
              <span className="text-muted small">{item.unit}</span>
            </div>
          </div>
        </div>

        {/* Botón ➕ */}
        <div className="col-md-1 text-center">
          <button
            className="btn btn-outline-success"
            title="Agregar"
            onClick={() => onAdd(item, amount)}
          >
            <PlusCircle />
          </button>
        </div>
      </div>
    </div>
  );
}