import React, { useState, useEffect } from 'react';
import {Card, CardBody, CardHeader} from "@nextui-org/react";
import {Input} from "@nextui-org/react";
import {Image} from "@nextui-org/image";
import {Button} from "@nextui-org/button"


interface WatchedListComponent {
  onSubmit: (movieList: string[]) => void;
}

//Limits the amount of calls to API
const debounce = (func, delay) => {
  let inDebounce;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
};

const WatchedListComponent: React.FC<WatchedListComponent> = ({ onSubmit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState([]);

  const apiKey = '4ee9a5dacc826d31306e4b2a903d1833';

  //Calls API
  const searchMovies = async (term) => {
    if (!term) {
      setSearchResults([]);
      return;
    }
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(term)}`);
    const data = await response.json();
    setSearchResults(data.results.slice(0, 3));
  };

  const debouncedSearchMovies = debounce(searchMovies, 300); // 300ms delay

  useEffect(() => {
    debouncedSearchMovies(searchTerm);
  }, [searchTerm]);

  //Triggers when text in search bar changes
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const handleSubmit = () => {
    // Implement movie list submission logic
    const movieList = ["Movie 1", "Movie 2"]; // Replace with actual list
    onSubmit(movieList);
  };

  const addMovieToList = (movie) => {
    if (selectedMovies.find((m) => m.id === movie.id)) {
      console.log('Movie already added');
      return; // Avoid adding duplicates
    }
    setSelectedMovies([...selectedMovies, movie]);
  };

  const removeMovieFromList = (movieId) => {
    setSelectedMovies(selectedMovies.filter(movie => movie.id !== movieId));
  };

  //Sends user's favorite movies to my database
  const submitMovies = async () => {
    try {
      for (const movie of selectedMovies) {
        const response = await fetch('YOUR_API_ENDPOINT', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(movie),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      console.log("All movies submitted successfully");
      handleSubmit()
    } catch (error) {
      console.error("Error submitting movies: ", error);
      // Optionally handle the error, e.g., showing an error message
    }
  };

  const MovieCard = ({ movie }) => {
    return (
      <div className="flex flex-col items-center m-2 w-full hover:bg-gray-800 p-2 rounded cursor-pointer" onClick={() => removeMovieFromList(movie.id)}>
        <img src={movie.posterUrl} alt={movie.title} className="w-full h-auto" />
        <h3 className="mt-2">{movie.title}</h3>
      </div>
    );
  };

  const MovieGrid = ({ movies }) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto max-h-[750px] p-4">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    );
  };
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 font-sans">
      <nav className="w-full flex justify-center items-center">
				<img src="/static/images/logo.png" alt="Logo" className="h-10 md:h-12" />
			</nav>
      <h1 className='text-3xl mb-5 text-center'>Enter your favorite movies!</h1>

      <Card className='w-full sm:w-2/3 md:w-1/2 lg:w-1/3 scrollbar-hide mb-4'>
        <CardHeader className='items-center justify-center flex flex-col'>
          <h1 className='text-l mb-2'>Maximum five movies.</h1>
          <Input placeholder='Search a movie title' value={searchTerm} onChange={handleSearchChange} />
        </CardHeader>
        <CardBody className='scrollbar-hide'>
          {searchResults.map(movie => (
           <div key={movie.id} className='flex flex-row mb-2 hover:bg-gray-800 p-2 rounded cursor-pointer' onClick={() => addMovieToList(movie)}>
              <Image
                width={75}
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
              <div className='flex-grow flex flex-col justify-center items-center text-center'>
                <h1 className='font-bold text-lg'>{movie.title}</h1>
                <p className='italic text-base'>{movie.release_date.split('-')[0]}</p>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
      
      <Card className='w-full sm:w-2/3 md:w-1/2 lg:w-1/3 scrollbar-hide mb-4'>
        <CardHeader className='items-center justify-center flex flex-col'>
          <h1 className='text-xl mb-2 text-center'>Your List</h1>
          <CardBody>
            <MovieGrid movies={movies} />
          </CardBody>
        </CardHeader>
      </Card>
      
      <Button onClick={submitMovies} color='primary' variant='bordered' className='mt-4'>Recommend a Movie!</Button>
    </div>
  );
};

export default WatchedListComponent;