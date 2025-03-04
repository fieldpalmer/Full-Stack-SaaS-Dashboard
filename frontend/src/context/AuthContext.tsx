import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface User {
   id: string;
   name: string;
   email: string;
   role: string;
}

interface AuthContextType {
   user: User | null;
   login: (email: string, password: string) => void;
   logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
   const [user, setUser] = useState<User | null>(null);
   const navigate = useNavigate();

   useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
         axios
            .get('http://localhost:5001/dashboard', {
               headers: { Authorization: `Bearer ${token}` }
            })
            .then((res) => setUser(res.data))
            .catch(() => logout());
      }
   }, []);

   const login = async (email: string, password: string) => {
      try {
         const { data } = await axios.post('http://localhost:5001/login', { email, password });
         localStorage.setItem('token', data.token);
         setUser(data.user);
         navigate('/dashboard');
      } catch (err: unknown) {
         if (axios.isAxiosError(err) && err.response) {
            alert(err.response.data.error);
         }
      }
   };

   const logout = () => {
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
   };

   return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export default AuthContext;
