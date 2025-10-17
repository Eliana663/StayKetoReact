import React, { useState } from 'react';
import { useUser } from '../AuthContext';
import FoodCard from '@/components/Food/FoodCard/FoodCard';

export default function AllowedFoods() {
  const { user } = useUser();
  const [searchItem, setSearchItem] = useState('');
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!user) {
    console.error("No user logged in");
    return null;
  }

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

  return (
    <div className="container my-4">
      <h2>Explorar alimentos</h2>

      {/* Cajita de instrucciones */}
      <div className="alert alert-info" role="alert">
        Busca tu alimento y verifica si es apto para la dieta cetogénica.
        <strong> (Keto o No Keto)</strong>
      </div>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Ej: aguacate, huevo, pollo..."
          value={searchItem}
          onChange={e => setSearchItem(e.target.value)}
        />
        <button
          className="btn btn-success"
          onClick={() => fetchFoodByName(searchItem)}
        >
          Buscar
        </button>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-danger">{error}</p>}

      <div className="d-flex flex-column gap-3">
        {foodItems.map(item => (
          <FoodCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
