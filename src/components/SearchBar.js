import React, { useState } from 'react';
import './SearchBar.css';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions] = useState([
    'Search for education',
    'Web development courses',
    'Learn React',
    'Python tutorials',
    'AI for beginners',
    'Free online courses'
  ]);
  const navigate = useNavigate();

  // Fonction pour gérer la recherche
  const handleSearch = async () => {
    if (query.trim()) {
      try {
        const youtubeApiKey = 'AIzaSyCJsY2i6l0-nYeaNNMCq2ubdhmCSMjQqic'; // Remplacez par votre vraie clé API
        const response = await fetch(`http://localhost:5000/search?query=${encodeURIComponent(query)}&youtube_api_key=${youtubeApiKey}`);
        const data = await response.json();

        console.log('Search results:', data);

        // Naviguer vers la page des résultats
        navigate(`/results?query=${encodeURIComponent(query)}`, { state: { searchResults: data } });
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    }
  };

  // Fonction pour remplir le champ de recherche avec la suggestion
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
  };

  return (
    <div className="search-container">
      <h1 className="main-title">What are you looking for?</h1>
      
      {/* Requêtes prédéfinies */}
      <div className="predefined-queries">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="predefined-query-btn"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>
      
      {/* Barre de recherche */}
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
          placeholder="Search for education"
        />
        <button onClick={handleSearch} className="search-button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
