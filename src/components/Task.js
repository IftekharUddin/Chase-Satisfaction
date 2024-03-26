import React, { useState, useEffect } from 'react';
import Popup from './Popup';
import HappinessPopup from './HappinessPopup';
import {useSpring, animated } from "react-spring";

// import './Popup.css'
import './Task.css'

function GoalsComponent() {
    const initialState = {
        points: 0,
        showPopup: false,
        popupData: null,
        showHappinessPopup: false,
        happyData: 0,
        lastDeletedItemState: { difficulty: 0, resistance: 0 },
        projects: [],
        newProjectName: '',
    };
    
    // Reducer function: Decides what to do based on the action
    function reducer(state, action) {
        switch (action.type) {
        case 'COMPLETE_TASK':
            // Add points and possibly show popup if points exceed a threshold
            return {
            ...state,
            points: state.points + action.payload, // payload is how much points to add
            showPopup: state.points + action.payload >= 10,
            };
        case 'RESET':
            // Reset points and hide popup
            return {
            ...state,
            points: 0,
            showPopup: false,
            };
        default:
            return state;
        }
    }

    const [state, dispatch] = useReducer(reducer, initialState);

    const [points , setPoints] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [popupData, setPopupData] = useState(null);

    const [showHappinessPopup, setHappinessPopup] = useState(false);
    const [happyData, setHappyData] = useState(0);

    const [lastDeletedItemState, setLastItemState] = useState({
        difficulty: 0,
        resistance: 0
    });

    const [projects, setProjects] = useState([]);
    const [newProjectName, setNewProjectName] = useState(''); // New state for form input

    const pointSpring = useSpring({
        from: { number: 0 },
        number: points,
        delay: 200,
        config: { mass: 1, tension: 20, friction: 10},
    });

    // Load initial data from Session Storage
    useEffect(() => {
        const savedPoints = sessionStorage.getItem('points');
        const savedProjects = sessionStorage.getItem('projects');

        if (savedPoints) {
            setPoints(JSON.parse(savedPoints));
        }

        if (savedProjects) {
            setProjects(JSON.parse(savedProjects));
        }
    }, []);

    // Save points to Session Storage
    useEffect(() => {
        sessionStorage.setItem('points', JSON.stringify(points));
    }, [points]);

    // Save projects to Session Storage
    useEffect(() => {
        sessionStorage.setItem('projects', JSON.stringify(projects));
    }, [projects]);

    // Function to add a new project
    const addProject = (projectName) => {
        setPopupData({ type: 'project', name: projectName });
        setShowPopup(true);
    };

    // Function to remove a project
    const completeProject = (projectId) => {
        setHappinessPopup(true);
        deleteSubtask(projectId, null);
        const newProjects = projects.filter(project => project.id !== projectId);
        setProjects(newProjects);
        return {newProjects};
    };

    // Function to add a subtask to a specific project
    const addSubtaskToProject = (projectId, subtaskName) => {
        setPopupData({ type: 'task', name: subtaskName, projectId });
        setShowPopup(true);
    };

    // Function to handle popup submission
    const handlePopupSubmit = (difficulty, resistance) => {
        if (popupData.type === 'project') {
            const newProject = { 
                id: Date.now().toString(), 
                name: popupData.name,
                subtasks: [],
                difficulty: difficulty,
                resistance: resistance
            };
            setProjects([...projects, newProject]);
            setNewProjectName('');
        } else if (popupData.type === 'task') {
            const updatedProjects = projects.map(project => {
                if (project.id === popupData.projectId) {
                    const newTask = { 
                        id: Date.now().toString(), 
                        name: popupData.name,
                        completed: false, 
                        difficulty: difficulty,
                        resistance: resistance
                    };
                    return { ...project, subtasks: [...project.subtasks, newTask] };
                }
                return project;
            });
            setProjects(updatedProjects);
        }
    };

    const handleHappinessPopup = (happiness) => {
        setHappyData(happiness);
    };

    useEffect(() => {
        if(happyData != 0.00){
            calculatePoints();
        }
    }, [happyData]);

    // Function to mark a subtask as completed
    const completeSubtask = (projectId, subtaskId) => {
        setHappinessPopup(true);
        deleteSubtask(projectId, subtaskId);
    };

    const calculatePoints = () => {
        const difficulty = parseFloat(lastDeletedItemState.difficulty);
        const resistance = parseFloat(lastDeletedItemState.resistance);
        const taskLevel = parseFloat(lastDeletedItemState.taskLevel);
        const satisfaction = happyData;

        const resistancePoints = difficulty * resistance;
        const satisfactionPoints = difficulty * satisfaction;
        const newPoints = resistancePoints + satisfactionPoints;
        const compoundedPoints = newPoints * taskLevel;


        const completedPoints = points + compoundedPoints;

        console.log(`${points} + ${difficulty} + ${resistancePoints} + ${satisfactionPoints} = ${completedPoints}`);
        setPoints(completedPoints);
        setHappyData(0);
        setLastItemState();
        setHappinessPopup(false);
    }

    // New function to explicitly delete a subtask
    const deleteSubtask = (projectId, subtaskId) => {
        const updatedProjects = projects.map(project => {
            if (project.id === projectId) {
                if (subtaskId === null) {
                    const deletedProject = {
                        difficulty: project.difficulty,
                        resistance: project.resistance,
                        taskLevel: 2
                    }
                    setLastItemState(deletedProject);
                } else {
                    // Filter out the subtask to delete
                    const subtask = project.subtasks.find(subtask => subtask.id===subtaskId);

                    const deletedTask = {
                        difficulty: subtask.difficulty,
                        resistance: subtask.resistance,
                        taskLevel: 1
                    };
                    
                    const updatedSubtasks = project.subtasks.filter(subtask => subtask.id !== subtaskId);
                    setLastItemState(deletedTask);
                    return { ...project, subtasks: updatedSubtasks };
                }
            }
            return project;
        });
        setProjects(updatedProjects);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        if (!newProjectName.trim()) return; // Guard clause for empty input
        addProject(newProjectName);
    };

    return (
        <div className='container'>
            <h1> Be Intentional</h1>
            <div className='points'>
                <animated.h1>{pointSpring.number.to((number) => Math.floor(number))}</animated.h1>
                <button className='reset' onClick={() => setPoints(0)}>Reset</button>
            </div>
            <form onSubmit={handleFormSubmit}>
                <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Enter new project name"
                />
                <button type="submit">Add Project</button>
            </form>

            {showPopup && <Popup onClose={() => setShowPopup(false)} onSubmit={handlePopupSubmit} />}
            {showHappinessPopup && <HappinessPopup onClose={() => setHappinessPopup(false)} onSubmit={handleHappinessPopup} />}
            {projects.map(project => (
                <div key={project.id} className="project">
                    <div className="project-header">
                        <h2>{project.name}</h2>
                        <button className='complete' onClick={() => completeProject(project.id)} style={{ marginLeft: '10px' }}>
                            Complete Project
                        </button>
                    </div>
                    <ul className='task-list'>
                        {project.subtasks.map(subtask => (
                            <li className='task' key={subtask.id}>
                            {subtask.name}
                            <button className='complete' onClick={() => completeSubtask(project.id, subtask.id)}>
                                Complete
                            </button>
                            <button className='reset' onClick={() => deleteSubtask(project.id, subtask.id)}>
                                Delete
                            </button>
                            </li>
                        ))}
                    </ul>
                    {/* Subtask form starts here */}
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const subtaskName = e.target.subtaskName.value;
                        if (subtaskName.trim()) {
                            addSubtaskToProject(project.id, subtaskName);
                            e.target.subtaskName.value = ''; // Reset input after submission
                        }
                    }}>
                        <input
                            type="text"
                            name="subtaskName"
                            placeholder="Enter new subtask name"
                        />
                        <button type="submit">Add Subtask</button>
                    </form>
                </div> 
            ))}
        </div>
    );
}

export default GoalsComponent;


