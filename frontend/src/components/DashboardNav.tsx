import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaFilm, FaMusic, FaBook } from 'react-icons/fa';

const DashboardNav = () => {
   const location = useLocation();

   const navItems = [
      { path: '/dashboard', icon: FaHome, label: 'Overview' },
      { path: '/dashboard/movies-table', icon: FaFilm, label: 'Movies' },
      { path: '/dashboard/music-table', icon: FaMusic, label: 'Music' },
      { path: '/dashboard/books-table', icon: FaBook, label: 'Books' },
   ];

   return (
      <nav className="dashboard-nav bg-gray-800 p-2 rounded-lg border border-gray-600 ">
         <div className="flex justify-between items-center">
            {navItems.map(item => {
               const Icon = item.icon;
               const isActive = location.pathname === item.path;
               return (
                  <Link
                     key={item.path}
                     to={item.path}
                     className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors flex-1 ${
                        isActive
                           ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                           : 'text-white hover:bg-gray-700'
                     }`}
                  >
                     <Icon className="text-xl sm:text-2xl" />
                     <span className="hidden sm:inline text-sm font-medium">{item.label}</span>
                  </Link>
               );
            })}
         </div>
      </nav>
   );
};

export default DashboardNav;
