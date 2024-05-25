import React, { useState, useEffect } from 'react';
import { searchFlights, getAmadeusToken } from '../api/amadeus';
import './FlightSearch.css';

const FlightSearch = ({ onSelectOffer }) => {
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [flights, setFlights] = useState([]);
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

  const handleSearch = async () => {
    if (!token) return;
    try {
      const data = await searchFlights(departure, arrival, departureDate, adults, children, infants, token);
      setFlights(data.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch flights');
    }
  };

  const handleSelectOffer = (offer) => {
    onSelectOffer(offer);
  };

  return (
    <div className="flight-search-container">
      <div className="container">
        <h2 className="flight-booking-heading">Flight Booking</h2>
        <div className="input-container">
          <label>Departure</label>
          <input
            type="text"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            placeholder="Departure"
          />
          <label>Arrival</label>
          <input
            type="text"
            value={arrival}
            onChange={(e) => setArrival(e.target.value)}
            placeholder="Arrival"
          />
          <label>Departure Date</label>
          <input
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
          />
          <label>Adults</label>
          <input
            type="number"
            value={adults}
            onChange={(e) => setAdults(e.target.value)}
            placeholder="Adults"
          />
          <label>Children</label>
          <input
            type="number"
            value={children}
            onChange={(e) => setChildren(e.target.value)}
            placeholder="Children"
          />
          <label>Infants</label>
          <input
            type="number"
            value={infants}
            onChange={(e) => setInfants(e.target.value)}
            placeholder="Infants"
          />
          <button onClick={handleSearch}>Search Flights</button>
        </div>
        {error && <div className="error">Error: {error}</div>}
        {flights.length > 0 && (
          <div className="table-container">
            <table className="flight-table">
              <thead>
                <tr>
                  <th>Departure</th>
                  <th>Arrival</th>
                  <th>Departure Time</th>
                  <th>Arrival Time</th>
                  <th>Select</th>
                </tr>
              </thead>
              <tbody>
                {flights.map((flight, index) => (
                  <tr key={index}>
                    <td>{flight.itineraries[0].segments[0].departure.iataCode}</td>
                    <td>{arrival}</td>
                    <td>{new Date(flight.itineraries[0].segments[0].departure.at).toLocaleString()}</td>
                    <td>{new Date(flight.itineraries[0].segments[0].arrival.at).toLocaleString()}</td>
                    <td><button onClick={() => handleSelectOffer(flight)}>Select Offer</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightSearch;
