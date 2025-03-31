import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import MyMedia from '../components/MyMedia';
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
     }, [yearRange, stats.maxYear, stats.minYear]);

     return (
          <div className='flex w-[100%] bg-gray-900 text-white'>
               <Sidebar />
               <div className='flex flex-col flex-1'>
                    <MyMedia stats={stats} runtimeData={runtimeData} />
               </div>
          </div>
     );
}
