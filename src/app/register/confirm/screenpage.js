
import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import withAuth from '../../components/withAuth';

function ManageMovies() {
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({ title: '', description: '' });


  useEffect(() => {
    fetch('/api/movies')
      .then((response) => response.json())
      .then((data) => setMovies(data));
  }, []);

  
  const handleAddMovie = () => {
    fetch('/api/movies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMovie),
    })
      .then((response) => response.json())
      .then((movie) => setMovies([...movies, movie]));
  };

  // Delete a movie
  const handleDeleteMovie = (id) => {
    fetch(`/api/movies/${id}`, { method: 'DELETE' })
      .then(() => setMovies(movies.filter((movie) => movie._id !== id)));
  };

  return (
    <AdminLayout>
      <h1>Manage Movies</h1>

      {/* Add Movie */}
      <div>
        <h2>Add New Movie</h2>
        <input
          type="text"
          placeholder="Movie Title"
          value={newMovie.title}
          onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Movie Description"
          value={newMovie.description}
          onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
        />
        <button onClick={handleAddMovie}>Add Movie</button>
      </div>

      {/* Movie List */}
      <h2>Current Movies</h2>
      <ul>
        {movies.map((movie) => (
          <li key={movie._id}>
            <strong>{movie.title}</strong>: {movie.description}
            <button onClick={() => handleDeleteMovie(movie._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </AdminLayout>
  );
}

export default withAuth(ManageMovies);