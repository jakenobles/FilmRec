import { Card, CardBody, CardHeader } from '@nextui-org/react';
import {CheckboxGroup, Checkbox} from "@nextui-org/react";
import {Button} from "@nextui-org/button"
import React from 'react';

interface QuestionnaireComponentProps {
  onComplete: () => void;
}

const QuestionnaireComponent: React.FC<QuestionnaireComponentProps> = ({ onComplete }) => {
  const handleSubmit = () => {
    // Handle form submission
    onComplete();
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center font-sans px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 scrollbar-hide'>
      <nav className="w-full flex justify-center items-center">
				<img src="/static/images/logo.png" alt="Logo" className="h-10 md:h-12" />
			</nav>
      <h1 className='text-3xl mb-4'>Fill out your profile!</h1>
      <div className='flex flex-col items-center w-full sm:w-3/4 md:w-1/2 scrollbar-hide'>
        <Card className='w-full sm:w-2/3 md:w-1/2 scrollbar-hide'>
          <CardBody className='scrollbar-hide'>
          <CheckboxGroup
            label="Tell me what you like!"
            defaultValue={[]}
          >
            <Checkbox value="action">Action</Checkbox>
            <Checkbox value="adventure">Adventure</Checkbox>
            <Checkbox value="animation">Animation</Checkbox>
            <Checkbox value="biography">Biography</Checkbox>
            <Checkbox value="comedy">Comedy</Checkbox>
            <Checkbox value="crime">Crime</Checkbox>
            <Checkbox value="documentary">Documentary</Checkbox>
            <Checkbox value="drama">Drama</Checkbox>
            <Checkbox value="fantasy">Fantasy</Checkbox>
            <Checkbox value="film_noir">Film Noir</Checkbox>
            <Checkbox value="history">History</Checkbox>
            <Checkbox value="horror">Horror</Checkbox>
            <Checkbox value="music">Music</Checkbox>
            <Checkbox value="musical">Musical</Checkbox>
            <Checkbox value="mystery">Mystery</Checkbox>
            <Checkbox value="romance">Romance</Checkbox>
            <Checkbox value="sci_fi">Sci-Fi</Checkbox>
            <Checkbox value="sport">Sport</Checkbox>
            <Checkbox value="thriller">Thriller</Checkbox>
            <Checkbox value="war">War</Checkbox>
            <Checkbox value="western">Western</Checkbox>
            <Checkbox value="foreign">Foreign</Checkbox>
          </CheckboxGroup>
          </CardBody>
        </Card>
        <Button onClick={handleSubmit} color='primary' variant='bordered' className='mt-4 w-1/3'>Submit</Button>
      </div>
    </div>
  );
};

export default QuestionnaireComponent;
