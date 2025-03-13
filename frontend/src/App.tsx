import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import MoviesTable from './pages/MoviesTables';
import ActorsTable from './pages/ActorsTable';
import DirectorsTable from './pages/DirectorsTable';
import GenresTable from './pages/GenresTable';
import LandingPage from './pages/LandingPage';
import About from './pages/About';
import Explore from './pages/Explore';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import TermsOfService from './pages/TermsOfService';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function App() {
     return (
          <>
               <Navbar />
               <Routes>
                    <Route path='/' element={<LandingPage />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/about' element={<About />} />
                    <Route path='/explore' element={<Explore />} />
                    <Route path='/contact' element={<Contact />} />
                    <Route path='/faq' element={<FAQ />} />
                    <Route path='/tos' element={<TermsOfService />} />
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
                    <Route
                         path='/dashboard/my-media'
                         element={
                              <ProtectedRoute>
                                   {/* replace with personal dashboard of movies */}
                                   {/* include option to go through list and save records to user */}
                                   {/* offer at registration too */}
                                   <MoviesTable />
                              </ProtectedRoute>
                         }
                    />
               </Routes>
               <Footer />
          </>
     );
}
