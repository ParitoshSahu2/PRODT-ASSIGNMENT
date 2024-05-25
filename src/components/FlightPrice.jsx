import React, { useState, useEffect } from 'react';
import { getFlightPrice, getAmadeusToken } from '../api/amadeus';
import './FlightPrice.css';

const FlightPrice = () => {
  const [flightOffers, setFlightOffers] = useState('');
  const [pricing, setPricing] = useState(null);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
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

  const handleGetPrice = async () => {
    if (!token) return;
    try {
      const offers = JSON.parse(flightOffers); 
      const data = await getFlightPrice(offers, token);
      setPricing(data);
      setError('');
    } catch (error) {
      setError('Failed to fetch flight prices');
    }
  };

  return (
    <div className="flight-price-container">
      <h2>Flight Price Checker</h2>
      <div className="form-container">
        <textarea 
          value={flightOffers} 
          onChange={(e) => setFlightOffers(e.target.value)} 
          placeholder="Enter flight offers JSON"
          className="flight-offers-input"
        />
        <button onClick={handleGetPrice} className="get-price-button">Get Flight Price</button>
      </div>
      {error && <p className="error-message">Error: {error}</p>}
      {pricing && (
        <div className="pricing-details">
          <h3>Flight Pricing:</h3>
          <pre>{JSON.stringify(pricing, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default FlightPrice;
