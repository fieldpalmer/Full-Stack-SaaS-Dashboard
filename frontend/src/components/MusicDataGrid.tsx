import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { FaSpinner, FaHeart } from 'react-icons/fa';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, ColDef, themeMaterial, colorSchemeDark } from 'ag-grid-community';
import '../App.css';

ModuleRegistry.registerModules([AllCommunityModule]);
const myTheme = themeMaterial.withPart(colorSchemeDark).withParams({ headerTextColor: 'white' });

interface MusicData {
     _id: string;
     name: string;
     listeners: number;
     image: string;
     url: string;
}

const MusicDataGrid = () => {
     const [music, setMusic] = useState<MusicData[]>([]);
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
               alert('Artist added to favorites!');
          } catch (error) {
               if (axios.isAxiosError(error) && error.response?.status === 400) {
                    alert('This artist is already in your favorites!');
               } else {
                    console.error('Error adding to favorites:', error);
                    alert('Failed to add artist to favorites');
               }
          }
     };

     const [colDefs] = useState<ColDef<MusicData>[]>([
          {
               field: 'image',
               headerName: 'Image',
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
          {
               field: 'listeners',
               headerName: 'Listeners',
               cellStyle: { display: 'flex', alignItems: 'center' },
               valueFormatter: (params) => {
                    return new Intl.NumberFormat().format(params.value);
               }
          },
          {
               field: 'url',
               headerName: 'Last.fm Link',
               cellRenderer: (params: { value: string }) => (
                    <a href={params.value} target='_blank' rel='noopener noreferrer' className='text-blue-400 hover:text-blue-300'>
                         Open in Last.fm
                    </a>
               ),
               cellStyle: { display: 'flex', alignItems: 'center' }
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
                         <FaHeart className={favorites.includes(params.data._id) ? 'text-white' : 'text-gray-400'} />
                         {favorites.includes(params.data._id) ? 'Added' : 'Add'}
                    </button>
               ),
               cellStyle: { display: 'flex', alignItems: 'center' }
          }
     ]);

     const fetchMusic = useCallback(async () => {
          setLoading(true);
          try {
               const token = localStorage.getItem('token');
               const { data } = await axios.get('https://full-stack-saas-dashboard.onrender.com/api/music/', {
                    headers: { Authorization: `Bearer ${token}` }
               });
               setMusic(data.music);
          } catch (error) {
               console.error('Error fetching music:', error);
          }
          setLoading(false);
     }, []);

     useEffect(() => {
          fetchMusic();
     }, [fetchMusic]);

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
                              rowData={music}
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

export default MusicDataGrid;
