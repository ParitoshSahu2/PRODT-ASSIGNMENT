import React, { useState, useEffect } from 'react';
import { searchCity, getAmadeusToken } from '../api/amadeus';
import './CitySearch.css';


const CitySearch = () => {
  const [keyword, setKeyword] = useState('');
  const [cities, setCities] = useState([]);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  useEffect(() =>
     {
    const getAccessToken = async () => {
      try {
        const token = await getAmadeusToken();
        setToken(token);
      } catch (error) {
        setError(error.message);
      }
    };

    getAccessToken();
  }, []);

  const handleSearch = async () => {
    if (!token) return;
    const data = await searchCity(keyword, token);
    setCities(data.data);
  };

  return (
    <div>
      <input 
        type="text" 
        value={keyword} 
        onChange={(e) => setKeyword(e.target.value)} 
        placeholder="Enter city or airport"
      />
      <button onClick={handleSearch}>Search</button>
      {error && <p>Error: {error}</p>}
      <ul>
        {cities.map(city => (
          <li key={city.id}>{city.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default CitySearch;
