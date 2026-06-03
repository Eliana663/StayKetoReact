import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import FoodCard from '@/components/Food/FoodCard/FoodCard';
import { API_BASE_URL } from '../../constants';
import { useTranslation } from 'react-i18next'; 

export default function AllowedFoods() {
  const { user } = useAuth();
  const [searchItem, setSearchItem] = useState('');
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation(); 

  const fetchFoodByName = async (name) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/food/searchByName?name=${encodeURIComponent(name)}`);
      
      if (!response.ok) throw new Error(t('allowed_foods.error_fetch'));
      
      const data = await response.json();

      if (!data || data.length === 0) {
        setFoodItems([]);
        setError(t('allowed_foods.error_not_found'));
        return;
      }

      setFoodItems(data);
    } catch (err) {
      setError(err.message === 'Failed to fetch' ? t('allowed_foods.error_fetch') : err.message);
      setFoodItems([]);
    } finally {
      loading && setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <h2>{t('allowed_foods.title')}</h2>

     
      <div className="alert alert-info" role="alert">
        {t('allowed_foods.info_alert')}
      </div>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder={t('allowed_foods.placeholder')} 
          value={searchItem}
          onChange={e => setSearchItem(e.target.value)}
        />
        <button
          className="btn btn-success"
          onClick={() => fetchFoodByName(searchItem)}
        >
          {t('allowed_foods.btn_search')}
        </button>
      </div>

      {loading && <p>{t('allowed_foods.loading')}</p>}
      {error && <p className="text-danger">{error}</p>}

      <div className="d-flex flex-column gap-3">
        {foodItems.map(item => (
          <FoodCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}