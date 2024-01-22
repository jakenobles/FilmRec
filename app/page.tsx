"use client"; // This is a client component
import React, { useState, useEffect } from 'react';
import LoginComponent from '../components/LoginComponent';
import QuestionnaireComponent from '../components/QuestionnaireComponent';
import MovieListComponent from '../components/MovieListComponent';
import RecommendationComponent from '../components/RecommendationComponent';
import {Button} from "@nextui-org/button"


const Home: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState<boolean>(false);
  const [movieList, setMovieList] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState<string | null>(null);

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

  const handleLogout = () => {
    setIsLoggedIn(false)
  };


  return (
    <div className="container mx-auto min-h-screen">
            {isLoggedIn ? (
        <>
          {showQuestionnaire ? (
            !recommendation ? (
              <MovieListComponent onSubmit={(list) => { setMovieList(list); setRecommendation('Your Movie'); setShowQuestionnaire(true); }} setShowQuestionnaire={setShowQuestionnaire} />
            ) : (
              <RecommendationComponent recommendation={recommendation} />
            )
          ) : (
            <QuestionnaireComponent onComplete={() => setShowQuestionnaire(true)} />
          )}
        </>
      ) : (
        <LoginComponent onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
};

export default Home;