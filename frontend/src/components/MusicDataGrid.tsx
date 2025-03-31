import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { FaSpinner } from 'react-icons/fa';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, ColDef, themeMaterial, colorSchemeDark } from 'ag-grid-community';
import { useNavigate, useLocation } from 'react-router-dom';
import '../App.css';

ModuleRegistry.registerModules([AllCommunityModule]);
const myTheme = themeMaterial.withPart(colorSchemeDark).withParams({ headerTextColor: 'white' });

interface MusicData {
     id: string;
     name: string;
     type: string;
     genres: string[];
     image: string | null;
     popularity: number;
     followers: number;
     spotify_url: string | null;
}

const MusicDataGrid = () => {
     const navigate = useNavigate();
     const location = useLocation();
     const [music, setMusic] = useState<MusicData[]>([]);
     const [loading, setLoading] = useState<boolean>(true);
     const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
     const [timeRange, setTimeRange] = useState<'short_term' | 'medium_term' | 'long_term'>('medium_term');
     const [currentPage, setCurrentPage] = useState<number>(1);

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

     const [colDefs] = useState<ColDef<MusicData>[]>([
          {
               field: 'image',
               headerName: 'Image',
               autoHeight: true,
               cellRenderer: (params: { value: string | null }) => {
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
                              alt='Artist'
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
          { field: 'name', flex: 2, cellStyle: { display: 'flex', alignItems: 'center' } },
          { field: 'type', cellStyle: { display: 'flex', alignItems: 'center' } },
          {
               field: 'genres',
               flex: 2,
               wrapText: true,
               cellStyle: { display: 'flex', alignItems: 'center', lineHeight: '1.3' },
               valueFormatter: (params) => (Array.isArray(params.value) ? params.value.join(', ') : params.value)
          },
          {
               field: 'popularity',
               headerName: 'Popularity',
               cellStyle: { display: 'flex', alignItems: 'center' }
          },
          {
               field: 'followers',
               headerName: 'Followers',
               cellStyle: { display: 'flex', alignItems: 'center' }
          },
          {
               field: 'spotify_url',
               headerName: 'Spotify Link',
               cellRenderer: (params: { value: string | null }) =>
                    params.value ? (
                         <a
                              href={params.value}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-blue-400 hover:text-blue-300'
                         >
                              Open in Spotify
                         </a>
                    ) : null,
               cellStyle: { display: 'flex', alignItems: 'center' }
          }
     ]);

     const fetchMusic = useCallback(async () => {
          if (!spotifyToken) {
               setLoading(false);
               return;
          }

          setLoading(true);
          try {
               const token = localStorage.getItem('token');
               const url = `http://localhost:5001/api/music?time_range=${timeRange}&limit=50&offset=${(currentPage - 1) * 50}`;
               const { data } = await axios.get(url, {
                    headers: {
                         Authorization: `Bearer ${token}`,
                         'Spotify-Token': spotifyToken
                    }
               });
               setMusic(data.artists);
          } catch (error) {
               console.error('Error fetching music:', error);
          }
          setLoading(false);
     }, [spotifyToken, timeRange, currentPage]);

     useEffect(() => {
          fetchMusic();
     }, [fetchMusic]);

     const handleSpotifyLogin = () => {
          const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
          if (!clientId) {
               console.error('Spotify Client ID is not set in environment variables');
               alert('Spotify Client ID is not configured. Please check your environment variables.');
               return;
          }

          // Use just the base URL for the redirect URI
          const redirectUri = 'http://localhost:5173';
          const scope = 'user-top-read';
          const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(
               redirectUri
          )}&scope=${scope}`;

          console.log('Spotify Login Details:', {
               clientId,
               redirectUri,
               scope,
               fullUrl: authUrl
          });

          window.location.href = authUrl;
     };

     useEffect(() => {
          const hash = location.hash;
          console.log('Current URL hash:', hash);

          if (hash) {
               console.log('Processing hash:', hash);
               const params = new URLSearchParams(hash.substring(1));
               const token = params.get('access_token');
               const error = params.get('error');
               const errorDescription = params.get('error_description');

               console.log('Extracted parameters:', {
                    token: token ? 'Token present' : 'No token',
                    error,
                    errorDescription
               });

               if (error) {
                    console.error('Spotify authentication error:', error);
                    console.error('Error description:', errorDescription);
                    alert(`Spotify authentication error: ${errorDescription || error}`);
                    return;
               }

               if (token) {
                    console.log('Successfully received Spotify token');
                    setSpotifyToken(token);
                    localStorage.setItem('spotify_token', token);
                    // Navigate to the same route without the hash
                    navigate(location.pathname + location.search, { replace: true });
                    console.log('Token stored and URL cleaned');
               }
          } else {
               // Check if we have a stored token
               const storedToken = localStorage.getItem('spotify_token');
               if (storedToken) {
                    console.log('Found stored Spotify token');
                    setSpotifyToken(storedToken);
               } else {
                    console.log('No stored token found');
               }
          }
     }, [location, navigate]);

     if (loading) {
          return (
               <div className='flex justify-center items-center h-[1080px]'>
                    <FaSpinner className='text-purple-500 text-4xl animate-spin' />
               </div>
          );
     }

     if (!spotifyToken) {
          return (
               <div className='flex h-screen w-[100%] bg-gray-900 text-white'>
                    <Sidebar />
                    <div className='flex flex-col flex-1 p-4 items-center justify-center'>
                         <h1 className='text-2xl mb-4'>Connect to Spotify</h1>
                         <button
                              onClick={handleSpotifyLogin}
                              className='bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded'
                         >
                              Login with Spotify
                         </button>
                    </div>
               </div>
          );
     }

     return (
          <div className='flex h-screen w-[100%] bg-gray-900 text-white'>
               <Sidebar />
               <div className='flex flex-col flex-1 p-4'>
                    <div className='mb-4 flex gap-4'>
                         <select
                              value={timeRange}
                              onChange={(e) => setTimeRange(e.target.value as 'short_term' | 'medium_term' | 'long_term')}
                              className='p-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none'
                         >
                              <option value='short_term'>Last 4 Weeks</option>
                              <option value='medium_term'>Last 6 Months</option>
                              <option value='long_term'>All Time</option>
                         </select>
                    </div>
                    <div className='flex-1'>
                         <AgGridReact
                              rowData={music}
                              columnDefs={colDefs}
                              defaultColDef={defaultColDef}
                              theme={myTheme}
                              pagination={pagination}
                              paginationPageSize={paginationPageSize}
                              paginationPageSizeSelector={paginationPageSizeSelector}
                              rowHeight={rowHeight}
                              onPaginationChanged={(e) => {
                                   const newPage = e.api.paginationGetCurrentPage() + 1;
                                   setCurrentPage(newPage);
                              }}
                         />
                    </div>
               </div>
          </div>
     );
};

export default MusicDataGrid;
