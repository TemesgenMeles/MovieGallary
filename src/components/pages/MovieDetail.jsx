import React, { useState } from 'react'
import { useLoaderData, useNavigate, useParams } from 'react-router-dom'

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

const MovieDetail = () => {
  const { id } = useParams();
  const { movie, credits, videos } = useLoaderData();
  const [showTrailer, setShowTrailer] = useState(false);
  const navigate = useNavigate();

  // Find the first YouTube trailer
  const trailer = videos.results?.find(
    v => v.type === 'Trailer' && v.site === 'YouTube'
  );

  // Format runtime as "2h 15m"
  const formatRuntime = (min) => {
    if (!min) return 'N/A';
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="relative max-w-4xl mx-auto my-10 bg-gradient-to-br from-indigo-900 via-slate-900 to-cyan-900 text-white rounded-2xl shadow-2xl p-8">
      {/* X Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 right-4 bg-cyan-400 text-slate-900 rounded-full w-9 h-9 font-bold text-2xl flex items-center justify-center z-10 hover:bg-cyan-500 transition"
        aria-label="Close"
      >✕</button>

      <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
        <div className="flex flex-col items-center md:items-start">
          <img
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w342/${movie.poster_path}` : '/No-Poster.png'}
            alt={movie.title}
            className="w-[220px] rounded-xl shadow-lg mx-auto md:mx-0"
          />
          {/* Year and Length in one line */}
          <div className="flex items-center justify-center gap-3 mt-4 w-full">
            <span className="text-slate-300 text-lg">
              • {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
            </span>
            <span className="text-slate-300 text-lg">
              • {formatRuntime(movie.runtime)}
            </span>
          </div>
          {/* Release Date below if you want to keep it */}
          
        </div>
        <div className="flex-1 flex flex-col items-center">
          <h1 className="text-4xl font-bold mb-4 leading-none text-cyan-300 text-center">{movie.title}</h1>
          {/* Genres as beautiful boxes, centered and close to the title */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-4 -mt-1 w-full">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-5 py-2 rounded-lg bg-gradient-to-br from-indigo-900 to-cyan-900 text-white font-semibold shadow-md text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}
          <div className="w-full">
            <p className="text-slate-300 mb-2 text-left">
              <strong>Rating:</strong> {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
            </p>
            <p className="text-slate-300 mb-2 text-left">
              <strong>Language:</strong> {movie.original_language?.toUpperCase()}
            </p>
            <p className="text-slate-300 mb-2 text-left">
              <strong>Release Date:</strong> {movie.release_date ? movie.release_date : 'N/A'}
            </p>
          </div>
          <p className="font-semibold text-slate-300 mb-2 w-full text-left">Overview:</p>
          <p className="leading-relaxed text-slate-200 mb-2">{movie.overview}</p>
          {trailer && (
            <button
              className="mt-5 px-6 py-2 bg-cyan-400 text-slate-900 rounded-md font-bold hover:bg-cyan-500 transition self-start"
              onClick={() => setShowTrailer(true)}
            >
              ▶ Watch Trailer
            </button>
          )}
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[1000]">
          <div className="relative w-[90vw] max-w-2xl bg-slate-900 rounded-xl p-5">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-2 right-2 bg-cyan-400 text-slate-900 rounded-full w-8 h-8 font-bold text-lg flex items-center justify-center hover:bg-cyan-500 transition"
            >✕</button>
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title="Trailer"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="rounded-lg"
            />
          </div>
        </div>
      )}

      <h2 className="text-2xl mb-5 text-cyan-300 font-semibold">Cast</h2>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 list-none p-0 m-0">
        {credits.cast && credits.cast.length > 0 ? (
          credits.cast.slice(0, 12).map((member) => (
            <li
              key={member.cast_id || member.credit_id}
              className="bg-slate-800 rounded-xl p-4 flex flex-col items-center shadow"
            >
              <img
                src={member.profile_path ? `https://image.tmdb.org/t/p/w185/${member.profile_path}` : '/No-Poster.png'}
                alt={member.name}
                className="w-20 h-28 object-cover object-top rounded-xl mb-2 shadow-lg bg-slate-800 transition-transform duration-300 hover:scale-105"
              />
              <span className="font-bold mb-1 text-center text-cyan-200">{member.name}</span> 
              <span className="text-cyan-400 text-sm text-center"> {member.character}</span>
            </li>
          ))
        ) : (
          <li className="text-slate-400 col-span-full">No cast information available.</li>
        )}
      </ul>
    </div>
  );
}

export default MovieDetail

export const MovieDetailLoader = async ({params}) => {
  const {id} = params
  // Fetch movie details
  const movieRes = await fetch(`${API_BASE_URL}/movie/${id}`, API_OPTIONS);
  if (!movieRes.ok) {
    throw new Error('Failed to fetch movie details');
  }
  const movie = await movieRes.json();

  // Fetch credits (cast)
  const creditsRes = await fetch(`${API_BASE_URL}/movie/${id}/credits`, API_OPTIONS);
  if (!creditsRes.ok) {
    throw new Error('Failed to fetch movie credits');
  }
  const credits = await creditsRes.json();

  // Fetch videos (trailers)
  const videosRes = await fetch(`${API_BASE_URL}/movie/${id}/videos`, API_OPTIONS);
  if (!videosRes.ok) throw new Error('Failed to fetch movie videos');
  const videos = await videosRes.json();

  return { movie, credits, videos };
}