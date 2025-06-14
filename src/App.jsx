
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import RootLayout from './components/layout/RootLayout';
import Home from './components/pages/Home';
import MovieDetail, { MovieDetailLoader } from './components/pages/MovieDetail';
import TvShowDetail, { TvShowDetailLoader } from './components/pages/TvShowDetail';




const App = () => {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path='Movie/:id' element={<MovieDetail />} loader={MovieDetailLoader} />
        <Route path='Tv/:id' element={<TvShowDetail />} loader={TvShowDetailLoader} />
      </Route>    
    )
  )
  
  return (
      <RouterProvider router={router} />
  );
}

export default App