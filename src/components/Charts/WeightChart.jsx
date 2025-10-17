import { useUser } from '../AuthContext';
import { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import axios from 'axios';

function WeightChart() {
  const { user } = useUser();
  const [weights, setWeights] = useState([]);

  // Traer datos del backend
  useEffect(() => {
    if (!user) return;

    axios.get(`http://localhost:8081/api/charts/users/${user.id}/daily-weight`)
      .then(res => setWeights(res.data || []))
      .catch(err => console.error('Error fetching weights:', err));
  }, [user]);

  // Generar gráfico
  useEffect(() => {
    if (!user || !weights.length || user.targetWeight === undefined) return;

    const sortedWeights = [...weights].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    const dias = sortedWeights.map(w => {
      const date = new Date(w.date);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(2);
      return `${day}/${month}/${year}`;
    });

    const weightValues = sortedWeights.map(w => w.weight);
    if (!weightValues.length) return; // protección extra

    
    const minWeight = Math.floor(Math.min(...weightValues) - 1);
    const maxWeight = Math.ceil(Math.max(...weightValues) + 1);

    const expCurve = weightValues.map((w, i) => weightValues[0] * Math.exp(-0.1 * i));
    const logCurve = weightValues.map((w, i) => weightValues[0] + Math.log(i + 1) * (-0.2));
    const targetLine = weightValues.map(() => Number(user.targetWeight) || 0);

    const chartDom = document.getElementById('weightChart');
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    const option = {
      title: { text: 'Registro de Peso' },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: dias },
      yAxis: {
        type: 'value',
        min: minWeight,
        max: maxWeight,
        interval: 2,
        axisLabel: { formatter: '{value} kg' }
      },
      series: [
        { name: 'Peso Registrado', type: 'line', data: weightValues, smooth: true, lineStyle: { width: 3 } },
        { name: 'Tendencia Rápida', type: 'line', data: expCurve, smooth: true, lineStyle: { type: 'dashed' } },
        { name: 'Tendencia Gradual', type: 'line', data: logCurve, smooth: true, lineStyle: { type: 'dotted' } },
        { name: 'Peso meta', type: 'line', data: targetLine, smooth: true, lineStyle: { width: 3, color: 'red' } }
      ]
    };

    myChart.setOption(option);

    return () => myChart.dispose();
  }, [weights, user]);

  return <div id="weightChart" style={{ width: '100%', height: '400px' }} />;
}

export default WeightChart;
