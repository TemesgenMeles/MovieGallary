import React, { useEffect } from 'react'
import { useState } from 'react'
import Search from '../search';
import Spinner from '../spinner';
import MovieCard from '../MovieCard';
import MovieCardTv from '../MovieCardTv';
import { useDebounce } from 'react-use';
import { getTradingMovies, updateSearchCount } from '../../appwrite';
import { Link } from 'react-router-dom';


const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`, // Fixed typo here
  },
};

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const [movieList, setMovieList] = useState([]);
  const [tvList, setTvList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoading_tv, setIsLoading_tv] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [errorMsg_tv, setErrorMsg_tv] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const loadTradingmovie = async () => {
    try {
      // Fetch trending movies from the Appwrite database
      // This function fetches the most searched movies from the Appwrite database
      // and sets them in the trendingMovies state
      // It uses the getTradingMovies function from appwrite.js to retrieve the data
      // This will only run on the initial load of the app
      const movies = await getTradingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(error);
    }
  }

  const featchMovies = async ( quiry = '') => {
    setIsLoading(true);
    setErrorMsg(null);
    setIsLoading_tv(true);
    setErrorMsg_tv(null);

    try {
       const endpoint = quiry ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(quiry)}&sort_by=popularity.desc`
       :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

       const tv_endpoint = quiry ? `${API_BASE_URL}/search/tv?query=${encodeURIComponent(quiry)}`
       :`${API_BASE_URL}/discover/tv`;

      const response = await fetch(endpoint, API_OPTIONS);
      const tv_response = await fetch(tv_endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      if (!tv_response.ok) {
        throw new Error('Failed to fetch TV shows');
      }
      
      const data = await response.json();
      const tv_data = await tv_response.json();

      console.log(data);
      console.log(tv_data);
      setMovieList(data.results);
      setTvList(tv_data.results);
      // If a search term was provided, update the search count in the database
      // This will only run if the user has searched for a movie
      // if(quiry && data.results.length > 0) {
      //   await updateSearchCount(quiry, data.results[0]);
      // }
      

    } catch (error) {
      console.error('Error fetching movies:', error);
      setErrorMsg('Error fetching movies. Please try again later.');
      setErrorMsg_tv('Error fetching TV shows. Please try again later.');
    } finally {
      setIsLoading(false);
      setIsLoading_tv(false);
    }
  }


  useEffect(() => {
    featchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    // Load trending movies when the component mounts
    loadTradingmovie()
  }, []);
  



  return (
    <main>
      <div className='pattern'/>

      <div className="wrapper">
        <header>
          <img src="./hero-img.png" alt="hero banner" />

          <h1>Find <span className='text-gradient'>Movie</span> You'll Enjoy Without The Hassel</h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        {trendingMovies.length > 0 && searchTerm.trim() === '' && (
          <section className='trending'>
            <h2 className='mt-[40px]'>Trending Movies</h2>

            
                <ul>
                  {trendingMovies.map((movie, index) => (
                    <li key={movie.$id}>
                      <p>{index + 1}</p>
                      <img src={movie.poster_url} alt={movie.id} />
                    </li>
                  ))}
                </ul>
             
          </section>
        )}

        
        <section className='all-movies'>
          <h2 className='mt-[40px]'>All Movies</h2>

          {isLoading ? ( <Spinner /> ) : errorMsg ? (
            <p className='text-red-500'>{errorMsg}</p>) : (
              <ul>
                {movieList.map((movie) => (
                  <Link to={'Movie/' + movie.id.toString()} key={movie.id}>  
                    <MovieCard movie = {movie}/>
                  </Link>
                ))}
              </ul>
            )}
        </section>

        <section className='all-movies'>
          <h2 className='mt-[40px]'>Tv Shows</h2>

          {isLoading_tv ? ( <Spinner /> ) : errorMsg_tv ? (
            <p className='text-red-500'>{errorMsg_tv}</p>) : (
              <ul>
                {tvList.map((tv) => (
                  <Link to={'Tv/' + tv.id.toString()} key={tv.id}>  
                    <MovieCardTv tv = {tv}/>
                  </Link>
                ))}
              </ul>
            )}
        </section>
        
      </div>
    </main>
  )
}

export default Home