import { useState, useEffect, useRef } from "react";
import { useMovies } from './useMovies';
import { useLocalStorageState } from './useLocalStorageState';
import { useKey } from './useKey';
import MovieDetails from './MovieDetails';
import Loader from "./Loader";

const average = (arr) => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedID] = useState(null);
  const { movies, isLoading, error } = useMovies(query);
  const [watched, setWatched] = useLocalStorageState([]);
	
  function handleSelection(id) {
       setSelectedID(selectedId => id === selectedId ? null : id);
  }

  function handleCloseMovie() {
      setSelectedID(null);
  }
  
  function handleAddWatched(movie) {
	  setWatched(watched => [...watched, movie]);
  }
  
  function handleDeleteWatched(id) {
      setWatched(watched => watched.filter(el => el.imdbID !== id))
  }
  
  return (
    <>
        <NavBar>
            <Logo />
            <Search query={query} setQuery={setQuery} />
            <NumResults movies={movies} />
        </NavBar>
        <Main>
            <Box>
                {isLoading && <Loader />}
                {!isLoading && !error &&
                <MovieList
                    movies={movies}
                    onSelectMovie={handleSelection}
                />}
                {error && <ErrorMEssage message={error} />}
            </Box>
            <Box>
                {selectedId ?
                    <MovieDetails
                        selectedId={selectedId}
                        onCloseMovie={handleCloseMovie}
                        onAddWatched={handleAddWatched}
                        watched={watched}
                    /> :
                    <>
                        <WatchedSummary watched={watched} />
                        <WatchedMoveisList watched={watched} onDeleteMovie={handleDeleteWatched} />
                    </>
                }
            </Box>
        </Main>
    </>
  );
}


function ErrorMEssage({ message }){
    return (
        <p className='error'>⛔️ {message}</p>
    )
}

function NavBar({ children }) {
  return (
      <nav className="nav-bar">
          {children}
      </nav>
  )
}

function Logo() {
  return (
      <div className="logo">
          <span role="img">🍿</span>
          <h1>usePopcorn</h1>
      </div>
  )
}

function Search({query, setQuery}) {
    const inputEl = useRef(null);
	
	useKey('Enter', function () {
		if(document.activeElement === inputEl.current) return;
	    inputEl.current.focus();
	    setQuery('');
	});
    
    return (
        <input
            ref={inputEl}
            className="search"
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
        />
  )
}

function NumResults({ movies }) {
  return (
      <p className="num-results">
          Found <strong>{movies.length}</strong> results
      </p>
  )
}

function Main({ children }){
  return (
        <main className="main">
            {children}
        </main>
  )
}

function Box({ children }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="box">
            <button
                className="btn-toggle"
                onClick={() => setIsOpen((open) => !open)}
            >
                {isOpen ? "–" : "+"}
            </button>
            {isOpen && children}
        </div>
    )
}

function MovieList({ movies, onSelectMovie }) {
  return (
      <ul className="list list-movies">
          {movies?.map((movie) => <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />)}
      </ul>
  )
}

function Movie({ movie, onSelectMovie }) {
  return (
      <li onClick={() => onSelectMovie(movie.imdbID)}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
              <p>
                  <span>🗓</span>
                  <span>{movie.Year}</span>
              </p>
          </div>
      </li>
  )
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
      <div className="summary">
          <h2>Movies you watched</h2>
          <div>
              <p>
                  <span>#️⃣</span>
                  <span>{watched.length} <span className='desktop'>movies</span></span>
              </p>
              <p>
                  <span>⭐️</span>
                  <span>{avgImdbRating.toFixed(2)}</span>
              </p>
              <p>
                  <span>🌟</span>
                  <span>{avgUserRating.toFixed(2)}</span>
              </p>
              <p>
                  <span>⏳</span>
                  <span>{avgRuntime.toFixed(2)} <span className='desktop'>min</span></span>
              </p>
          </div>
      </div>
  )
}

function WatchedMoveisList({ watched, onDeleteMovie }) {
    return (
        <ul className="list">
            {watched.map((movie) => <WatchedMovie
                                        movie={movie}
                                        key={movie.imdbID}
                                        onDeleteMovie={onDeleteMovie}
                                    />
                )
            }
        </ul>
    )
}

function WatchedMovie({ movie, onDeleteMovie }){
  return (
      <li>
          <img src={movie.poster} alt={`${movie.title} poster`} />
          <h3>{movie.title}</h3>
          <div>
              <p>
                  <span>⭐️</span>
                  <span>{movie.imdbRating}</span>
              </p>
              <p>
                  <span>🌟</span>
                  <span>{movie.userRating}</span>
              </p>
              <p>
                  <span>⏳</span>
                  <span>{movie.runtime} min</span>
              </p>
          </div>
	      <button className='btn-delete' onClick={()=> onDeleteMovie(movie.imdbID)}>X</button>
      </li>
  )
}