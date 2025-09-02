import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';

export default function DonutChart({ item }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!item) return;
    
    const chart = echarts.init(chartRef.current);

    const option = {
      title: {
        text: `${item.calories.toFixed(0)} kcal`,
        left: 'center',
        top: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold',
          color: '#333',
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}g ({d}%)',
      },
      legend: {
        orient: 'horizontal',
        bottom: 0,
        icon: 'circle',
        textStyle: {
          fontSize: 12,
        },
      },
      series: [
        {
          name: 'Nutrientes',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'outside',
            formatter: '{b}: {c}g',
          },
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          roundCap: true,
          data: [
            { value: item.carbohydrates || 0, name: 'Carbohidratos Netos' },
            { value: item.proteins || 0, name: 'Proteinas' },
            { value: item.fat || 0, name: 'Grasas' },
          ],
          color: ['#e32305', '#2196f3', '#35ab09'], 
        },
      ],
    };

    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, [item]);

  return <div ref={chartRef} style={{ width: '100%', height: 300, margin: '0 auto' }} />;
}