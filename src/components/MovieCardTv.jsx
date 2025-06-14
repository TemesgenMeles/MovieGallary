import { updateSearchCount } from '../appwrite';

const MovieCardTV = ({tv : {id, name, vote_average, first_air_date, poster_path, backdrop_path, original_language}}) => {
  return (
    <div className="movie-card" onClick={() => { updateSearchCount(id, name, poster_path) }}>
      <img
        src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : '/No-Poster.png'}
        alt={name}
      />
      <div className="mt-4">
        <h3>{name}</h3>

        <div className="content">
            <div className="rating">
                <img src="./star.svg" alt="Star Icon" />
                <p>{ vote_average ? vote_average.toFixed(1) : 'N/A' }</p>
                <span>•</span>
                <p className='lang'>{original_language}</p>
                <span>•</span>
                <p className="year">
                    {first_air_date? first_air_date.split('-')[0] : 'N/A'}
                </p>
            </div>
        </div>
      </div>
    </div>
  )
}

export default MovieCardTV