import { useEffect, useState } from 'react';
import axios from 'axios';

interface Movie {
   title: string;
   year: number;
   runtime: number;
   genres: string[];
   directors: string[];
   rated: string;
}

export default function PaginatedMovies() {
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

   return (
      <div className='bg-gray-800 p-6 rounded-lg shadow-md mt-6'>
         <h3 className='text-lg text-gray-400 mb-4'>Movie Details</h3>

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
                  <th className='py-2 px-4'>Rated</th>
               </tr>
            </thead>
            <tbody>
               {movies.map((movie, index) => (
                  <tr key={index} className='border-b border-gray-700 hover:bg-gray-700 transition'>
                     <td className='py-2 px-4'>{movie.title}</td>
                     <td className='py-2 px-4'>{String(movie.year).replace(/[^\d]/g, '')}</td>
                     <td className='py-2 px-4'>
                        {movie.runtime ? `${movie.runtime} mins` : 'N/A'}
                     </td>
                     <td className='py-2 px-4'>{movie.genres?.join(', ') || 'N/A'}</td>
                     <td className='py-2 px-4'>{movie.directors?.join(', ') || 'N/A'}</td>
                     <td className='py-2 px-4'>{movie.rated || 'Unrated'}</td>
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
   );
}
