"use client"; // This is a client component
import React, { useState } from 'react';
import LoginComponent from '../components/LoginComponent';
import QuestionnaireComponent from '../components/QuestionnaireComponent';
import MovieListComponent from '../components/MovieListComponent';
import RecommendationComponent from '../components/RecommendationComponent';


const Home: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState<boolean>(false);
  const [movieList, setMovieList] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState<string | null>(null);

  return (
    <div className="container mx-auto min-h-screen">
      {!isLoggedIn ? (
        <LoginComponent onLoginSuccess={() => setIsLoggedIn(true)} />
      ) : !showQuestionnaire ? (
        <QuestionnaireComponent onComplete={() => setShowQuestionnaire(true)} />
      ) : !recommendation ? (
        <MovieListComponent onSubmit={(list) => { setMovieList(list); setRecommendation('Your Movie'); }} />
      ) : (
        <RecommendationComponent recommendation={recommendation} />
      )}
    </div>
  );
};

export default Home;