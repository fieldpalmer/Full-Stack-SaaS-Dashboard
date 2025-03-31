import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { FaSpinner, FaHeart } from 'react-icons/fa';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, ColDef, themeMaterial, colorSchemeDark } from 'ag-grid-community';
import '../App.css';

ModuleRegistry.registerModules([AllCommunityModule]);
const myTheme = themeMaterial.withPart(colorSchemeDark).withParams({ headerTextColor: 'white' });

interface BookData {
     _id: string;
     title: string;
     authors: string[];
     description: string;
     publishedDate: string;
     categories: string[];
     thumbnail: string;
     infoLink: string;
     googleId: string;
}

const BooksDataGrid = () => {
     const [books, setBooks] = useState<BookData[]>([]);
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

     const handleAddToFavorites = async (bookId: string) => {
          try {
               const token = localStorage.getItem('token');
               await axios.post(
                    `http://localhost:5001/api/favorites/books/${bookId}`,
                    {},
                    {
                         headers: { Authorization: `Bearer ${token}` }
                    }
               );
               setFavorites((prev) => [...prev, bookId]);
               alert('Book added to favorites!');
          } catch (error) {
               if (axios.isAxiosError(error) && error.response?.status === 400) {
                    alert('This book is already in your favorites!');
               } else {
                    console.error('Error adding to favorites:', error);
                    alert('Failed to add book to favorites');
               }
          }
     };

     const [colDefs] = useState<ColDef<BookData>[]>([
          {
               field: 'thumbnail',
               headerName: 'Cover',
               autoHeight: true,
               cellRenderer: (params: { value: string }) => {
                    const fallbackImage = 'https://dummyimage.com/100x150/cccccc/ffffff.png&text=No+Cover';
                    if (!params.value) {
                         return <img src={fallbackImage} alt='No cover available' style={{ width: '100px', height: 'auto' }} />;
                    }
                    return (
                         <img
                              src={params.value}
                              alt='Book cover'
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
          {
               field: 'authors',
               headerName: 'Authors',
               flex: 2,
               cellStyle: { display: 'flex', alignItems: 'center' },
               valueFormatter: (params) => (Array.isArray(params.value) ? params.value.join(', ') : params.value)
          },
          {
               field: 'publishedDate',
               headerName: 'Published Date',
               cellStyle: { display: 'flex', alignItems: 'center' }
          },
          {
               field: 'categories',
               headerName: 'Categories',
               flex: 2,
               cellStyle: { display: 'flex', alignItems: 'center' },
               valueFormatter: (params) => (Array.isArray(params.value) ? params.value.join(', ') : params.value)
          },
          {
               field: 'description',
               flex: 3,
               wrapText: true,
               cellStyle: { display: 'flex', alignItems: 'center', whiteSpace: 'normal', lineHeight: '1.3' }
          },
          {
               field: 'infoLink',
               headerName: 'Google Books Link',
               cellRenderer: (params: { value: string }) => (
                    <a href={params.value} target='_blank' rel='noopener noreferrer' className='text-blue-400 hover:text-blue-300'>
                         Open in Google Books
                    </a>
               ),
               cellStyle: { display: 'flex', alignItems: 'center' }
          },
          {
               headerName: 'Add to Favorites',
               cellRenderer: (params: { data: BookData }) => (
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

     const fetchBooks = useCallback(async () => {
          setLoading(true);
          try {
               const token = localStorage.getItem('token');
               const { data } = await axios.get('http://localhost:5001/api/books/', {
                    headers: { Authorization: `Bearer ${token}` }
               });
               setBooks(data.books);
          } catch (error) {
               console.error('Error fetching books:', error);
          }
          setLoading(false);
     }, []);

     useEffect(() => {
          fetchBooks();
     }, [fetchBooks]);

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
                              rowData={books}
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

export default BooksDataGrid;
