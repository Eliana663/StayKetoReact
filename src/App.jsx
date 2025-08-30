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

function App() {
  return (
  <>
    <TopNavbar />
    <AvocadoBackground>
      {/* Public Routes*/}
      <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<LandingPage />} />
      </Routes>

      {/* Private Routes */}

      <AuthContext>
        <RequireUser>
            <Routes>
              <Route path="/foodDiary" element={<FoodSearch />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/panelPersonal" element={<PersonalPanel />} />
              <Route path="/progresoGraficos" element={<DashBoard />} />
            </Routes>
        </RequireUser>
      </AuthContext>
    </AvocadoBackground>
    </>
    
  );
}

export default App;