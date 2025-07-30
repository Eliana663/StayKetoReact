import { Routes, Route } from 'react-router-dom';
import FoodSearch from './components/Food/FoodSearch';
import ProfilePage from './components/ProfilePage';
import TopNavbar from './components/TopNavBar';
import AvocadoBackground from './components/AvocadoBackground';

function App() {
  return (
    <>
    <TopNavbar />
    <AvocadoBackground>
      
      <Routes>
        <Route path="/" element={<FoodSearch />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </AvocadoBackground>
    </>
  );
}

export default App;