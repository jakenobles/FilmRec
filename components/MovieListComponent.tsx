import React from 'react';

interface MovieListComponentProps {
  onSubmit: (movieList: string[]) => void;
}

const MovieListComponent: React.FC<MovieListComponentProps> = ({ onSubmit }) => {
  const handleSubmit = () => {
    // Implement movie list submission logic
    const movieList = ["Movie 1", "Movie 2"]; // Replace with actual list
    onSubmit(movieList);
  };

  return (
    <div className="p-4">
      <p>Enter movies you like:</p>
      {/* Add input field for movie list */}
      <button onClick={handleSubmit}>Submit List</button>
    </div>
  );
};

export default MovieListComponent;
