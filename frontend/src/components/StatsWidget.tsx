interface StatsWidgetProps {
   title: string;
   value: string;
}

export default function StatsWidget({ title, value }: StatsWidgetProps) {
   return (
      <div className='bg-gray-800 p-6 rounded-lg shadow-md text-center'>
         <h3 className='text-lg text-gray-400'>{title}</h3>
         <p className='text-2xl font-bold text-blue-400'>{value}</p>
      </div>
   );
}
