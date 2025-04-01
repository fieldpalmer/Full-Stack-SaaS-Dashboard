import Sidebar from '../components/Sidebar';
import MyMedia from '../components/MyMedia';

const Dashboard = () => {
     return (
          <div className='flex h-screen w-[100%] bg-gray-900 text-white'>
               <Sidebar />
               <div className='flex flex-col flex-1'>
                    <div className='flex-1'>
                         <MyMedia />
                    </div>
               </div>
          </div>
     );
};

export default Dashboard;
