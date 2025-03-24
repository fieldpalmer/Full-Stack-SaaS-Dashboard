import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
// import Sidebar from '../components/Sidebar';
import { FaSpinner } from 'react-icons/fa';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, ColDef, themeMaterial, colorSchemeDark } from 'ag-grid-community';
import '../App.css';

ModuleRegistry.registerModules([AllCommunityModule]);
const myTheme = themeMaterial.withPart(colorSchemeDark).withParams({ headerTextColor: 'white' });

interface MovieData {
     _id: string;
     poster: string;
     seen: boolean;
     title: string;
     year: number;
     runtime: number;
     genres: string[];
     directors: string[];
     rated: string;
     viewerTomatoesRating: string;
     cast: string[];
     plot: string;
}

const MovieDataGrid = () => {
     const [movies, setMovies] = useState<MovieData[]>([]);
     const [loading, setLoading] = useState<boolean>(true);

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
     const paginationPageSize = 100;
     const paginationPageSizeSelector = [100, 500, 1000];
     const rowHeight = 100;

     const [colDefs] = useState<ColDef<MovieData>[]>([
          // { field: '_id' },
          {
               field: 'poster',
               autoHeight: true,
               cellRenderer: (params: { value: string }) => {
                    const fallbackImage = 'https://dummyimage.com/100x150/cccccc/ffffff.png&text=No+Image';
                    if (!params.value) {
                         return <img src={fallbackImage} alt='No poster available' style={{ width: '100px', height: 'auto' }} />;
                    }
                    return (
                         <img
                              src={params.value}
                              alt='Poster'
                              style={{ width: '100px', height: 'auto' }}
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
          { field: 'seen', editable: true, cellStyle: { display: 'flex', alignItems: 'center' } },
          { field: 'year', cellStyle: { display: 'flex', alignItems: 'center' } },
          {
               field: 'runtime',
               cellStyle: { display: 'flex', alignItems: 'center' },
               valueFormatter: (params) => {
                    const totalMinutes = params.value;
                    const hours = Math.floor(totalMinutes / 60);
                    const minutes = totalMinutes % 60;
                    if (hours === 0) {
                         return `${minutes}m`;
                    }
                    return `${hours}H${minutes}m`;
               }
          },
          { field: 'rated', cellStyle: { display: 'flex', alignItems: 'center' } },
          { field: 'viewerTomatoesRating', headerName: 'Viewer Rating', cellStyle: { display: 'flex', alignItems: 'center' } },
          {
               field: 'genres',
               flex: 2,
               wrapText: true,
               cellStyle: { display: 'flex', alignItems: 'center', lineHeight: '1.3' },
               valueFormatter: (params) => (Array.isArray(params.value) ? params.value.join(', ') : params.value)
          },
          {
               field: 'directors',
               flex: 2,
               wrapText: true,
               cellStyle: { display: 'flex', alignItems: 'center', lineHeight: '1.3' },
               valueFormatter: (params) => (Array.isArray(params.value) ? params.value.join(', ') : params.value)
          },
          {
               field: 'cast',
               flex: 2,
               wrapText: true,
               cellStyle: { display: 'flex', alignItems: 'center', lineHeight: '1.3' },
               valueFormatter: (params) => (Array.isArray(params.value) ? params.value.join(', ') : params.value)
          },
          {
               field: 'plot',
               autoHeight: true,
               flex: 2,
               wrapText: true,
               cellStyle: { display: 'flex', alignItems: 'center', whiteSpace: 'normal', lineHeight: '1.3' }
          }
     ]);

     const fetchMovies = useCallback(async () => {
          setLoading(true);
          try {
               const token = localStorage.getItem('token');
               const { data } = await axios.get('http://localhost:5001/api/movies/', {
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
          <div className='h-[1080px]'>
               <AgGridReact
                    rowData={movies}
                    columnDefs={colDefs}
                    defaultColDef={defaultColDef}
                    // rowSelection={{ mode: 'multiRow', checkboxes: true }}
                    theme={myTheme}
                    pagination={pagination}
                    paginationPageSize={paginationPageSize}
                    paginationPageSizeSelector={paginationPageSizeSelector}
                    rowHeight={rowHeight}
                    // onSelectionChanged={handleSelectionChanged}
               />
          </div>
     );
};

export default MovieDataGrid;
