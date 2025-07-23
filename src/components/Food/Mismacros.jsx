import React from 'react';
import ReactECharts from 'echarts-for-react';

export default function Mismacros({ proteins = 0, fat = 0, carbs = 0, calories = 0 }) {
  // Objetivos diarios base
  const proteinGoal = 75;     // g
  const fatGoal = 130;        // g
  const carbGoal = 30;        // g
  const calorieGoal = 1600;   // kcal

  const data = [
    { value: proteins, name: 'Proteínas (g)' },
    { value: fat, name: 'Grasas (g)' },
    { value: carbs, name: 'Carbohidratos (g)' }
  ];

  const option = {
    title: {
      text: 'Mis Macros Hoy',
      left: 'center',
      top: 40,
      textStyle: { fontSize: 25 }
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        return `${params.name}: ${params.value.toFixed(2)} g (${params.percent.toFixed(1)}%)`;
      }
    },
    color: ['blue', 'green', 'red'],
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 60,
      data: data.map(item => item.name)
    },
    series: [
      {
        name: 'Macros',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '60%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'outside',
          formatter: function (params) {
            return `${params.name}\n${params.value.toFixed(2)} g (${params.percent.toFixed(1)}%)`;
          },
          fontWeight: 'bold',
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 4,
          padding: [4, 8]
        },
        labelLine: {
          show: true,
          length: 15,
          length2: 20,
          smooth: true
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 18,
            fontWeight: 'bold'
          }
        },
        data
      }
    ]
  };

  const proteinPct = Math.min((proteins / proteinGoal) * 100, 100);
  const fatPct = Math.min((fat / fatGoal) * 100, 100);
  const carbPct = Math.min((carbs / carbGoal) * 100, 100);
  const calPct = Math.min((calories / calorieGoal) * 100, 100);

  return (
    <div>
      <ReactECharts option={option} style={{ height: 500, width: '100%' }} />

      <div style={{ padding: '0 1rem', marginTop: 20 }}>
        <div className="mb-2">
          <label>Carbohidratos (máx {carbGoal} g)</label>
          <div style={{ background: '#f0f0f0', height: '14px', borderRadius: '7px' }}>
            <div
              style={{
                width: `${carbPct}%`,
                height: '100%',
                background: 'red',
                borderRadius: '7px'
              }}
            ></div>
          </div>
        </div>

        <div className="mb-2">
          <label>Grasas (objetivo {fatGoal} g)</label>
          <div style={{ background: '#f0f0f0', height: '14px', borderRadius: '7px' }}>
            <div
              style={{
                width: `${fatPct}%`,
                height: '100%',
                background: 'green',
                borderRadius: '7px'
              }}
            ></div>
          </div>
        </div>

        <div className="mb-2">
          <label>Proteínas (objetivo {proteinGoal} g)</label>
          <div style={{ background: '#f0f0f0', height: '14px', borderRadius: '7px' }}>
            <div
              style={{
                width: `${proteinPct}%`,
                height: '100%',
                background: 'blue',
                borderRadius: '7px'
              }}
            ></div>
          </div>
        </div>

        <div className="mb-2">
          <label>Calorías (objetivo {calorieGoal} kcal)</label>
          <div style={{ background: '#f0f0f0', height: '14px', borderRadius: '7px' }}>
            <div
              style={{
                width: `${calPct}%`,
                height: '100%',
                background: 'gray',
                borderRadius: '7px'
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}