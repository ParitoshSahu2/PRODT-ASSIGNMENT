import React, { useState } from 'react';
import FlightSearch from './FlightSearch';
import FlightOrder from './FlightOrder';
import './FlightBookingContainer.css';

const FlightBookingContainer = () => {
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const handleSelectOffer = (offer) => {
    setSelectedOffer(offer);
    setIsOrderPlaced(false); 
  };

  const handlePlaceOrder = () => {
    setIsOrderPlaced(true); 
  };

  return (
    <div className="flight-booking-container">
      {!selectedOffer && !isOrderPlaced ? (
        <FlightSearch onSelectOffer={handleSelectOffer} />
      ) : (
        <div className="offer-details">
          {selectedOffer && (
            <div className="selected-offer">
              <h2>Selected Offer Details</h2>
              <div className="offer-section">
                <h3>General Information</h3>
                <p><strong>Offer ID:</strong> {selectedOffer.id}</p>
                <p><strong>Last Ticketing Date:</strong> {selectedOffer.lastTicketingDate}</p>
                <p><strong>Last Ticketing DateTime:</strong> {selectedOffer.lastTicketingDateTime}</p>
                <p><strong>Number of Bookable Seats:</strong> {selectedOffer.numberOfBookableSeats}</p>
              </div>
              
              <div className="offer-section">
                <h3>Price Details</h3>
                <p><strong>Currency:</strong> {selectedOffer.price.currency}</p>
                <p><strong>Total Price:</strong> {selectedOffer.price.total}</p>
              </div>

              <div className="offer-section">
                <h3>Traveler Pricings</h3>
                {selectedOffer.travelerPricings && selectedOffer.travelerPricings.length > 0 && (
                  selectedOffer.travelerPricings.map((pricing, index) => (
                    <div key={index} className="traveler-pricing">
                      <h4>Traveler Pricing {index + 1}</h4>
                      <p><strong>Traveler Type:</strong> {pricing.travelerType}</p>
                      <p><strong>Fare Option:</strong> {pricing.fareOption}</p>
                      <p><strong>Total Price:</strong> {pricing.price.total}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {!isOrderPlaced && (
            <button onClick={handlePlaceOrder} className="place-order-button">
              Place Order
            </button>
          )}
          {isOrderPlaced && (
            <div className="order-placed">
              <FlightOrder selectedOffer={selectedOffer} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlightBookingContainer;
