import React, { useState, useEffect } from 'react';
import {Image} from "@nextui-org/image";
import {Card, CardBody, CardHeader} from "@nextui-org/react";
import NextImage from "next/image";
import {Button} from "@nextui-org/button"

interface RecommendationComponentProps {
  recommendation: string;
  username: string;
}

const RecommendationComponent: React.FC<RecommendationComponentProps> = ({ recommendation, username }) => {
    const [recommendedMovie, setRecommendedMovie] = useState<any>(null); // State to store recommended movie data
  
    useEffect(() => {
      // Create a request body object with the username
      const requestBody = {
        username: username,
      };
  
      // Make a POST request to your API to fetch the recommended movie data with the username
      fetch('http://127.0.0.1:5000/api/recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
        .then(response => response.json())
        .then(data => setRecommendedMovie(data))
        .catch(error => console.error('Error fetching recommended movie:', error));
    }, [username]);
  
    return (
      <section className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 font-sans">
        <nav className="w-full flex justify-center items-center">
          <img src="/static/images/logo.png" alt="Logo" className="h-10 md:h-12 mb-2" />
        </nav>
        <div className="flex flex-col items-center justify-content-center">
          {recommendedMovie && (
            <>
              <Image
                as={NextImage}
                width={300}
                height={200}
                src={recommendedMovie.posterUrl} // Replace with the URL of the recommended movie's poster image
                alt={recommendedMovie.title}
              />
              <h1 className="text-center mt-2 mb-2 text-2xl">
                <strong>{recommendedMovie.title}</strong> ({recommendedMovie.releaseYear})
              </h1>
              <Card className="mt-2">
                <CardBody>
                  <p className="text-center italic">{recommendedMovie.reason}</p>
                </CardBody>
              </Card>
              <Card className="mt-2 mb-0 max-w-prose">
                <CardHeader className="font-bold">
                  <h1>Description</h1>
                </CardHeader>
                <CardBody>
                  <p className="">{recommendedMovie.description}</p>
                </CardBody>
              </Card>
            </>
          )}
          <div className='flex flex-row justify-center items-center'>
            <Button color='primary' variant='bordered' className='mt-4 mr-2'>Add to Watched</Button>
            <Button color='primary' variant='bordered' className='mt-4 ml-2'>Reroll</Button>
          </div>
          <div className='flex flex-row justify-center items-center'>
            <Button color='primary' variant='bordered' className='mt-4 mr-2'>Edit Preferences</Button>
            <Button color='primary' variant='bordered' className='mt-4 ml-2'>Edit Watched List</Button>
            <Button color='primary' variant='bordered' className='mt-4 ml-2'>Edit Favorites</Button>
          </div>
        </div>
      </section>
    );
  };
  
  export default RecommendationComponent;
