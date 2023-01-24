//This is the page that allows you to add or edit a turbine
import React, { useState } from "react";
import "./css/home.css"; 
import Header from "./home.js"; 
import "./css/EditTurbine.css";
import { TextField, Button } from "@mui/material";

const EditTurbine = () => {
    const [turbineName, setTurbineName] = useState('');
    const [turbineId, setTurbineId] = useState('');
    const [turbineCapacity, setTurbineCapacity] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/v1/turbines`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ turbineName, turbineId, turbineCapacity }),
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            alert('Turbine added successfully');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="EditTurbine">
            <Header />
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Turbine Name"
                    value={turbineName}
                    onChange={(event) => setTurbineName(event.target.value)}
                />
                <TextField
                    label="Turbine ID"
                    value={turbineId}
                    onChange={(event) => setTurbineId(event.target.value)}
                />
                <TextField
                    label="Turbine Capacity"
                    value={turbineCapacity}
                    onChange={(event) => setTurbineCapacity(event.target.value)}
                />
                <Button type="submit">Add Turbine</Button>
            </form>
        </div>
    );
};

export default EditTurbine;



