import { Routes, Route } from "react-router-dom";
import FoodSearch from "./components/Food/FoodSearch";
import ProfilePage from "./components/ProfilePage";
import TopNavbar from "./components/TopNavBar";
import PersonalPanel from "./components/PersonalPanel/PersonalPanel";
import AvocadoBackground from "./components/AvocadoBackground";
import LandingPage from "./components/LandingPage";
import DashBoard from "./components/Charts/DashBoard";
import CalorieGoal from "./components/CetoCalc/CalorieGoal";
import KetoDietIntro from "./components/KetoDietIntro";
import { AllowedFoods, KetoDiet, KetoRecipesPage } from "./components/MainMenu";
import { AuthProvider } from "./components/AuthContext";
import { RequireUser } from "./components/RequireUser";

function App() {
  return (
    <AuthProvider>
      <TopNavbar />
      <AvocadoBackground>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<KetoDietIntro />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/home" element={<KetoDietIntro />} />
          <Route path="/allowedFoods" element={<AllowedFoods />} />
          <Route path="/ketoDiet" element={<KetoDiet />} />
          <Route path="/ketoRecipes" element={<KetoRecipesPage />} />

          {/* Rutas privadas */}
          <Route path="/foodDiary" element={<RequireUser><FoodSearch /></RequireUser>} />
          <Route path="/profile" element={<RequireUser><ProfilePage /></RequireUser>} />
          <Route path="/panelPersonal" element={<RequireUser><PersonalPanel /></RequireUser>} />
          <Route path="/progresoGraficos" element={<RequireUser><DashBoard /></RequireUser>} />
          <Route path="/calculadoraKeto" element={<RequireUser><CalorieGoal /></RequireUser>} />
        </Routes>
      </AvocadoBackground>
    </AuthProvider>
  );
}

export default App;
