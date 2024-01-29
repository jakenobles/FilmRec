import React, { useState } from 'react';
import {Image} from "@nextui-org/image";
import {Card, CardBody, CardHeader} from "@nextui-org/react";
import {Button} from "@nextui-org/button"

interface RecommendationComponentProps {
  recommendation: {
    title: string;
    year: number;
    id: number;
    reason: string;
    poster_path: string; // Add this line
    overview: string; // Add this line
  };

  onEditPreferences: () => void;
  onAlreadyWatched: () => void;
  onLogout: () => void;
}

const RecommendationComponent: React.FC<RecommendationComponentProps> = ({ recommendation, onEditPreferences, onAlreadyWatched, onLogout }) => {
  const [error, setError] = useState('');

  //Sends user's favorite movies to my database
  const watched_already = async () => {
    try {
      const response = await fetch('https://filmrecapi.midnight-prophet.com/api/store/singlewatched', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 
        JSON.stringify({ movie : recommendation, favorite : 1}),
      });

      if (!response.ok) {
        throw new Error(`https error! status: ${response.status}`);
      }

      console.log("All movies submitted successfully");
    } catch (error: any) {
      console.error("Error submitting movies: ", error);
      setError(typeof error === 'string' ? error : error.message);
    } finally {
      onAlreadyWatched();
    }
  };

  //Sends user's favorite movies to my database
  const do_not_recommend = async () => {
    try {
      const response = await fetch('https://filmrecapi.midnight-prophet.com/api/store/dnr', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 
        JSON.stringify({ movie : recommendation }),
      });

      if (!response.ok) {
        throw new Error(`https error! status: ${response.status}`);
      }

      console.log("All movies submitted successfully");
    } catch (error: any) {
      setError(typeof error === 'string' ? error : error.message);
      console.error("Error submitting movies: ", error);
    } finally {
      onAlreadyWatched();
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('https://filmrecapi.midnight-prophet.com/logout', {
        method: 'POST',
        credentials: 'include', // Ensure cookies are sent with the request if using session-based authentication
      });

      if (!response.ok) {
        throw new Error(`Logout failed with status: ${response.status}`);
      }

      console.log("Logout successful");

      onLogout();

    } catch (error: any) {
      setError(typeof error === 'string' ? error : error.message);
      console.error("Error during logout: ", error);
    }
  };


  
    return (
      <div className="flex flex-col items-center justify-center px-2 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 font-sans">
        <nav className="w-full flex justify-center items-center">
        <img src="/static/images/logo.png" alt="Logo" className="h-10 md:h-12 mb-2" />
      </nav>
        {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
        )} 
        {recommendation && (
          <>
            <Image
              width={300}
              src={`https://image.tmdb.org/t/p/w500${recommendation.poster_path}`}
              alt={recommendation.title}
              className=''
            />
            <h1 className="text-center mt-2 mb-2 text-2xl">
              <strong>{recommendation.title}</strong> ({recommendation.year})
            </h1>
            <div className=''>
              <Card className="mt-2">
                <CardBody className='max-w-prose'>
                  <p className="text-center italic">{recommendation.reason}</p>
                </CardBody>
              </Card>
            </div>
            <div className=''>
              <Card className="mt-2 mb-0 max-w-prose">
                <CardHeader className="font-bold">
                  <h1>Description</h1>
                </CardHeader>
                <CardBody>
                  <p className="">{recommendation.overview}</p>
                </CardBody>
              </Card>
            </div>
          </>
        )}
        <div className='px-4'>
          <div className='flex flex-row justify-center items-center space-x-1'>
            <div className='flex-1'>
              <Button onClick={watched_already} color='primary' variant='bordered' className='mt-4 mr-1 w-full sm:w-32'>I&apos;ve seen this!</Button>
            </div>
            <div className='flex-1'>
              <Button onClick={do_not_recommend} color='primary' variant='bordered' className='mt-4 mr-1 w-full sm:w-32'>Don&apos;t Recommend</Button>
            </div>
          </div>
          <div className='flex flex-row justify-center items-center'>
            <Button onClick={onEditPreferences} color='primary' variant='bordered' className='mt-4'>Edit Preferences and Watched List</Button>
          </div>
          <div className='flex flex-row justify-center items-center'>
            <Button onClick={handleLogout} color='danger' variant='bordered' className='mt-4'>Logout</Button>
          </div>
        </div>
      </div>
    );
  };
  
  export default RecommendationComponent;