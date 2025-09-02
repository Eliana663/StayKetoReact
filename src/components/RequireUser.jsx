import { useUser } from './AuthContext';

export const RequireUser = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) return <p>Loading user...</p>;
  if (!user) return <p>Please log in</p>;

  return children; 
};