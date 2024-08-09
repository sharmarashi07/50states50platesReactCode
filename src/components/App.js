import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [currentState, setCurrentState] = useState('');
    const [message, setMessage] = useState('');
    const [licensePlates, setLicensePlates] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [score, setScore] = useState(0);
    const [time, setTime] = useState(0);
    const [remainingStates, setRemainingStates] = useState([]);
    const timerRef = useRef(null);

    useEffect(() => {
        fetchLicensePlates();
        fetchStatesList();
    }, []);

    useEffect(() => {
        if (remainingStates.length > 0 && currentState === '') {
            fetchRandomState();
        }
    }, [remainingStates, currentState]);

    useEffect(() => {
        if (remainingStates.length === 0 && score > 0) {
            clearInterval(timerRef.current);
        }
    }, [remainingStates, score]);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setTime(prevTime => prevTime + 1);
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, []);

    const fetchStatesList = async () => {
        const states = [
            "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
            "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
            "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
            "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
            "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
            "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina",
            "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
            "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas",
            "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin",
            "Wyoming"
        ];
        setRemainingStates(states);
    };

    const fetchRandomState = () => {
        if (remainingStates.length === 0) {
            return;
        }
        const randomIndex = Math.floor(Math.random() * remainingStates.length);
        const randomState = remainingStates[randomIndex];
        setCurrentState(randomState);
    };

    const fetchLicensePlates = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/license_plates');
            setLicensePlates(response.data.license_plates);
        } catch (error) {
            console.error('Error fetching license plates:', error);
        }
    };

    const handlePlateClick = (clickedState) => {
        if (remainingStates.length === 0) return;

        if (clickedState === currentState) {
            setMessage('Correct!');
            setScore(prevScore => prevScore + 1);
        } else {
            setMessage('Incorrect');
        }
        setDisabled(true);
        setRemainingStates(prev => prev.filter(s => s !== currentState));
        setTimeout(() => {
            setMessage('');
            setDisabled(false);
            setCurrentState(''); // Reset current state to trigger the next random state fetch
        }, 2000);
    };

    return (
        <div className="app">
            <h1>50 States, 50 Plates</h1>
            <h3>Welcome to 50 States, 50 Plates! Below are 50 license plates, one from each state of the USA. Guess as many correctly as you can in the shortest amount of time. Refresh the page to play again.</h3>
            <h2>Current State: {currentState}</h2>
            <div className="message">{message}</div>
            <div className="score">Score: {score}</div>
            <div className="timer">Time: {time} seconds</div>
            <div className="license-plates">
                {licensePlates.map((plate, index) => (
                    <button
                        key={index}
                        onClick={() => handlePlateClick(plate.replace('/static/', '').replace('.png', '').replace('_', ' '))}
                        disabled={disabled}
                        className="license-plate-button"
                    >
                        <img src={`http://127.0.0.1:8000${plate}`} alt="License Plate" className="license-plate-image" />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default App;
