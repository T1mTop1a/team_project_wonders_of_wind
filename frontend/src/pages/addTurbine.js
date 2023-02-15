//This is the page that allows you to add a turbine
import React, { useState, useEffect } from 'react';
import "./css/home.css";
import Header from "./navBar.js";
import "./css/addTurbine.css";
import { TextField, Button } from "@mui/material";
import { default as Select } from 'react-select';
import API from '../API';

const addTurbine = () => {
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
        <div className="base">
            <Header />
            <div className="box addTurbinebox">
            <form className ="form" onSubmit={handleSubmit}>
                <TextField
                    required
                    label="Turbine Name"
                    data-testid="turbine name"
                    value={turbineName}
                    onChange={(event) => setTurbineName(event.target.value)}
                />
                <TextField
                    required
                    label="Turbine Longitude"
                    data-testid="turbine longitude"
                    value={turbineLongitude}
                    onChange={(event) => {

                        setTurbineLongitude(event.target.value);
                        setIsLongitudeValid(true);
      
                    }}
                />
                <TextField
                    required
                    label="Turbine Latitude"
                    data-testid="turbine latitude"
                    value={turbineLatitude}
                    onChange={(event) => {
        
                        setTurbineLatitude(event.target.value);
                        setIsLatitudeValid(true);
                    
                    }}
                />
                <TextField
                    required
                    label="Turbine Height"
                    data-testid="turbine height"
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
                <Button type="submit" data-testid="submit button" disabled={!isLatitudeValid || !isLongitudeValid || !selectedTurbineModel || !turbineHeight}>Add Turbine</Button>
            </form>
            </div>
        </div>
    );
};

export default addTurbine;
