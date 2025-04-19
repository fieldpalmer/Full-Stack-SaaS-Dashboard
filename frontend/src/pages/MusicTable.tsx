import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FaSpinner, FaHeart } from 'react-icons/fa';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, ColDef, themeMaterial, colorSchemeDark } from 'ag-grid-community';
import { MusicStats, MusicData, ArtistStats } from '../types/interfaces';
import MusicDataCard from '../components/stats/MusicDataCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { API_BASE_URL } from '../config';

ModuleRegistry.registerModules([AllCommunityModule]);

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';
const myTheme = themeMaterial.withPart(colorSchemeDark).withParams({ headerTextColor: 'white' });

const MusicTable = () => {
     const [music, setMusic] = useState<MusicData[]>([]);
     const [loading, setLoading] = useState<boolean>(true);
     const [favorites, setFavorites] = useState<string[]>([]);
     const [musicStats, setMusicStats] = useState<MusicStats>({
          totalArtists: 0,
          totalListeners: 0,
          averageListeners: 0,
          topArtists: []
     });
     const [favoriteMusicStats, setFavoriteMusicStats] = useState<MusicStats>({
          totalArtists: 0,
          totalListeners: 0,
          averageListeners: 0,
          topArtists: []
     });

     useEffect(() => {
          const fetchData = async () => {
               try {
                    const token = localStorage.getItem('token');
                    if (!token) {
                         console.error('No token found');
                         return;
                    }

                    const [musicRes, favoritesRes] = await Promise.all([
                         axios.get('https://full-stack-saas-dashboard.onrender.com/api/music', {
                              headers: { Authorization: `Bearer ${token}` }
                         }),
                         axios.get('https://full-stack-saas-dashboard.onrender.com/api/favorites', {
                              headers: { Authorization: `Bearer ${token}` }
                         })
                    ]);

                    const musicData = musicRes.data.music || [];
                    const favoriteIds = favoritesRes.data.music?.map((track: MusicData) => track._id) || [];

                    setMusic(musicData);
                    setFavorites(favoriteIds);

                    const totalStats: MusicStats = {
                         totalArtists: musicData.length,
                         totalListeners: musicData.reduce((acc: number, artist: ArtistStats) => acc + artist.listeners, 0),
                         averageListeners:
                              musicData.reduce((acc: number, artist: ArtistStats) => acc + artist.listeners, 0) /
                                   musicData.length || 0,
                         topArtists: [...musicData].sort((a, b) => b.listeners - a.listeners).slice(0, 5)
                    };

                    const favoriteMusic = musicData.filter((track: MusicData) => favoriteIds.includes(track._id));
                    const favoriteStats: MusicStats = {
                         totalArtists: favoriteMusic.length,
                         totalListeners: favoriteMusic.reduce((acc: number, artist: ArtistStats) => acc + artist.listeners, 0),
                         averageListeners:
                              favoriteMusic.reduce((acc: number, artist: ArtistStats) => acc + artist.listeners, 0) /
                                   favoriteMusic.length || 0,
                         topArtists: [...favoriteMusic].sort((a, b) => b.listeners - a.listeners).slice(0, 5)
                    };

                    setMusicStats(totalStats);
                    setFavoriteMusicStats(favoriteStats);
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

     const [colDefs] = useState<ColDef<MusicData>[]>([
          { field: 'name', flex: 2, cellStyle: { display: 'flex', alignItems: 'center' } },
          {
               field: 'artist',
               headerName: 'Artist',
               cellStyle: { display: 'flex', alignItems: 'center' }
          },
          {
               field: 'album',
               headerName: 'Album',
               cellStyle: { display: 'flex', alignItems: 'center' }
          },
          {
               field: 'duration_ms',
               headerName: 'Duration',
               cellStyle: { display: 'flex', alignItems: 'center' },
               valueFormatter: (params) => {
                    const minutes = Math.floor(params.value / 60000);
                    const seconds = Math.floor((params.value % 60000) / 1000);
                    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
               }
          },
          {
               field: 'popularity',
               headerName: 'Popularity',
               cellStyle: { display: 'flex', alignItems: 'center' }
          },
          {
               field: 'release_date',
               headerName: 'Release Date',
               cellStyle: { display: 'flex', alignItems: 'center' },
               valueFormatter: (params) => {
                    const date = new Date(params.value);
                    const month = date.toLocaleString('default', { month: 'short' });
                    const year = date.getFullYear();
                    return `${month}. ${year}`;
               }
          },
          {
               headerName: 'Add to Favorites',
               cellRenderer: (params: { data: MusicData }) => (
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

     const handleAddToFavorites = async (musicId: string) => {
          try {
               const token = localStorage.getItem('token');
               await axios.post(
                    `https://full-stack-saas-dashboard.onrender.com/api/favorites/music/${musicId}`,
                    {},
                    {
                         headers: { Authorization: `Bearer ${token}` }
                    }
               );
               setFavorites((prev) => [...prev, musicId]);
               alert('Music added to favorites!');
          } catch (error) {
               if (axios.isAxiosError(error) && error.response?.status === 400) {
                    alert('This music is already in your favorites!');
               } else {
                    console.error('Error adding to favorites:', error);
                    alert('Failed to add music to favorites');
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
                                        <h4 className='text-sm text-gray-400 mb-2'>Total Artists</h4>
                                        <p className='text-3xl font-bold text-purple-500'>{musicStats.totalArtists}</p>
                                   </div>
                                   <div className='bg-gray-700 rounded-lg p-4 text-center'>
                                        <h4 className='text-sm text-gray-400 mb-2'>Total Listeners</h4>
                                        <p className='text-3xl font-bold text-pink-500'>
                                             {musicStats.totalListeners >= 1000000
                                                  ? `${(musicStats.totalListeners / 1000000).toFixed(1)}M`
                                                  : musicStats.totalListeners >= 1000
                                                  ? `${(musicStats.totalListeners / 1000).toFixed(1)}K`
                                                  : musicStats.totalListeners}
                                        </p>
                                   </div>
                                   <div className='bg-gray-700 rounded-lg p-4 text-center'>
                                        <h4 className='text-sm text-gray-400 mb-2'>Avg Listeners</h4>
                                        <p className='text-3xl font-bold text-green-500'>
                                             {musicStats.averageListeners >= 1000000
                                                  ? `${(musicStats.averageListeners / 1000000).toFixed(1)}M`
                                                  : musicStats.averageListeners >= 1000
                                                  ? `${(musicStats.averageListeners / 1000).toFixed(1)}K`
                                                  : Math.round(musicStats.averageListeners)}
                                        </p>
                                   </div>
                              </div>

                              {/* Line Chart */}
                              <div className='bg-gray-700 rounded-lg p-4 mb-4'>
                                   <h4 className='text-lg font-semibold text-white mb-4 text-center'>Top Artists Comparison</h4>
                                   <div style={{ height: '300px', width: '100%' }}>
                                        <ResponsiveContainer>
                                             <LineChart
                                                  data={musicStats.topArtists.map((artist, i) => {
                                                       const favoriteArtist = favoriteMusicStats.topArtists[i];
                                                       return {
                                                            name: artist.name,
                                                            totalListeners: artist.listeners,
                                                            favoriteListeners: favoriteArtist?.listeners || 0
                                                       };
                                                  })}
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
                                                  <Line
                                                       type='monotone'
                                                       dataKey='totalListeners'
                                                       stroke='#8B5CF6'
                                                       strokeWidth={2}
                                                       dot={{ fill: '#8B5CF6', r: 4 }}
                                                       name='Total Listeners'
                                                  />
                                                  <Line
                                                       type='monotone'
                                                       dataKey='favoriteListeners'
                                                       stroke='#EC4899'
                                                       strokeWidth={2}
                                                       dot={{ fill: '#EC4899', r: 4 }}
                                                       name='Favorite Listeners'
                                                  />
                                             </LineChart>
                                        </ResponsiveContainer>
                                   </div>
                              </div>

                              {/* Bar Chart */}
                              <div className='bg-gray-700 rounded-lg p-4'>
                                   <h4 className='text-lg font-semibold text-white mb-4 text-center'>Performance Comparison</h4>
                                   <div style={{ height: '300px', width: '100%' }}>
                                        <ResponsiveContainer>
                                             <BarChart
                                                  data={[
                                                       {
                                                            name: 'All Music',
                                                            listeners: musicStats.averageListeners,
                                                            artists: musicStats.totalArtists
                                                       },
                                                       {
                                                            name: 'Favorites',
                                                            listeners: favoriteMusicStats.averageListeners,
                                                            artists: favoriteMusicStats.totalArtists
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
                                                  <Bar dataKey='listeners' name='Average Listeners' fill='#8B5CF6' />
                                                  <Bar dataKey='artists' name='Total Artists' fill='#EC4899' />
                                             </BarChart>
                                        </ResponsiveContainer>
                                   </div>
                              </div>
                         </div>
                         {/* User Favorites Section */}
                         <div className='bg-gray-800 rounded-lg p-4'>
                              <MusicDataCard title='Your Favorites' stats={favoriteMusicStats} />
                         </div>
                    </div>

                    <div className='w-full md:w-2/3'>
                         <div className='ag-theme-quartz' style={{ height: '100%', width: '100%' }}>
                              <AgGridReact
                                   rowData={music}
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

export default MusicTable;
