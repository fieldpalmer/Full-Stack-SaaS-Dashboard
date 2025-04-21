import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FaSpinner, FaHeart } from 'react-icons/fa';
import { AgGridReact } from 'ag-grid-react';
import {
   AllCommunityModule,
   ModuleRegistry,
   ColDef,
   themeMaterial,
   colorSchemeDark,
   ICellRendererParams,
} from 'ag-grid-community';
import { MusicStats, MusicData, ArtistStats } from '../types/interfaces';
import MusicDataCard from '../components/stats/MusicDataCard';
import {
   LineChart,
   Line,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
   Legend,
   BarChart,
   Bar,
} from 'recharts';
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
      topArtists: [],
   });
   const [favoriteMusicStats, setFavoriteMusicStats] = useState<MusicStats>({
      totalArtists: 0,
      totalListeners: 0,
      averageListeners: 0,
      topArtists: [],
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
               axios.get(`${API_BASE_URL}/api/music`, {
                  headers: { Authorization: `Bearer ${token}` },
               }),
               axios.get(`${API_BASE_URL}/api/favorites`, {
                  headers: { Authorization: `Bearer ${token}` },
               }),
            ]);

            const musicData = musicRes.data.music || [];
            const favoriteIds = favoritesRes.data.music?.map((track: MusicData) => track._id) || [];

            setMusic(musicData);
            setFavorites(favoriteIds);

            const totalStats: MusicStats = {
               totalArtists: musicData.length,
               totalListeners: musicData.reduce(
                  (acc: number, artist: ArtistStats) => acc + artist.listeners,
                  0
               ),
               averageListeners:
                  musicData.reduce(
                     (acc: number, artist: ArtistStats) => acc + artist.listeners,
                     0
                  ) / musicData.length || 0,
               topArtists: [...musicData].sort((a, b) => b.listeners - a.listeners).slice(0, 5),
            };

            const favoriteMusic = musicData.filter((track: MusicData) =>
               favoriteIds.includes(track._id)
            );
            const favoriteStats: MusicStats = {
               totalArtists: favoriteMusic.length,
               totalListeners: favoriteMusic.reduce(
                  (acc: number, artist: ArtistStats) => acc + artist.listeners,
                  0
               ),
               averageListeners:
                  favoriteMusic.reduce(
                     (acc: number, artist: ArtistStats) => acc + artist.listeners,
                     0
                  ) / favoriteMusic.length || 0,
               topArtists: [...favoriteMusic].sort((a, b) => b.listeners - a.listeners).slice(0, 5),
            };

            setMusicStats(totalStats);
            setFavoriteMusicStats(favoriteStats);
         } catch (error) {
            console.error('Error fetching data:', error);
            if (axios.isAxiosError(error)) {
               console.error('Error details:', {
                  status: error.response?.status,
                  data: error.response?.data,
                  headers: error.response?.headers,
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
         wrapText: true,
      }),
      []
   );

   const colDefs: ColDef<MusicData>[] = [
      {
         field: 'image',
         headerName: '',
         width: 100,
         cellStyle: { lineHeight: '1.2' },
         cellRenderer: (params: ICellRendererParams<MusicData>) => {
            return (
               <div className="flex items-center justify-center h-full">
                  <img
                     src={params.data?.image}
                     alt={params.data?.name}
                     className="w-10 h-10 rounded-full object-cover"
                     onError={e => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
                     }}
                  />
               </div>
            );
         },
      },
      {
         field: 'name',
         headerName: 'Name',
         flex: 1,
         cellStyle: { lineHeight: '1.2' },
      },
      {
         field: 'listeners',
         headerName: 'Listeners',
         hide: window.innerWidth < 768,
         width: 120,
         cellStyle: { lineHeight: '1.2' },
         valueFormatter: params => {
            const value = params.value as number;
            if (value >= 1000000) {
               return `${(value / 1000000).toFixed(1)}M`;
            }
            if (value >= 1000) {
               return `${(value / 1000).toFixed(1)}K`;
            }
            return value.toString();
         },
      },
      {
         field: 'playcount',
         headerName: 'Play Count',
         hide: window.innerWidth < 768,
         width: 120,
         cellStyle: { lineHeight: '1.2' },
         valueFormatter: params => {
            const value = params.value as number;
            if (value >= 1000000) {
               return `${(value / 1000000).toFixed(1)}M`;
            }
            if (value >= 1000) {
               return `${(value / 1000).toFixed(1)}K`;
            }
            return value.toString();
         },
      },
      {
         field: 'url',
         headerName: 'URL',
         hide: window.innerWidth < 768,
         width: 100,
         cellStyle: { lineHeight: '1.2' },
         cellRenderer: (params: ICellRendererParams<MusicData>) => {
            const url = params.data?.url;
            if (!url) return null;
            return (
               <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-400"
               >
                  Link
               </a>
            );
         },
      },
      {
         headerName: 'Actions',
         width: 120,
         cellStyle: { lineHeight: '1.2' },
         cellRenderer: (params: ICellRendererParams<MusicData>) => {
            const isFavorite = params.data?._id && favorites.includes(params.data._id);
            return (
               <button
                  onClick={() => params.data?._id && handleToggleFavorite('music', params.data._id)}
                  className={`p-2 rounded-full ${
                     isFavorite
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
               >
                  <FaHeart className="w-4 h-4" />
               </button>
            );
         },
      },
   ];

   const handleToggleFavorite = async (type: string, musicId: string) => {
      try {
         const token = localStorage.getItem('token');
         if (favorites.includes(musicId)) {
            await axios.delete(`${API_BASE_URL}/api/favorites/${type}/${musicId}`, {
               headers: { Authorization: `Bearer ${token}` },
            });
            setFavorites(prev => prev.filter(id => id !== musicId));
         } else {
            await axios.post(
               `${API_BASE_URL}/api/favorites/${type}/${musicId}`,
               {},
               {
                  headers: { Authorization: `Bearer ${token}` },
               }
            );
            setFavorites(prev => [...prev, musicId]);
         }
         alert('Favorite status updated!');

         // Refresh stats after toggling favorite
         const [musicRes, favoritesRes] = await Promise.all([
            axios.get(`${API_BASE_URL}/api/music`, {
               headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${API_BASE_URL}/api/favorites`, {
               headers: { Authorization: `Bearer ${token}` },
            }),
         ]);

         const musicData = musicRes.data.music || [];
         const favoriteIds = favoritesRes.data.music?.map((track: MusicData) => track._id) || [];

         const totalStats: MusicStats = {
            totalArtists: musicData.length,
            totalListeners: musicData.reduce(
               (acc: number, artist: ArtistStats) => acc + artist.listeners,
               0
            ),
            averageListeners:
               musicData.reduce((acc: number, artist: ArtistStats) => acc + artist.listeners, 0) /
                  musicData.length || 0,
            topArtists: [...musicData].sort((a, b) => b.listeners - a.listeners).slice(0, 5),
         };

         const favoriteMusic = musicData.filter((track: MusicData) =>
            favoriteIds.includes(track._id)
         );
         const favoriteStats: MusicStats = {
            totalArtists: favoriteMusic.length,
            totalListeners: favoriteMusic.reduce(
               (acc: number, artist: ArtistStats) => acc + artist.listeners,
               0
            ),
            averageListeners:
               favoriteMusic.reduce(
                  (acc: number, artist: ArtistStats) => acc + artist.listeners,
                  0
               ) / favoriteMusic.length || 0,
            topArtists: [...favoriteMusic].sort((a, b) => b.listeners - a.listeners).slice(0, 5),
         };

         setMusicStats(totalStats);
         setFavoriteMusicStats(favoriteStats);
      } catch (error) {
         console.error('Error toggling favorite:', error);
         alert('Failed to update favorite status');
      }
   };

   if (loading) {
      return (
         <div className="flex justify-center items-center h-[1080px]">
            <FaSpinner className="text-purple-500 text-4xl animate-spin" />
         </div>
      );
   }

   return (
      <div className="flex flex-col min-h-[calc(100vh-4rem)] w-full bg-gray-900 text-white py-4">
         <div className="flex flex-col md:flex-row gap-4">
            {/* Sidebar - Stats & Charts */}
            <div className="w-full md:w-1/4 space-y-4">
               {/* Stats Cards */}
               <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                  {/* Key Statistics */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                     <div className="bg-gray-700 rounded-lg p-3 text-center">
                        <h4 className="text-sm text-gray-400 mb-1">Total Artists</h4>
                        <p className="text-xl font-bold text-purple-500">
                           {musicStats.totalArtists}
                        </p>
                     </div>
                     <div className="bg-gray-700 rounded-lg p-3 text-center">
                        <h4 className="text-sm text-gray-400 mb-1">Total Listeners</h4>
                        <p className="text-xl font-bold text-pink-500">
                           {musicStats.totalListeners >= 1000000
                              ? `${(musicStats.totalListeners / 1000000).toFixed(1)}M`
                              : musicStats.totalListeners >= 1000
                              ? `${(musicStats.totalListeners / 1000).toFixed(1)}K`
                              : musicStats.totalListeners}
                        </p>
                     </div>
                     <div className="bg-gray-700 rounded-lg p-3 text-center">
                        <h4 className="text-sm text-gray-400 mb-1">Avg Listeners</h4>
                        <p className="text-xl font-bold text-green-500">
                           {Math.round(musicStats.averageListeners) >= 1000000
                              ? `${(Math.round(musicStats.averageListeners) / 1000000).toFixed(1)}M`
                              : Math.round(musicStats.averageListeners) >= 1000
                              ? `${(Math.round(musicStats.averageListeners) / 1000).toFixed(1)}K`
                              : Math.round(musicStats.averageListeners)}
                        </p>
                     </div>
                  </div>

                  {/* Charts */}
                  <div className="space-y-4">
                     {/* Listener Distribution Chart */}
                     <div className="bg-gray-700 rounded-lg p-3">
                        <h4 className="text-sm font-semibold text-white mb-2 text-center">
                           Listener Distribution
                        </h4>
                        <div className="h-40">
                           <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                 data={musicStats.topArtists}
                                 margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
                              >
                                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                 <XAxis dataKey="name" stroke="#9CA3AF" />
                                 <YAxis stroke="#9CA3AF" />
                                 <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                                    labelStyle={{ color: '#9CA3AF' }}
                                 />
                                 <Legend />
                                 <Line
                                    type="monotone"
                                    dataKey="listeners"
                                    stroke="#8B5CF6"
                                    strokeWidth={2}
                                    dot={{ fill: '#8B5CF6', r: 4 }}
                                    name="Listeners"
                                 />
                              </LineChart>
                           </ResponsiveContainer>
                        </div>
                     </div>

                     {/* Performance Comparison Chart */}
                     <div className="bg-gray-700 rounded-lg p-3">
                        <h4 className="text-sm font-semibold text-white mb-2 text-center">
                           Performance Comparison
                        </h4>
                        <div className="h-40">
                           <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                 data={[
                                    {
                                       name: 'All Artists',
                                       listeners: musicStats.averageListeners,
                                       tracks: musicStats.totalArtists,
                                    },
                                    {
                                       name: 'Favorites',
                                       listeners: favoriteMusicStats.averageListeners,
                                       tracks: favoriteMusicStats.totalArtists,
                                    },
                                 ]}
                                 margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
                              >
                                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                 <XAxis dataKey="name" stroke="#9CA3AF" />
                                 <YAxis stroke="#9CA3AF" />
                                 <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                                    labelStyle={{ color: '#9CA3AF' }}
                                 />
                                 <Legend />
                                 <Bar dataKey="listeners" name="Average Listeners" fill="#8B5CF6" />
                                 <Bar dataKey="tracks" name="Total Artists" fill="#EC4899" />
                              </BarChart>
                           </ResponsiveContainer>
                        </div>
                     </div>
                  </div>
               </div>

               {/* User Favorites Section */}
               <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                  <MusicDataCard title="Your Favorites" stats={favoriteMusicStats} />
               </div>
            </div>

            {/* Music Grid */}
            <div className="w-full md:w-3/4">
               <div className="ag-theme-quartz h-[400px] md:h-[calc(100vh-4rem)] w-full border border-gray-700 rounded-lg">
                  <AgGridReact
                     rowData={music}
                     columnDefs={colDefs}
                     defaultColDef={defaultColDef}
                     pagination={true}
                     paginationPageSize={50}
                     paginationPageSizeSelector={[50]}
                     rowHeight={80}
                     theme={myTheme}
                  />
               </div>
            </div>
         </div>
      </div>
   );
};

export default MusicTable;
