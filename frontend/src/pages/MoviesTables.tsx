import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

interface Movie {
   _id: string;
   title: string;
   year: number;
   runtime: number;
   genres: string[];
   directors: string[];
   rated: string;
   viewerTomatoesRating: string;
   plot: string;
   cast: string[];
   languages: string[];
   countries: string[];
}

export default function MoviesTable() {
   const [movies, setMovies] = useState<Movie[]>([]);

   const fetchMovies = async () => {
      try {
         const token = localStorage.getItem('token');
         const { data } = await axios.get(
            // `http://localhost:5001/api/movies?genre=${genre}&rating=${rating}&year=${year}`,
            `http://localhost:5001/api/movies`,
            { headers: { Authorization: `Bearer ${token}` } }
         );
         setMovies(data.movies);
      } catch (error) {
         console.error('Error fetching movies:', error);
      }
   };

   useEffect(() => {
      fetchMovies();
   }, []);

   return (
      <div className='flex max-h-screen overflow-auto w-screen bg-gray-900 text-white'>
         <Sidebar />

         <div className='flex flex-col flex-1 p-6'>
            <h2 className='text-2xl font-bold mb-4'>Movie List</h2>

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
                     <th className='py-2 px-4'>Tomato Meter</th>
                     <th className='py-2 px-4'>Plot</th>
                     <th className='py-2 px-4'>Cast</th>
                     <th className='py-2 px-4'>Languages</th>
                     <th className='py-2 px-4'>Countries</th>
                  </tr>
               </thead>
               <tbody>
                  {movies.map((movie) => (
                     <tr
                        key={movie._id}
                        className='border-b border-gray-700 hover:bg-gray-700 transition'
                     >
                        <td className='py-2 px-4'>{movie.title}</td>
                        <td className='py-2 px-4'>{movie.year}</td>
                        <td className='py-2 px-4'>{movie.runtime} mins</td>
                        <td className='py-2 px-4'>{movie.genres?.join(', ') || 'N/A'}</td>
                        <td className='py-2 px-4'>{movie.directors?.join(', ') || 'N/A'}</td>
                        <td className='py-2 px-4'>{movie.rated || 'Unrated'}</td>
                        <td className='py-2 px-4'>{movie.viewerTomatoesRating || 'N/A'}</td>
                        <td className='py-2 px-4 truncate max-w-xs'>{movie.plot || 'N/A'}</td>
                        <td className='py-2 px-4'>{movie.cast?.join(', ') || 'N/A'}</td>
                        <td className='py-2 px-4'>{movie.languages?.join(', ') || 'N/A'}</td>
                        <td className='py-2 px-4'>{movie.countries?.join(', ') || 'N/A'}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
}
