import { useAuth } from '../AuthContext';
import WeightChart from '@/components/Charts/WeightChart';
import MeasurementsChart from '@/components/Charts/MeasurementsChart';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return <p>Cargando datos del usuario...</p>; 

  return (
    <div>
      <h2>Gráficos y Progreso</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <WeightChart userId={user.id} />
        <MeasurementsChart userId={user.id} />
      </div>
    </div>
  );
}
