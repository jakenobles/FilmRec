import React, { useState, useEffect } from 'react';
import {Card, CardBody, CardHeader} from "@nextui-org/react";
import {Input} from "@nextui-org/react";
import {Image} from "@nextui-org/image";
import {Button} from "@nextui-org/button"


interface MovieListComponentProps {
  onSubmit: (movieList: string[]) => void;
  setShowQuestionnaire: (show: boolean) => void;
  username: string;
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

const MovieListComponent: React.FC<MovieListComponentProps> = ({ onSubmit, setShowQuestionnaire, username }) => {
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
    if (selectedMovies.length < 5 && !selectedMovies.find((m) => m.id === movie.id)) {
      setSelectedMovies([...selectedMovies, movie]);
    } else if (selectedMovies.length >= 5) {
      console.log('Maximum of 5 movies reached');
    } else {
      console.log('Movie already added');
    }
  };

  const removeMovieFromList = (movieId) => {
    setSelectedMovies(selectedMovies.filter(movie => movie.id !== movieId));
  };

  //Sends user's favorite movies to my database
  const submitMovies = async () => {
    try {
      for (const movie of selectedMovies) {
        const response = await fetch('http://127.0.0.1:5000/api/store/watched', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: 
          JSON.stringify({username : username, movie : movie, favorite : 1}),
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

  // Handler for "Go Back" button click
  const handleBack = () => {
    // Call the callback function to set setShowQuestionaire to true
    setShowQuestionnaire(false);
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
      
      <Card className='w-full sm:w-2/3 md:w-1/2 lg:w-1/3 scrollbar-hide'>
        <CardHeader className='items-center justify-center flex flex-col'>
          <h1 className='text-2xl mb-2'>Your List</h1>
          <p className='text-base mb-2'>Click on a movie to remove it.</p>
        </CardHeader>
        <CardBody className='scrollbar-hide'>
          {selectedMovies.map(movie => (
            <div key={movie.id} className='flex flex-row mb-2 hover:bg-gray-800 p-2 rounded cursor-pointer' onClick={() => removeMovieFromList(movie.id)}>
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
      <Button onClick={submitMovies} color='primary' variant='bordered' className='mt-4'>Recommend a Movie!</Button>
      <Button onClick={handleBack} color='primary' variant='bordered' className='mt-4'>Go Back</Button>
    </div>
  );
};

export default MovieListComponent;
