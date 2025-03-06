import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

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

   const fetchMovies = async () => {
      try {
         const token = localStorage.getItem('token');
         const { data } = await axios.get(`http://localhost:5001/api/movies`, {
            headers: { Authorization: `Bearer ${token}` }
         });

         setMovies(data.movies);
         setFilteredMovies(data.movies);

         // Set year range dynamically
         const years = data.movies.map((m: Movie) => m.year).filter(Boolean);
         if (years.length) {
            setMinYear(Math.min(...years));
            setMaxYear(Math.max(...years));
            setYearRange([Math.min(...years), Math.max(...years)]);
         }
      } catch (error) {
         console.error('Error fetching movies:', error);
      }
   };

   // 🎯 Filtering Logic
   useEffect(() => {
      let filtered = movies;
      filtered = filtered.filter((m) => m.year >= yearRange[0] && m.year <= yearRange[1]);

      if (selectedGenre) filtered = filtered.filter((m) => m.genres.includes(selectedGenre));
      if (selectedDirector)
         filtered = filtered.filter((m) => m.directors.includes(selectedDirector));
      if (selectedCast) filtered = filtered.filter((m) => m.cast.includes(selectedCast));
      if (selectedLanguage)
         filtered = filtered.filter((m) => m.languages.includes(selectedLanguage));
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
      yearRange,
      movies
   ]);

   // Dynamically Update Filter Options Based on Current Filtered Movies
   const availableGenres = [...new Set(filteredMovies.flatMap((m) => m.genres))].sort();
   const availableDirectors = [...new Set(filteredMovies.flatMap((m) => m.directors))].sort();
   const availableCasts = [...new Set(filteredMovies.flatMap((m) => m.cast))].sort();
   const availableLanguages = [...new Set(filteredMovies.flatMap((m) => m.languages))].sort();
   const availableCountries = [...new Set(filteredMovies.flatMap((m) => m.countries))].sort();
   const availableRatings = [...new Set(filteredMovies.flatMap((m) => m.rated))].sort();

   const handleSort = (field: keyof Movie) => {
      let newSortDirection: SortDirection;

      if (sortField === field) {
         newSortDirection =
            sortDirection === 'asc' ? 'desc' : sortDirection === 'desc' ? 'default' : 'asc';
      } else {
         newSortDirection = 'asc';
      }

      setSortField(field);
      setSortDirection(newSortDirection);

      if (newSortDirection === 'default') {
         setMovies(movies);
         return;
      }

      const sortedMovies = [...filteredMovies].sort((a, b) => {
         if (a[field] < b[field]) return newSortDirection === 'asc' ? -1 : 1;
         if (a[field] > b[field]) return newSortDirection === 'asc' ? 1 : -1;
         return 0;
      });

      setMovies(sortedMovies);
   };

   const getSortIndicator = (field: keyof Movie) => {
      if (sortField !== field) return '';
      return sortDirection === 'asc' ? '↑' : sortDirection === 'desc' ? '↓' : '';
   };

   useEffect(() => {
      fetchMovies();
   }, []);

   // Filtering Logic
   useEffect(() => {
      let filtered = movies;

      if (selectedGenre) {
         filtered = filtered.filter((movie) => movie.genres.includes(selectedGenre));
      }
      if (selectedDirector) {
         filtered = filtered.filter((movie) => movie.directors.includes(selectedDirector));
      }
      if (selectedCast) {
         filtered = filtered.filter((movie) => movie.cast.includes(selectedCast));
      }
      if (selectedLanguage) {
         filtered = filtered.filter((movie) => movie.languages.includes(selectedLanguage));
      }
      if (selectedCountry) {
         filtered = filtered.filter((movie) => movie.countries.includes(selectedCountry));
      }
      if (selectedRating) {
         filtered = filtered.filter((movie) => movie.countries.includes(selectedRating));
      }

      setFilteredMovies(filtered);
   }, [
      selectedGenre,
      selectedDirector,
      selectedCast,
      selectedLanguage,
      selectedCountry,
      selectedRating,
      movies
   ]);

   return (
      <div className='flex max-h-screen overflow-auto w-screen bg-gray-900 text-white'>
         <Sidebar />

         <div className='flex flex-col flex-1 p-6'>
            <h2 className='text-2xl font-bold mb-4'>All Movies</h2>

            {/* Filter Controls */}
            <div className='flex gap-4 mb-4 bg-gray-800 p-4 rounded-lg'>
               <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className='bg-gray-700 p-2 rounded'
               >
                  <option value=''>All Genres</option>
                  {availableGenres.map((genre, index) => (
                     <option key={index} value={genre}>
                        {genre}
                     </option>
                  ))}
               </select>

               <select
                  value={selectedDirector}
                  onChange={(e) => setSelectedDirector(e.target.value)}
                  className='bg-gray-700 p-2 rounded'
               >
                  <option value=''>All Directors</option>
                  {availableDirectors.map((director, index) => (
                     <option key={index} value={director}>
                        {director}
                     </option>
                  ))}
               </select>

               <select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className='bg-gray-700 p-2 rounded'
               >
                  <option value=''>All Ratings</option>
                  {availableRatings.map((rating, index) => (
                     <option key={index} value={rating}>
                        {rating}
                     </option>
                  ))}
               </select>

               <select
                  value={selectedCast}
                  onChange={(e) => setSelectedCast(e.target.value)}
                  className='bg-gray-700 p-2 rounded'
               >
                  <option value=''>All Actors</option>
                  {availableCasts.map((castMember, index) => (
                     <option key={index} value={castMember}>
                        {castMember}
                     </option>
                  ))}
               </select>

               <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className='bg-gray-700 p-2 rounded'
               >
                  <option value=''>All Languages</option>
                  {availableLanguages.map((language, index) => (
                     <option key={index} value={language}>
                        {language}
                     </option>
                  ))}
               </select>

               <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className='bg-gray-700 p-2 rounded'
               >
                  <option value=''>All Countries</option>
                  {availableCountries.map((country, index) => (
                     <option key={index} value={country}>
                        {country}
                     </option>
                  ))}
               </select>
            </div>

            <div className='flex-1 p-6 pt-2 flex-wrap gap-4 mb-4 bg-gray-800 rounded-lg'>
               <div className='flex justify-between text-gray-400 mb-2'>
                  <span>{yearRange[0]}</span>
                  <span>Release Date</span>
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

            {/* Movies Table */}
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
