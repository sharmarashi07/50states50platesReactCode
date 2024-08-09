import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const Quiz = () => {
    const [state, setState] = useState('');
    const [message, setMessage] = useState('');
    const [licensePlates, setLicensePlates] = useState([]);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        fetchRandomState();
        fetchLicensePlates();
    }, []);

    const fetchRandomState = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/state');
            setState(response.data.state);
        } catch (error) {
            console.error('Error fetching state:', error);
        }
    };

    const fetchLicensePlates = () => {
        const states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
            "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
            "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
            "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
            "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
            "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina",
            "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
            "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas",
            "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin",
            "Wyoming"];
        setLicensePlates(states);
    };

    const handlePlateClick = (clickedState) => {
        if (clickedState === state) {
            setMessage('Correct!');
            setDisabled(true);
            setTimeout(() => {
                setMessage('');
                setDisabled(false);
                fetchRandomState();
            }, 2000);
        } else {
            setMessage('Incorrect');
            setDisabled(true);
            setTimeout(() => {
                setMessage('');
                setDisabled(false);
            }, 2000);
        }
    };

    return (
        <div className="app">
            <p>Guess the correct license plate that corresponds to the state name. You have one minute. Go!</p>
            <h2>{state}</h2>
            <div className="message">{message}</div>
            <div className="license-plates">
                {licensePlates.map((plateState, index) => (
                    <button
                        key={index}
                        onClick={() => handlePlateClick(plateState)}
                        disabled={disabled}
                        className="license-plate-button"
                    >
                        <img src={`LicensePlates/${{plateState}}.png`} alt={plateState}/>
                    </button>
            ))}
            </div>
        </div>
    );
};

export default Quiz;
