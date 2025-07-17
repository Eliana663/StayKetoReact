import React, { useState } from "react";
import FoodCard from '../components/FoodCard';

export default function FoodSearch() {
  const [searchItem, setSearchItem] = useState('');
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFoodByName = async (name) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:8081/food/searchByName?name=${encodeURIComponent(name)}`);
      if (!response.ok) throw new Error('Error al obtener los alimentos');

      const text = await response.text();
      if (!text) {
        setFoodItems([]);
        setError('No se encontraron alimentos con ese término');
        return;
      }

      const data = JSON.parse(text);
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

  const handleAdd = (item, amount) => {
    alert(`Agregado: ${amount} ${item.unit} de ${item.commonName}`);
  };

  return (
    <div className="container my-4">
      <h2 className="mb-3">Buscar alimento</h2>

      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Ej: manzana"
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
        />
        <button className="btn btn-primary" onClick={() => fetchFoodByName(searchItem)}>Buscar</button>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-danger">{error}</p>}

      {/* Contenedor vertical con gap */}
      <div className="d-flex flex-column gap-3">
        {foodItems.map((item) => (
          <FoodCard key={item.id} item={item} onAdd={handleAdd} />
        ))}
      </div>
    </div>
  );
}