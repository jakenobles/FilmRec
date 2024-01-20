import React from 'react';
import {Card, CardBody, CardHeader} from "@nextui-org/react";
import {Input} from "@nextui-org/react";
import {Image} from "@nextui-org/image";
import {Button} from "@nextui-org/button"
interface MovieListComponentProps {
  onSubmit: (movieList: string[]) => void;
}

const MovieListComponent: React.FC<MovieListComponentProps> = ({ onSubmit }) => {
  const handleSubmit = () => {
    // Implement movie list submission logic
    const movieList = ["Movie 1", "Movie 2"]; // Replace with actual list
    onSubmit(movieList);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 font-sans">
      <nav className="w-full flex justify-center items-center">
				<img src="/static/images/logo.png" alt="Logo" className="h-10 md:h-12" />
			</nav>
      <h1 className='text-3xl mb-5 text-center'>Enter your favorite movies!</h1>
      <Card className='w-full sm:w-2/3 md:w-1/2 lg:w-1/3 scrollbar-hide'>
        <CardHeader className='items-center justify-center flex flex-col'>
          <h1 className='text-l mb-2'>Minimum five movies.</h1>
          <Input placeholder='Enter a movie title'></Input>
        </CardHeader>
        <CardBody className='scrollbar-hide'>
          <div className='flex flex-row mb-2'>
            <div className='flex-shrink-0'>
              <Image
                width={75}
                src="/static/images/medium-cover.jpg"
                alt="Movie Poster"
              />
            </div>
            <div className='flex-grow flex flex-col justify-center items-center text-center'>
              <h1 className='font-bold text-lg'>Interstellar</h1>
              <p className='italic text-base'>2014</p>
            </div>
          </div>
          <div className='flex flex-row mb-2'>
            <div className='flex-shrink-0'>
              <Image
                width={75}
                src="/static/images/medium-cover.jpg"
                alt="Movie Poster"
              />
            </div>
            <div className='flex-grow flex flex-col justify-center items-center text-center'>
              <h1 className='font-bold text-lg'>Interstellar</h1>
              <p className='italic text-base'>2014</p>
            </div>
          </div>
          <div className='flex flex-row mb-2'>
            <div className='flex-shrink-0'>
              <Image
                width={75}
                src="/static/images/medium-cover.jpg"
                alt="Movie Poster"
              />
            </div>
            <div className='flex-grow flex flex-col justify-center items-center text-center'>
              <h1 className='font-bold text-lg'>Interstellar</h1>
              <p className='italic text-base'>2014</p>
            </div>
          </div>
          <div className='flex flex-row mb-2'>
            <div className='flex-shrink-0'>
              <Image
                width={75}
                src="/static/images/medium-cover.jpg"
                alt="Movie Poster"
              />
            </div>
            <div className='flex-grow flex flex-col justify-center items-center text-center'>
              <h1 className='font-bold text-lg'>Interstellar</h1>
              <p className='italic text-base'>2014</p>
            </div>
          </div>
          <div className='flex flex-row mb-2'>
            <div className='flex-shrink-0'>
              <Image
                width={75}
                src="/static/images/medium-cover.jpg"
                alt="Movie Poster"
              />
            </div>
            <div className='flex-grow flex flex-col justify-center items-center text-center'>
              <h1 className='font-bold text-lg'>Interstellar</h1>
              <p className='italic text-base'>2014</p>
            </div>
          </div>
        </CardBody>

      </Card>
      <Button onClick={handleSubmit} color='primary' variant='bordered' className='mt-4'>Submit</Button>
    </div>
  );
};

export default MovieListComponent;
