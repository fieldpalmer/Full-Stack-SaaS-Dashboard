import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { FaSpinner, FaHeart } from 'react-icons/fa';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, ColDef, themeMaterial, colorSchemeDark } from 'ag-grid-community';
import '../App.css';

ModuleRegistry.registerModules([AllCommunityModule]);
const myTheme = themeMaterial.withPart(colorSchemeDark).withParams({ headerTextColor: 'white' });

interface MovieData {
     _id: string;
     title: string;
     overview: string;
     release_date: string;
     rating: number;
     popularity: number;
     poster_url: string;
     tmdb_id: number;
}

const MovieDataGrid = () => {
     const [movies, setMovies] = useState<MovieData[]>([]);
     const [loading, setLoading] = useState<boolean>(true);
     const [favorites, setFavorites] = useState<string[]>([]);

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

     const pagination = true;
     const paginationPageSize = 50;
     const paginationPageSizeSelector = [50];
     const rowHeight = 100;

     const handleAddToFavorites = async (movieId: string) => {
          try {
               const token = localStorage.getItem('token');
               await axios.post(
                    `https://full-stack-saas-dashboard.onrender.com/api/favorites/movies/${movieId}`,
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
                    return new Date(params.value).toLocaleDateString();
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
                         <FaHeart className={favorites.includes(params.data._id) ? 'text-white' : 'text-gray-400'} />
                         {favorites.includes(params.data._id) ? 'Added' : 'Add'}
                    </button>
               ),
               cellStyle: { display: 'flex', alignItems: 'center' }
          }
     ]);

     const fetchMovies = useCallback(async () => {
          setLoading(true);
          try {
               const token = localStorage.getItem('token');
               const { data } = await axios.get('https://full-stack-saas-dashboard.onrender.com/api/movies/', {
                    headers: { Authorization: `Bearer ${token}` }
               });
               setMovies(data.movies);
          } catch (error) {
               console.error('Error fetching movies:', error);
          }
          setLoading(false);
     }, []);

     useEffect(() => {
          fetchMovies();
     }, [fetchMovies]);

     if (loading) {
          return (
               <div className='flex justify-center items-center h-[1080px]'>
                    <FaSpinner className='text-purple-500 text-4xl animate-spin' />
               </div>
          );
     }

     return (
          <div className='flex h-screen w-[100%] bg-gray-900 text-white'>
               <Sidebar />
               <div className='flex flex-col flex-1 p-4'>
                    <div className='flex-1'>
                         <AgGridReact
                              rowData={movies}
                              columnDefs={colDefs}
                              defaultColDef={defaultColDef}
                              theme={myTheme}
                              pagination={pagination}
                              paginationPageSize={paginationPageSize}
                              paginationPageSizeSelector={paginationPageSizeSelector}
                              rowHeight={rowHeight}
                         />
                    </div>
               </div>
          </div>
     );
};

export default MovieDataGrid;
