import React from 'react';
import {
   LineChart,
   BarChart,
   Bar,
   Line,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer
} from 'recharts';

interface GenreRatingChartProps {
   data: { genre: string; avgRating: number }[];
}

interface MovieRuntimeChartProps {
   data: { _id: number; avgRuntime: number }[];
}

interface StatsWidgetProps {
   title: string;
   value: string;
}

export const StatsWidget: React.FC<StatsWidgetProps> = ({ title, value }) => {
   return (
      <div className='bg-gray-800 p-3 rounded-lg shadow-md text-center'>
         <h3 className='text-lg text-gray-400'>{title}</h3>
         <p className='text-2xl font-bold text-blue-400'>{value}</p>
      </div>
   );
};

export const GenreRatingChart: React.FC<GenreRatingChartProps> = ({ data }) => {
   return (
      <div className='bg-gray-800 p-3 rounded-lg'>
         <ResponsiveContainer width='100%' height={250}>
            <BarChart data={data} margin={{ bottom: 40 }}>
               <CartesianGrid strokeDasharray='3 3' />
               <XAxis
                  dataKey='genre'
                  tick={{ fill: '#fff', fontSize: 12 }}
                  angle={-45}
                  textAnchor='end'
                  interval={0}
               />
               <YAxis
                  domain={[0, 100]}
                  tick={{ fill: '#fff' }}
                  label={{
                     value: 'TomatoMeter',
                     angle: -90,
                     position: 'insideBottomLeft',
                     fill: '#fff',
                     offset: 13
                  }}
               />
               <Tooltip />
               <Bar dataKey='avgRating' fill='#4f46e5' barSize={30} />
            </BarChart>
         </ResponsiveContainer>
      </div>
   );
};

export const MovieRuntimeChart: React.FC<MovieRuntimeChartProps> = ({ data }) => {
   return (
      <div className='bg-gray-800 p-3 rounded-lg shadow-md'>
         <ResponsiveContainer width='100%' height={250}>
            <LineChart data={data}>
               {' '}
               {/* Increased bottom margin */}
               <CartesianGrid strokeDasharray='3 3' />
               <XAxis
                  dataKey='_id'
                  type='category'
                  tickFormatter={(tick) => String(tick)}
                  angle={-45}
                  textAnchor='end'
                  interval={2}
                  tick={{ fill: '#fff', fontSize: 12 }}
               />
               <YAxis
                  label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fill: '#fff' }}
                  tick={{ fill: '#fff' }}
               />
               <Tooltip />
               <Line type='monotone' dataKey='avgRuntime' stroke='#00c0ff' strokeWidth={3} />
            </LineChart>
         </ResponsiveContainer>
      </div>
   );
};
