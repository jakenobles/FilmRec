import React, { useState, useEffect } from 'react';
import {Card, CardBody, CardHeader} from "@nextui-org/react";
import {Input} from "@nextui-org/react";
import {Image} from "@nextui-org/image";
import {Button} from "@nextui-org/button"
import { Spinner } from "@nextui-org/react"


interface MovieListComponentProps {
  onSubmit: (username: string) => void;
  setShowQuestionnaire: (show: string) => void;
  username: string;
}

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  // Add any other necessary properties
}

//Limits the amount of calls to API
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let inDebounce: ReturnType<typeof setTimeout> | null;
  return function(this: any, ...args: any[]) {
    if (inDebounce) clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(this, args), delay);
  };
};

const MovieListComponent: React.FC<MovieListComponentProps> = ({ onSubmit, setShowQuestionnaire, username }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const apiKey = process.env.NEXT_PUBLIC_REACT_APP_TMDB_API_KEY;

  //Calls API
  const searchMovies = async (term: string) => {
    if (!term) {
      setSearchResults([]);
      return;
    }
  
    try {
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(term)}`);
  
      const data = await response.json();

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status} ${response.statusText}`);
      }
  
      setSearchResults(data.results.slice(0, 3));
    } catch (error: any) {
      console.error("Error searching for movies:", error.message);
      setSearchResults([]);
    }
  };

  const debouncedSearchMovies = debounce(searchMovies, 300); // 300ms delay

  useEffect(() => {
    debouncedSearchMovies(searchTerm);
  }, [searchTerm]);

  //Triggers when text in search bar changes
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  const handleSubmit = () => {
    // Implement movie list submission logic
    onSubmit(username);
  };

  const addMovieToList = (movie: Movie) => {
    // Check if the movie is already in the list
    if (!selectedMovies.find((m) => m.id === movie.id)) {
      setSelectedMovies([...selectedMovies, movie]);
    } else {
      console.log('Movie already added');
    }
  };

  const removeMovieFromList = (movieId: number) => {
    setSelectedMovies(selectedMovies.filter(movie => movie.id !== movieId));
  };

  //Sends user's favorite movies to my database
  const submitMovies = async () => {
    try {
      for (const movie of selectedMovies) {
        const response = await fetch('https://filmrecapi.midnight-prophet.com/api/store/watched', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: 
          JSON.stringify({username : username, movie : movie, favorite : 1}),
        });

        if (!response.ok) {
          throw new Error(`https error! status: ${response.status}`);
        }
      }

      console.log("All movies submitted successfully");
      handleSubmit()
    } catch (error: any) {
      setError(typeof error === 'string' ? error : error.message);
      console.error("Error submitting movies: ", error);
      // Optionally handle the error, e.g., showing an error message
    }
  };

  useEffect(() => {
    const fetchUserWatched = async () => {
      try {
        const response = await fetch(`https://filmrecapi.midnight-prophet.com//api/fetch/watched`, {
          method: 'GET',
          credentials: 'include', // Necessary for cookies
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (!response.ok) {
          const errorMessage = data.error || `Error: ${response.status} ${response.statusText}`;
          setError(errorMessage);
          throw new Error(`Error: ${response.status}`);
        }

        setSelectedMovies(data)

      } catch (error: any) {
        console.error('Error fetching user watched:', error);
        setError(typeof error === 'string' ? error : error.message);
      } finally {
        setIsLoading(false); // Finish loading
      }
    };

    fetchUserWatched();
  }, []);

  // Handler for "Go Back" button click
  const handleBack = () => {
    // Call the callback function to set setShowQuestionaire to true
    setShowQuestionnaire('questionnaire');
  };

  const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => {
    return (
      <div className="flex flex-col items-center justify-center w-full hover:bg-gray-800 p-2 rounded cursor-pointer" onClick={() => removeMovieFromList(movie.id)}>
        <Image
                width={100}
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
        <h3 className="mt-2">{movie.title}</h3>
      </div>
    );
  };

  const MovieGrid: React.FC<{ movies: Movie[] }> = ({ movies }) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto max-h-[750px] p-4">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    );
  };


  //Loads until user's movies load from database
  if (isLoading) {
    return  (
            <div className='min-h-screen flex flex-col items-center justify-center font-sans px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 scrollbar-hide'>
              <nav className="w-full flex justify-center items-center">
                <img src="/static/images/logo.png" alt="Logo" className="h-10 md:h-12" />
              </nav>
              <h1 className='text-3xl mb-4 text-center'>Hi {username}!</h1>
              <p className='text-xl mb-4 text-center'>Please wait while we load your watched list!</p>
              <Spinner size="lg" />
            </div>
            )
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 font-sans">
      <nav className="w-full flex justify-center items-center">
				<img src="/static/images/logo.png" alt="Logo" className="h-10 md:h-12" />
			</nav>
      <h1 className='text-3xl mb-5 text-center'>Enter your liked movies!</h1>

      <Card className='w-full sm:w-2/3 md:w-1/2 lg:w-1/3 scrollbar-hide mb-4'>
        <CardHeader className='items-center justify-center flex flex-col'>
          <h1 className='text-l mb-2'>Minimum five movies.</h1>
          <Input placeholder='Search a movie title' value={searchTerm} onChange={handleSearchChange} />
        </CardHeader>
        <CardBody className='scrollbar-hide'>
          {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
          )}
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
          <CardBody className='max-h-[375px] overflow-y-auto'>
            <MovieGrid movies={selectedMovies} />
          </CardBody>
        </CardHeader>
      </Card>
      
      <Button onClick={submitMovies} color='primary' variant='bordered' className='mt-4'>Recommend a Movie!</Button>
      <Button onClick={handleBack} color='primary' variant='bordered' className='mt-4'>Go Back</Button>
    </div>
  );
};

export default MovieListComponent;