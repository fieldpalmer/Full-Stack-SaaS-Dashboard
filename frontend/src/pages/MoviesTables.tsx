import { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { FaSpinner } from 'react-icons/fa';
import { StatsWidget } from '../components/Charts';

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

type SortDirection = 'asc' | 'desc' | 'default';

export default function MoviesTable() {
   const [movies, setMovies] = useState<Movie[]>([]);
   const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
   const [loading, setLoading] = useState(true);
   // sorting stuff
   const [sortField, setSortField] = useState<string | null>(null);
   const [sortDirection, setSortDirection] = useState<SortDirection>('default');
   // filtering stuff
   const [selectedGenre, setSelectedGenre] = useState('');
   const [selectedDirector, setSelectedDirector] = useState('');
   const [selectedCast, setSelectedCast] = useState('');
   const [selectedLanguage, setSelectedLanguage] = useState('');
   const [selectedCountry, setSelectedCountry] = useState('');
   const [selectedRating, setSelectedRating] = useState('');
   // Year range state
   const [yearRange, setYearRange] = useState<[number, number]>([1900, new Date().getFullYear()]);
   const [minYear, setMinYear] = useState(1900);
   const [maxYear, setMaxYear] = useState(new Date().getFullYear());
   // TomatoesMeter range state
   const [meterRange, setMeterRange] = useState<[number, number]>([0, 100]);
   const [minMeter, setMinMeter] = useState(0);
   const [maxMeter, setMaxMeter] = useState(100);

   const fetchMovies = useCallback(async () => {
      setLoading(true);

      try {
         const token = localStorage.getItem('token');
         const { data } = await axios.get(`http://localhost:5001/api/movies/`, {
            headers: { Authorization: `Bearer ${token}` }
         });

         setMovies(data.movies);
         setFilteredMovies(data.movies);

         const years = data.movies.map((m: Movie) => m.year).filter(Boolean);
         if (years.length) {
            setMinYear(Math.min(...years));
            setMaxYear(Math.max(...years));
            setYearRange([Math.min(...years), Math.max(...years)]);
         }

         const tomatoMeters = data.movies
            .map((m: Movie) => Number(m.viewerTomatoesRating))
            .filter((num: number) => !isNaN(num) && num > 0);
         if (tomatoMeters.length > 0) {
            setMinMeter(Math.min(...tomatoMeters));
            setMaxMeter(Math.max(...tomatoMeters));
            setMeterRange([Math.min(...tomatoMeters), Math.max(...tomatoMeters)]);
         }
      } catch (error) {
         console.error('Error fetching movies:', error);
      }
      setLoading(false);
   }, []);

   const stats = useMemo(() => {
      if (!filteredMovies.length) {
         return {
            totalMovies: 0,
            avgRuntime: 0,
            avgRating: 0
         };
      }

      const totalMovies = filteredMovies.length;

      const avgRuntime = filteredMovies.reduce((sum, movie) => sum + (movie.runtime || 0), 0) / totalMovies;

      const avgRating = filteredMovies.reduce((sum, movie) => sum + Number(movie.viewerTomatoesRating || 0), 0) / totalMovies;

      return {
         totalMovies,
         avgRuntime: avgRuntime.toFixed(2),
         avgRating: avgRating.toFixed(2)
      };
   }, [filteredMovies]);

   useEffect(() => {
      let filtered = movies;
      if (meterRange) {
         filtered = filtered.filter(
            (movie) => Number(movie.viewerTomatoesRating) >= meterRange[0] && Number(movie.viewerTomatoesRating) <= meterRange[1]
         );
      }
      if (yearRange) {
         filtered = filtered.filter((movie) => movie.year >= yearRange[0] && movie.year <= yearRange[1]);
      }
      if (selectedGenre) filtered = filtered.filter((m) => m.genres.includes(selectedGenre));
      if (selectedDirector) filtered = filtered.filter((m) => m.directors.includes(selectedDirector));
      if (selectedCast) filtered = filtered.filter((m) => m.cast.includes(selectedCast));
      if (selectedLanguage) filtered = filtered.filter((m) => m.languages.includes(selectedLanguage));
      if (selectedCountry) filtered = filtered.filter((m) => m.countries.includes(selectedCountry));
      if (selectedRating) filtered = filtered.filter((m) => m.rated === selectedRating);

      setFilteredMovies(filtered);
   }, [
      selectedGenre,
      selectedDirector,
      selectedCast,
      selectedLanguage,
      selectedCountry,
      selectedRating,
      sortField,
      sortDirection,
      yearRange,
      meterRange,
      minMeter,
      maxMeter,
      movies
   ]);

   const availableGenres = [...new Set(filteredMovies.flatMap((m) => m.genres))].sort();
   const availableDirectors = [...new Set(filteredMovies.flatMap((m) => m.directors))].sort();
   const availableCasts = [...new Set(filteredMovies.flatMap((m) => m.cast))].sort();
   const availableLanguages = [...new Set(filteredMovies.flatMap((m) => m.languages))].sort();
   const availableCountries = [...new Set(filteredMovies.flatMap((m) => m.countries))].sort();
   const availableRatings = [...new Set(filteredMovies.flatMap((m) => m.rated))].sort();

   const handleSort = (field: keyof Movie) => {
      let newSortDirection: SortDirection;

      if (sortField === field) {
         newSortDirection = sortDirection === 'asc' ? 'desc' : sortDirection === 'desc' ? 'default' : 'asc';
      } else {
         newSortDirection = 'asc';
      }

      setSortField(field);
      setSortDirection(newSortDirection);

      if (newSortDirection === 'default') {
         setFilteredMovies([...movies]);
         return;
      }

      const sortedMovies = [...filteredMovies].sort((a, b) => {
         if (a[field] < b[field]) return newSortDirection === 'asc' ? -1 : 1;
         if (a[field] > b[field]) return newSortDirection === 'asc' ? 1 : -1;
         return 0;
      });

      setFilteredMovies(sortedMovies);
   };

   const getSortIndicator = (field: keyof Movie) => {
      if (sortField !== field) return '';
      return sortDirection === 'asc' ? '↑' : sortDirection === 'desc' ? '↓' : '';
   };

   useEffect(() => {
      fetchMovies();
   }, [fetchMovies]);

   return (
      <div className='flex max-h-screen overflow-auto w-screen bg-gray-900 text-white'>
         <Sidebar />

         <div className='flex flex-col p-6'>
            {/* Stats & Slider 1 */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 m-6 rounded-lg'>
               {/* Stats Widgets */}
               <div className='flex gap-6 col-span-1'>
                  <StatsWidget title='Movies' value={stats.totalMovies.toString()} />
                  <StatsWidget title='Avg Runtime (mins)' value={String(stats.avgRuntime)} />
                  <StatsWidget title='Avg Rating' value={String(stats.avgRating)} />
               </div>

               {/* Year Range Slider */}
               <div className='col-span-2'>
                  <div className='flex justify-between text-gray-400 mb-2'>
                     <span>{yearRange[0]}</span>
                     <span className='text-center flex-1'>Release Date</span>
                     <span>{yearRange[1]}</span>
                  </div>
                  <Slider
                     range
                     min={minYear}
                     max={maxYear}
                     value={yearRange}
                     onChange={(value) => setYearRange(value as [number, number])}
                     trackStyle={[{ backgroundColor: '#4f46e5', height: 13 }]}
                     railStyle={{ height: 13 }}
                     handleStyle={[
                        {
                           borderColor: '#4f46e5',
                           backgroundColor: '#4f46e5',
                           height: 24,
                           width: 24,
                           opacity: 100
                        },
                        {
                           borderColor: '#4f46e5',
                           backgroundColor: '#4f46e5',
                           height: 24,
                           width: 24,
                           opacity: 100
                        }
                     ]}
                  />
               </div>
            </div>

            {/* Filters & Slider 2 */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 m-6 rounded-lg'>
               {/* Tomatoes Rating Slider */}
               <div className='px-6 col-span-1'>
                  <div className='flex justify-between text-gray-400 mb-2'>
                     <span>{meterRange[0]}</span>
                     <span className='text-center flex-1'>Tomatoes Rating (Viewer)</span>
                     <span>{meterRange[1]}</span>
                  </div>
                  <Slider
                     range
                     min={minMeter}
                     max={maxMeter}
                     value={meterRange}
                     onChange={(value) => setMeterRange(value as [number, number])}
                     trackStyle={[{ backgroundColor: '#4f46e5', height: 13 }]}
                     railStyle={{ height: 13 }}
                     handleStyle={[
                        {
                           borderColor: '#4f46e5',
                           backgroundColor: '#4f46e5',
                           height: 24,
                           width: 24,
                           opacity: 100
                        },
                        {
                           borderColor: '#4f46e5',
                           backgroundColor: '#4f46e5',
                           height: 24,
                           width: 24,
                           opacity: 100
                        }
                     ]}
                  />
               </div>

               {/* Filters */}
               <div className='col-span-2'>
                  {[
                     { value: selectedGenre, onChange: setSelectedGenre, options: availableGenres, label: 'Genres' },
                     { value: selectedDirector, onChange: setSelectedDirector, options: availableDirectors, label: 'Directors' },
                     { value: selectedRating, onChange: setSelectedRating, options: availableRatings, label: 'Ratings' },
                     { value: selectedCast, onChange: setSelectedCast, options: availableCasts, label: 'Actors' },
                     { value: selectedLanguage, onChange: setSelectedLanguage, options: availableLanguages, label: 'Languages' },
                     { value: selectedCountry, onChange: setSelectedCountry, options: availableCountries, label: 'Countries' }
                  ].map(({ value, onChange, options, label }, index) => (
                     <select
                        key={index}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className='bg-gray-700  m-1 p-3 rounded'
                     >
                        <option value=''>{`All ${label}`}</option>
                        {options.map((option, idx) => (
                           <option key={idx} value={option}>
                              {option}
                           </option>
                        ))}
                     </select>
                  ))}
               </div>
            </div>

            <hr className='my-10' />

            {loading ? (
               <div className='flex justify-center items-center h-40'>
                  <FaSpinner className='text-purple-500 text-4xl animate-spin' />
               </div>
            ) : (
               <table className='w-full text-left border-collapse'>
                  <thead>
                     <tr className='border-b border-gray-700'>
                        <th className='py-2 px-4' onClick={() => handleSort('title')}>
                           Title{getSortIndicator('title')}
                        </th>
                        <th className='py-2 px-4' onClick={() => handleSort('year')}>
                           Year{getSortIndicator('year')}
                        </th>
                        <th className='py-2 px-4' onClick={() => handleSort('runtime')}>
                           Runtime{getSortIndicator('runtime')}
                        </th>
                        <th className='py-2 px-4' onClick={() => handleSort('genres')}>
                           Genres{getSortIndicator('genres')}
                        </th>
                        <th className='py-2 px-4' onClick={() => handleSort('directors')}>
                           Director{getSortIndicator('directors')}
                        </th>
                        <th className='py-2 px-4' onClick={() => handleSort('rated')}>
                           Rating{getSortIndicator('rated')}
                        </th>
                        <th className='py-2 px-4' onClick={() => handleSort('viewerTomatoesRating')}>
                           Tomato Meter{getSortIndicator('viewerTomatoesRating')}
                        </th>
                        <th className='py-2 px-4' onClick={() => handleSort('plot')}>
                           Plot{getSortIndicator('plot')}
                        </th>
                        <th className='py-2 px-4' onClick={() => handleSort('cast')}>
                           Cast{getSortIndicator('cast')}
                        </th>
                        <th className='py-2 px-4' onClick={() => handleSort('languages')}>
                           Languages{getSortIndicator('languages')}
                        </th>
                        <th className='py-2 px-4' onClick={() => handleSort('countries')}>
                           Countries{getSortIndicator('countries')}
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {filteredMovies.map((movie) => (
                        <tr key={movie._id} className='border-b border-gray-700 hover:bg-gray-700 transition'>
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
            )}
         </div>
      </div>
   );
}
