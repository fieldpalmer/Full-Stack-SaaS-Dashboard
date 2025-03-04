import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import MoviesTable from './pages/MoviesTables';
import ActorsTable from './pages/ActorsTable';
import DirectorsTable from './pages/DirectorsTable';
import GenresTable from './pages/GenresTable';

export default function App() {
   return (
      <Routes>
         {/* <Route path='/' element={<Dashboard />} /> */}
         <Route path='/login' element={<Login />} />
         <Route path='/register' element={<Register />} />
         <Route
            path='/dashboard/*'
            element={
               <ProtectedRoute>
                  <Dashboard />
               </ProtectedRoute>
            }
         />
         <Route
            path='/dashboard/movies-table'
            element={
               <ProtectedRoute>
                  <MoviesTable />
               </ProtectedRoute>
            }
         />

         <Route
            path='/dashboard/actors'
            element={
               <ProtectedRoute>
                  <ActorsTable />
               </ProtectedRoute>
            }
         />
         <Route
            path='/dashboard/directors'
            element={
               <ProtectedRoute>
                  <DirectorsTable />
               </ProtectedRoute>
            }
         />
         <Route
            path='/dashboard/genres'
            element={
               <ProtectedRoute>
                  <GenresTable />
               </ProtectedRoute>
            }
         />
      </Routes>
   );
}
