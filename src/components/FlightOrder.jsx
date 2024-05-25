import React, { useState, useEffect } from 'react';
import { createFlightOrder, getAmadeusToken } from '../api/amadeus';
import './FlightOrder.css';

const FlightOrder = ({ selectedOffer }) => {
  const [travelerInfo, setTravelerInfo] = useState({
    id: '1',
    dateOfBirth: '1990-01-01',
    gender: 'MALE',
    contact: {
      emailAddress: '',
      phones: [{ deviceType: 'MOBILE', countryCallingCode: '', number: '' }]
    },
    name: { firstName: '', lastName: '' }
  });
  const [order, setOrder] = useState(null);
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

  const handleCreateOrder = async () => {
    if (!token) return;
    try {
      const data = await createFlightOrder(selectedOffer, travelerInfo, token);
      console.log(data);
      setOrder(data);
      setError('');
    } catch (error) {
      setError('Failed to create flight order');
    }
  };

  const renderSelectedOfferDetails = (offer) => {
    if (!offer) return null;

    const { associatedRecords, flightOffers, travelers } = offer.data;
    const creationDate = associatedRecords[0].creationDate;
    const segment = flightOffers[0].itineraries[0].segments[0]; 
    const traveler = travelers[0];
    const { firstName, lastName } = traveler.name;
    const { emailAddress, phones } = traveler.contact;
    const phoneNumber = phones[0];

    const { grandTotal, billingCurrency } = flightOffers[0].price;
    const travelerPricings = flightOffers[0].travelerPricings;

    return (
      <div className="ticket">
        <div className="ticket-header">
          <h3>Flight Ticket</h3>
        </div>
        <div className="ticket-body">
          <div className="ticket-section">
            <h4>Passenger Information</h4>
            <p><strong>Name:</strong> {firstName} {lastName}</p>
            <p><strong>Email:</strong> {emailAddress}</p>
            <p><strong>Phone:</strong> {phoneNumber.countryCallingCode} {phoneNumber.number}</p>
            <p><strong>Creation Date:</strong> {new Date(creationDate).toLocaleString()}</p>
          </div>
          <div className="ticket-section">
            <h4>Flight Details</h4>
            <p><strong>Departure:</strong> {segment.departure.iataCode} at {new Date(segment.departure.at).toLocaleString()}</p>
            <p><strong>Arrival:</strong> {segment.arrival.iataCode} at {new Date(segment.arrival.at).toLocaleString()}</p>
            <p><strong>Carrier Code:</strong> {segment.carrierCode}</p>
            <p><strong>Flight Number:</strong> {segment.number}</p>
            <p><strong>Aircraft:</strong> {segment.aircraft.code}</p>
            <p><strong>Duration:</strong> {segment.duration}</p>
          </div>
          <div className="ticket-section">
            <h4>Price Details</h4>
            <p><strong>Grand Total:</strong> {grandTotal} {billingCurrency}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flight-order-container">
      <h2>Flight Order</h2>
      <div className="traveler-info">
        <h3>Traveler Info:</h3>
        <input 
          type="text" 
          placeholder="First Name" 
          value={travelerInfo.name.firstName}
          onChange={(e) => setTravelerInfo({...travelerInfo, name: {...travelerInfo.name, firstName: e.target.value}})}
        />
        <input 
          type="text" 
          placeholder="Last Name" 
          value={travelerInfo.name.lastName}
          onChange={(e) => setTravelerInfo({...travelerInfo, name: {...travelerInfo.name, lastName: e.target.value}})}
        />
        <input 
          type="email" 
          placeholder="Email Address" 
          value={travelerInfo.contact.emailAddress}
          onChange={(e) => setTravelerInfo({...travelerInfo, contact: {...travelerInfo.contact, emailAddress: e.target.value}})}
        />
        <div className="phone-info">
          <input 
            type="text" 
            placeholder="Country Calling Code" 
            value={travelerInfo.contact.phones[0].countryCallingCode}
            onChange={(e) => setTravelerInfo({...travelerInfo, contact: {...travelerInfo.contact, phones: [{...travelerInfo.contact.phones[0], countryCallingCode: e.target.value}]}})}
          />
          <input 
            type="text" 
            placeholder="Phone Number" 
            value={travelerInfo.contact.phones[0].number}
            onChange={(e) => setTravelerInfo({...travelerInfo, contact: {...travelerInfo.contact, phones: [{...travelerInfo.contact.phones[0], number: e.target.value}]}})}
          />
        </div>
      </div>
      <button onClick={handleCreateOrder} className="create-order-button">Create Flight Order</button>
      {error && <p className="error-message">Error: {error}</p>}
      {order && (
        <div className="order-confirmation">
          <h3>Order Confirmation:</h3>
          {renderSelectedOfferDetails(order)}
        </div>
      )}
    </div>
  );
};

export default FlightOrder;
