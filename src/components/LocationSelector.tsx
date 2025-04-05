import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LocationSelector.css';

const LocationSelector: React.FC = () => {
  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  
  const [isLoadingCountries, setIsLoadingCountries] = useState<boolean>(false);
  const [isLoadingStates, setIsLoadingStates] = useState<boolean>(false);
  const [isLoadingCities, setIsLoadingCities] = useState<boolean>(false);
  
  const [error, setError] = useState<string | null>(null);

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoadingCountries(true);
      setError(null);
      
      try {
        const response = await axios.get('https://crio-location-selector.onrender.com/countries');
        setCountries(response.data);
      } catch (err) {
        console.error('Error fetching countries:', err);
        setError('Failed to load countries. Please try again later.');
      } finally {
        setIsLoadingCountries(false);
      }
    };
    
    fetchCountries();
  }, []);

  // Fetch states when a country is selected
  useEffect(() => {
    if (!selectedCountry) {
      setStates([]);
      return;
    }
    
    const fetchStates = async () => {
      setIsLoadingStates(true);
      setError(null);
      
      try {
        const response = await axios.get(`https://crio-location-selector.onrender.com/country=${selectedCountry}/states`);
        setStates(response.data);
      } catch (err) {
        console.error(`Error fetching states for ${selectedCountry}:`, err);
        setError(`Failed to load states for ${selectedCountry}. Please try again later.`);
      } finally {
        setIsLoadingStates(false);
      }
    };
    
    fetchStates();
    
    // Reset state and city when country changes
    setSelectedState('');
    setSelectedCity('');
    setCities([]);
  }, [selectedCountry]);

  // Fetch cities when a state is selected
  useEffect(() => {
    if (!selectedCountry || !selectedState) {
      setCities([]);
      return;
    }
    
    const fetchCities = async () => {
      setIsLoadingCities(true);
      setError(null);
      
      try {
        const response = await axios.get(
          `https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`
        );
        setCities(response.data);
      } catch (err) {
        console.error(`Error fetching cities for ${selectedState}, ${selectedCountry}:`, err);
        setError(`Failed to load cities for ${selectedState}. Please try again later.`);
      } finally {
        setIsLoadingCities(false);
      }
    };
    
    fetchCities();
    
    // Reset city when state changes
    setSelectedCity('');
  }, [selectedCountry, selectedState]);

  // Handle country selection
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
  };

  // Handle state selection
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(e.target.value);
  };

  // Handle city selection
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
  };

  return (
    <div className="location-selector">
      <h1>Select your location</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="dropdowns">
        {/* Country dropdown */}
        <div className="select-container">
          <select 
            value={selectedCountry} 
            onChange={handleCountryChange}
            disabled={isLoadingCountries}
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          {isLoadingCountries && <div className="loading-indicator">Loading...</div>}
        </div>
        
        {/* State dropdown */}
        <div className="select-container">
          <select 
            value={selectedState} 
            onChange={handleStateChange}
            disabled={!selectedCountry || isLoadingStates}
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {isLoadingStates && <div className="loading-indicator">Loading...</div>}
        </div>
        
        {/* City dropdown */}
        <div className="select-container">
          <select 
            value={selectedCity} 
            onChange={handleCityChange}
            disabled={!selectedState || isLoadingCities}
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {isLoadingCities && <div className="loading-indicator">Loading...</div>}
        </div>
      </div>
      
      {/* Selected location display */}
      {selectedCity && (
        <div className="selected-location">
          <p>You selected {selectedCity}, {selectedState}, {selectedCountry}</p>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;