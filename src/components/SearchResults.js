import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SearchResults.css';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [query, setQuery] = useState(location.state?.query || ''); // Initial search terms
  const [searchTerm, setSearchTerm] = useState(''); // Current search terms for a new search

  // Function to handle a new search submission
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      try {
        const youtubeApiKey = 'AIzaSyCJsY2i6l0-nYeaNNMCq2ubdhmCSMjQqic'; // Use .env in production
        const response = await fetch(
          `http://localhost:5000/search?query=${encodeURIComponent(searchTerm)}&youtube_api_key=${youtubeApiKey}`
        );
        const data = await response.json();
        navigate('/results', { state: { query: searchTerm, searchResults: data } });
      } catch (error) {
        console.error('Error fetching search results:', error);
        setResults({ error: 'Failed to fetch search results. Please try again.' });
      }
    }
  };

  // Retrieve search results from the previous page or handle missing results
  useEffect(() => {
    const searchResults = location.state?.searchResults;
    if (searchResults) {
      setResults(searchResults);
    } else {
      navigate('/'); // Redirect to home if results are absent
    }
  }, [location.state, navigate]);

  // Show a loading spinner if results are not yet available
  if (!results) {
    return (
      <div className="loading-container">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  // Show an error message if results failed to load
  if (results.error) {
    return (
      <div className="error-message">
        <span className="error-icon">⚠️</span>
        {results.error}
      </div>
    );
  }

  return (
    <div className="search-results-container">
      {/* Search bar for a new search */}
      <div className="search-bar-container">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search again..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            aria-label="Search again"
          />
          <button type="submit" className="search-button" aria-label="Search">
            Search
          </button>
        </form>
      </div>

      <h2>{query ? `Search Results for: ${query}` : 'Search Results'}</h2>

      <div className="results-section">
        {/* PDF Results */}
        <div className="results-column">
          <h3>PDF Results</h3>
          <ul className="pdf-list">
            {results.pdfs?.length > 0 ? (
              results.pdfs.map((pdf, index) => (
                <li key={index} className="pdf-result-item">
                  <a href={pdf.link} target="_blank" rel="noopener noreferrer" className="pdf-link">
                    <span className="pdf-icon">📄</span>
                    {pdf.title} - {pdf.authors}
                  </a>
                </li>
              ))
            ) : (
              <p>No PDF results found.</p>
            )}
          </ul>
        </div>

        {/* Video Results */}
        <div className="results-column">
          <h3>Video Results</h3>
          <div className="video-grid">
            {results.videos?.length > 0 ? (
              results.videos.map((video, index) => (
                <div key={index} className="video-item">
                  <a href={video.link} target="_blank" rel="noopener noreferrer">
                    <img src={video.thumbnail} alt={video.title} className="video-thumbnail" />
                  </a>
                  <p>{video.title}</p>
                </div>
              ))
            ) : (
              <p>No video results found.</p>
            )}
          </div>
        </div>

        {/* Image Results */}
        <div className="results-column">
          <h3>Image Results</h3>
          <div className="image-grid">
            {Object.entries(results.image_keywords || {}).length > 0 ? (
              Object.entries(results.image_keywords).map(([fileName, data]) => (
                <div key={fileName} className="image-result">
                  <img
                    src={`http://localhost:5000${data.image_path}`}
                    alt={fileName}
                    className="result-image"
                  />
                </div>
              ))
            ) : (
              <p>No image results found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
