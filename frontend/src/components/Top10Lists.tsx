interface Movie {
   title: string;
   year: number;
   rating?: number;
   runtime?: number;
   tomatoes?: { viewer?: { meter?: number } };
}

interface Genre {
   _id: string;
   count: number;
}

interface Top10ListsProps {
   topRatedMovies: Movie[];
   topGenres: Genre[];
   longestMovies: Movie[];
}

const Top10Lists: React.FC<Top10ListsProps> = ({ topRatedMovies, topGenres, longestMovies }) => {
   return (
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
         <div className='bg-gray-800 p-6 rounded-lg shadow-md max-h-[55%] overflow-y-auto scrollbar-hide'>
            <h3 className='text-xl font-bold mb-4 text-purple-400'>🏆 Highest Rated Movies</h3>
            <ul className='space-y-2'>
               {topRatedMovies.map((movie, index) => (
                  <li
                     key={index}
                     className='flex items-center bg-gray-700 p-3 rounded-lg hover:bg-purple-600 transition'
                  >
                     <span className='bg-purple-500 text-white font-bold w-8 h-8 flex items-center justify-center rounded-full mr-3'>
                        {index + 1}
                     </span>
                     <div>
                        <p className='text-white font-semibold'>
                           {movie.title} ({movie.year})
                        </p>
                        <p className='text-gray-400 text-sm'>
                           ⭐{' '}
                           {movie.tomatoes?.viewer?.meter
                              ? `${movie.tomatoes.viewer.meter}%`
                              : 'N/A'}
                        </p>
                     </div>
                  </li>
               ))}
            </ul>
         </div>

         <div className='bg-gray-800 p-6 rounded-lg shadow-md max-h-[55%] overflow-y-auto scrollbar-hide'>
            <h3 className='text-xl font-bold mb-4 text-blue-400'>🎭 Most Popular Genres</h3>
            <ul className='space-y-2'>
               {topGenres.map((genre, index) => (
                  <li
                     key={index}
                     className='flex items-center bg-gray-700 p-3 rounded-lg hover:bg-blue-600 transition'
                  >
                     <span className='bg-blue-500 text-white font-bold w-8 h-8 flex items-center justify-center rounded-full mr-3'>
                        {index + 1}
                     </span>
                     <div>
                        <p className='text-white font-semibold'>{genre._id}</p>
                        <p className='text-gray-400 text-sm'>{genre.count} movies</p>
                     </div>
                  </li>
               ))}
            </ul>
         </div>

         <div className='bg-gray-800 p-6 rounded-lg shadow-md max-h-[55%] overflow-y-auto scrollbar-hide'>
            <h3 className='text-xl font-bold mb-4 text-green-400'>⏳ Longest Movies</h3>
            <ul className='space-y-2'>
               {longestMovies.map((movie, index) => (
                  <li
                     key={index}
                     className='flex items-center bg-gray-700 p-3 rounded-lg hover:bg-green-600 transition'
                  >
                     <span className='bg-green-500 text-white font-bold w-8 h-8 flex items-center justify-center rounded-full mr-3'>
                        {index + 1}
                     </span>
                     <div>
                        <p className='text-white font-semibold'>
                           {movie.title} ({movie.year})
                        </p>
                        <p className='text-gray-400 text-sm'>⏳ {movie.runtime} min</p>
                     </div>
                  </li>
               ))}
            </ul>
         </div>
      </div>
   );
};

export default Top10Lists;
