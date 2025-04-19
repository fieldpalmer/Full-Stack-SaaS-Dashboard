import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FaSpinner, FaHeart } from 'react-icons/fa';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, ColDef, themeMaterial, colorSchemeDark } from 'ag-grid-community';
import { MovieStats, MovieData } from '../types/interfaces';
import MovieDataCard from '../components/stats/MovieDataCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { API_BASE_URL } from '../config';

ModuleRegistry.registerModules([AllCommunityModule]);

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';
const myTheme = themeMaterial.withPart(colorSchemeDark).withParams({ headerTextColor: 'white' });
const MoviesTable = () => {
     const [movies, setMovies] = useState<MovieData[]>([]);
     const [loading, setLoading] = useState<boolean>(true);
     const [favorites, setFavorites] = useState<string[]>([]);
     const [movieStats, setMovieStats] = useState<MovieStats>({
          count: 0,
          avgRating: 0,
          avgPopularity: 0,
          oldestMovie: null,
          newestMovie: null,
          ratingDistribution: []
     });
     const [favoriteMovieStats, setFavoriteMovieStats] = useState<MovieStats>({
          count: 0,
          avgRating: 0,
          avgPopularity: 0,
          oldestMovie: null,
          newestMovie: null,
          ratingDistribution: []
     });

     useEffect(() => {
          const fetchData = async () => {
               try {
                    const token = localStorage.getItem('token');
                    if (!token) {
                         console.error('No token found');
                         return;
                    }

                    const [moviesRes, favoritesRes] = await Promise.all([
                         axios.get('/api/movies', {
                              headers: { Authorization: `Bearer ${token}` }
                         }),
                         axios.get('/api/favorites', {
                              headers: { Authorization: `Bearer ${token}` }
                         })
                    ]);

                    const moviesData = moviesRes.data.movies || [];
                    const favoriteIds = favoritesRes.data.movies.map((movie: MovieData) => movie._id) || [];

                    setMovies(moviesData);
                    setFavorites(favoriteIds);

                    // Calculate total stats
                    const totalStats: MovieStats = {
                         count: moviesData.length,
                         avgRating:
                              moviesData.length > 0
                                   ? moviesData.reduce((acc: number, movie: MovieData) => acc + (movie.rating || 0), 0) /
                                     moviesData.length
                                   : 0,
                         avgPopularity:
                              moviesData.length > 0
                                   ? moviesData.reduce((acc: number, movie: MovieData) => acc + (movie.popularity || 0), 0) /
                                     moviesData.length
                                   : 0,
                         oldestMovie:
                              moviesData.length > 0
                                   ? new Date(
                                          Math.min(...moviesData.map((m: MovieData) => new Date(m.release_date || 0).getTime()))
                                     )
                                   : null,
                         newestMovie:
                              moviesData.length > 0
                                   ? new Date(
                                          Math.max(...moviesData.map((m: MovieData) => new Date(m.release_date || 0).getTime()))
                                     )
                                   : null,
                         ratingDistribution: Array.from({ length: 10 }, (_, i) => ({
                              rating: (i + 1).toFixed(1),
                              count: moviesData.filter((m: MovieData) => Math.floor(m.rating || 0) === i + 1).length
                         }))
                    };

                    // Calculate favorite stats
                    const favoriteMovies = moviesData.filter((movie: MovieData) => favoriteIds.includes(movie._id));
                    const favoriteStats: MovieStats = {
                         count: favoriteMovies.length,
                         avgRating:
                              favoriteMovies.length > 0
                                   ? favoriteMovies.reduce((acc: number, movie: MovieData) => acc + (movie.rating || 0), 0) /
                                     favoriteMovies.length
                                   : 0,
                         avgPopularity:
                              favoriteMovies.length > 0
                                   ? favoriteMovies.reduce((acc: number, movie: MovieData) => acc + (movie.popularity || 0), 0) /
                                     favoriteMovies.length
                                   : 0,
                         oldestMovie:
                              favoriteMovies.length > 0
                                   ? new Date(
                                          Math.min(
                                               ...favoriteMovies.map((m: MovieData) => new Date(m.release_date || 0).getTime())
                                          )
                                     )
                                   : null,
                         newestMovie:
                              favoriteMovies.length > 0
                                   ? new Date(
                                          Math.max(
                                               ...favoriteMovies.map((m: MovieData) => new Date(m.release_date || 0).getTime())
                                          )
                                     )
                                   : null,
                         ratingDistribution: Array.from({ length: 10 }, (_, i) => ({
                              rating: (i + 1).toFixed(1),
                              count: favoriteMovies.filter((m: MovieData) => Math.floor(m.rating || 0) === i + 1).length
                         }))
                    };

                    setMovieStats(totalStats);
                    setFavoriteMovieStats(favoriteStats);
               } catch (error) {
                    console.error('Error fetching data:', error);
                    if (axios.isAxiosError(error)) {
                         console.error('Error details:', {
                              status: error.response?.status,
                              data: error.response?.data,
                              headers: error.response?.headers
                         });
                    }
               } finally {
                    setLoading(false);
               }
          };

          fetchData();
     }, []);

     const defaultColDef = useMemo(
          () => ({
               sortable: true,
               filter: true,
               resizable: true,
               flex: 1,
               minWidth: 100,
               wrapHeaderText: true,
               wrapText: true
          }),
          []
     );

     const [colDefs] = useState<ColDef<MovieData>[]>([
          {
               field: 'poster_url',
               headerName: 'Poster',
               autoHeight: true,
               cellRenderer: (params: { value: string }) => {
                    const fallbackImage = 'https://dummyimage.com/100x100/cccccc/ffffff.png&text=No+Image';
                    if (!params.value) {
                         return (
                              <img
                                   src={fallbackImage}
                                   alt='No image available'
                                   style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                              />
                         );
                    }
                    return (
                         <img
                              src={params.value}
                              alt='Movie Poster'
                              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                   const img = e.target as HTMLImageElement;
                                   img.onerror = null;
                                   img.src = fallbackImage;
                              }}
                         />
                    );
               }
          },
          { field: 'title', flex: 2, cellStyle: { display: 'flex', alignItems: 'center' } },
          {
               field: 'release_date',
               headerName: 'Release Date',
               cellStyle: { display: 'flex', alignItems: 'center' },
               valueFormatter: (params) => {
                    const date = new Date(params.value);
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const year = date.getFullYear();
                    return `${month}/${year}`;
               }
          },
          {
               field: 'rating',
               headerName: 'Rating',
               cellStyle: { display: 'flex', alignItems: 'center' },
               valueFormatter: (params) => {
                    return params.value.toFixed(1);
               }
          },
          {
               field: 'popularity',
               headerName: 'Popularity',
               cellStyle: { display: 'flex', alignItems: 'center' },
               valueFormatter: (params) => {
                    return Math.round(params.value).toString();
               }
          },
          {
               field: 'overview',
               headerName: 'Overview',
               flex: 3,
               cellStyle: { display: 'flex', alignItems: 'center' },
               wrapText: true
          },
          {
               field: 'tmdb_id',
               headerName: 'TMDB ID',
               cellStyle: { display: 'flex', alignItems: 'center' }
          },
          {
               headerName: 'Add to Favorites',
               cellRenderer: (params: { data: MovieData }) => (
                    <button
                         onClick={() => handleAddToFavorites(params.data._id)}
                         className={`flex items-center gap-2 px-3 py-1 rounded ${
                              favorites.includes(params.data._id) ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                         } text-white transition-colors`}
                    >
                         <FaHeart className={favorites.includes(params.data._id) ? 'text-red-500' : 'text-white'} />
                    </button>
               ),
               cellStyle: { display: 'flex', alignItems: 'center' }
          }
     ]);

     const handleAddToFavorites = async (movieId: string) => {
          try {
               const token = localStorage.getItem('token');
               await axios.post(
                    `/api/favorites/movies/${movieId}`,
                    {},
                    {
                         headers: { Authorization: `Bearer ${token}` }
                    }
               );
               setFavorites((prev) => [...prev, movieId]);
               alert('Movie added to favorites!');
          } catch (error) {
               if (axios.isAxiosError(error) && error.response?.status === 400) {
                    alert('This movie is already in your favorites!');
               } else {
                    console.error('Error adding to favorites:', error);
                    alert('Failed to add movie to favorites');
               }
          }
     };

     if (loading) {
          return (
               <div className='flex justify-center items-center h-[1080px]'>
                    <FaSpinner className='text-purple-500 text-4xl animate-spin' />
               </div>
          );
     }

     return (
          <div className='flex flex-col min-h-[calc(100vh-4rem)] w-full bg-gray-900 text-white'>
               <div className='flex flex-col md:flex-row gap-6 p-4 sm:p-6'>
                    <div className='w-full md:w-1/3 space-y-6'>
                         {/* Performance Comparison Section */}
                         <div className='bg-gray-800 rounded-lg p-4'>
                              {/* Key Statistics */}
                              <div className='grid grid-cols-3 gap-4 mb-6'>
                                   <div className='bg-gray-700 rounded-lg p-4 text-center'>
                                        <h4 className='text-sm text-gray-400 mb-2'>Total Movies</h4>
                                        <p className='text-3xl font-bold text-purple-500'>{movieStats.count}</p>
                                   </div>
                                   <div className='bg-gray-700 rounded-lg p-4 text-center'>
                                        <h4 className='text-sm text-gray-400 mb-2'>Average Rating</h4>
                                        <p className='text-3xl font-bold text-pink-500'>{movieStats.avgRating.toFixed(1)}</p>
                                   </div>
                                   <div className='bg-gray-700 rounded-lg p-4 text-center'>
                                        <h4 className='text-sm text-gray-400 mb-2'>Average Popularity</h4>
                                        <p className='text-3xl font-bold text-green-500'>{movieStats.avgPopularity.toFixed(1)}</p>
                                   </div>
                              </div>

                              {/* Line Chart */}
                              <div className='bg-gray-700 rounded-lg p-4 mb-4'>
                                   <h4 className='text-lg font-semibold text-white mb-4 text-center'>Rating Distribution</h4>
                                   <div className='h-64'>
                                        <ResponsiveContainer width='100%' height='100%'>
                                             <LineChart
                                                  data={movieStats.ratingDistribution}
                                                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                             >
                                                  <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                                                  <XAxis dataKey='rating' stroke='#9CA3AF' />
                                                  <YAxis stroke='#9CA3AF' />
                                                  <Tooltip
                                                       contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                                                       labelStyle={{ color: '#9CA3AF' }}
                                                  />
                                                  <Legend />
                                                  <Line
                                                       type='monotone'
                                                       dataKey='count'
                                                       stroke='#8B5CF6'
                                                       strokeWidth={2}
                                                       dot={{ fill: '#8B5CF6', r: 4 }}
                                                       name='Number of Movies'
                                                  />
                                             </LineChart>
                                        </ResponsiveContainer>
                                   </div>
                              </div>

                              {/* Bar Chart */}
                              <div className='bg-gray-700 rounded-lg p-4'>
                                   <h4 className='text-lg font-semibold text-white mb-4 text-center'>Performance Comparison</h4>
                                   <div className='h-64'>
                                        <ResponsiveContainer width='100%' height='100%'>
                                             <BarChart
                                                  data={[
                                                       {
                                                            name: 'All Movies',
                                                            rating: movieStats.avgRating,
                                                            popularity: movieStats.avgPopularity
                                                       },
                                                       {
                                                            name: 'Favorites',
                                                            rating: favoriteMovieStats.avgRating,
                                                            popularity: favoriteMovieStats.avgPopularity
                                                       }
                                                  ]}
                                                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                             >
                                                  <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                                                  <XAxis dataKey='name' stroke='#9CA3AF' />
                                                  <YAxis stroke='#9CA3AF' />
                                                  <Tooltip
                                                       contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                                                       labelStyle={{ color: '#9CA3AF' }}
                                                  />
                                                  <Legend />
                                                  <Bar dataKey='rating' name='Average Rating' fill='#8B5CF6' />
                                                  <Bar dataKey='popularity' name='Average Popularity' fill='#EC4899' />
                                             </BarChart>
                                        </ResponsiveContainer>
                                   </div>
                              </div>
                         </div>
                         {/* User Favorites Section */}
                         <div className='bg-gray-800 rounded-lg p-4'>
                              <MovieDataCard title='Your Favorites' stats={favoriteMovieStats} />
                         </div>
                    </div>

                    <div className='w-full md:w-2/3'>
                         <div className='ag-theme-quartz' style={{ height: '100%', width: '100%' }}>
                              <AgGridReact
                                   rowData={movies}
                                   columnDefs={colDefs}
                                   defaultColDef={defaultColDef}
                                   pagination={true}
                                   paginationPageSize={50}
                                   paginationPageSizeSelector={[50]}
                                   rowHeight={100}
                                   theme={myTheme}
                              />
                         </div>
                    </div>
               </div>
          </div>
     );
};

export default MoviesTable;
