import React, { useState } from 'react';

const HappinessPopup = ({onClose, onSubmit}) => {
    const [happiness, setHappiness] = useState(0);

    const handleHappinessChange = (e) => {
        setHappiness(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(happiness);
        onClose();
    }

    return (
        <div className="happinessPopup">
            <h2>Rate Your Satisfaction Level</h2>
            {/* <input
                type="range"
                min="0"
                max="10"
                value={happiness}
                onChange={handleHappinessChange}
            />
            <output>{happiness}</output> */}
            <select value={happiness} onChange={handleHappinessChange}>
                <option value={0}>Rate your Satisfaction</option>
                <option value={.1}>1</option>
                <option value={.2}>2</option>
                <option value={.3}>3</option>
                <option value={.4}>4</option>
                <option value={.5}>5</option>
                <option value={.6}>6</option>
                <option value={.7}>7</option>
                <option value={.8}>8</option>
                <option value={.9}>9</option>
                <option value={1}>10</option>
            </select>
            <button onClick={handleSubmit}>Complete</button>
        </div>
    );
};

export default HappinessPopup;