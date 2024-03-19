import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import GoalsComponent from './components/Task';
import { initializeApp } from 'firebase/app';

import './App.css';

function App() {
  // Firebase configuration
  const firebaseConfig = {
    // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    // authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    // storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
    // appId: process.env.REACT_APP_FIREBASE_APP_ID
  };

  // Initialize Firebase app
  useEffect(() => {
    const firebaseApp = initializeApp(firebaseConfig);
    // Additional Firebase initialization code can be added here
    return () => {
      // Clean up Firebase resources if needed
    };
  }, [firebaseConfig]);

  return (
    <div className="App">
      <GoalsComponent />
    </div>
  );
}

export default App;
