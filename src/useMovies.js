import {useState, useEffect} from 'react';

const KEY = '48b46f54';

export function useMovies(query) {
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	
	useEffect(() => {
		// callback?.();
		const controller = new AbortController(); // if new request coming cancel previous request (when typing in search field)
		
		async function fetchMovies() {
			
			try{
				setIsLoading(true);
				setError('');
				const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&s=${query}`, { signal: controller.signal });
				
				if(!res.ok) throw new Error('Something went wrong with fetching movies');
				
				const data = await res.json();
				if(data.Response === 'False') throw new Error('Movie not found');
				setMovies(data.Search);
				setIsLoading(false);
				setError('');
			} catch (err) {
				console.log(err.message);
				if(err.name !== 'AbortError'){
					setError(err.message);
				}
			} finally {
				setIsLoading(false);
			}
		}
		
		if(query.length < 3) {
			setMovies([]);
			setError('');
			return
		}
		
		fetchMovies();
		
		return function () {
			controller.abort();
		}
	},[query]);
	
	return { movies, isLoading, error }
}
