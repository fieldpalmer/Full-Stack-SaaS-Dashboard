import { Routes, Route } from 'react-router-dom';
import DashboardNav from '../components/DashboardNav';
import MyMedia from '../components/MyMedia';
import MoviesTable from './MoviesTable';
import MusicTable from './MusicTable';
import BooksTable from './BooksTable';

const Dashboard = () => {
     return (
          <div className='min-h-screen w-full bg-gray-900 text-white'>
               <div className='p-4 md:p-6'>
                    <DashboardNav />
                    <Routes>
                         <Route path='/' element={<MyMedia />} />
                         <Route path='/movies-table' element={<MoviesTable />} />
                         <Route path='/music-table' element={<MusicTable />} />
                         <Route path='/books-table' element={<BooksTable />} />
                    </Routes>
               </div>
          </div>
     );
};

export default Dashboard;
