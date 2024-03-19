import React, { useState } from 'react';

import './Popup.css'

const Popup = ({ onClose, onSubmit }) => {
  const [difficulty, setDifficulty] = useState(0);
  const [resistance, setResistance] = useState(0);

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
  };

  const handleResistanceChange = (e) => {
    setResistance(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(difficulty, resistance);
    onClose();
  };

  return (
    <div className="popup">
      <div className="popup-inner">
        <h2>Select Difficulty</h2>
        <select value={difficulty} onChange={handleDifficultyChange} className="select-box">
          <option value={0}>Select Difficulty</option>
          <option value={5}>Easy</option>
          <option value={10}>Medium</option>
          <option value={20}>Hard</option>
        </select>
  
        <h2>Select Resistance</h2>
        <select value={resistance} onChange={handleResistanceChange} className="select-box">
          <option value={0}>Select Resistance Level</option>
          <option value={0.10}>1</option>
          <option value={0.20}>2</option>
          <option value={0.40}>3</option>
          <option value={0.80}>4</option>
          <option value={1}>5</option>
        </select>
  
        <button onClick={handleSubmit} className="submit-button">Submit</button>
      </div>
    </div>
  );
  
};

export default Popup;
