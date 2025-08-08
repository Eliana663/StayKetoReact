import React, { useEffect, useState } from 'react';
import MiniDonutChart from './MiniDonutChart';

export default function MiniDonutChartGrid() {
  const [dailyData, setDailyData] = useState(null); // null para diferenciar entre loading y vacío
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/daily-food/macros-by-date?start=2025-08-01&end=2025-08-07')
      .then(res => res.json())
      .then(data => {
        // Si data es vacío o undefined, crear un array con días vacíos
        const prepared = (data && data.length > 0 ? data : generateEmptyWeekData()).map(d => ({
          ...d,
          label: d.date ? new Date(d.date).toLocaleDateString() : d.label,
          proteins: d.proteins ?? 0,
          fat: d.fat ?? 0,
          carbs: d.carbs ?? 0,
          calories: d.calories ?? 0,
        }));
        setDailyData(prepared);
        setLoading(false);
      })
      .catch(() => {
        setDailyData(generateEmptyWeekData());
        setLoading(false);
      });
  }, []);

  // Función para generar datos vacíos para 7 días
  function generateEmptyWeekData() {
    const baseDate = new Date('2025-08-01');
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + i);
      return {
        date: date.toISOString().slice(0, 10),
        label: date.toLocaleDateString(),
        proteins: 0,
        fat: 0,
        carbs: 0,
        calories: 0,
      };
    });
  }

  if (loading) return <p>Cargando...</p>;

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