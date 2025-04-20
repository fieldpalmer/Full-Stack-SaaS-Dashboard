import {
   ComposedChart,
   Bar,
   Line,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
   Legend,
} from 'recharts';
import { BookStats } from '../../types/interfaces';

interface BooksDataCardProps {
   title: string;
   stats: BookStats;
}

const formatNumber = (num: number) => {
   return new Intl.NumberFormat().format(num);
};

const BooksDataCard = ({ title, stats }: BooksDataCardProps) => {
   // Transform the data to include both count and relative distribution
   const chartData = Object.entries(stats.yearDistribution)
      .map(([year, count]) => ({
         year: parseInt(year),
         count,
         distribution: (count / stats.count) * 100, // Calculate relative distribution
      }))
      .sort((a, b) => a.year - b.year);

   return (
      <div className="bg-gray-700 rounded-lg p-4">
         <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
               <h4 className="text-lg font-semibold text-white">{title}</h4>
            </div>
         </div>
         <div className="grid grid-cols-2 gap-3 mt-4">
            {stats.count > 0 ? (
               <>
                  <div className="bg-gray-800 rounded-lg p-3">
                     <p className="text-gray-400 text-sm">Total Books</p>
                     <p className="text-2xl font-bold text-white">{stats.count}</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                     <p className="text-gray-400 text-sm">Total Pages</p>
                     <p className="text-2xl font-bold text-white">
                        {formatNumber(stats.avgPages * stats.count)}
                     </p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                     <p className="text-gray-400 text-sm">Average Pages</p>
                     <p className="text-2xl font-bold text-white">{formatNumber(stats.avgPages)}</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                     <p className="text-gray-400 text-sm">Unique Authors</p>
                     <p className="text-sm text-white">{stats.uniqueAuthors}</p>
                  </div>
               </>
            ) : (
               <div className="col-span-2 text-center py-4">
                  <p className="text-gray-400 mb-4">Add books to your favorites to see insights</p>
               </div>
            )}
         </div>
         <div className="h-[200px] mt-4">
            {stats.count > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                     <XAxis
                        dataKey="year"
                        stroke="#9CA3AF"
                        label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
                     />
                     <YAxis
                        yAxisId="left"
                        stroke="#8B5CF6"
                        label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
                     />
                     <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#EC4899"
                        label={{ value: 'Distribution %', angle: 90, position: 'insideRight' }}
                     />
                     <Tooltip
                        contentStyle={{
                           backgroundColor: '#1F2937',
                           border: 'none',
                           borderRadius: '0.5rem',
                        }}
                        formatter={(value: number, name: string) => {
                           if (name === 'count') return [value, 'Count'];
                           return [`${value.toFixed(1)}%`, 'Distribution'];
                        }}
                     />
                     <Legend />
                     <Bar
                        yAxisId="left"
                        dataKey="count"
                        fill="#8B5CF6"
                        name="Count"
                        radius={[4, 4, 0, 0]}
                     />
                     <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="distribution"
                        stroke="#EC4899"
                        strokeWidth={2}
                        dot={{ fill: '#EC4899', r: 4 }}
                        name="Distribution"
                     />
                  </ComposedChart>
               </ResponsiveContainer>
            ) : (
               <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400">No data available for chart</p>
               </div>
            )}
         </div>
      </div>
   );
};

export default BooksDataCard;
