import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import FoodCard from '@/components/Food/FoodCard/FoodCard';
import Mismacros from '@/components/Food/Macros/Mismacros';
import { API_BASE_URL } from '../../constants';
import { useTranslation } from 'react-i18next'; 

export default function FoodSearch() {
  const { user } = useAuth();
  const { t } = useTranslation(); 

  const [searchItem, setSearchItem] = useState('');
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 
  const [selectedItems, setSelectedItems] = useState([]);
  const [showMacros, setShowMacros] = useState(false);

  const token = localStorage.getItem("token"); 
  const configHeaders = { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  
  if (!user) {
    console.error("No user logged in");
    return <p>{t("food_search.no_user")}</p>;
  }

  const fetchTodaySelectedItems = async () => {
    try {
      const today = new Date().toISOString().slice(0, 10); 
      const res = await fetch(`${API_BASE_URL}/api/daily-food?date=${today}`, {
        headers: configHeaders
      });
      if (!res.ok) throw new Error('load_failed');
      const data = await res.json();
      setSelectedItems(data);
    } catch (err) {
      console.error(err);
      
    }
  };

  useEffect(() => {
    fetchTodaySelectedItems();
  }, []);

  const fetchFoodByName = async (name) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/food/searchByName?name=${encodeURIComponent(name)}`, {
        headers: configHeaders
      });
      if (!response.ok) throw new Error('fetch_failed');

      const data = await response.json(); 

      if (!data || data.length === 0) {
        setFoodItems([]);
        setError('food_search.errors.not_found');
        return;
      }

      setFoodItems(data);
    } catch (err) {
        if (err.message === 'fetch_failed') {
        setError('food_search.errors.fetch_failed');
      } else {
        setError('food_search.errors.generic');
      }
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
      weightInGrams: quantity,
      date: new Date().toISOString().slice(0, 10),
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/daily-food/users/${user.id}`, {
        method: 'POST',
        headers: configHeaders,
        body: JSON.stringify(newItem),
      });
      if (!res.ok) throw new Error('save_failed');

      await fetchTodaySelectedItems();
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
          {t("food_search.btn_back")}
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
        <h2>{t("food_search.title")}</h2>

        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder={t("food_search.placeholder_search")}
            value={searchItem}
            onChange={e => setSearchItem(e.target.value)}
          />
          <button className="btn btn-success" onClick={() => fetchFoodByName(searchItem)}>
            {t("food_search.btn_search")}
          </button>
        </div>

        <button
          className="btn btn-success mt-3 mb-3"
          onClick={() => setShowMacros(true)}
        >
          {t("food_search.btn_view_macros")}
        </button>

        {loading && <p>{t("food_search.loading")}</p>}
        {error && <p className="text-danger">{t(error)}</p>}

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
            <h4 className="mb-3">{t("food_search.summary_title")}</h4>

            <div className="d-flex flex-wrap gap-3 mb-4">
              {selectedItems.map((item, idx) => (
                <div key={idx} className="position-relative border rounded p-2" style={{ minWidth: 120 }}>
                  <button
                    onClick={() => handleRemoveItem(idx)}
                    className="btn-close position-absolute top-0 end-0 m-1"
                    aria-label="Eliminar"
                    style={{ fontSize: '0.7rem' }}
                  />
                  {/* item.name viene de la base de datos de alimentos, se renderiza tal cual */}
                  <strong>{item.name}</strong><br />
                  <span>{item.calories.toFixed(0)} kcal</span>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-around border-top pt-3">
              <div style={{ color: 'blue' }}>
                <strong>{t("food_search.label_proteins")}:</strong> {totalProteins.toFixed(1)} g
              </div>
              <div style={{ color: 'green' }}>
                <strong>{t("food_search.label_fat")}:</strong> {totalFat.toFixed(1)} g
              </div>
              <div style={{ color: 'red' }}>
                <strong>{t("food_search.label_carbs")}:</strong> {totalCarbs.toFixed(1)} g
              </div>
              <div style={{ color: 'gray' }}>
                <strong>{t("food_search.label_calories")}:</strong> {totalCalories.toFixed(0)} kcal
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}