import React from 'react';
import {Image} from "@nextui-org/image";
import {Card, CardBody, CardHeader} from "@nextui-org/react";
import NextImage from "next/image";
import {Input} from "@nextui-org/react";
import {Button} from "@nextui-org/react";

interface LoginComponentProps {
  onLoginSuccess: () => void;
}

const LoginComponent: React.FC<LoginComponentProps> = ({ onLoginSuccess }) => {
  const handleLogin = () => {
    // Implement login logic
    onLoginSuccess();
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8'>
      <div className='flex flex-col justify-center items-center mb-10 relative z-10'>
        <Image
          width={600}
          src="/static/images/bannerfr.png"
          alt="FilmRec Logo"
          radius='none'
        />
        <p className='mt-2 text-xl font-sans text-center'>Let me choose for you!</p>
      </div>
      <div className='flex flex-col items-center justify-center w-full max-w-md relative z-20 font-sans'>
        <Card className='w-full'>
          <CardHeader>Login / Register</CardHeader>
          <CardBody>
            <Input className="mb-2" type="email" label="Email" placeholder="Enter your email" />
            <Input className="mb-2" type="password" label="Password" placeholder="Enter your password" />
            <Button onClick={handleLogin} color='primary' variant='bordered'>Login</Button>       
          </CardBody>
        </Card>
      </div>
  </div>
  );
};

export default LoginComponent;
