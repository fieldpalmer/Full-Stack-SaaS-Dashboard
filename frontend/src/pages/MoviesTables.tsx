import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

interface Movie {
   title: string;
   year: number;
   runtime: number;
   genres: string[];
   directors: string[];
   rated: string;
   viewerTomatoesRating: string;
}

export default function MoviesTable() {
   const [movies, setMovies] = useState<Movie[]>([]);
   const [page, setPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const [sortField, setSortField] = useState('year');
   const [sortOrder, setSortOrder] = useState('asc');
   const [genre, setGenre] = useState('');
   const [rating, setRating] = useState('');
   const [year, setYear] = useState('');

   const fetchMovies = async () => {
      try {
         const token = localStorage.getItem('token');
         const { data } = await axios.get(
            `http://localhost:5001/api/movies?page=${page}&limit=10&sortField=${sortField}&sortOrder=${sortOrder}&genre=${genre}&rating=${rating}&year=${year}`,
            { headers: { Authorization: `Bearer ${token}` } }
         );
         setMovies(data.movies);
         setTotalPages(data.totalPages);
      } catch (error) {
         console.error('Error fetching paginated movies:', error);
      }
   };

   useEffect(() => {
      fetchMovies();
   }, [page, sortField, sortOrder, genre, rating, year]);

   // Compute summary stats
   const stats = useMemo(() => {
      if (movies.length === 0) return null;

      return {
         highestRated: movies.reduce((a, b) => (a.rated > b.rated ? a : b)),
         shortest: movies.reduce((a, b) => (a.runtime < b.runtime ? a : b)),
         longest: movies.reduce((a, b) => (a.runtime > b.runtime ? a : b)),
         oldest: movies.reduce((a, b) => (a.year < b.year ? a : b)),
         newest: movies.reduce((a, b) => (a.year > b.year ? a : b))
      };
   }, [movies]);

   return (
      <div className='flex h-screen bg-gray-900 text-white'>
         <Sidebar />

         <div className='flex flex-col flex-1 p-6'>
            <h2 className='text-2xl font-bold mb-4'>Movie List</h2>

            {/* Summary Stats Boxes */}
            {stats && (
               <div className='grid grid-cols-5 gap-4 mb-4'>
                  <div className='bg-gray-800 p-4 rounded-lg text-center'>
                     <h4 className='font-bold text-lg'>Highest Rated</h4>
                     <p>{stats.highestRated.title}</p>
                  </div>
                  <div className='bg-gray-800 p-4 rounded-lg text-center'>
                     <h4 className='font-bold text-lg'>Shortest</h4>
                     <p>
                        {stats.shortest.title} ({stats.shortest.runtime} min)
                     </p>
                  </div>
                  <div className='bg-gray-800 p-4 rounded-lg text-center'>
                     <h4 className='font-bold text-lg'>Longest</h4>
                     <p>
                        {stats.longest.title} ({stats.longest.runtime} min)
                     </p>
                  </div>
                  <div className='bg-gray-800 p-4 rounded-lg text-center'>
                     <h4 className='font-bold text-lg'>Oldest</h4>
                     <p>
                        {stats.oldest.title} ({stats.oldest.year})
                     </p>
                  </div>
                  <div className='bg-gray-800 p-4 rounded-lg text-center'>
                     <h4 className='font-bold text-lg'>Newest</h4>
                     <p>
                        {stats.newest.title} ({stats.newest.year})
                     </p>
                  </div>
               </div>
            )}

            {/* Filter & Sort Controls */}
            <div className='flex flex-wrap gap-4 mb-4'>
               <select
                  onChange={(e) => setSortField(e.target.value)}
                  className='bg-gray-700 p-2 rounded'
               >
                  <option value='year'>Sort by Year</option>
                  <option value='title'>Sort by Title</option>
                  <option value='runtime'>Sort by Runtime</option>
               </select>
               <select
                  onChange={(e) => setSortOrder(e.target.value)}
                  className='bg-gray-700 p-2 rounded'
               >
                  <option value='asc'>Ascending</option>
                  <option value='desc'>Descending</option>
               </select>
               <input
                  type='text'
                  placeholder='Genre'
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className='bg-gray-700 p-2 rounded'
               />
               <input
                  type='text'
                  placeholder='Rating'
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className='bg-gray-700 p-2 rounded'
               />
               <input
                  type='number'
                  placeholder='Year'
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className='bg-gray-700 p-2 rounded'
               />
               <button
                  onClick={() => {
                     setPage(1);
                     fetchMovies();
                  }}
                  className='bg-blue-500 p-2 rounded'
               >
                  Apply Filters
               </button>
            </div>

            {/* Movies Table */}
            <table className='w-full text-left border-collapse'>
               <thead>
                  <tr className='border-b border-gray-700'>
                     <th className='py-2 px-4'>Title</th>
                     <th className='py-2 px-4'>Year</th>
                     <th className='py-2 px-4'>Runtime</th>
                     <th className='py-2 px-4'>Genres</th>
                     <th className='py-2 px-4'>Director</th>
                     <th className='py-2 px-4'>Rating</th>
                     <th className='py-2 px-4'>TomatoMeter</th>
                  </tr>
               </thead>
               <tbody>
                  {movies.map((movie, index) => (
                     <tr
                        key={index}
                        className='border-b border-gray-700 hover:bg-gray-700 transition'
                     >
                        <td className='py-2 px-4'>{movie.title}</td>
                        <td className='py-2 px-4'>{String(movie.year).replace(/[^\d]/g, '')}</td>
                        <td className='py-2 px-4'>
                           {movie.runtime ? `${movie.runtime} mins` : 'N/A'}
                        </td>
                        <td className='py-2 px-4'>{movie.genres?.join(', ') || 'N/A'}</td>
                        <td className='py-2 px-4'>{movie.directors?.join(', ') || 'N/A'}</td>
                        <td className='py-2 px-4'>{movie.rated || 'Unrated'}</td>
                        <td className='py-2 px-4'>{movie.viewerTomatoesRating || 'N/A'}</td>
                     </tr>
                  ))}
               </tbody>
            </table>

            {/* Pagination Controls */}
            <div className='flex justify-between mt-4'>
               <button
                  className={`px-4 py-2 rounded bg-gray-700 ${
                     page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'
                  }`}
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
               >
                  Prev
               </button>
               <span className='text-gray-300'>
                  Page {page} of {totalPages}
               </span>
               <button
                  className={`px-4 py-2 rounded bg-gray-700 ${
                     page === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'
                  }`}
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
               >
                  Next
               </button>
            </div>
         </div>
      </div>
   );
}
