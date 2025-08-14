import React from 'react';
import ReactECharts from 'echarts-for-react';

export default function MiniDonutChart({ item, label, dateLabel }) {
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
    <div style={{ width: 120, height: 140 }}>
      <ReactECharts option={option} style={{ height: 120, width: '100%' }} />
      <div style={{ textAlign: 'center', fontSize: 12, marginTop: 4 }}>
        <div>{label}</div>
        <div style={{ fontSize: 10, color: '#666' }}>{dateLabel}</div>
      </div>
    </div>
  );
}