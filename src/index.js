import React from 'react';
import ReactDOM from 'react-dom/client';
import { useState } from 'react';
import './index.css';
import App from './App 2';

import StarRating from './StarRating';

function Test() {
    const [movieRatting, setMovieRatting] = useState(0);

    return (
        <div>
            <StarRating color={'blue'} onSetRating={setMovieRatting} />
            <p>Movie was rated as {movieRatting}</p>
        </div>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/*<StarRating messages={['Terrible', 'Bad', 'Okay', 'Good', 'Amazing']}/>*/}
    {/*<StarRating maxRating={5} color={'green'} className='test' />*/}
    {/*<StarRating maxRating={10} defaultRating={3} />*/}
      {/*<Test />*/}
  </React.StrictMode>
);

