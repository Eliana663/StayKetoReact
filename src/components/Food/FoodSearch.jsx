import React, { useState } from 'react';
import FoodCard from '@/components/Food/FoodCard/FoodCard';
import Mismacros from '@/components/Food/Mismacros';


export default function FoodSearch() {
  const [searchItem, setSearchItem] = useState('');
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showMacros, setShowMacros] = useState(false);

  const fetchFoodByName = async (name) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:8081/food/searchByName?name=${encodeURIComponent(name)}`);
      if (!response.ok) throw new Error('Error al obtener los alimentos');

      const data = await response.json();
      if (!data || data.length === 0) {
        setFoodItems([]);
        setError('No se encontraron alimentos con ese término');
        return;
      }

      setFoodItems(data);
    } catch (err) {
      setError(err.message);
      setFoodItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (item, amount) => {
  const quantity = Number(amount) || 100;
  const factor = quantity / (item.quantity || 100);

  const newItem = {
    foodItemId: item.id,
    name: item.name,
    carbohydrates: (item.carbohydrates || 0) * factor,
    proteins: (item.proteins || 0) * factor,
    fat: (item.fat || 0) * factor,
    calories: (item.calories || 0) * factor,
    amount: quantity,
    date: new Date().toISOString().slice(0, 10), // yyyy-MM-dd
  };

 
  setSelectedItems(prev => [...prev, newItem]);

  // Saving in backend
      try {
        const res = await fetch('http://localhost:8081/api/daily-food', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(newItem),
        });
        if (!res.ok) throw new Error('Error guardando alimento');
      } catch (error) {
        console.error(error);
      }
    };
      const handleRemoveItem = (index) => {
        setSelectedItems(prev => prev.filter((_, i) => i !== index));
      };

      const totalProteins = selectedItems.reduce((sum, f) => sum + f.proteins, 0);
      const totalFat = selectedItems.reduce((sum, f) => sum + f.fat, 0);
      const totalCarbs = selectedItems.reduce((sum, f) => sum + f.carbohydrates, 0);
      const totalCalories = selectedItems.reduce((sum, f) => sum + f.calories, 0);

      if (showMacros) {
        return (
          <div className="container my-4">
            <button className="btn btn-secondary mb-3" onClick={() => setShowMacros(false)}>
              Volver a búsqueda
            </button>
            <Mismacros
              proteins={totalProteins}
              fat={totalFat}
              carbs={totalCarbs}
              calories={totalCalories}
            />
          </div>
        );
      }

  return (

     <div>
         

    <div className="container my-1">
      <h2>Buscar alimento</h2>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Ej: manzana"
          value={searchItem}
          onChange={e => setSearchItem(e.target.value)}
        />
        <button className="btn btn-success" onClick={() => fetchFoodByName(searchItem)}>Buscar</button>
      </div>

      <button
          className="btn btn-success mt-3 mb-3"
          onClick={() => setShowMacros(true)}
        >
          Ver mis macros
      </button>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-danger">{error}</p>}

      <div className="d-flex flex-column gap-3">
        {foodItems.map(item => (
          <FoodCard key={item.id} item={item} onAdd={handleAddItem} />
        ))}
      </div>

      {selectedItems.length > 0 && (
        <div
          className="position-fixed bottom-0 start-0 w-100 bg-white border-top shadow"
          style={{ zIndex: 1050, padding: '1rem', maxHeight: '50vh', overflowY: 'auto' }}
        >
          <h4 className="mb-3">Resumen de alimentos añadidos</h4>

          <div className="d-flex flex-wrap gap-3 mb-4">
            {selectedItems.map((item, idx) => (
              <div key={idx} className="position-relative border rounded p-2" style={{ minWidth: 120 }}>
                <button
                  onClick={() => handleRemoveItem(idx)}
                  className="btn-close position-absolute top-0 end-0 m-1"
                  aria-label="Eliminar"
                  style={{ fontSize: '0.7rem' }}
                />
                <strong>{item.name}</strong><br />
                <span>{item.calories.toFixed(0)} kcal</span>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-around border-top pt-3">
            <div style={{ color: 'blue' }}>
              <strong>Proteínas:</strong> {totalProteins.toFixed(1)} g
            </div>
            <div style={{ color: 'green' }}>
              <strong>Grasas:</strong> {totalFat.toFixed(1)} g
            </div>
            <div style={{ color: 'red' }}>
              <strong>Carbohidratos:</strong> {totalCarbs.toFixed(1)} g
            </div>
            <div style={{ color: 'gray' }}>
              <strong>Calorías:</strong> {totalCalories.toFixed(0)} kcal
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
