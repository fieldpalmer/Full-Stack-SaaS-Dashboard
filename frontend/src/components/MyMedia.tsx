import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSpinner, FaHeart, FaFilm, FaBook, FaMusic } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface Movie {
     _id: string;
     title: string;
     release_date: string;
     rating: number;
     popularity: number;
     poster_url: string;
     tmdb_id: number;
}

interface Book {
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

interface Music {
     _id: string;
     name: string;
     listeners: number;
     image: string;
     url: string;
}

interface UserFavorites {
     movies: Movie[];
     books: Book[];
     music: Music[];
}

const MyMedia = () => {
     const [loading, setLoading] = useState(true);
     const [favorites, setFavorites] = useState<UserFavorites>({
          movies: [],
          books: [],
          music: []
     });

     useEffect(() => {
          const fetchFavorites = async () => {
               try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get('https://full-stack-saas-dashboard.onrender.com/api/favorites', {
                         headers: { Authorization: `Bearer ${token}` }
                    });
                    setFavorites(response.data);
               } catch (error) {
                    console.error('Error fetching favorites:', error);
               } finally {
                    setLoading(false);
               }
          };

          fetchFavorites();
     }, []);

     if (loading) {
          return (
               <div className='flex justify-center items-center h-[1080px]'>
                    <FaSpinner className='text-purple-500 text-4xl animate-spin' />
               </div>
          );
     }

     const hasAnyFavorites = favorites.movies.length > 0 || favorites.books.length > 0 || favorites.music.length > 0;

     if (!hasAnyFavorites) {
          return (
               <div className='p-6 text-center h-screen'>
                    <div className='bg-gray-800 rounded-lg p-8 max-w-2xl mx-auto'>
                         <FaHeart className='text-6xl text-purple-500 mx-auto mb-4' />
                         <h2 className='text-2xl font-bold mb-4 text-white'>No Favorites Yet</h2>
                         <p className='text-gray-400 mb-6'>
                              Start building your collection by adding your favorite movies, books, and artists!
                         </p>
                         <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                              <Link
                                   to='/dashboard/movies-table'
                                   className='flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors'
                              >
                                   <FaFilm />
                                   Browse Movies
                              </Link>
                              <Link
                                   to='/dashboard/books-table'
                                   className='flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors'
                              >
                                   <FaBook />
                                   Browse Books
                              </Link>
                              <Link
                                   to='/dashboard/music-table'
                                   className='flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors'
                              >
                                   <FaMusic />
                                   Browse Music
                              </Link>
                         </div>
                    </div>
               </div>
          );
     }

     return (
          <div className='p-6 h-screen'>
               <h2 className='text-2xl font-bold mb-6 text-white'>My Favorites</h2>

               {/* Movies Section */}
               <div className='mb-8'>
                    <h3 className='text-xl font-semibold mb-4 text-white'>Favorite Movies</h3>
                    {favorites.movies.length === 0 ? (
                         <div className='bg-gray-800 rounded-lg p-6 text-center'>
                              <FaFilm className='text-4xl text-purple-500 mx-auto mb-2' />
                              <p className='text-gray-400 mb-4'>No favorite movies yet</p>
                              <Link
                                   to='/dashboard/movies-table'
                                   className='inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors'
                              >
                                   Browse Movies
                              </Link>
                         </div>
                    ) : (
                         <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                              {favorites.movies.map((movie) => (
                                   <div key={movie._id} className='bg-gray-800 rounded-lg p-4 flex items-start gap-4'>
                                        <img
                                             src={movie.poster_url}
                                             alt={movie.title}
                                             className='w-24 h-36 object-cover rounded'
                                             onError={(e) => {
                                                  const img = e.target as HTMLImageElement;
                                                  img.src = 'https://dummyimage.com/100x150/cccccc/ffffff.png&text=No+Poster';
                                             }}
                                        />
                                        <div className='flex-1'>
                                             <h4 className='text-lg font-semibold text-white'>{movie.title}</h4>
                                             <p className='text-gray-400'>Rating: {movie.rating.toFixed(1)}</p>
                                             <p className='text-gray-400'>
                                                  Released: {new Date(movie.release_date).toLocaleDateString()}
                                             </p>
                                        </div>
                                   </div>
                              ))}
                         </div>
                    )}
               </div>

               {/* Books Section */}
               <div className='mb-8'>
                    <h3 className='text-xl font-semibold mb-4 text-white'>Favorite Books</h3>
                    {favorites.books.length === 0 ? (
                         <div className='bg-gray-800 rounded-lg p-6 text-center'>
                              <FaBook className='text-4xl text-purple-500 mx-auto mb-2' />
                              <p className='text-gray-400 mb-4'>No favorite books yet</p>
                              <Link
                                   to='/dashboard/books-table'
                                   className='inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors'
                              >
                                   Browse Books
                              </Link>
                         </div>
                    ) : (
                         <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                              {favorites.books.map((book) => (
                                   <div key={book._id} className='bg-gray-800 rounded-lg p-4 flex items-start gap-4'>
                                        <img
                                             src={book.thumbnail}
                                             alt={book.title}
                                             className='w-24 h-36 object-cover rounded'
                                             onError={(e) => {
                                                  const img = e.target as HTMLImageElement;
                                                  img.src = 'https://dummyimage.com/100x150/cccccc/ffffff.png&text=No+Cover';
                                             }}
                                        />
                                        <div className='flex-1'>
                                             <h4 className='text-lg font-semibold text-white'>{book.title}</h4>
                                             <p className='text-gray-400'>By {book.authors.join(', ')}</p>
                                             <p className='text-gray-400'>Published: {book.publishedDate}</p>
                                        </div>
                                   </div>
                              ))}
                         </div>
                    )}
               </div>

               {/* Music Section */}
               <div className='mb-8'>
                    <h3 className='text-xl font-semibold mb-4 text-white'>Favorite Artists</h3>
                    {favorites.music.length === 0 ? (
                         <div className='bg-gray-800 rounded-lg p-6 text-center'>
                              <FaMusic className='text-4xl text-purple-500 mx-auto mb-2' />
                              <p className='text-gray-400 mb-4'>No favorite artists yet</p>
                              <Link
                                   to='/dashboard/music-table'
                                   className='inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors'
                              >
                                   Browse Music
                              </Link>
                         </div>
                    ) : (
                         <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                              {favorites.music.map((artist) => (
                                   <div key={artist._id} className='bg-gray-800 rounded-lg p-4 flex items-start gap-4'>
                                        <img
                                             src={artist.image}
                                             alt={artist.name}
                                             className='w-24 h-24 object-cover rounded-full'
                                             onError={(e) => {
                                                  const img = e.target as HTMLImageElement;
                                                  img.src = 'https://dummyimage.com/100x100/cccccc/ffffff.png&text=No+Image';
                                             }}
                                        />
                                        <div className='flex-1'>
                                             <h4 className='text-lg font-semibold text-white'>{artist.name}</h4>
                                             <p className='text-gray-400'>
                                                  {new Intl.NumberFormat().format(artist.listeners)} listeners
                                             </p>
                                        </div>
                                   </div>
                              ))}
                         </div>
                    )}
               </div>
          </div>
     );
};

export default MyMedia;
