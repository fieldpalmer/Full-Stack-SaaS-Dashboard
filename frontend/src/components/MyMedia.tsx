import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { FaSpinner, FaFilm, FaBook, FaMusic, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import {
   UserFavorites,
   MovieStats,
   BookStats,
   MusicStats,
   Movie,
   Book,
   Music,
} from '../types/interfaces';
import MovieDataCard from './stats/MovieDataCard';
import MusicDataCard from './stats/MusicDataCard';
import BooksDataCard from './stats/BooksDataCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useAuth } from '../context/AuthContext';
import AuthModals from './AuthModals';

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const MyMedia = () => {
   const { user, createGuest } = useAuth();
   const [loading, setLoading] = useState(true);
   const [expandedRows, setExpandedRows] = useState({
      movies: true,
      books: true,
      music: true,
   });
   const [favorites, setFavorites] = useState<UserFavorites>({
      movies: [],
      books: [],
      music: [],
   });
   const [totalMovies, setTotalMovies] = useState<Movie[]>([]);
   const [totalBooks, setTotalBooks] = useState<Book[]>([]);
   const [totalMusic, setTotalMusic] = useState<Music[]>([]);
   const [authModalOpen, setAuthModalOpen] = useState(false);
   const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

   const handleAuthClick = (mode: 'login' | 'register') => {
      setAuthModalMode(mode);
      setAuthModalOpen(true);
   };

   useEffect(() => {
      const fetchData = async () => {
         try {
            if (!user) {
               await createGuest();
            }

            const [favoritesRes, moviesRes, booksRes, musicRes] = await Promise.all([
               axios.get('/api/favorites'),
               axios.get('/api/movies'),
               axios.get('/api/books'),
               axios.get('/api/music'),
            ]);

            setFavorites(favoritesRes.data);
            setTotalMovies(moviesRes.data.movies);
            setTotalBooks(booksRes.data.books);
            setTotalMusic(musicRes.data.music);
         } catch (error) {
            console.error('Error fetching data:', error);
         } finally {
            setLoading(false);
         }
      };

      fetchData();
   }, [user, createGuest]);

   // Calculate total movie statistics
   const totalMovieStats: MovieStats = {
      count: totalMovies.length,
      avgRating:
         totalMovies.reduce((acc, movie) => acc + movie.rating, 0) / totalMovies.length || 0,
      avgPopularity:
         totalMovies.reduce((acc, movie) => acc + movie.popularity, 0) / totalMovies.length || 0,
      oldestMovie:
         totalMovies.length > 0
            ? new Date(Math.min(...totalMovies.map(m => new Date(m.release_date).getTime())))
            : null,
      newestMovie:
         totalMovies.length > 0
            ? new Date(Math.max(...totalMovies.map(m => new Date(m.release_date).getTime())))
            : null,
      ratingDistribution: Array.from({ length: 10 }, (_, i) => ({
         rating: (i + 1).toFixed(1),
         count: totalMovies.filter(m => Math.floor(m.rating) === i + 1).length,
      })),
   };

   // Calculate favorite movie statistics
   const favoriteMovieStats: MovieStats = {
      count: favorites.movies.length,
      avgRating:
         favorites.movies.reduce((acc, movie) => acc + movie.rating, 0) / favorites.movies.length ||
         0,
      avgPopularity:
         favorites.movies.reduce((acc, movie) => acc + movie.popularity, 0) /
            favorites.movies.length || 0,
      oldestMovie:
         favorites.movies.length > 0
            ? new Date(Math.min(...favorites.movies.map(m => new Date(m.release_date).getTime())))
            : null,
      newestMovie:
         favorites.movies.length > 0
            ? new Date(Math.max(...favorites.movies.map(m => new Date(m.release_date).getTime())))
            : null,
      ratingDistribution: Array.from({ length: 10 }, (_, i) => ({
         rating: (i + 1).toFixed(1),
         count: favorites.movies.filter(m => Math.floor(m.rating) === i + 1).length,
      })),
   };

   // Calculate total book statistics
   const totalBookStats: BookStats = {
      count: totalBooks.length,
      uniqueAuthors: new Set(totalBooks.flatMap(book => book.authors)).size,
      avgPages:
         totalBooks.length > 0
            ? Math.round(
                 totalBooks.reduce((total, book) => total + (book.pageCount || 0), 0) /
                    totalBooks.length
              )
            : 0,
      oldestBook:
         totalBooks.length > 0
            ? new Date(Math.min(...totalBooks.map(b => new Date(b.publishedDate).getTime())))
            : null,
      newestBook:
         totalBooks.length > 0
            ? new Date(Math.max(...totalBooks.map(b => new Date(b.publishedDate).getTime())))
            : null,
      yearDistribution: totalBooks.reduce((acc, book) => {
         const year = new Date(book.publishedDate).getFullYear();
         acc[year] = (acc[year] || 0) + 1;
         return acc;
      }, {} as { [key: number]: number }),
   };

   // Calculate favorite book statistics
   const favoriteBookStats: BookStats = {
      count: favorites.books.length,
      uniqueAuthors: new Set(favorites.books.flatMap(book => book.authors)).size,
      avgPages:
         favorites.books.length > 0
            ? Math.round(
                 favorites.books.reduce((total, book) => total + (book.pageCount || 0), 0) /
                    favorites.books.length
              )
            : 0,
      oldestBook:
         favorites.books.length > 0
            ? new Date(Math.min(...favorites.books.map(b => new Date(b.publishedDate).getTime())))
            : null,
      newestBook:
         favorites.books.length > 0
            ? new Date(Math.max(...favorites.books.map(b => new Date(b.publishedDate).getTime())))
            : null,
      yearDistribution: favorites.books.reduce((acc, book) => {
         const year = new Date(book.publishedDate).getFullYear();
         acc[year] = (acc[year] || 0) + 1;
         return acc;
      }, {} as { [key: number]: number }),
   };

   // Calculate total music statistics
   const totalMusicStats: MusicStats = {
      totalArtists: totalMusic.length,
      totalListeners: totalMusic.reduce((acc, artist) => acc + artist.listeners, 0),
      averageListeners:
         totalMusic.reduce((acc, artist) => acc + artist.listeners, 0) / totalMusic.length || 0,
      topArtists: [...totalMusic]
         .sort((a, b) => b.listeners - a.listeners)
         .slice(0, 5)
         .map(artist => ({
            name: artist.name,
            listeners: artist.listeners,
            tracks: 1,
         })),
   };

   // Calculate favorite music statistics
   const favoriteMusicStats: MusicStats = {
      totalArtists: favorites.music.length,
      totalListeners: favorites.music.reduce((acc, artist) => acc + artist.listeners, 0),
      averageListeners:
         favorites.music.reduce((acc, artist) => acc + artist.listeners, 0) /
            favorites.music.length || 0,
      topArtists: [...favorites.music]
         .sort((a, b) => b.listeners - a.listeners)
         .slice(0, 5)
         .map(artist => ({
            name: artist.name,
            listeners: artist.listeners,
            tracks: 1,
         })),
   };

   const toggleRow = (mediaType: 'movies' | 'books' | 'music') => {
      setExpandedRows(prev => ({
         ...prev,
         [mediaType]: !prev[mediaType],
      }));
   };

   const calculateInsights = (
      total: MovieStats | BookStats | MusicStats,
      favorites: MovieStats | BookStats | MusicStats,
      type: 'movies' | 'books' | 'music'
   ) => {
      switch (type) {
         case 'movies': {
            const movieTotal = total as MovieStats;
            const movieFavorites = favorites as MovieStats;
            return {
               ratingDifference: (movieFavorites.avgRating - movieTotal.avgRating).toFixed(1),
               popularityDifference: (
                  movieFavorites.avgPopularity - movieTotal.avgPopularity
               ).toFixed(1),
               isRatingHigher: movieFavorites.avgRating > movieTotal.avgRating,
               isPopularityHigher: movieFavorites.avgPopularity > movieTotal.avgPopularity,
            };
         }
         case 'books': {
            const bookTotal = total as BookStats;
            const bookFavorites = favorites as BookStats;
            return {
               authorDiversity: (
                  bookFavorites.uniqueAuthors / bookFavorites.count -
                  bookTotal.uniqueAuthors / bookTotal.count
               ).toFixed(2),
               isMoreDiverse:
                  bookFavorites.uniqueAuthors / bookFavorites.count >
                  bookTotal.uniqueAuthors / bookTotal.count,
            };
         }
         case 'music': {
            const musicTotal = total as MusicStats;
            const musicFavorites = favorites as MusicStats;
            return {
               listenerDifference: (
                  ((musicFavorites.averageListeners - musicTotal.averageListeners) /
                     musicTotal.averageListeners) *
                  100
               ).toFixed(1),
               isMorePopular: musicFavorites.averageListeners > musicTotal.averageListeners,
            };
         }
         default:
            return {};
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
      <div className="p-2 sm:p-6 min-h-[calc(100vh-4rem)] overflow-y-auto">
         <AuthModals
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
            initialMode={authModalMode}
         />
         <div className="text-white text-lg mb-6 mt-3 md:mt-0">
            Welcome, {user?.name || 'Guest'} <br />
            {user?.isGuest && (
               <small>
                  <Link
                     to="#"
                     onClick={e => {
                        e.preventDefault();
                        handleAuthClick('login');
                     }}
                     className="text-cyan-400 hover:text-cyan-300"
                  >
                     login
                  </Link>{' '}
                  or{' '}
                  <Link
                     to="#"
                     onClick={e => {
                        e.preventDefault();
                        handleAuthClick('register');
                     }}
                     className="text-cyan-400 hover:text-cyan-300"
                  >
                     register
                  </Link>{' '}
                  to save your progress
               </small>
            )}
         </div>
         <hr className="border-t border-gray-700 mb-6 " />
         <h2 className="text-xl sm:text-2xl font-bold mb-6 mt-3 md:mt-0 text-white">
            TasteIQ - Analysis & Insights
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-600 ">
               <h3 className="text-lg font-semibold text-white mb-4 text-center">
                  Total Media Distribution
               </h3>
               <div style={{ height: '300px' }}>
                  <ResponsiveContainer>
                     <PieChart>
                        <Pie
                           data={[
                              { name: 'Movies', value: totalMovies.length },
                              { name: 'Books', value: totalBooks.length },
                              { name: 'Music', value: totalMusic.length },
                           ]}
                           cx="50%"
                           cy="50%"
                           labelLine={false}
                           label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                           outerRadius={80}
                           fill="#8884d8"
                           dataKey="value"
                        >
                           <Cell fill="#3B82F6" />
                           <Cell fill="#10B981" />
                           <Cell fill="#8B5CF6" />
                        </Pie>
                        <Tooltip
                           contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                           labelStyle={{ color: '#9CA3AF' }}
                        />
                        <Legend />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 border border-gray-600 ">
               <h3 className="text-lg font-semibold text-white mb-4 text-center">
                  Favorite Media Distribution
               </h3>
               <div style={{ height: '300px' }}>
                  {favorites.movies.length === 0 &&
                  favorites.books.length === 0 &&
                  favorites.music.length === 0 ? (
                     <div className="flex flex-col items-center justify-center h-full">
                        <p className="text-gray-300 mb-4">You haven't added any favorites yet!</p>
                        <div className="flex flex-col gap-2 w-full max-w-md">
                           <Link
                              to="/dashboard/movies-table"
                              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors bg-purple-600 text-white shadow-lg shadow-purple-500/20 hover:bg-purple-700 w-full"
                           >
                              <FaFilm className="text-xl sm:text-2xl text-white" />
                              <span className="text-base font-medium text-white">Go to Movies</span>
                           </Link>
                           <Link
                              to="/dashboard/music-table"
                              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors bg-purple-600 text-white shadow-lg shadow-purple-500/20 hover:bg-purple-700 w-full"
                           >
                              <FaMusic className="text-xl sm:text-2xl text-white" />
                              <span className="text-base font-medium text-white">Go to Music</span>
                           </Link>
                           <Link
                              to="/dashboard/books-table"
                              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors bg-purple-600 text-white shadow-lg shadow-purple-500/20 hover:bg-purple-700 w-full"
                           >
                              <FaBook className="text-xl sm:text-2xl text-white" />
                              <span className="text-base font-medium text-white">Go to Books</span>
                           </Link>
                        </div>
                     </div>
                  ) : (
                     <ResponsiveContainer>
                        <PieChart>
                           <Pie
                              data={[
                                 { name: 'Movies', value: favorites.movies.length },
                                 { name: 'Books', value: favorites.books.length },
                                 { name: 'Music', value: favorites.music.length },
                              ]}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) =>
                                 `${name} ${(percent * 100).toFixed(0)}%`
                              }
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                           >
                              <Cell fill="#3B82F6" />
                              <Cell fill="#10B981" />
                              <Cell fill="#8B5CF6" />
                           </Pie>
                           <Tooltip
                              contentStyle={{
                                 backgroundColor: 'white',
                                 border: '1px solid #E5E7EB',
                              }}
                              labelStyle={{ color: '#4B5563' }}
                           />
                           <Legend />
                        </PieChart>
                     </ResponsiveContainer>
                  )}
               </div>
            </div>
         </div>
         <div className="space-y-4 sm:space-y-6">
            {/* MOVIES */}
            <div className="bg-gray-800 rounded-lg p-2 sm:p-6 border border-gray-600 ">
               <div className="flex items-center justify-between m-2">
                  <div className="flex items-center gap-3">
                     <FaFilm className="text-3xl text-cyan-400" />
                     <h3 className="text-xl font-semibold text-white">Movies</h3>
                  </div>
                  <button
                     onClick={() => toggleRow('movies')}
                     className="text-gray-400 hover:text-white transition-colors"
                  >
                     {expandedRows.movies ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
               </div>
               {expandedRows.movies && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                     {/* Insights Column */}
                     <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-white mb-4">Insights</h4>
                        {favorites.movies.length > 0 ? (
                           <div className="space-y-2">
                              {(() => {
                                 const insights = calculateInsights(
                                    totalMovieStats,
                                    favoriteMovieStats,
                                    'movies'
                                 );
                                 return (
                                    <>
                                       <p className="text-gray-300">
                                          Your favorite movies are{' '}
                                          {insights.isRatingHigher ? 'higher' : 'lower'} rated by an
                                          average of {Math.abs(Number(insights.ratingDifference))}{' '}
                                          points
                                       </p>
                                       <p className="text-gray-300">
                                          Your favorites are{' '}
                                          {insights.isPopularityHigher ? 'more' : 'less'} popular by{' '}
                                          {Math.abs(Number(insights.popularityDifference))} points
                                       </p>
                                    </>
                                 );
                              })()}
                           </div>
                        ) : (
                           <div className="text-center py-4">
                              <p className="text-gray-400 mb-4">
                                 Add movies to your favorites to see insights
                              </p>
                              <Link
                                 to="/dashboard/movies-table"
                                 className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors bg-purple-600 text-white shadow-lg shadow-purple-500/20 hover:bg-purple-700"
                              >
                                 <FaFilm className="text-xl sm:text-2xl text-white" />
                                 <span className="text-base font-medium text-white">
                                    Go to Movies
                                 </span>
                              </Link>
                           </div>
                        )}
                     </div>

                     {/* Data Cards Column */}
                     <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-white mb-4">Statistics</h4>
                        {favorites.movies.length > 0 ? (
                           <MovieDataCard title="Your Favorites" stats={favoriteMovieStats} />
                        ) : (
                           <div className="text-center py-4">
                              <p className="text-gray-400 mb-4">
                                 Add movies to your favorites to see statistics
                              </p>
                              <Link
                                 to="/dashboard/movies-table"
                                 className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors bg-purple-600 text-white shadow-lg shadow-purple-500/20 hover:bg-purple-700"
                              >
                                 <FaFilm className="text-xl sm:text-2xl text-white" />
                                 <span className="text-base font-medium text-white">
                                    Go to Movies
                                 </span>
                              </Link>
                           </div>
                        )}
                     </div>

                     {/* Favorites Table Column */}
                     <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-white mb-4">Favorites</h4>
                        {favorites.movies.length > 0 ? (
                           <div className="overflow-x-auto">
                              <table className="w-full">
                                 <thead>
                                    <tr className="text-left text-gray-400">
                                       <th className="pb-2">Title</th>
                                       <th className="pb-2">Rating</th>
                                       <th className="pb-2">Popularity</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {favorites.movies.map(movie => (
                                       <tr key={movie._id} className="border-t border-gray-600">
                                          <td className="py-2 text-white">{movie.title}</td>
                                          <td className="py-2 text-white">
                                             {movie.rating.toFixed(1)}
                                          </td>
                                          <td className="py-2 text-white">
                                             {movie.popularity.toFixed(1)}
                                          </td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                           </div>
                        ) : (
                           <div className="text-center py-4">
                              <p className="text-gray-400 mb-4">
                                 Add movies to your favorites to see your list
                              </p>
                              <Link
                                 to="/dashboard/movies-table"
                                 className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors bg-purple-600 text-white shadow-lg shadow-purple-500/20 hover:bg-purple-700"
                              >
                                 <FaFilm className="text-xl sm:text-2xl text-white" />
                                 <span className="text-base font-medium text-white">
                                    Go to Movies
                                 </span>
                              </Link>
                           </div>
                        )}
                     </div>
                  </div>
               )}
            </div>

            {/* BOOKS */}
            <div className="bg-gray-800 rounded-lg p-2 sm:p-6 border border-gray-600 ">
               <div className="flex items-center justify-between m-2">
                  <div className="flex items-center gap-3">
                     <FaBook className="text-3xl text-cyan-400" />
                     <h3 className="text-xl font-semibold text-white">Books</h3>
                  </div>
                  <button
                     onClick={() => toggleRow('books')}
                     className="text-gray-400 hover:text-white transition-colors"
                  >
                     {expandedRows.books ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
               </div>
               {expandedRows.books && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                     {/* Insights Column */}
                     <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-white mb-4">Insights</h4>
                        {favorites.books.length > 0 ? (
                           <div className="space-y-2">
                              {(() => {
                                 const insights = calculateInsights(
                                    totalBookStats,
                                    favoriteBookStats,
                                    'books'
                                 );
                                 return (
                                    <p className="text-gray-300">
                                       Your favorite books have{' '}
                                       {insights.isMoreDiverse ? 'more' : 'less'} author diversity
                                       by {Math.abs(Number(insights.authorDiversity))} points
                                    </p>
                                 );
                              })()}
                           </div>
                        ) : (
                           <div className="text-center py-4">
                              <p className="text-gray-400 mb-4">
                                 Add books to your favorites to see insights
                              </p>
                              <Link
                                 to="/dashboard/books-table"
                                 className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors bg-purple-600 text-white shadow-lg shadow-purple-500/20 hover:bg-purple-700"
                              >
                                 <FaBook className="text-xl sm:text-2xl text-white" />
                                 <span className="text-base font-medium text-white">
                                    Go to Books
                                 </span>
                              </Link>
                           </div>
                        )}
                     </div>

                     {/* Data Cards Column */}
                     <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-white mb-4">Statistics</h4>
                        {favorites.books.length > 0 ? (
                           <BooksDataCard title="Your Favorites" stats={favoriteBookStats} />
                        ) : (
                           <div className="text-center py-4">
                              <p className="text-gray-400 mb-4">
                                 Add books to your favorites to see statistics
                              </p>
                              <Link
                                 to="/dashboard/books-table"
                                 className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors bg-purple-600 text-white shadow-lg shadow-purple-500/20 hover:bg-purple-700"
                              >
                                 <FaBook className="text-xl sm:text-2xl text-white" />
                                 <span className="text-base font-medium text-white">
                                    Go to Books
                                 </span>
                              </Link>
                           </div>
                        )}
                     </div>

                     {/* Favorites Table Column */}
                     <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-white mb-4">Favorites</h4>
                        {favorites.books.length > 0 ? (
                           <div className="overflow-x-auto">
                              <table className="w-full">
                                 <thead>
                                    <tr className="text-left text-gray-400">
                                       <th className="pb-2">Title</th>
                                       <th className="pb-2">Authors</th>
                                       <th className="pb-2">Pages</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {favorites.books.map(book => (
                                       <tr key={book._id} className="border-t border-gray-600">
                                          <td className="py-2 text-white">{book.title}</td>
                                          <td className="py-2 text-white">
                                             {book.authors.join(', ')}
                                          </td>
                                          <td className="py-2 text-white">{book.pageCount}</td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                           </div>
                        ) : (
                           <div className="text-center py-4">
                              <p className="text-gray-400 mb-4">
                                 Add books to your favorites to see your list
                              </p>
                              <Link
                                 to="/dashboard/books-table"
                                 className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors bg-purple-600 text-white shadow-lg shadow-purple-500/20 hover:bg-purple-700"
                              >
                                 <FaBook className="text-xl sm:text-2xl text-white" />
                                 <span className="text-base font-medium text-white">
                                    Go to Books
                                 </span>
                              </Link>
                           </div>
                        )}
                     </div>
                  </div>
               )}
            </div>

            {/* MUSIC */}
            <div className="bg-gray-800 rounded-lg p-2 sm:p-6 border border-gray-600 ">
               <div className="flex items-center justify-between m-2">
                  <div className="flex items-center gap-3">
                     <FaMusic className="text-3xl text-cyan-400" />
                     <h3 className="text-xl font-semibold text-white">Music</h3>
                  </div>
                  <button
                     onClick={() => toggleRow('music')}
                     className="text-gray-400 hover:text-white transition-colors"
                  >
                     {expandedRows.music ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
               </div>
               {expandedRows.music && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                     {/* Insights Column */}
                     <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-white mb-4">Insights</h4>
                        {favorites.music.length > 0 ? (
                           <div className="space-y-2">
                              {(() => {
                                 const insights = calculateInsights(
                                    totalMusicStats,
                                    favoriteMusicStats,
                                    'music'
                                 );
                                 return (
                                    <p className="text-gray-300">
                                       Your favorite artists are{' '}
                                       {insights.isMorePopular ? 'more' : 'less'} popular by{' '}
                                       {Math.abs(Number(insights.listenerDifference))}%
                                    </p>
                                 );
                              })()}
                           </div>
                        ) : (
                           <div className="text-center py-4">
                              <p className="text-gray-400 mb-4">
                                 Add music to your favorites to see insights
                              </p>
                              <Link
                                 to="/dashboard/music-table"
                                 className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors bg-purple-600 text-white shadow-lg shadow-purple-500/20 hover:bg-purple-700"
                              >
                                 <FaMusic className="text-xl sm:text-2xl text-white" />
                                 <span className="text-base font-medium text-white">
                                    Go to Music
                                 </span>
                              </Link>
                           </div>
                        )}
                     </div>

                     {/* Data Cards Column */}
                     <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-white mb-4">Statistics</h4>
                        {favorites.music.length > 0 ? (
                           <MusicDataCard title="Your Favorites" stats={favoriteMusicStats} />
                        ) : (
                           <div className="text-center py-4">
                              <p className="text-gray-400 mb-4">
                                 Add music to your favorites to see statistics
                              </p>
                              <Link
                                 to="/dashboard/music-table"
                                 className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors bg-purple-600 text-white shadow-lg shadow-purple-500/20 hover:bg-purple-700"
                              >
                                 <FaMusic className="text-xl sm:text-2xl text-white" />
                                 <span className="text-base font-medium text-white">
                                    Go to Music
                                 </span>
                              </Link>
                           </div>
                        )}
                     </div>

                     {/* Favorites Table Column */}
                     <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-white mb-4">Favorites</h4>
                        {favorites.music.length > 0 ? (
                           <div className="overflow-x-auto">
                              <table className="w-full">
                                 <thead>
                                    <tr className="text-left text-gray-400">
                                       <th className="pb-2">Artist</th>
                                       <th className="pb-2">Listeners</th>
                                       <th className="pb-2">Tracks</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {favorites.music.map(artist => (
                                       <tr key={artist._id} className="border-t border-gray-600">
                                          <td className="py-2 text-white">{artist.name}</td>
                                          <td className="py-2 text-white">
                                             {artist.listeners >= 1000000
                                                ? `${(artist.listeners / 1000000).toFixed(1)}M`
                                                : artist.listeners >= 1000
                                                ? `${(artist.listeners / 1000).toFixed(1)}K`
                                                : artist.listeners}
                                          </td>
                                          <td className="py-2 text-white">-</td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                           </div>
                        ) : (
                           <div className="text-center py-4">
                              <p className="text-gray-400 mb-4">
                                 Add music to your favorites to see your list
                              </p>
                              <Link
                                 to="/dashboard/music-table"
                                 className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors bg-purple-600 text-white shadow-lg shadow-purple-500/20 hover:bg-purple-700"
                              >
                                 <FaMusic className="text-xl sm:text-2xl text-white" />
                                 <span className="text-base font-medium text-white">
                                    Go to Music
                                 </span>
                              </Link>
                           </div>
                        )}
                     </div>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

export default MyMedia;
