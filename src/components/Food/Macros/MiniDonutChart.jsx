import React from 'react';
import ReactECharts from 'echarts-for-react';

export default function MiniDonutChart({ item, label }) {
  // Valores por defecto para evitar errores
  const proteins = item?.proteins || 0;
  const fat = item?.fat || 0;
  const carbs = item?.carbohydrates || 0;

  const data = [
    { value: proteins, name: 'Proteínas' },
    { value: fat, name: 'Grasas' },
    { value: carbs, name: 'Carbohidratos' },
  ];

  const option = {
    tooltip: { trigger: 'item' },
    legend: { show: false },
    series: [
      {
        name: label,
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 12, fontWeight: 'bold' }
        },
        labelLine: { show: false },
        data,
        color: ['blue', 'green', 'red']
      }
    ]
  };

  return (
    <div style={{ width: 120, height: 120 }}>
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      <div style={{ textAlign: 'center', marginTop: 6, fontSize: 12 }}>{label}</div>
    </div>
  );
}