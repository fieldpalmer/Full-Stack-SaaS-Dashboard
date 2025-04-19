import { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaBook } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BookStats } from '../../types/interfaces';
import { Link } from 'react-router-dom';

interface BooksDataCardProps {
     title: string;
     stats: BookStats;
}

const BooksDataCard = ({ title, stats }: BooksDataCardProps) => {
     const [isExpanded, setIsExpanded] = useState(true);
     const yearData = Object.entries(stats.yearDistribution)
          .map(([year, count]) => ({
               year: parseInt(year),
               count
          }))
          .sort((a, b) => a.year - b.year);

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
                              {stats.count > 0 ? (
                                   <>
                                        <div className='bg-gray-800 rounded-lg p-3'>
                                             <p className='text-gray-400 text-sm'>Total Books</p>
                                             <p className='text-2xl font-bold text-white'>{stats.count}</p>
                                        </div>
                                        <div className='bg-gray-800 rounded-lg p-3'>
                                             <p className='text-gray-400 text-sm'>Unique Authors</p>
                                             <p className='text-2xl font-bold text-white'>{stats.uniqueAuthors}</p>
                                        </div>
                                        <div className='bg-gray-800 rounded-lg p-3'>
                                             <p className='text-gray-400 text-sm'>Author Diversity</p>
                                             <p className='text-2xl font-bold text-white'>
                                                  {((stats.uniqueAuthors / stats.count) * 100).toFixed(1)}%
                                             </p>
                                        </div>
                                        <div className='bg-gray-800 rounded-lg p-3'>
                                             <p className='text-gray-400 text-sm'>Publication Range</p>
                                             <p className='text-sm text-white'>
                                                  {stats.oldestBook?.getFullYear()} - {stats.newestBook?.getFullYear()}
                                             </p>
                                        </div>
                                   </>
                              ) : (
                                   <div className='col-span-2 text-center py-4'>
                                        <p className='text-gray-400 mb-4'>Add books to your favorites to see insights</p>
                                        <Link
                                             to='/dashboard/books-table'
                                             className='flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors bg-purple-600 text-white shadow-lg shadow-purple-500/20 hover:bg-purple-700'
                                        >
                                             <FaBook className='text-xl sm:text-2xl text-white' />
                                             <span className='text-base font-medium text-white'>Go to Books</span>
                                        </Link>
                                   </div>
                              )}
                         </div>
                         <div className='h-64 mt-6'>
                              <ResponsiveContainer width='100%' height='100%'>
                                   <BarChart data={yearData}>
                                        <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                                        <XAxis dataKey='year' stroke='#9CA3AF' />
                                        <YAxis stroke='#9CA3AF' />
                                        <Tooltip
                                             contentStyle={{
                                                  backgroundColor: '#1F2937',
                                                  border: 'none',
                                                  borderRadius: '0.5rem'
                                             }}
                                        />
                                        <Bar dataKey='count' fill='#8884d8' />
                                   </BarChart>
                              </ResponsiveContainer>
                         </div>
                    </>
               )}
          </div>
     );
};

export default BooksDataCard;
