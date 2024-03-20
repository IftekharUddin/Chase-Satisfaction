import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import GoalsComponent from './components/Task';


import './App.css';

function App() {
  return (
    <div className="App">
      <GoalsComponent />
    </div>
  );
}

export default App;
