import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import DataTable from '../components/DataTable';

export default function GenresTable() {
   const [genres, setGenres] = useState<
      {
         _id: string;
         movieCount: number;
         avgRuntime?: number;
         avgRating?: number;
         medianYear?: number | string;
      }[]
   >([]);

   useEffect(() => {
      const fetchGenres = async () => {
         try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('http://localhost:5001/api/genres', {
               headers: { Authorization: `Bearer ${token}` }
            });
            setGenres(data);
         } catch (error) {
            console.error('Error fetching genres:', error);
         }
      };

      fetchGenres();
   }, []);

   return (
      <div className='flex h-screen bg-gray-900 text-white'>
         <Sidebar />
         <div className='flex flex-col flex-1 p-6'>
            <DataTable data={genres} title='Movie Genres' />
         </div>
      </div>
   );
}
