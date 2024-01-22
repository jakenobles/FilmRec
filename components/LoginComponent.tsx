import React, { useState } from 'react';
import {Image} from "@nextui-org/image";
import {Card, CardBody, CardHeader} from "@nextui-org/react";
import {Input} from "@nextui-org/react";
import {Button} from "@nextui-org/react";

interface LoginComponentProps {
  onLoginSuccess: () => void;
}

//Logs in the user and retrieves cookies for sessions.
const LoginComponent: React.FC<LoginComponentProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true); // Toggle between login and registration
  const [error, setError] = useState('');

  const handleAuth = async () => {
    const apiUrl = isLoginMode 
      ? 'http://127.0.0.1:5000/api/login' 
      : 'http://127.0.0.1:5000/api/register';
    
    setError(''); // Reset error message

    //Posting to my API and retrieving cookies throught the credentials attribute
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      onLoginSuccess();
    } catch (error) {
      setError(error.message);
    }
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
          <CardHeader>{isLoginMode ? 'Login' : 'Register'}</CardHeader>
          <CardBody>
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            <Input
              className="mb-2"
              type="username"
              label="Username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              className="mb-2"
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handleAuth} color='primary' variant='bordered'>
              {isLoginMode ? 'Login' : 'Register'}
            </Button>
            <Button
              color='secondary'
              variant='flat'
              onClick={() => setIsLoginMode(!isLoginMode)}
              className='mt-2'
            >
              Switch to {isLoginMode ? 'Register' : 'Login'}
            </Button>        
          </CardBody>
        </Card>
      </div>
  </div>
  );
};

export default LoginComponent;
