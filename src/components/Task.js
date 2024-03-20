import React, { useState, useEffect } from 'react';
import Popup from './Popup';
import HappinessPopup from './HappinessPopup';
import {useSpring, animated } from "react-spring";

// import './Popup.css'
import './Task.css'

function GoalsComponent() {
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
        const updatedProjects = projects.filter(project => project.id !== projectId);
        setProjects(updatedProjects);
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
        const satisfaction = happyData;

        const resistanceModifiedPoints = difficulty * resistance;
        const satisfactionModifiedPoints = difficulty * satisfaction;
        const completedPoints = points + difficulty + resistanceModifiedPoints + satisfactionModifiedPoints;

        console.log(`${points} + ${difficulty} + ${resistanceModifiedPoints} + ${satisfactionModifiedPoints} = ${completedPoints}`);
        setPoints(completedPoints);
        setHappyData(0);
        setLastItemState();
        setHappinessPopup(false);
    }

    // New function to explicitly delete a subtask
    const deleteSubtask = (projectId, subtaskId) => {
        const updatedProjects = projects.map(project => {
            if (project.id === projectId) {
                // Filter out the subtask to delete
                const subtask = project.subtasks.find(subtask => subtask.id===subtaskId);

                const deletedItemStats = {
                    difficulty: subtask.difficulty,
                    resistance: subtask.resistance
                };

                setLastItemState(deletedItemStats);
                const updatedSubtasks = project.subtasks.filter(subtask => subtask.id !== subtaskId);
                return { ...project, subtasks: updatedSubtasks };
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
        <div class='container'>
            <h1> Be Intentional</h1>
            <div class='points'>
                <animated.h1>{pointSpring.number.to((number) => Math.floor(number))}</animated.h1>
                <button class='reset' onClick={() => setPoints(0)}>Reset</button>
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
                        <button class='complete' onClick={() => completeProject(project.id)} style={{ marginLeft: '10px' }}>
                            Complete Project
                        </button>
                    </div>
                    <ul class='task-list'>
                        {project.subtasks.map(subtask => (
                            <li class='task' key={subtask.id}>
                            {subtask.name}
                            <button class='complete' onClick={() => completeSubtask(project.id, subtask.id)}>
                                Complete
                            </button>
                            <button class='reset' onClick={() => deleteSubtask(project.id, subtask.id)}>
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


