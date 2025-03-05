interface DataTableProps {
   data: {
      _id: string;
      movieCount: number;
      avgRuntime?: number;
      avgRating?: number;
      medianYear?: number | string;
   }[];
   title: string;
}

export default function DataTable({ data, title }: DataTableProps) {
   return (
      <div className='bg-gray-800 p-6 rounded-lg shadow-md mt-6'>
         <h3 className='text-lg text-gray-400 mb-4'>{title}</h3>
         <table className='w-full text-left border-collapse table-auto'>
            <thead>
               <tr className='border-b border-gray-700'>
                  <th className='py-2 px-4'>Name</th>
                  <th className='py-2 px-4'>Movies</th>
                  <th className='py-2 px-4'>Avg Runtime (mins)</th>
                  <th className='py-2 px-4'>Avg Rating</th>
                  <th className='py-2 px-4'>Median Year</th>
               </tr>
            </thead>
            <tbody>
               {data.map((item, index) => (
                  <tr key={index} className='border-b border-gray-700 hover:bg-gray-700 transition'>
                     <td className='py-2 px-4'>{item._id}</td>
                     <td className='py-2 px-4'>{item.movieCount}</td>
                     <td className='py-2 px-4'>
                        {item.avgRuntime ? item.avgRuntime.toFixed(1) : 'N/A'}
                     </td>
                     <td className='py-2 px-4'>
                        {item.avgRating ? item.avgRating.toFixed(1) : 'N/A'}
                     </td>
                     <td className='py-2 px-4'>{item.medianYear}</td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}
