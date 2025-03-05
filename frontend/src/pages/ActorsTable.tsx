import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import DataTable from '../components/DataTable';

export default function ActorsTable() {
   const [actors, setActors] = useState<
      {
         _id: string;
         movieCount: number;
         avgRuntime?: number;
         avgRating?: number;
         medianYear?: number | string;
      }[]
   >([]);

   useEffect(() => {
      const fetchActors = async () => {
         try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('http://localhost:5001/api/actors', {
               headers: { Authorization: `Bearer ${token}` }
            });
            setActors(data);
         } catch (error) {
            console.error('Error fetching actors:', error);
         }
      };

      fetchActors();
   }, []);

   return (
      <div className='flex max-h-screen overflow-scroll w-screen bg-gray-900 text-white'>
         <Sidebar />
         <div className='flex flex-col flex-1 p-6'>
            <DataTable data={actors} title='Top Actors in Movies' />
         </div>
      </div>
   );
}
