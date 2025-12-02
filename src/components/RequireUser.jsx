import { Navigate } from "react-router-dom";
import { useUser } from "./AuthContext";

export const RequireUser = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) return <p>Cargando...</p>; // Espera a cargar user

  if (!user) return <Navigate to="/landing" replace />; // Si no hay user, redirige

  return children;
};
