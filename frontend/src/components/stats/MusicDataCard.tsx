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
   Scatter,
} from 'recharts';
import { MusicStats } from '../../types/interfaces';

interface MusicDataCardProps {
   title: string;
   stats: MusicStats;
}

const MusicDataCard = ({ title, stats }: MusicDataCardProps) => {
   const formatNumber = (num: number): string => {
      if (num >= 1000000) {
         return `${(num / 1000000).toFixed(1)}M`;
      }
      if (num >= 1000) {
         return `${(num / 1000).toFixed(1)}K`;
      }
      return num.toString();
   };

   // Transform the data to include both listeners and tracks
   const chartData = stats.topArtists.map(artist => ({
      ...artist,
      tracks: artist.tracks || 1, // Default to 1 if tracks not specified
      popularity: (artist.listeners / stats.averageListeners) * 100, // Calculate relative popularity
   }));

   return (
      <div className="bg-gray-700 rounded-lg p-4">
         <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
               <h4 className="text-lg font-semibold text-white">{title}</h4>
            </div>
         </div>
         <div className="grid grid-cols-2 gap-3 mt-4">
            {stats.totalArtists > 0 ? (
               <>
                  <div className="bg-gray-800 rounded-lg p-3">
                     <p className="text-gray-400 text-sm">Total Artists</p>
                     <p className="text-2xl font-bold text-white">{stats.totalArtists}</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                     <p className="text-gray-400 text-sm">Total Listeners</p>
                     <p className="text-2xl font-bold text-white">
                        {formatNumber(stats.totalListeners)}
                     </p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                     <p className="text-gray-400 text-sm">Average Listeners</p>
                     <p className="text-2xl font-bold text-white">
                        {formatNumber(stats.averageListeners)}
                     </p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                     <p className="text-gray-400 text-sm">Top Artists</p>
                     <p className="text-sm text-white">{stats.topArtists.length}</p>
                  </div>
               </>
            ) : (
               <div className="col-span-2 text-center py-4">
                  <p className="text-gray-400 mb-4">Add music to your favorites to see insights</p>
               </div>
            )}
         </div>
         <div className="h-[200px] mt-4">
            {stats.totalArtists > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                     <XAxis
                        dataKey="name"
                        stroke="#9CA3AF"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                     />
                     <YAxis
                        yAxisId="left"
                        stroke="#8B5CF6"
                        label={{ value: 'Listeners', angle: -90, position: 'insideLeft' }}
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
                           if (name === 'listeners') return [formatNumber(value), 'Listeners'];
                           if (name === 'tracks') return [value, 'Tracks'];
                           return [`${value.toFixed(1)}%`, 'Popularity'];
                        }}
                     />
                     <Legend />
                     <Bar
                        yAxisId="left"
                        dataKey="listeners"
                        fill="#8B5CF6"
                        name="Listeners"
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
                     <Scatter yAxisId="left" dataKey="tracks" fill="#F59E0B" name="Tracks" />
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

export default MusicDataCard;
