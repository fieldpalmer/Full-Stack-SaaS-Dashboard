import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FaSpinner, FaHeart } from 'react-icons/fa';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, ColDef, themeMaterial, colorSchemeDark } from 'ag-grid-community';
import { BookStats, BookData } from '../types/interfaces';
import '../App.css';
import BooksDataCard from '../components/stats/BooksDataCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { API_BASE_URL } from '../config';

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

ModuleRegistry.registerModules([AllCommunityModule]);
const myTheme = themeMaterial.withPart(colorSchemeDark).withParams({ headerTextColor: 'white' });

const BooksTable = () => {
     const [books, setBooks] = useState<BookData[]>([]);
     const [loading, setLoading] = useState<boolean>(true);
     const [favorites, setFavorites] = useState<string[]>([]);
     const [bookStats, setBookStats] = useState<BookStats>({
          count: 0,
          uniqueAuthors: 0,
          oldestBook: null,
          newestBook: null,
          yearDistribution: {}
     });
     const [favoriteBookStats, setFavoriteBookStats] = useState<BookStats>({
          count: 0,
          uniqueAuthors: 0,
          oldestBook: null,
          newestBook: null,
          yearDistribution: {}
     });

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

     const handleAddToFavorites = async (bookId: string) => {
          try {
               const token = localStorage.getItem('token');
               await axios.post(
                    `https://full-stack-saas-dashboard.onrender.com/api/favorites/books/${bookId}`,
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
                              alt='Book Cover'
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
               field: 'authors',
               headerName: 'Authors',
               cellStyle: { display: 'flex', alignItems: 'center' },
               valueFormatter: (params) => {
                    return params.value.join(', ');
               }
          },
          {
               field: 'publishedDate',
               headerName: 'Published Date',
               cellStyle: { display: 'flex', alignItems: 'center' },
               valueFormatter: (params) => {
                    const date = new Date(params.value);
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const year = date.getFullYear();
                    return `${month}/${year}`;
               }
          },
          {
               field: 'categories',
               headerName: 'Categories',
               cellStyle: { display: 'flex', alignItems: 'center' },
               valueFormatter: (params) => {
                    return params.value.join(', ');
               }
          },
          {
               field: 'description',
               headerName: 'Description',
               flex: 3,
               cellStyle: { display: 'flex', alignItems: 'center' },
               wrapText: true
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
                         <FaHeart className={favorites.includes(params.data._id) ? 'text-red-500' : 'text-white'} />
                    </button>
               ),
               cellStyle: { display: 'flex', alignItems: 'center' }
          }
     ]);

     useEffect(() => {
          const fetchData = async () => {
               setLoading(true);
               try {
                    const token = localStorage.getItem('token');
                    console.log('Fetching books with token:', token);

                    const [booksRes, favoritesRes] = await Promise.all([
                         axios.get('https://full-stack-saas-dashboard.onrender.com/api/books/', {
                              headers: { Authorization: `Bearer ${token}` }
                         }),
                         axios.get('https://full-stack-saas-dashboard.onrender.com/api/favorites', {
                              headers: { Authorization: `Bearer ${token}` }
                         })
                    ]);

                    console.log('Books API Response:', booksRes.data);
                    console.log('Favorites API Response:', favoritesRes.data);

                    const booksData = booksRes.data.books;
                    const favoriteIds = favoritesRes.data.books?.map((book: BookData) => book._id) || [];

                    setBooks(booksData);
                    setFavorites(favoriteIds);

                    // Calculate total book stats
                    const totalStats: BookStats = {
                         count: booksData.length,
                         uniqueAuthors: new Set(booksData.flatMap((book: BookData) => book.authors)).size,
                         oldestBook:
                              booksData.length > 0
                                   ? new Date(Math.min(...booksData.map((b: BookData) => new Date(b.publishedDate).getTime())))
                                   : null,
                         newestBook:
                              booksData.length > 0
                                   ? new Date(Math.max(...booksData.map((b: BookData) => new Date(b.publishedDate).getTime())))
                                   : null,
                         yearDistribution: booksData.reduce((acc: { [key: number]: number }, book: BookData) => {
                              const year = new Date(book.publishedDate).getFullYear();
                              acc[year] = (acc[year] || 0) + 1;
                              return acc;
                         }, {} as { [key: number]: number })
                    };

                    // Calculate favorite book stats
                    const favoriteBooks = booksData.filter((book: BookData) => favoriteIds.includes(book._id));
                    const favoriteStats: BookStats = {
                         count: favoriteBooks.length,
                         uniqueAuthors: new Set(favoriteBooks.flatMap((book: BookData) => book.authors)).size,
                         oldestBook:
                              favoriteBooks.length > 0
                                   ? new Date(Math.min(...favoriteBooks.map((b: BookData) => new Date(b.publishedDate).getTime())))
                                   : null,
                         newestBook:
                              favoriteBooks.length > 0
                                   ? new Date(Math.max(...favoriteBooks.map((b: BookData) => new Date(b.publishedDate).getTime())))
                                   : null,
                         yearDistribution: favoriteBooks.reduce((acc: { [key: number]: number }, book: BookData) => {
                              const year = new Date(book.publishedDate).getFullYear();
                              acc[year] = (acc[year] || 0) + 1;
                              return acc;
                         }, {} as { [key: number]: number })
                    };

                    setBookStats(totalStats);
                    setFavoriteBookStats(favoriteStats);

                    console.log('Total Book Stats:', totalStats);
                    console.log('Favorite Book Stats:', favoriteStats);
               } catch (error) {
                    console.error('Error fetching data:', error);
               } finally {
                    setLoading(false);
               }
          };

          fetchData();
     }, []);

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
                                        <h4 className='text-sm text-gray-400 mb-2'>Total Books</h4>
                                        <p className='text-3xl font-bold text-purple-500'>
                                             {bookStats.count >= 1000000
                                                  ? `${(bookStats.count / 1000000).toFixed(1)}M`
                                                  : bookStats.count >= 1000
                                                  ? `${(bookStats.count / 1000).toFixed(1)}K`
                                                  : bookStats.count}
                                        </p>
                                   </div>
                                   <div className='bg-gray-700 rounded-lg p-4 text-center'>
                                        <h4 className='text-sm text-gray-400 mb-2'>Unique Authors</h4>
                                        <p className='text-3xl font-bold text-pink-500'>
                                             {bookStats.uniqueAuthors >= 1000000
                                                  ? `${(bookStats.uniqueAuthors / 1000000).toFixed(1)}M`
                                                  : bookStats.uniqueAuthors >= 1000
                                                  ? `${(bookStats.uniqueAuthors / 1000).toFixed(1)}K`
                                                  : bookStats.uniqueAuthors}
                                        </p>
                                   </div>
                                   <div className='bg-gray-700 rounded-lg p-4 text-center'>
                                        <h4 className='text-sm text-gray-400 mb-2'>Author Diversity</h4>
                                        <p className='text-3xl font-bold text-green-500'>
                                             {((bookStats.uniqueAuthors / bookStats.count) * 100).toFixed(1)}%
                                        </p>
                                   </div>
                              </div>

                              {/* Line Chart */}
                              <div className='bg-gray-700 rounded-lg p-4 mb-4'>
                                   <h4 className='text-lg font-semibold text-white mb-4 text-center'>Year Distribution</h4>
                                   <div style={{ height: '300px', width: '100%' }}>
                                        <ResponsiveContainer>
                                             <LineChart
                                                  data={Object.entries(bookStats.yearDistribution).map(([year, count]) => ({
                                                       year,
                                                       count,
                                                       favoriteCount:
                                                            (favoriteBookStats.yearDistribution as Record<string, number>)[year] ||
                                                            0
                                                  }))}
                                                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                             >
                                                  <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                                                  <XAxis dataKey='year' stroke='#9CA3AF' />
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
                                                       name='Total Books'
                                                  />
                                                  <Line
                                                       type='monotone'
                                                       dataKey='favoriteCount'
                                                       stroke='#EC4899'
                                                       strokeWidth={2}
                                                       dot={{ fill: '#EC4899', r: 4 }}
                                                       name='Favorite Books'
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
                                                            name: 'All Books',
                                                            authorDiversity: (bookStats.uniqueAuthors / bookStats.count).toFixed(
                                                                 2
                                                            ),
                                                            count: bookStats.count
                                                       },
                                                       {
                                                            name: 'Favorites',
                                                            authorDiversity: (
                                                                 favoriteBookStats.uniqueAuthors / favoriteBookStats.count
                                                            ).toFixed(2),
                                                            count: favoriteBookStats.count
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
                                                  <Bar dataKey='authorDiversity' name='Author Diversity' fill='#8B5CF6' />
                                                  <Bar dataKey='count' name='Book Count' fill='#EC4899' />
                                             </BarChart>
                                        </ResponsiveContainer>
                                   </div>
                              </div>
                         </div>
                         {/* User Favorites Section */}
                         <div className='bg-gray-800 rounded-lg p-4'>
                              <BooksDataCard title='Your Favorites' stats={favoriteBookStats} />
                         </div>
                    </div>

                    <div className='w-full md:w-2/3'>
                         <AgGridReact
                              rowData={books}
                              columnDefs={colDefs}
                              defaultColDef={defaultColDef}
                              theme={myTheme}
                              pagination={true}
                              paginationPageSize={50}
                              paginationPageSizeSelector={[50]}
                              rowHeight={100}
                         />
                    </div>
               </div>
          </div>
     );
};

export default BooksTable;
