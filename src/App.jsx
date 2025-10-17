import { Routes, Route } from 'react-router-dom';
import FoodSearch from './components/Food/FoodSearch';
import ProfilePage from './components/ProfilePage';
import TopNavbar from './components/TopNavBar';
import PersonalPanel from './components/PersonalPanel/PersonalPanel';
import AvocadoBackground from './components/AvocadoBackground';
import LandingPage from './components/LandingPage';
import DashBoard from './components/Charts/DashBoard';
import { AuthContext } from './components/AuthContext';
import { RequireUser } from './components/RequireUser';
import CalorieGoal from './components/CetoCalc/CalorieGoal';
import KetoDietIntro from './components/KetoDietIntro';
import { AllowedFoods } from './components/MainMenu';

function App() {
  return (
    <AuthContext>
      <TopNavbar />
      <AvocadoBackground>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<KetoDietIntro />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/home" element={<KetoDietIntro />} />
          <Route path="/allowedFoods" element={<AllowedFoods />} />

          {/* Private Routes */}
          <Route path="/foodDiary" element={<RequireUser><FoodSearch /></RequireUser>} />
          <Route path="/profile" element={<RequireUser><ProfilePage /></RequireUser>} />
          <Route path="/panelPersonal" element={<RequireUser><PersonalPanel /></RequireUser>} />
          <Route path="/progresoGraficos" element={<RequireUser><DashBoard /></RequireUser>} />
          <Route path="/calculadoraKeto" element={<RequireUser><CalorieGoal /></RequireUser>} />
        </Routes>
      </AvocadoBackground>
    </AuthContext>
  );
}

export default App;
