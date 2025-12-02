import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';

const colors = ['#5470C6', '#91CC75', '#EE6666', '#FAC858', '#73C0DE', '#3BA272'];

export default function MeasurementsChart({ userId }) {
  const [measurements, setMeasurements] = useState([]);
  const [option, setOption] = useState(null);
  const token = localStorage.getItem("token"); 
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!userId) return;

    axios.get(`http://localhost:8081/api/daily-measurements/user/${userId}`,config)
      .then(res => setMeasurements(res.data))
      .catch(err => console.error(err));
  }, [userId]);

  useEffect(() => {
    if (!measurements || measurements.length === 0) return;

    const sortedMeasurements = [...measurements].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // Fechas para eje X
    const dias = sortedMeasurements.map(m => {
      const date = new Date(m.date);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(2);
      return `${day}/${month}/${year}`;
    });

    // Detectar todas las medidas presentes en cualquier fecha
    const measurementKeys = Array.from(
      new Set(
        sortedMeasurements.flatMap(m =>
          Object.keys(m).filter(k => !['id', 'userId', 'date'].includes(k) && m[k] != null)
        )
      )
    );

    const series = [];
    let globalMin = Infinity;
    let globalMax = -Infinity;

    measurementKeys.forEach((key, index) => {
      const color = colors[index % colors.length];

      // Tomamos los valores por fecha, null si falta
      const values = sortedMeasurements.map(m =>
        m[key] != null ? Number(m[key]) : null
      );

      const validValues = values.filter(v => v != null);
      if (validValues.length === 0) return;

      // Actualizar min/max global
      const min = Math.min(...validValues);
      const max = Math.max(...validValues);
      if (min < globalMin) globalMin = min;
      if (max > globalMax) globalMax = max;

      // Pequeño offset visual para diferenciar líneas idénticas
      const offsetValues = values.map(v => (v != null ? v + index * 0.01 : null));

      series.push({
        name: key.toUpperCase(),
        type: 'line',
        data: offsetValues,
        smooth: true,
        lineStyle: { color, width: 3 },
        connectNulls: false,
        showSymbol: true,
        symbolSize: 6,
        label: { show: false }
      });
    });

    setOption({
      title: { text: 'Registro de Medidas' },
      tooltip: { trigger: 'axis' },
      legend: { type: 'scroll', top: 'bottom' },
      xAxis: { type: 'category', data: dias },
      yAxis: {
        type: 'value',
        min: Math.floor(globalMin - 1),
        max: Math.ceil(globalMax + 1),
        axisLabel: { formatter: '{value} cm' }
      },
      series
    });

  }, [measurements]);

  return (
    <div style={{ width: '100%', height: '400px' }}>
      {option ? (
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      ) : (
        <p>Cargando gráfico...</p>
      )}
    </div>
  );
}
