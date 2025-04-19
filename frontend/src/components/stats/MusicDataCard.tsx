import { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaMusic } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MusicStats } from '../../types/interfaces';
import { Link } from 'react-router-dom';

interface MusicDataCardProps {
     title: string;
     stats: MusicStats;
}

const MusicDataCard = ({ title, stats }: MusicDataCardProps) => {
     const [isExpanded, setIsExpanded] = useState(true);

     const formatNumber = (num: number): string => {
          if (num >= 1000000) {
               return `${(num / 1000000).toFixed(1)}M`;
          }
          if (num >= 1000) {
               return `${(num / 1000).toFixed(1)}K`;
          }
          return num.toString();
     };

     return (
          <div className='bg-gray-700 rounded-lg p-4 mb-4'>
               <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-3'>
                         <h4 className='text-lg font-semibold text-white'>{title}</h4>
                    </div>
                    <button
                         onClick={() => setIsExpanded(!isExpanded)}
                         className='text-gray-400 hover:text-white transition-colors'
                    >
                         {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
               </div>
               {isExpanded && (
                    <>
                         <div className='grid grid-cols-2 gap-3 mt-4'>
                              {stats.totalArtists > 0 ? (
                                   <>
                                        <div className='bg-gray-800 rounded-lg p-3'>
                                             <p className='text-gray-400 text-sm'>Total Artists</p>
                                             <p className='text-2xl font-bold text-white'>{stats.totalArtists}</p>
                                        </div>
                                        <div className='bg-gray-800 rounded-lg p-3'>
                                             <p className='text-gray-400 text-sm'>Total Listeners</p>
                                             <p className='text-2xl font-bold text-white'>{formatNumber(stats.totalListeners)}</p>
                                        </div>
                                        <div className='bg-gray-800 rounded-lg p-3'>
                                             <p className='text-gray-400 text-sm'>Average Listeners</p>
                                             <p className='text-2xl font-bold text-white'>
                                                  {formatNumber(stats.averageListeners)}
                                             </p>
                                        </div>
                                        <div className='bg-gray-800 rounded-lg p-3'>
                                             <p className='text-gray-400 text-sm'>Top Artists</p>
                                             <p className='text-sm text-white'>{stats.topArtists.length}</p>
                                        </div>
                                   </>
                              ) : (
                                   <div className='col-span-2 text-center py-4'>
                                        <p className='text-gray-400 mb-4'>Add music to your favorites to see insights</p>
                                        <Link
                                             to='/dashboard/music-table'
                                             className='flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors bg-purple-600 text-white shadow-lg shadow-purple-500/20 hover:bg-purple-700'
                                        >
                                             <FaMusic className='text-xl sm:text-2xl text-white' />
                                             <span className='text-base font-medium text-white'>Go to Music</span>
                                        </Link>
                                   </div>
                              )}
                         </div>
                         <div className='h-64 mt-6'>
                              <ResponsiveContainer width='100%' height='100%'>
                                   <BarChart data={stats.topArtists}>
                                        <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                                        <XAxis dataKey='name' stroke='#9CA3AF' />
                                        <YAxis stroke='#9CA3AF' />
                                        <Tooltip
                                             contentStyle={{
                                                  backgroundColor: '#1F2937',
                                                  border: 'none',
                                                  borderRadius: '0.5rem'
                                             }}
                                             formatter={(value: number) => formatNumber(value)}
                                        />
                                        <Bar dataKey='listeners' fill='#8884d8' />
                                   </BarChart>
                              </ResponsiveContainer>
                         </div>
                    </>
               )}
          </div>
     );
};

export default MusicDataCard;
