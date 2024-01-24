import React, { useState, useEffect } from 'react';
import {Image} from "@nextui-org/image";
import {Card, CardBody, CardHeader} from "@nextui-org/react";
import NextImage from "next/image";
import {Button} from "@nextui-org/button"

interface RecommendationComponentProps {
  recommendation: {
    title: string;
    year: number;
    id: number;
    reason: string;
    // Add other properties if necessary
  };
}

const RecommendationComponent: React.FC<RecommendationComponentProps> = ({ recommendation }) => {
  
    return (
      <section className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 font-sans">
        <nav className="w-full flex justify-center items-center">
          <img src="/static/images/logo.png" alt="Logo" className="h-10 md:h-12 mb-2" />
        </nav>
        <div className="flex flex-col items-center justify-content-center px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
          {recommendation && (
            <>
              <Image
                width={300}
                src={`https://image.tmdb.org/t/p/w500${recommendation.poster_path}`}
                alt={recommendation.title}
              />
              <h1 className="text-center mt-2 mb-2 text-2xl">
                <strong>{recommendation.title}</strong> ({recommendation.year})
              </h1>
              <Card className="mt-2">
                <CardBody className='max-w-prose'>
                  <p className="text-center italic">{recommendation.reason}</p>
                </CardBody>
              </Card>
              <Card className="mt-2 mb-0 max-w-prose">
                <CardHeader className="font-bold">
                  <h1>Description</h1>
                </CardHeader>
                <CardBody>
                  <p className="">{recommendation.overview}</p>
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
          </div>
        </div>
      </section>
    );
  };
  
  export default RecommendationComponent;
