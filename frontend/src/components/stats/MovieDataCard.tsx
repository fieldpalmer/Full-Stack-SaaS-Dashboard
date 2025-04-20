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
import { MovieStats } from '../../types/interfaces';

interface MovieDataCardProps {
   title: string;
   stats: MovieStats;
}

const MovieDataCard = ({ title, stats }: MovieDataCardProps) => {
   // Transform the data to include both rating and popularity
   const chartData = stats.ratingDistribution.map(dist => ({
      ...dist,
      popularity: (dist.count / stats.count) * 100, // Calculate relative popularity
      rating: parseFloat(dist.rating), // Convert rating to number
   }));

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
                     <p className="text-gray-400 text-sm">Total Movies</p>
                     <p className="text-2xl font-bold text-white">{stats.count}</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                     <p className="text-gray-400 text-sm">Average Rating</p>
                     <p className="text-2xl font-bold text-white">{stats.avgRating.toFixed(1)}</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                     <p className="text-gray-400 text-sm">Average Popularity</p>
                     <p className="text-2xl font-bold text-white">
                        {stats.avgPopularity.toFixed(1)}
                     </p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                     <p className="text-gray-400 text-sm">Release Range</p>
                     <p className="text-sm text-white">
                        {stats.oldestMovie?.getFullYear()} - {stats.newestMovie?.getFullYear()}
                     </p>
                  </div>
               </>
            ) : (
               <div className="col-span-2 text-center py-4">
                  <p className="text-gray-400 mb-4">Add movies to your favorites to see insights</p>
               </div>
            )}
         </div>
         <div className="h-[200px] mt-4">
            {stats.count > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                     <XAxis
                        dataKey="rating"
                        stroke="#9CA3AF"
                        label={{ value: 'Rating', position: 'insideBottom', offset: -5 }}
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
                        label={{ value: 'Popularity %', angle: 90, position: 'insideRight' }}
                     />
                     <Tooltip
                        contentStyle={{
                           backgroundColor: '#1F2937',
                           border: 'none',
                           borderRadius: '0.5rem',
                        }}
                        formatter={(value: number, name: string) => {
                           if (name === 'count') return [value, 'Count'];
                           return [`${value.toFixed(1)}%`, 'Popularity'];
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
                        dataKey="popularity"
                        stroke="#EC4899"
                        strokeWidth={2}
                        dot={{ fill: '#EC4899', r: 4 }}
                        name="Popularity"
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

export default MovieDataCard;
