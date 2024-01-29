import React from 'react';
import { Spinner } from "@nextui-org/react";

interface LoadingComponentProps {
  username: string;
}

const LoadingComponent: React.FC<LoadingComponentProps> = ({ username }) => {

  return (
    <div className='min-h-screen flex flex-col items-center justify-center text-centerfont-sans px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 scrollbar-hide'>
      <nav className="w-full flex justify-center items-center">
        <img src="/static/images/logo.png" alt="Logo" className="h-10 md:h-12" />
      </nav>
      <h1 className='text-3xl mb-4 text-center'>Hi {username}!</h1>
      <p className='text-xl mb-4 text-center'>Please wait while we load your recommendation!</p>
      <Spinner size="lg" />
    </div>
  );
};

export default LoadingComponent;