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
import { BookData, BookStats, YearDistribution } from '../types/interfaces';
import '../App.css';
import BooksDataCard from '../components/stats/BooksDataCard';
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
      avgPages: 0,
      oldestBook: null,
      newestBook: null,
      yearDistribution: {} as YearDistribution,
   });
   const [favoriteBookStats, setFavoriteBookStats] = useState<BookStats>({
      count: 0,
      uniqueAuthors: 0,
      avgPages: 0,
      oldestBook: null,
      newestBook: null,
      yearDistribution: {} as YearDistribution,
   });

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

   const handleAddToFavorites = async (bookId: string) => {
      try {
         const token = localStorage.getItem('token');
         if (favorites.includes(bookId)) {
            await axios.delete(`${API_BASE_URL}/api/favorites/books/${bookId}`, {
               headers: { Authorization: `Bearer ${token}` },
            });
            setFavorites(prev => prev.filter(id => id !== bookId));
         } else {
            await axios.post(
               `${API_BASE_URL}/api/favorites/books/${bookId}`,
               {},
               {
                  headers: { Authorization: `Bearer ${token}` },
               }
            );
            setFavorites(prev => [...prev, bookId]);
         }
         alert('Favorite status updated!');

         // Refresh stats after toggling favorite
         const [booksRes, favoritesRes] = await Promise.all([
            axios.get(`${API_BASE_URL}/api/books`, {
               headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${API_BASE_URL}/api/favorites`, {
               headers: { Authorization: `Bearer ${token}` },
            }),
         ]);

         const booksData = booksRes.data.books;
         const favoriteIds = favoritesRes.data.books?.map((book: BookData) => book._id) || [];

         // Update stats with new data
         const totalStats = calculateBookStats(booksData);
         const favoriteStats = calculateBookStats(
            booksData.filter((book: BookData) => favoriteIds.includes(book._id))
         );

         setBookStats(totalStats);
         setFavoriteBookStats(favoriteStats);
      } catch (error) {
         console.error('Error updating favorites:', error);
         alert('Failed to update favorite status');
      }
   };

   const calculateBookStats = (books: BookData[]): BookStats => {
      const yearDistribution: YearDistribution = {};
      books.forEach((book: BookData) => {
         const year = new Date(book.publishedDate).getFullYear();
         yearDistribution[year] = (yearDistribution[year] || 0) + 1;
      });

      return {
         count: books.length,
         uniqueAuthors: new Set(books.flatMap((book: BookData) => book.authors)).size,
         avgPages:
            books.length > 0
               ? Math.round(
                    books.reduce((total, book) => total + (book.pageCount || 0), 0) / books.length
                 )
               : 0,
         oldestBook:
            books.length > 0
               ? new Date(Math.min(...books.map(book => new Date(book.publishedDate).getTime())))
               : null,
         newestBook:
            books.length > 0
               ? new Date(Math.max(...books.map(book => new Date(book.publishedDate).getTime())))
               : null,
         yearDistribution,
      };
   };

   const colDefs: ColDef<BookData>[] = [
      {
         field: 'thumbnail',
         headerName: 'Cover',
         width: 100,
         autoHeight: true,
         hide: window.innerWidth < 768,
         cellStyle: { lineHeight: '1.2' },
         cellRenderer: (params: { value: string }) => {
            const fallbackImage = 'https://dummyimage.com/60x90/cccccc/ffffff.png&text=No+Image';
            if (!params.value) {
               return (
                  <div className="flex items-center justify-center h-full">
                     <img
                        src={fallbackImage}
                        alt="No image available"
                        className="w-[40px] h-[60px] object-cover rounded shadow-md"
                     />
                  </div>
               );
            }
            return (
               <div className="flex items-center justify-center h-full">
                  <img
                     src={params.value}
                     alt="Book Cover"
                     className="w-[40px] h-[60px] object-cover rounded shadow-md"
                     onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        const img = e.target as HTMLImageElement;
                        img.onerror = null;
                        img.src = fallbackImage;
                     }}
                  />
               </div>
            );
         },
      },
      {
         field: 'title',
         flex: 2,
         cellStyle: { lineHeight: '1.2' },
      },
      {
         field: 'authors',
         headerName: 'Author',
         flex: 2,
         cellStyle: { lineHeight: '1.2' },
         valueFormatter: params => {
            return params.value.join(', ');
         },
      },
      {
         field: 'publishedDate',
         headerName: 'Date Published',
         hide: window.innerWidth < 768,
         cellStyle: { lineHeight: '1.2' },
         valueFormatter: params => {
            const date = new Date(params.value);
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${month}/${year}`;
         },
      },
      {
         field: 'categories',
         headerName: 'Category',
         hide: window.innerWidth < 768,
         flex: 2,
         cellStyle: { lineHeight: '1.2' },
         valueFormatter: params => {
            return params.value.join(', ');
         },
      },
      {
         field: 'description',
         headerName: 'Description',
         hide: window.innerWidth < 768,
         flex: 3,
         cellStyle: {
            lineHeight: '1.2',
            padding: '8px 0',
         },
         wrapText: true,
         maxWidth: 400,
         tooltipField: 'description',
         valueFormatter: params => {
            const text = params.value;
            if (text && text.length > 200) {
               return text.substring(0, 200) + '...';
            }
            return text;
         },
      },
      {
         headerName: 'Actions',
         width: 120,
         cellStyle: { lineHeight: '1.2' },
         cellRenderer: (params: ICellRendererParams<BookData>) => {
            const isFavorite = params.data?._id && favorites.includes(params.data._id);
            return (
               <button
                  onClick={() => params.data?._id && handleAddToFavorites(params.data._id)}
                  className={`p-2 rounded-full ${
                     isFavorite
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
               >
                  <FaHeart className={`w-4 h-4 ${isFavorite ? 'text-white' : 'text-gray-700'}`} />
               </button>
            );
         },
      },
   ];

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         try {
            const token = localStorage.getItem('token');
            if (!token) {
               console.error('No token found');
               return;
            }

            const [booksRes, favoritesRes] = await Promise.all([
               axios.get('/api/books', {
                  headers: { Authorization: `Bearer ${token}` },
               }),
               axios.get('/api/favorites', {
                  headers: { Authorization: `Bearer ${token}` },
               }),
            ]);

            const booksData = booksRes.data.books;
            const favoriteIds = favoritesRes.data.books?.map((book: BookData) => book._id) || [];

            setBooks(booksData);
            setFavorites(favoriteIds);

            // Calculate total book stats
            const totalStats = calculateBookStats(booksData);

            // Calculate favorite book stats
            const favoriteBooks = booksData.filter((book: BookData) =>
               favoriteIds.includes(book._id)
            );
            const favoriteStats = calculateBookStats(favoriteBooks);

            setBookStats(totalStats);
            setFavoriteBookStats(favoriteStats);
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
                        <h4 className="text-sm text-gray-400 mb-1">Total Books</h4>
                        <p className="text-xl font-bold text-purple-500">{bookStats.count}</p>
                     </div>
                     <div className="bg-gray-700 rounded-lg p-3 text-center">
                        <h4 className="text-sm text-gray-400 mb-1">Unique Authors</h4>
                        <p className="text-xl font-bold text-pink-500">{bookStats.uniqueAuthors}</p>
                     </div>
                     <div className="bg-gray-700 rounded-lg p-3 text-center">
                        <h4 className="text-sm text-gray-400 mb-1">Avg Pages</h4>
                        <p className="text-xl font-bold text-green-500">
                           {Math.round(bookStats.avgPages)}
                        </p>
                     </div>
                  </div>

                  {/* Charts */}
                  <div className="space-y-4">
                     {/* Year Distribution Chart */}
                     <div className="bg-gray-700 rounded-lg p-3">
                        <h4 className="text-sm font-semibold text-white mb-2 text-center">
                           Year Distribution
                        </h4>
                        <div className="h-40">
                           <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                 data={Object.entries(bookStats.yearDistribution)}
                                 margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
                              >
                                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                 <XAxis dataKey="0" stroke="#9CA3AF" />
                                 <YAxis stroke="#9CA3AF" />
                                 <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                                    labelStyle={{ color: '#9CA3AF' }}
                                 />
                                 <Legend />
                                 <Line
                                    type="monotone"
                                    dataKey="1"
                                    stroke="#8B5CF6"
                                    strokeWidth={2}
                                    dot={{ fill: '#8B5CF6', r: 4 }}
                                    name="Number of Books"
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
                                       name: 'All Books',
                                       authors: bookStats.uniqueAuthors,
                                       pages: bookStats.avgPages,
                                    },
                                    {
                                       name: 'Favorites',
                                       authors: favoriteBookStats.uniqueAuthors,
                                       pages: favoriteBookStats.avgPages,
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
                                 <Bar dataKey="authors" name="Unique Authors" fill="#8B5CF6" />
                                 <Bar dataKey="pages" name="Average Pages" fill="#EC4899" />
                              </BarChart>
                           </ResponsiveContainer>
                        </div>
                     </div>
                  </div>
               </div>

               {/* User Favorites Section */}
               <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                  <BooksDataCard title="Your Favorites" stats={favoriteBookStats} />
               </div>
            </div>

            {/* Books Grid */}
            <div className="w-full md:w-3/4">
               <div className="ag-theme-quartz h-[400px] md:h-[calc(100vh-4rem)] w-full border border-gray-700 rounded-lg">
                  <AgGridReact
                     rowData={books}
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

export default BooksTable;
