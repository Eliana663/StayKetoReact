import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import MiniDonutChartGrid from '@/components/Food/Macros/MiniDonutChartGrid';
import { startOfWeek, endOfWeek, format } from 'date-fns';

export default function Mismacros() {
  const [dailyMacros, setDailyMacros] = useState({
    proteins: 0,
    fat: 0,
    carbs: 0,
    calories: 0,
  });
  const [weeklyData, setWeeklyData] = useState([]);

  // 📅 Calcular inicio y fin de semana actual (lunes a domingo)
  const today = new Date();
  const startDate = format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const endDate = format(endOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');

  const formatDate = (d) => format(new Date(d), 'yyyy-MM-dd');

  useEffect(() => {
    async function fetchMacros() {
      try {
        console.log('📅 Fechas solicitadas:', startDate, endDate);

        const res = await fetch(
          `http://localhost:8081/api/daily-food/macros-by-date?start=${startDate}&end=${endDate}`
        );
        const data = await res.json();

        // 🛡 Filtrar días vacíos (todos en cero)
        const filteredData = data.filter(d =>
          (d.proteins > 0 || d.fat > 0 || d.carbohydrates > 0 || d.calories > 0)
        );

        setWeeklyData(filteredData);

        // 📅 Macros del día actual
        const todayString = formatDate(today);
        const todayMacros = filteredData.find(d => d.date === todayString) || {
          proteins: 0,
          fat: 0,
          carbohydrates: 0,
          calories: 0,
        };

        setDailyMacros({
          proteins: todayMacros.proteins || 0,
          fat: todayMacros.fat || 0,
          carbs: todayMacros.carbohydrates || 0,
          calories: todayMacros.calories || 0,
        });
      } catch (error) {
        console.error('❌ Error cargando macros:', error);
      }
    }
    fetchMacros();
  }, [startDate, endDate]);

  const proteinGoal = 75;
  const fatGoal = 130;
  const carbGoal = 30;
  const calorieGoal = 1600;

  const data = [
    { value: dailyMacros.proteins, name: 'Proteínas (g)' },
    { value: dailyMacros.fat, name: 'Grasas (g)' },
    { value: dailyMacros.carbs, name: 'Carbohidratos (g)' }
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
      formatter: params =>
        `${params.name}: ${params.value.toFixed(2)} g (${params.percent.toFixed(1)}%)`
    },
    color: ['blue', 'green', 'red'],
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 60,
      data: data.map(item => item.name)
    },
    series: [{
      name: 'Macros',
      type: 'pie',
      radius: ['70%'],
      center: ['50%', '60%'],
      avoidLabelOverlap: false,
      label: {
        show: true,
        position: 'outside',
        formatter: params =>
          `${params.name}\n${params.value.toFixed(2)} g (${params.percent.toFixed(1)}%)`,
        fontWeight: 'bold',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        padding: [4, 8]
      },
      labelLine: { show: true, length: 15, length2: 20, smooth: true },
      emphasis: { label: { show: true, fontSize: 18, fontWeight: 'bold' } },
      data
    }]
  };

  const proteinPct = Math.min((dailyMacros.proteins / proteinGoal) * 100, 100);
  const fatPct = Math.min((dailyMacros.fat / fatGoal) * 100, 100);
  const carbPct = Math.min((dailyMacros.carbs / carbGoal) * 100, 100);
  const calPct = Math.min((dailyMacros.calories / calorieGoal) * 100, 100);

  return (
    <div>
      <ReactECharts option={option} style={{ height: 500, width: '100%' }} />

      <div style={{ padding: '0 1rem', marginTop: 20 }}>
        <div className="mb-2">
          <label>Carbohidratos: {dailyMacros.carbs.toFixed(1)} g / {carbGoal} g</label>
          <div style={{ background: '#f0f0f0', height: '14px', borderRadius: '7px' }}>
            <div style={{
              width: `${carbPct}%`,
              height: '100%',
              background: 'red',
              borderRadius: '7px'
            }}></div>
          </div>
        </div>

        <div className="mb-2">
          <label>Grasas: {dailyMacros.fat.toFixed(1)} g / {fatGoal} g</label>
          <div style={{ background: '#f0f0f0', height: '14px', borderRadius: '7px' }}>
            <div style={{
              width: `${fatPct}%`,
              height: '100%',
              background: 'green',
              borderRadius: '7px'
            }}></div>
          </div>
        </div>

        <div className="mb-2">
          <label>Proteínas: {dailyMacros.proteins.toFixed(1)} g / {proteinGoal} g</label>
          <div style={{ background: '#f0f0f0', height: '14px', borderRadius: '7px' }}>
            <div style={{
              width: `${proteinPct}%`,
              height: '100%',
              background: 'blue',
              borderRadius: '7px'
            }}></div>
          </div>
        </div>

        <div className="mb-2">
          <label>Calorías: {dailyMacros.calories.toFixed(0)} kcal / {calorieGoal} kcal</label>
          <div style={{ background: '#f0f0f0', height: '14px', borderRadius: '7px' }}>
            <div style={{
              width: `${calPct}%`,
              height: '100%',
              background: 'gray',
              borderRadius: '7px'
            }}></div>
          </div>
        </div>
      </div>

      <div className="mt-5 px-3">
        <h3 className="text-lg font-semibold mb-2">Resumen Semanal</h3>
        {/* 📅 Pasar fecha formateada al componente para mostrar debajo */}
        <MiniDonutChartGrid
          data={weeklyData.map(d => ({
            ...d,
            displayDate: format(new Date(d.date), 'dd/MM/yyyy')
          }))}
        />
      </div>
    </div>
  );
}