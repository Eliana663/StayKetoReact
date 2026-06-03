import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import MiniDonutChart from './MiniDonutChart';
import { startOfWeek, endOfWeek, format } from 'date-fns';
import { API_BASE_URL } from '../../../constants';

export default function MiniDonutChartGrid() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { weekday: 'long' }); 
  };

 useEffect(() => {
    const hoy = new Date();
    const inicioSemana = startOfWeek(hoy, { weekStartsOn: 1 });
    const finSemana = endOfWeek(hoy, { weekStartsOn: 1 });
    const formatDate = (date) => format(date, 'yyyy-MM-dd');
    const start = formatDate(inicioSemana);
    const end = formatDate(finSemana);

    setLoading(true);
    setError(null);

   
    const token = localStorage.getItem("token");

    
    fetch(`${API_BASE_URL}/api/daily-food/macros-by-date?start=${start}&end=${end}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) {
           if(res.status === 401) throw new Error('Sesión expirada o no autorizada');
           throw new Error('Error al cargar datos');
        }
        return res.json();
      })
      .then(json => {
        const dataConLabels = json.map(item => ({
          ...item,
          label: getDayName(item.date),
          dateLabel: format(new Date(item.date), 'dd/MM/yyyy')
        }));

        setData(dataConLabels);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando datos de macros...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;
  if (data.length === 0) return <p>No hay datos para mostrar.</p>;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
      {data.map((day, index) => (
        <div key={index} style={{ textAlign: 'center' }}>
          <MiniDonutChart
            item={day}
            label={`${day.label}`} 
            dateLabel={day.dateLabel} 
          />
        </div>
      ))}
    </div>
  );
}