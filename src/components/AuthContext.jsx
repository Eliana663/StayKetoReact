import { createContext, useState, useEffect, useContext } from "react";

const UserContext = createContext(null);

export const AuthContext = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Suponiendo que guardas el token en localStorage
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            // No hay token → usuario no logueado
            setUser(null);
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await fetch(`http://localhost:8081/api/users/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!res.ok) throw new Error("No user found");
                const data = await res.json();
                setUser(data);
            } catch (err) {
                console.error(err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [token]);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext);
