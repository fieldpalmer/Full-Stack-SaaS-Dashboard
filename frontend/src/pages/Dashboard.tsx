import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import AuthContext from '../context/AuthContext';
import { MovieRuntimeChart, StatsWidget } from '../components/Charts';
import Top10Lists from '../components/Top10Lists.tsx';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface Movie {
   title: string;
   year: number;
   rating?: number;
   runtime?: number;
}

interface MovieStats {
   totalMovies: number;
   avgRuntime: string;
   avgRating: string;
   minYear: number;
   maxYear: number;
   topRatedMovies: Movie[];
   topGenres: [];
   longestMovies: [];
   genreAverages: { genre: string; avgRating: number }[];
}

export default function Dashboard() {
   const { user, logout } = useContext(AuthContext)!;
   const [stats, setStats] = useState<MovieStats>({
      totalMovies: 0,
      avgRuntime: '0',
      avgRating: '0',
      minYear: 1900,
      maxYear: new Date().getFullYear(),
      topRatedMovies: [],
      topGenres: [],
      longestMovies: [],
      genreAverages: []
   });
   const [runtimeData, setRuntimeData] = useState<{ _id: number; avgRuntime: number }[]>([]);
   const [yearRange, setYearRange] = useState<[number, number]>([1900, new Date().getFullYear()]);

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
               avgRating: data.avgRating,
               minYear: data.minYear,
               maxYear: data.maxYear,
               topRatedMovies: data.topRatedMovies,
               topGenres: data.topGenres,
               longestMovies: data.longestMovies,
               genreAverages: data.genreAverages
            });

            setRuntimeData(data.runtimeOverYears);
            setYearRange([data.minYear, data.maxYear]);
         } catch (error) {
            console.error('Error fetching movie stats:', error);
         }
      };

      fetchMovieStats();
   }, []);

   useEffect(() => {
      const fetchFilteredMovies = async () => {
         try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(
               `http://localhost:5001/api/movie-stats?startYear=${yearRange[0]}&endYear=${yearRange[1]}`,
               {
                  headers: { Authorization: `Bearer ${token}` }
               }
            );

            setStats({
               totalMovies: data.totalMovies,
               avgRuntime: data.avgRuntime,
               avgRating: data.avgRating,
               minYear: stats.minYear,
               maxYear: stats.maxYear,
               topRatedMovies: data.topRatedMovies,
               topGenres: data.topGenres,
               longestMovies: data.longestMovies,
               genreAverages: data.genreAverages
            });

            setRuntimeData(data.runtimeOverYears);
         } catch (error) {
            console.error('Error fetching filtered data:', error);
         }
      };

      if (yearRange[0] !== stats.minYear || yearRange[1] !== stats.maxYear) {
         fetchFilteredMovies();
      }
   }, [yearRange]);

   return (
      <div className='flex max-h-screen overflow-scroll w-screen bg-gray-900 text-white'>
         <Sidebar />
         <div className='flex flex-col flex-1'>
            <header className='bg-gray-800 p-4 flex justify-between items-center shadow-md'>
               <h2 className='text-2xl'>Welcome, {user?.name}!</h2>
               <button onClick={logout} className='bg-red-500 px-4 py-2 rounded'>
                  Logout
               </button>
            </header>

            <div className='m-6 px-4 py-4 rounded-lg flex flex-col md:flex-row items-center gap-8'>
               <div className='flex gap-6'>
                  <StatsWidget title='Movies' value={stats.totalMovies.toString()} />
                  <StatsWidget title='Avg Runtime (mins)' value={stats.avgRuntime} />
                  <StatsWidget title='Avg Rating' value={stats.avgRating} />
               </div>
               <div className='flex-1'>
                  <div className='flex justify-between text-gray-400 mb-2'>
                     <span>{yearRange[0]}</span>
                     <span>{yearRange[1]}</span>
                  </div>
                  <Slider
                     range
                     min={stats.minYear}
                     max={stats.maxYear}
                     value={yearRange}
                     onChange={(value) => setYearRange(value as [number, number])}
                     trackStyle={[{ backgroundColor: '#4f46e5', height: 13 }]}
                     railStyle={{ height: 13 }}
                     handleStyle={[
                        {
                           borderColor: '#4f46e5',
                           backgroundColor: '#4f46e5',
                           height: 24,
                           width: 24,
                           opacity: 100
                        },
                        {
                           borderColor: '#4f46e5',
                           backgroundColor: '#4f46e5',
                           height: 24,
                           width: 24,
                           opacity: 100
                        }
                     ]}
                  />
               </div>
            </div>

            <div className='px-6 pb-6'>
               <MovieRuntimeChart data={runtimeData} />
            </div>

            <div className='px-6'>
               <Top10Lists
                  topRatedMovies={stats.topRatedMovies}
                  topGenres={stats.topGenres}
                  longestMovies={stats.longestMovies}
               />
            </div>
         </div>
      </div>
   );
}
