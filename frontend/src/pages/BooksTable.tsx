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
         await axios.post(
            `https://full-stack-saas-dashboard.onrender.com/api/favorites/books/${bookId}`,
            {},
            {
               headers: { Authorization: `Bearer ${token}` },
            }
         );
         setFavorites(prev => [...prev, bookId]);
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

   const [colDefs] = useState<ColDef<BookData>[]>([
      {
         field: 'thumbnail',
         headerName: 'Cover',
         autoHeight: true,
         cellRenderer: (params: { value: string }) => {
            const fallbackImage = 'https://dummyimage.com/100x100/cccccc/ffffff.png&text=No+Image';
            if (!params.value) {
               return (
                  <div className="flex items-center justify-center h-full">
                     <img
                        src={fallbackImage}
                        alt="No image available"
                        className="w-10 h-10 rounded-full object-cover"
                     />
                  </div>
               );
            }
            return (
               <div className="flex items-center justify-center h-full">
                  <img
                     src={params.value}
                     alt="Book Cover"
                     className="w-10 h-10 rounded-full object-cover"
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
      { field: 'title', flex: 2, cellStyle: { lineHeight: '1.2' } },
      {
         field: 'authors',
         headerName: 'Authors',
         flex: 2,
         valueFormatter: params => {
            return params.value.join(', ');
         },
      },
      {
         field: 'publishedDate',
         headerName: 'Published Date',
         valueFormatter: params => {
            const date = new Date(params.value);
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${month}/${year}`;
         },
      },
      {
         field: 'pageCount',
         headerName: 'Pages',
         valueFormatter: params => {
            return params.value ? params.value.toString() : 'N/A';
         },
      },
      {
         field: 'categories',
         headerName: 'Categories',
         flex: 2,
         valueFormatter: params => {
            return params.value.join(', ');
         },
      },
      {
         field: 'description',
         headerName: 'Description',
         flex: 3,
         cellStyle: { lineHeight: '1.2' },
         wrapText: true,
         maxWidth: 400,
         tooltipField: 'description',
         valueFormatter: params => {
            const text = params.value;
            if (text && text.length > 200) {
               return text.substring(0, 200) + '...';
            }
            return text || 'No description available';
         },
      },
      {
         field: 'infoLink',
         headerName: 'Info Link',
         cellRenderer: (params: { value: string }) => (
            <a
               href={params.value}
               target="_blank"
               rel="noopener noreferrer"
               className="text-blue-500 hover:text-blue-600"
            >
               View on Google Books
            </a>
         ),
      },
      {
         headerName: 'Add to Favorites',
         cellRenderer: (params: { data: BookData }) => (
            <button
               onClick={() => handleAddToFavorites(params.data._id)}
               className={`p-2 rounded-full ${
                  favorites.includes(params.data._id)
                     ? 'bg-red-500 text-white'
                     : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
               }`}
            >
               <FaHeart className="w-4 h-4" />
            </button>
         ),
         cellStyle: { display: 'flex', alignItems: 'center' },
      },
   ]);

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         try {
            const token = localStorage.getItem('token');

            const [booksRes, favoritesRes] = await Promise.all([
               axios.get('https://full-stack-saas-dashboard.onrender.com/api/books/', {
                  headers: { Authorization: `Bearer ${token}` },
               }),
               axios.get('https://full-stack-saas-dashboard.onrender.com/api/favorites', {
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
      <div className="flex flex-col min-h-[calc(100vh-4rem)] w-full bg-gray-900 text-white">
         <div className="flex flex-col md:flex-row gap-2 py-2 md:py-3 h-full">
            <div className="w-full md:w-1/4 space-y-2">
               {/* SIDEBAR*/}
               <div className="bg-gray-800 rounded-lg p-2 border border-gray-600 ">
                  {/* Key Statistics */}
                  <div className="grid grid-cols-3 gap-1 sm:gap-2 mb-2">
                     <div className="bg-gray-700 rounded-lg p-2 text-center">
                        <h4 className="text-xs sm:text-sm text-gray-400 mb-1">Total Books</h4>
                        <p className="text-xl sm:text-2xl font-bold text-purple-500">
                           {bookStats.count}
                        </p>
                     </div>
                     <div className="bg-gray-700 rounded-lg p-2 text-center">
                        <h4 className="text-xs sm:text-sm text-gray-400 mb-1">Unique Authors</h4>
                        <p className="text-xl sm:text-2xl font-bold text-pink-500">
                           {bookStats.uniqueAuthors}
                        </p>
                     </div>
                     <div className="bg-gray-700 rounded-lg p-2 text-center">
                        <h4 className="text-xs sm:text-sm text-gray-400 mb-1">Avg Pages</h4>
                        <p className="text-xl sm:text-2xl font-bold text-green-500">
                           {Math.round(bookStats.avgPages)}
                        </p>
                     </div>
                  </div>

                  {/* Line Chart */}
                  <div className="bg-gray-700 rounded-lg p-2 mb-2">
                     <h4 className="text-sm sm:text-base font-semibold text-white mb-2 text-center">
                        Year Distribution
                     </h4>
                     <div className="h-40 sm:h-48">
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

                  {/* Bar Chart */}
                  <div className="bg-gray-700 rounded-lg p-2">
                     <h4 className="text-sm sm:text-base font-semibold text-white mb-2 text-center">
                        Performance Comparison
                     </h4>
                     <div className="h-40 sm:h-48">
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
               {/* User Favorites Section */}
               <div className="bg-gray-800 rounded-lg p-2 border border-gray-600 h-[400px]">
                  <BooksDataCard title="Your Favorites" stats={favoriteBookStats} />
               </div>
            </div>

            <div className="w-full md:w-2/3 mt-2 md:mt-0 flex-1">
               <div className="ag-theme-quartz h-[400px] md:h-full w-full border border-gray-700 rounded-lg">
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
