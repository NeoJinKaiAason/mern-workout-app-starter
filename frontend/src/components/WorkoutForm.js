import React, { useState } from "react"; // Import useState from React
import { useWorkoutsContext } from "../hooks/useWorkoutContext"; // Import context hook to dispatch actions

const WorkoutForm = () => {
    const { dispatch } = useWorkoutsContext(); // Destructure dispatch from context
    const [title, setTitle] = useState("");
    const [load, setLoad] = useState("");
    const [reps, setReps] = useState("");
    const [error, setError] = useState(null);
    const [emptyFields, setEmptyFields] = useState([])

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        const workout = { title, load, reps }; // Create workout object

        // Send POST request to the API
        const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/workouts`, {
            method: "POST",
            body: JSON.stringify(workout),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const json = await response.json();

        // Handle errors from the server response
        if (!response.ok) {
            setError(json.error);
            setEmptyFields(json.emptyFields)
        }

        // Reset form state and update global context on success
        if (response.ok) {
            setTitle("");
            setLoad("");
            setReps("");
            setError(null);
            setEmptyFields([])
            console.log("New workout added:", json);

            dispatch({ type: "CREATE_WORKOUT", payload: json }); // Dispatch new workout to context
        }
    };

    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add a New Workout</h3>

            <label>Exercise Title:</label>
            <input
                type="text"
                onChange={(e) => setTitle(e.target.value)} // Update title state
                value={title}
                className={emptyFields.includes('title') ? 'error' : ''}
            />

            <label>Load (in kg):</label>
            <input
                type="number"
                onChange={(e) => setLoad(e.target.value)} // Update load state
                value={load}
                className={emptyFields.includes('load') ? 'error' : ''}
            />

            <label>Reps:</label>
            <input
                type="number"
                onChange={(e) => setReps(e.target.value)} // Update reps state
                value={reps}
                className={emptyFields.includes('reps') ? 'error' : ''}
            />

            <button>Add Workout</button>

            {/* Display error message if there is one */}
            {error && <div className="error">{error}</div>}
        </form>
    );
};

export default WorkoutForm;

