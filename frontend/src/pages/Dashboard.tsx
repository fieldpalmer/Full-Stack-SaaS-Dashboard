import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import StatsWidget from '../components/StatsWidget';
import MovieRuntimeChart from '../components/MovieRuntimeChart';
import AuthContext from '../context/AuthContext';

interface MovieStats {
   totalMovies: number;
   avgRuntime: string;
   avgRating: string;
}

export default function Dashboard() {
   const { user, logout } = useContext(AuthContext)!;
   const [stats, setStats] = useState<MovieStats>({
      totalMovies: 0,
      avgRuntime: '0',
      avgRating: '0'
   });
   const [runtimeData, setRuntimeData] = useState<{ year: number; avgRuntime: number }[]>([]);

   useEffect(() => {
      const fetchMovieStats = async () => {
         try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('http://localhost:5001/api/movie-stats', {
               headers: { Authorization: `Bearer ${token}` }
            });
            setStats({
               totalMovies: data.totalMovies,
               avgRuntime: data.avgRuntime,
               avgRating: data.avgRating
            });
            setRuntimeData(data.runtimeOverYears);
         } catch (error) {
            console.error('Error fetching movie stats:', error);
         }
      };

      fetchMovieStats();
   }, []);

   return (
      <div className='flex h-screen w-screen bg-gray-900 text-white'>
         <Sidebar />

         <div className='flex flex-col flex-1'>
            <header className='bg-gray-800 p-4 flex justify-between items-center shadow-md'>
               <h2 className='text-2xl'>Welcome, {user?.name}!</h2>
               <button onClick={logout} className='bg-red-500 px-4 py-2 rounded'>
                  Logout
               </button>
            </header>

            <div className='p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
               <StatsWidget title='Movies' value={stats.totalMovies.toString()} />
               <StatsWidget title='Avg Runtime (mins)' value={stats.avgRuntime} />
               <StatsWidget title='Avg Rating' value={stats.avgRating} />
            </div>

            <div className='p-6'>
               <MovieRuntimeChart data={runtimeData} />
            </div>
         </div>
      </div>
   );
}
