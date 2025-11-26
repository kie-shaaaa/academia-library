import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.css';
import SearchSection from './components/SearchSection';

function App() {
  const [showFeatured, setShowFeatured] = useState(true);

  const handleSearch = () => {
    setShowFeatured(false);
  };

  const handleShowFeatured = () => {
    setShowFeatured(true);
  };

  const handleHomeClick = () => {
    setShowFeatured(true); // Show featured books
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
  };

  return (
    <>
      <div>
        <Navbar 
          brandName='Academia Library' 
          onHomeClick={handleHomeClick} 
        />
      </div>
      <div>
        <h1 className="text-center mt-5 mb-2 fw-bolder header-title" style={{color: '#800020'}}>Welcome to Academia Library</h1>
        <h6 className="text-center" style={{color:'#4B352A'}}>Discover your next literary adventure</h6>
        
        <SearchSection onSearch={handleSearch} onShowFeatured={handleShowFeatured} showFeatured={showFeatured} />
      </div>
    </>
  )
}

export default App