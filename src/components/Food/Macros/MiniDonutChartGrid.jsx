import React, { useEffect, useState } from 'react';
import MiniDonutChart from './MiniDonutChart';

export default function MiniDonutChartGrid() {
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/daily-food/macros-by-date?start=2025-08-01&end=2025-08-07')
      .then(res => res.json())
      .then(data => {
        const prepared = data.map(d => ({
          ...d,
          label: new Date(d.date).toLocaleDateString(),
        }));
        setDailyData(prepared);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (!dailyData.length) return <p>No hay datos para mostrar.</p>;

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        justifyContent: 'center',
      }}
    >
      {dailyData.map((day, index) => (
        <div key={index} style={{ textAlign: 'center' }}>
          <MiniDonutChart item={day} label={day.label || `Día ${index + 1}`} />
        </div>
      ))}
    </div>
  );
}