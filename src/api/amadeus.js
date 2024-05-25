import axios from 'axios';
import { Children } from 'react';

export const getAmadeusToken = async () => {
  const response = await axios.post(
    'https://test.api.amadeus.com/v1/security/oauth2/token',
    new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: 'Rju8d43Ao98BOv5GPu65fClokAKmLnFP',
      client_secret: '4gaWVHeRqq5o6wwR',
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return response.data.access_token;
};

export const searchCity = async (keyword, token) => {
  const response = await axios.get(`https://test.api.amadeus.com/v1/reference-data/locations`, {
    params: {
      keyword: keyword,
      subType: 'CITY,AIRPORT',
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const searchFlights = async (departure, arrival, departureDate,ad,child,inf ,token) => {
  const response = await axios.get(`https://test.api.amadeus.com/v2/shopping/flight-offers`, {
    params: {
      originLocationCode: departure,
      destinationLocationCode: arrival,
      departureDate: departureDate,
      adults: ad,
      children:child,
      infants:inf
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getFlightPrice = async (flightOffers, token) => {
  const response = await axios.post(
    `https://test.api.amadeus.com/v1/shopping/flight-offers/pricing`,
    { data: { type: 'flight-offers-pricing', flightOffers } },
    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
  );
  return response.data;
};

export const createFlightOrder = async (flightOffer, travelerInfo, token) => {
    // console.log(flightOffer)
    // console.dir(travelerInfo)
    
    console.log(flightOffer)
  const response = await axios.post(

    `https://test.api.amadeus.com/v1/booking/flight-orders`,
    { 'data': {
        'type': 'flight-order',
        'flightOffers': [flightOffer],
        'travelers': [{
          "id": "1",
          "dateOfBirth": "1982-01-16",
          "name": {
            "firstName": travelerInfo.name.firstName,
            "lastName": travelerInfo.name.lastName
          },
          "gender": "MALE",
          "contact": {
            "emailAddress": travelerInfo.contact.emailAddress,
            "phones": [{
              "deviceType": "MOBILE",
              "countryCallingCode": travelerInfo.contact.phones[0].countryCallingCode,
              "number": travelerInfo.contact.phones[0].number
            }]
          },
          "documents": [{
            "documentType": "PASSPORT",
            "birthPlace": "Madrid",
            "issuanceLocation": "Madrid",
            "issuanceDate": "2015-04-14",
            "number": "00000000",
            "expiryDate": "2025-04-14",
            "issuanceCountry": "ES",
            "validityCountry": "ES",
            "nationality": "ES",
            "holder": true
          }]
        }]
      } },
    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
  );
  // console.log(response.data);
  return response.data;
};


//aAAWUoUPn7GlokcmD6aFCqUWHVaR