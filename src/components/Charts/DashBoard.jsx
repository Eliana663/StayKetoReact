import WeightChart from '@/components/Charts/WeightChart';

export default function Dashboard({ userId }) {
  return (
    <div>
      <h2>Graficos y Progreso</h2>

    
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <WeightChart userId={userId} />
        </div>
    </div>
  )
}