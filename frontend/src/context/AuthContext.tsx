import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

interface User {
   _id: string;
   email: string;
   name: string;
   isGuest: boolean;
}

interface AuthContextType {
   user: User | null;
   loading: boolean;
   login: (email: string, password: string) => Promise<void>;
   register: (name: string, email: string, password: string) => Promise<void>;
   logout: () => void;
   createGuest: () => Promise<void>;
   convertGuestToUser: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
   const [user, setUser] = useState<User | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
         axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
         fetchUser();
      } else {
         setLoading(false);
      }
   }, []);

   const fetchUser = async () => {
      try {
         const response = await axios.get('/api/auth/me');
         setUser(response.data);
      } catch (error) {
         console.error('Error fetching user:', error);
         localStorage.removeItem('token');
         setUser(null);
      } finally {
         setLoading(false);
      }
   };

   const createGuest = async () => {
      try {
         const response = await axios.post('/api/auth/guest');
         const { token, user } = response.data;
         localStorage.setItem('token', token);
         axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
         setUser(user);
      } catch (error) {
         console.error('Error creating guest account:', error);
      }
   };

   const login = async (email: string, password: string) => {
      try {
         const response = await axios.post(`${API_BASE_URL}/login`, {
            email,
            password,
            guestId: user?.isGuest ? user._id : undefined,
         });
         const { token, user: userData } = response.data;
         localStorage.setItem('token', token);
         axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
         setUser({
            _id: userData.id,
            email: userData.email,
            name: userData.name,
            isGuest: false,
         });
      } catch (error) {
         console.error('Login error:', error);
         throw error;
      }
   };

   const register = async (name: string, email: string, password: string) => {
      try {
         await axios.post(`${API_BASE_URL}/register`, {
            name,
            email,
            password,
            guestId: user?.isGuest ? user._id : undefined,
         });

         // After successful registration, log in the user
         const loginResponse = await axios.post(`${API_BASE_URL}/login`, {
            email,
            password,
         });

         const { token, user: userData } = loginResponse.data;
         localStorage.setItem('token', token);
         axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
         setUser({
            _id: userData._id,
            email: userData.email,
            name: userData.name,
            isGuest: false,
         });
      } catch (error) {
         console.error('Registration error:', error);
         throw error;
      }
   };

   const convertGuestToUser = async (name: string, email: string, password: string) => {
      if (!user?.isGuest) throw new Error('Only guest accounts can be converted');

      try {
         const response = await axios.post(`${API_BASE_URL}/api/auth/convert-guest`, {
            name,
            email,
            password,
            guestId: user._id,
         });
         const { token, user: newUser } = response.data;
         localStorage.setItem('token', token);
         axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
         setUser(newUser);
      } catch (error) {
         console.error('Error converting guest to user:', error);
         throw error;
      }
   };

   const logout = () => {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
   };

   return (
      <AuthContext.Provider
         value={{
            user,
            loading,
            login,
            register,
            logout,
            createGuest,
            convertGuestToUser,
         }}
      >
         {children}
      </AuthContext.Provider>
   );
};

export const useAuth = () => {
   const context = useContext(AuthContext);
   if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
   }
   return context;
};
