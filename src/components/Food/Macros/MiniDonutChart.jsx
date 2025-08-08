import React from 'react';
import MiniDonutChart from './MiniDonutChart';

export default function MiniDonutChartGrid({ data }) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        justifyContent: 'center',
      }}
    >
      {data.map((day, index) => (
        <div key={index} style={{ textAlign: 'center' }}>
          <MiniDonutChart
            item={day}
            label={day.label || new Date(day.date).toLocaleDateString()}
          />
        </div>
      ))}
    </div>
  );
}