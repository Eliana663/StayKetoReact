import { createContext, useState, useEffect, useContext } from "react";

const UserContext = createContext(null);

export const AuthContext = ({ children }) => {
    const [user, setUser] = useState({id:1});
    const [Loading, setLoading] = useState(true);

    const fetchUser  = async () => {
        try {
            const res = await fetch(`http://localhost:8081/api/users/1`)
            if(!res.ok) throw new Error("No user found");
            const data = await res.json();
            setUser(data);
        } catch(err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, Loading}}>
        {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext);