import axios from 'axios';
import { useEffect, useState } from 'react';
import * as echarts from 'echarts';

function WeightChart() {
  const userId = 1;
  const [weights, setWeights] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8081/api/users/${userId}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, [userId]);

  // Traer los datos del back-end
  useEffect(() => {
    axios.get(`http://localhost:8081/api/charts/users/${userId}/daily-weight`)
      .then(res => setWeights(res.data))
      .catch(err => console.error('Error fetching weights:', err));
  }, [userId]);

  
  useEffect(() => {
    if (weights.length === 0) return;

   const dias = weights.map(w => {
    const date = new Date(w.date); 
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = String(date.getFullYear()).slice(2);
    return `${day}/${month}/${year}`;
   })

    const weightValues = weights.map(w => w.weight);
    const minWeight = Math.floor(Math.min(...weightValues) - 1); 
    const maxWeight = Math.ceil(Math.max(...weightValues) + 1); 
    
    const expCurve = weightValues.map((w, i) => weightValues[0] * Math.exp(-0.1 * i));

    const logCurve = weightValues.map((w, i) => weightValues[0] + Math.log(i + 1) * (-0.2));

    const chartDom = document.getElementById('weightChart');
    const myChart = echarts.init(chartDom);

    const option = {
      title: { text: 'Peso Diario' },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: dias },
      yAxis: { type: 'value', min: minWeight, max: maxWeight, interval: 2, axisLabel: {formatter: '{value} kg'} },
      series: [
        {
          name: 'Peso Registrado',
          type: 'line',
          data: weightValues,
          smooth: true,
          lineStyle: { width: 3 }
        },
        {
          name: 'Tendencia Rápida',
          type: 'line',
          data: expCurve,
          smooth: true,
          lineStyle: { type: 'dashed' }
        },
        {
          name: 'Tendencia Gradual',
          type: 'line',
          data: logCurve,
          smooth: true,
          lineStyle: { type: 'dotted' }
        }
      ]
    };

    myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, [weights]);

  return <div id="weightChart" style={{ width: '100%', height: '400px' }} />;
}

export default WeightChart;

