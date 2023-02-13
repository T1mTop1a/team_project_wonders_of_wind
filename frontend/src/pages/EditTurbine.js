//This is the page that allows you to add or edit a turbine
import React, { useState, useEffect } from 'react';
import "./css/home.css";
import Header from "./home.js";
import "./css/EditTurbine.css";
import { TextField, Button } from "@mui/material";
import { default as Select } from 'react-select';
import API from '../API';

const EditTurbine = () => {
    const [turbineName, setTurbineName] = useState('');//Turbine name
    const [turbineLongitude, setTurbineLongitude] = useState('');//Turbine longitude
    const [turbineLatitude, setTurbineLatitude] = useState('');//Turbine latitude
    const [isLatitudeValid, setIsLatitudeValid] = useState(true);//is latitude valid
    const [isLongitudeValid, setIsLongitudeValid] = useState(true);//is longitude valid
    const [selectedTurbineModel, setSelectedTurbineModel] = useState(null);//selected turbine model
    const [defaultTurbineModels, setDefaultTurbineModels] = useState([]);//default turbine models
    const [turbineHeight, setTurbineHeight] = useState(null);

    useEffect(() => {
        loadDefaultTurbineModels();
        
    }, []);

    console.log(defaultTurbineModels); 

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await API.addTurbine(turbineName, turbineLatitude, turbineLongitude, turbineHeight, selectedTurbineModel.value);

            if (!response.ok) {
                throw new Error(response.statusText);
            }
            alert('Turbine added successfully');
        } catch (error) {
            console.error(error);
        }
    };

    const loadDefaultTurbineModels = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/v1/turbines`);
            console.log(response);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const data = await response.json();
            console.log(data); 
            setDefaultTurbineModels(
                data.map((turbine) => ({
                    value: turbine["modelId"],
                    label: turbine["display_name"],
                })));
            
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="EditTurbine">
            <Header />
            <form onSubmit={handleSubmit}>
                <TextField
                    required
                    label="Turbine Name"
                    value={turbineName}
                    onChange={(event) => setTurbineName(event.target.value)}
                />
                <TextField
                    required
                    label="Turbine Longitude"
                    value={turbineLongitude}
                    onChange={(event) => {
                        if (!isNaN(event.target.value)) {
                            setTurbineLongitude(event.target.value);
                            setIsLongitudeValid(true);
                        } else {
                            setIsLongitudeValid(false);
                        }
                    }}
                />
                <TextField
                    required
                    label="Turbine Latitude"
                    value={turbineLatitude}
                    onChange={(event) => {
                        if (!isNaN(event.target.value)) {
                            setTurbineLatitude(event.target.value);
                            setIsLatitudeValid(true);
                        } else {
                            setIsLatitudeValid(false);
                        }
                    }}
                />
                <TextField
                    required
                    label="Turbine Height"
                    value={turbineHeight}
                    onChange={(event) => {
                        if (!isNaN(event.target.value)) {
                            setTurbineHeight(event.target.value);
                        }
                    }}
                />
                <Select
                    required
                    options={defaultTurbineModels}
                    value={selectedTurbineModel}
                    onChange={(selectedOption) => setSelectedTurbineModel(selectedOption)}
                    isSearchable
                    placeholder="Select a turbine model"
                    styles={{
                        control: (base, state) => ({
                            ...base,
                            width: '200px',
                            height: '50px',
                        }),
                    }}
                />
                <Button type="submit" disabled={!isLatitudeValid || !isLongitudeValid || !selectedTurbineModel || !turbineHeight}>Add Turbine</Button>
            </form>
        </div>
    );
};

export default EditTurbine;
