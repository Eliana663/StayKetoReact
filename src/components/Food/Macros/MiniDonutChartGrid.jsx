import React, { useEffect, useState } from 'react';
import MiniDonutChart from './MiniDonutChart';

export default function MiniDonutChartGrid() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener nombre del día en español
  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { weekday: 'long' }); // ej: "lunes"
  };

  useEffect(() => {
    const hoy = new Date();
    const hace7Dias = new Date();
    hace7Dias.setDate(hoy.getDate() - 7);

    const formatDate = (date) => date.toISOString().split('T')[0];

    const start = formatDate(hace7Dias);
    const end = formatDate(hoy);

    setLoading(true);
    setError(null);

    fetch(`http://localhost:8081/api/daily-food/macros-by-date?start=${start}&end=${end}`)
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar datos');
        return res.json();
      })
      .then(json => {
        // Agregar label con nombre del día
        const dataConLabels = json.map(item => ({
          ...item,
          label: getDayName(item.date)
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
            label={day.label}
          />
        </div>
      ))}
    </div>
  );
}