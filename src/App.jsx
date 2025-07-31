import { Routes, Route } from 'react-router-dom';
import FoodSearch from './components/Food/FoodSearch';
import ProfilePage from './components/ProfilePage';
import TopNavbar from './components/TopNavBar';
import PersonalPanel from './components/PersonalPanel';
import AvocadoBackground from './components/AvocadoBackground';

function App() {
  return (
    <>
    <TopNavbar />
    <AvocadoBackground>
      
      <Routes>
        <Route path="/foodDiary" element={<FoodSearch />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/personalPanel" element={<PersonalPanel />} />
      </Routes>
    </AvocadoBackground>
    </>
  );
}

export default App;