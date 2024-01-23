"use client"; // This is a client component
import React, { useState, useEffect } from 'react';
import LoginComponent from '../components/LoginComponent';
import QuestionnaireComponent from '../components/QuestionnaireComponent';
import MovieListComponent from '../components/MovieListComponent';
import RecommendationComponent from '../components/RecommendationComponent';
import LoadingComponent from '../components/LoadingComponent';


//Main Function
const Home: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [movieList, setMovieList] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState<string | null>(null);

  //Checks if there is a valid session ID on load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/check-session', {
          method: 'GET',
          credentials: 'include', // Necessary for cookies
        });

        if (response.ok) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Session check failed:', error);
      }
    };

    checkSession();
  }, []);

  //Submits the movie list to Flask to then create a recommendation
  const handleMovieListSubmit = async (list) => {
    setMovieList(list);
    setIsLoading(true);
  
    const url = 'http://127.0.0.1:5000/api/recommendation'; 
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username : username
        }),
      });
      const recommendationData = await response.json();
      setRecommendation(recommendationData);
    } catch (error) {
      console.error('Error:', error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  //Handles the session if user logs out
  const handleLogout = () => {
    setIsLoggedIn(false)
  };


  return (
    <div className="container mx-auto min-h-screen">
      {isLoading ? (
        <LoadingComponent username={username} />
      ) : isLoggedIn ? (
        <>
          {showQuestionnaire ? (
            !recommendation ? (
              <MovieListComponent onSubmit={handleMovieListSubmit} setShowQuestionnaire={setShowQuestionnaire} username={username} />
            ) : (
              <RecommendationComponent recommendation={recommendation} />
            )
          ) : (
            <QuestionnaireComponent onComplete={() => setShowQuestionnaire(true)} username={username} />
          )}
        </>
      ) : (
        <LoginComponent onLoginSuccess={() => setIsLoggedIn(true)} setGlobalUsername={setUsername} />
      )}
    </div>
  );
};

export default Home;