"use client"; // This is a client component
import React, { useState, useEffect, useCallback } from 'react';
import LoginComponent from '../components/LoginComponent';
import QuestionnaireComponent from '../components/QuestionnaireComponent';
import MovieListComponent from '../components/MovieListComponent';
import RecommendationComponent from '../components/RecommendationComponent';
import LoadingComponent from '../components/LoadingComponent';


//Main Function
const Home: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<string>('login');
  const [username, setUsername] = useState<string>('');
  const [recommendation, setRecommendation] = useState<string | any>(null);

  //Checks if there is a valid session ID on load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/check-session', {
          method: 'GET',
          credentials: 'include', // Necessary for cookies
        });

        if (response.ok) {
          const data = await response.json();
          setUsername(data.username)
          setIsLoggedIn(true)
          setCurrentStep('loading');
        }
      } catch (error) {
        console.error('Session check failed:', error);
      }
    };

    checkSession();
  }, []);

  
  const handleMovieListSubmit = async (userName: string) => {
    console.log(userName + " IN HANDLE ML");
  
    const url = 'http://127.0.0.1:5000/api/recommendation'; 
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userName
        }),
      });
      const recommendationData = await response.json();
      setRecommendation(recommendationData);
    } catch (error) {
      console.error('Error:', error);
      // Handle error appropriately
    } finally {
      setCurrentStep('recommendation');
    }
  };

  const handleRecommendButton = () => {
    setCurrentStep('loading')
  }

  //Triggers when currentstep is loading, starts recommendation
  useEffect(() => {
    if (currentStep === 'loading') {
      handleMovieListSubmit(username);
    }
    // This useEffect will trigger whenever currentStep changes to 'loading'
  }, [currentStep, username, handleMovieListSubmit]);

  //Handles questionnaire completion and goes to movie list
  const handleQuestionnaireComplete = () => {
    setCurrentStep('movielist')
  }

  const setShowQuestionnaire = (step: string) => {
    setCurrentStep(step);
  };

  const handleAlreadyWatched = () => {
    setCurrentStep('loading')
  };

  //Handles the session if user logs out
  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentStep('login')
  };

  const renderComponent = () => {
    switch (currentStep) {
      case 'login':
        return <LoginComponent onLoginSuccess={handleLogin} setGlobalUsername={setUsername}/>;
      case 'questionnaire':
        return <QuestionnaireComponent onComplete={handleQuestionnaireComplete} username={username}/>;
      case 'movielist':
        return <MovieListComponent onSubmit={handleRecommendButton} setShowQuestionnaire={setShowQuestionnaire} username={username} />
      case 'recommendation':
        return <RecommendationComponent recommendation={recommendation} onEditPreferences={handleEditPreferences} onAlreadyWatched={handleAlreadyWatched} onLogout={handleLogout}/>;
      case 'loading':
        return <LoadingComponent username={username} />;
      default:
        return <LoginComponent onLoginSuccess={handleLogin} setGlobalUsername={setUsername}/>;
    }
  };

  const handleLogin = (isNewUser: boolean) => {
    setIsLoggedIn(true);
    setIsNewUser(isNewUser)
    setCurrentStep(isNewUser ? 'questionnaire' : 'loading')
  };

  const handleEditPreferences = () => {
    setCurrentStep('questionnaire');
  };


  return (
    <div className="container mx-auto min-h-screen">
      {renderComponent()}
    </div>
  );
};

export default Home;