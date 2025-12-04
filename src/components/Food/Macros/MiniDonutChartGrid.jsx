import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import MiniDonutChart from './MiniDonutChart';
import { startOfWeek, endOfWeek, format } from 'date-fns';
import { api } from "../../../api";

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

  const inicioSemana = startOfWeek(hoy, { weekStartsOn: 1 }); 
  const finSemana = endOfWeek(hoy, { weekStartsOn: 1 }); 

  const formatDate = (date) => format(date, 'yyyy-MM-dd');

  const start = formatDate(inicioSemana);
  const end = formatDate(finSemana);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get(`/api/daily-food/macros-by-date?start=${start}&end=${end}`);
      const json = res.data; // Axios devuelve los datos aquí

      // Agregar nombre del día y fecha formateada
      const dataConLabels = json.map(item => ({
        ...item,
        label: getDayName(item.date), // día de la semana
        dateLabel: format(new Date(item.date), 'dd/MM/yyyy') // fecha
      }));

      setData(dataConLabels);
      setLoading(false);

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  fetchData();
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
            label={`${day.label}`} // Día
            dateLabel={day.dateLabel} // Fecha
          />
        </div>
      ))}
    </div>
  );
}