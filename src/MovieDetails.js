import {useEffect, useRef, useState} from "react";
import {useKey} from "./useKey";
import StarRating from "./StarRating";
import Loader from "./Loader";

const KEY = '48b46f54';

export default function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
	const [movie, setMovie] = useState({});
	const [loading, setLoading] = useState(false);
	const [userRating, setUserRating] = useState(0);
	
	const countRef = useRef(0);
	
	useEffect(()=>{
		if(userRating) countRef.current++;
	}, [userRating]);
	
	const isWathced = !watched.find(el => el.imdbID === selectedId);
	const watchedUserRating = watched.find(el => el.imdbID === selectedId)?.userRating;
	
	const { Title: title,
		Year: year,
		Poster: poster,
		Runtime: runtime,
		imdbRating,
		Plot: plot,
		Released: released,
		Actors: actors,
		Director: director,
		Genre: genre
	} = movie;
	
	function handleAdd() {
		const newWatchedMovie = {
			imdbID: selectedId,
			title,
			year,
			poster,
			imdbRating: Number(imdbRating),
			runtime: Number(runtime.split(' ').at(0)),
			userRating,
			countRatingDecisions: countRef.current,
		};
		onAddWatched(newWatchedMovie);
		onCloseMovie();
	}
	
	
	useKey("Escape", onCloseMovie);
	
	useEffect(() => {
		async function getMovieDetails() {
			setLoading(true);
			const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
			const data = await res.json();
			setMovie(data);
			setLoading(false);
		}
		getMovieDetails();
	}, [selectedId]);
	
	useEffect(() => {
		if (!title) return;
		document.title = `Movie | ${title}`;
		
		return function(){
			document.title = `usePopcorn`;
		}
	}, [title]);
	
	return (
		<div className='details'>
			{loading ?
				<Loader /> :
				<>
					<header>
						<button className='btn-back' onClick={onCloseMovie}>&larr;</button>
						<img src={poster} alt={`Poster of movie ${movie}`}/>
						<div className="details-overview">
							<h2>{title}</h2>
							<p>{released} &bull; {runtime}</p>
							<p>{genre}</p>
							<p><span>⭐️</span>
								{imdbRating} IMDb rating
							</p>
						</div>
					</header>
					<section>
						<div className="rating">
							{isWathced ?
								<>
									<StarRating maxRating={10} size={24} onSetRating={setUserRating} />
									{userRating > 0 && <button className="btn-add" onClick={handleAdd}> + Add to list</button>}
								</>
								:
								<p>You rated with tis movie {watchedUserRating} <span>🌟</span></p>
							}
						</div>
						<p><em>{plot}</em></p>
						<p>Starring {actors}</p>
						<p>Directed bt {director}</p>
					</section>
				</>
			}
		</div>
	)
}