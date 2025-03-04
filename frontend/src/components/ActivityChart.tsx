import {
   LineChart,
   Line,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer
} from 'recharts';

const data = [
   { date: 'Jan', users: 30 },
   { date: 'Feb', users: 45 },
   { date: 'Mar', users: 70 },
   { date: 'Apr', users: 90 },
   { date: 'May', users: 110 }
];

export default function ActivityChart() {
   return (
      <div className='bg-gray-800 p-6 rounded-lg shadow-md'>
         <h3 className='text-lg text-gray-400 mb-4'>User Activity</h3>
         <ResponsiveContainer width='100%' height={300}>
            <LineChart data={data}>
               <CartesianGrid strokeDasharray='3 3' />
               <XAxis dataKey='date' />
               <YAxis />
               <Tooltip />
               <Line type='monotone' dataKey='users' stroke='#00c0ff' strokeWidth={3} />
            </LineChart>
         </ResponsiveContainer>
      </div>
   );
}
