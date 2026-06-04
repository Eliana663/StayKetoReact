import { useAuth } from '../AuthContext';
import WeightChart from '@/components/Charts/WeightChart';
import MeasurementsChart from '@/components/Charts/MeasurementsChart';
import { useTranslation } from 'react-i18next'; 

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useTranslation(); 

  if (!user) return <p>{t("dashboard.loading_user")}</p>; 

  return (
    <div>
      <h2>{t("dashboard.title")}</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <WeightChart userId={user.id} />
        <MeasurementsChart userId={user.id} />
      </div>
    </div>
  );
}