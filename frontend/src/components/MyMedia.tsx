import React, { useState } from 'react';
import { MovieRuntimeChart, StatsWidget } from './Charts.tsx';
import Top10Lists from './Top10Lists.tsx';
import Slider from 'rc-slider';

interface Movie {
     title: string;
     year: number;
     rating?: number;
     runtime?: number;
}

interface MovieStats {
     totalMovies: number;
     avgRuntime: string;
     avgRating: string;
     minYear: number;
     maxYear: number;
     topRatedMovies: Movie[];
     topGenres: [];
     longestMovies: [];
     genreAverages: { genre: string; avgRating: number }[];
}

const MyMedia = ({ stats, runtimeData }: { stats: MovieStats; runtimeData: { _id: number; avgRuntime: number }[] }) => {
     const [yearRange, setYearRange] = useState<[number, number]>([1900, new Date().getFullYear()]);

     return (
          <>
               <div className='m-6 px-4 py-4 rounded-lg flex flex-col md:flex-row items-center gap-8'>
                    <div className='flex gap-6'>
                         <StatsWidget title='Movies' value={stats.totalMovies.toString()} />
                         <StatsWidget title='Avg Runtime (mins)' value={stats.avgRuntime} />
                         <StatsWidget title='Avg Rating' value={stats.avgRating} />
                    </div>
                    <div className='flex-1'>
                         <div className='flex justify-between text-gray-400 mb-2'>
                              <span>{yearRange[0]}</span>
                              <span>{yearRange[1]}</span>
                         </div>
                         <Slider
                              range
                              min={stats.minYear}
                              max={stats.maxYear}
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

               <div className='px-6 pb-6'>
                    <MovieRuntimeChart data={runtimeData} />
               </div>

               <div className='px-6'>
                    <Top10Lists
                         topRatedMovies={stats.topRatedMovies}
                         topGenres={stats.topGenres}
                         longestMovies={stats.longestMovies}
                    />
               </div>
          </>
     );
};

export default MyMedia;
