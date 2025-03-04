import {
   LineChart,
   Line,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer
} from 'recharts';

interface MovieRuntimeChartProps {
   data: { year: number; avgRuntime: number }[];
}

export default function MovieRuntimeChart({ data }: MovieRuntimeChartProps) {
   return (
      <div className='bg-gray-800 p-6 rounded-lg shadow-md'>
         <h3 className='text-lg text-gray-400 mb-4'>Average Runtime Over Years</h3>
         <ResponsiveContainer width='100%' height={300}>
            <LineChart data={data}>
               <CartesianGrid strokeDasharray='3 3' />
               <XAxis dataKey='year' />
               <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
               <Tooltip />
               <Line type='monotone' dataKey='avgRuntime' stroke='#00c0ff' strokeWidth={3} />
            </LineChart>
         </ResponsiveContainer>
      </div>
   );
}
