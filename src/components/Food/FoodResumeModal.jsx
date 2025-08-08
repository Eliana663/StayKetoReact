import { Modal } from 'react-bootstrap';
import DonutChart from '@/components/Food/DonutChart'

export default function FoodResumeModal({ show, onClose, item, amount, setAmount, onAdd }) {
  if (!item) return null;

  const baseQuantity = Number(item.quantity) || 100;
  const amountNumber = Number(amount) || 100;
  const factor = amountNumber / baseQuantity;

  const imageUrl = item.image_url?.startsWith('http')
    ? item.image_url
    : `http://localhost:8081${item.image_url?.startsWith('/') ? '' : '/'}${item.image_url || 'images/default.jpg'}`;

  const chartDataItem = {
    carbohydrates: (Number(item.carbohydrates) || 0) * factor,
    proteins: (Number(item.proteins) || 0) * factor,
    fat: (Number(item.fat) || 0) * factor,
    calories: (Number(item.calories) || 0) * factor,
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{item.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <img
          src={imageUrl}
          alt={item.name}
          style={{ width: 150, borderRadius: 8, marginBottom: 10 }}
        />

        <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
          {item.isKeto ? 'Keto ✅' : 'No Keto ❌'}
        </p>

        <div style={{ marginBottom: '1rem', maxWidth: 120, margin: '0 auto' }}>
          <label style={{ fontWeight: 'bold' }}>Cantidad (g):</label>
          <input
            type="number"
            min="0"
            step="100"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="form-control form-control-sm"
          />
        </div>

        <DonutChart item={chartDataItem} />

       
        <button
          className="btn btn-success mt-3"
          onClick={() => {
            onAdd(item, amount);  
            onClose();             
          }}
        >
          Añadir alimento
        </button>
      </Modal.Body>
    </Modal>
  );
}