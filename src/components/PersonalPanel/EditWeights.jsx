import React, { useState } from 'react';

export default function EditWeights({ initialTargetWeight, initialCurrentWeight, onSave }) {
  const [targetWeight, setTargetWeight] = useState(initialTargetWeight || '');
  const [currentWeight, setCurrentWeight] = useState(initialCurrentWeight || '');

  const handleSave = () => {
    onSave({ targetWeight, currentWeight });
  };

  return (
    <div style={{ fontFamily: 'Arial', textAlign: 'center', padding: '20px' }}>
      <h3>Editar Peso</h3>

      <div style={{ marginBottom: '15px' }}>
        <label>🎯 Peso Meta:</label>
        <input
          type="number"
          value={targetWeight}
          onChange={(e) => setTargetWeight(e.target.value)}
          style={{ fontSize: '16px', textAlign: 'center', padding: '6px', width: '100px', marginLeft: '10px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>⚖️ Peso Actual:</label>
        <input
          type="number"
          value={currentWeight}
          onChange={(e) => setCurrentWeight(e.target.value)}
          style={{ fontSize: '16px', textAlign: 'center', padding: '6px', width: '100px', marginLeft: '10px' }}
        />
      </div>

      <button
        onClick={handleSave}
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '16px'
        }}
      >
        Guardar
      </button>
    </div>
  );
}