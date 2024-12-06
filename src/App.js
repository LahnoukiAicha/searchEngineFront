import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div>
        {/* Routes */}
        <Routes>
          <Route path="/" element={<SearchBar />} />
          <Route path="/results" element={<SearchResults />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
