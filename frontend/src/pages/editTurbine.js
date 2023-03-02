import React, { useState, useEffect } from 'react';
import Header from "./navBar.js";
import { TextField, Button } from "@mui/material";
import { default as Select } from 'react-select';
import { useLocation } from 'react-router-dom';
import API from '../API';
import "./css/editTurbine.css";


const editTurbine = () => {    
    //get turbine
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const name = params.get('name');
    const model = params.get('model');
    const latitude = params.get('lat');
    const longitude = params.get('long');
    const height = params.get('h');

    const [turbineName, setTurbineName] = useState(name);//Turbine name
    const [turbineLongitude, setTurbineLongitude] = useState(longitude);//Turbine longitude
    const [turbineLatitude, setTurbineLatitude] = useState(latitude);//Turbine latitude
    const [selectedTurbineModel, setSelectedTurbineModel] = useState(model);//selected turbine model
    const [turbineHeight, setTurbineHeight] = useState(height);
    const [isLatitudeValid, setIsLatitudeValid] = useState(true);//is latitude valid
    const [isLongitudeValid, setIsLongitudeValid] = useState(true);//is longitude valid
    const [defaultTurbineModels, setDefaultTurbineModels] = useState([]);//default turbine models


    useEffect(() => {
        loadDefaultTurbineModels();
        
    }, []);

    console.log(defaultTurbineModels); 

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
////////////////////
            const response = await API.addTurbine(turbineName, turbineLatitude, turbineLongitude, turbineHeight || 135, selectedTurbineModel.value);
            
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            alert('Turbine updated successfully');
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
            <h2 className="myTurbines">Edit your Turbine</h2>
            <div className="box addTurbinebox">
            <form className ="form" onSubmit={handleSubmit}>
                <TextField
                InputProps={{
                    style:{
                        color: "#202A44",
                    },
                }}
                sx={{
                    "& .MuiInputLabel-root": {color: '#202A44'},
                    "& .MuiOutlinedInput-root": {
                        "& > fieldset": { borderColor: "#202A44" },
                    },
                    
                    "& .MuiFormLabel-root": {
                        color: '#202A44',
                        borderColor: '#202A44'
                    },
                    "& .MuiFormLabel-root.Mui-focused": {
                        color: '#202A44'
                    }
                }}
                    margin="dense"
                    required
                    label="Turbine Name"
                    data-testid="turbine name"
                    value={turbineName}
                    onChange={(event) => setTurbineName(event.target.value)}
                />
                
                <TextField
                    InputProps={{
                        style:{
                            color: "#202A44",
                        },
                    }}
                    sx={{
                        "& .MuiInputLabel-root": {color: '#202A44'},
                        "& .MuiOutlinedInput-root": {
                            "& > fieldset": { borderColor: "#202A44" },
                        },
                        
                        "& .MuiFormLabel-root": {
                            color: '#202A44',
                            borderColor: '#202A44'
                        },
                        "& .MuiFormLabel-root.Mui-focused": {
                            color: '#202A44'
                        }
                    }}
                    margin="dense"
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
                    InputProps={{
                        style:{
                            color: "#202A44",
                        },
                    }}
                    sx={{
                        "& .MuiInputLabel-root": {color: '#202A44'},
                        "& .MuiOutlinedInput-root": {
                            "& > fieldset": { borderColor: "#202A44" },
                        },
                        
                        "& .MuiFormLabel-root": {
                            color: '#202A44',
                            borderColor: '#202A44'
                        },
                        "& .MuiFormLabel-root.Mui-focused": {
                            color: '#202A44'
                        }
                    }}
                    margin="dense"
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
                    InputProps={{
                        style:{
                            color: "#202A44",
                        },
                    }}
                    sx={{
                        "& .MuiInputLabel-root": {color: '#202A44'},
                        "& .MuiOutlinedInput-root": {
                            "& > fieldset": { borderColor: "#202A44" },
                        },
                        
                        "& .MuiFormLabel-root": {
                            color: '#202A44',
                            borderColor: '#202A44'
                        },
                        "& .MuiFormLabel-root.Mui-focused": {
                            color: '#202A44'
                        }
                    }}
                    margin="dense"
                    label="Turbine Hub Height"
                    data-testid="turbine height"
                    value={turbineHeight}
                    onChange={(event) => {
                        if (!isNaN(event.target.value)) {
                            setTurbineHeight(event.target.value);
                        }
                    }}
                />
                <Select className="modelDropdown"
                    InputProps={{
                        style:{
                            color: "#202A44",
                        },
                    }}
                    required
                    options={defaultTurbineModels}
                    value={selectedTurbineModel}
                    onChange={(selectedOption) => setSelectedTurbineModel(selectedOption)}
                    isSearchable
                    placeholder="Select a turbine model"
                    styles={{
                        control: (base, state) => ({
                            ...base,
                            background: "transparent",
                            borderColor: "#202A44",
                            borderWidth: "1px",
                            width: '255px',
                            height: '60px',
                            fontFamily: "Arial",
                            marginTop: "10px",
                            marginBottom: "20px",
                            fontColor: "#202A44",
                        }),
                        menu: base => ({
                            ...base,
                            fontFamily: "Arial",
                            background: "#4686AE",
                            color: "#4686AE",
                            
                        }),  
                    }}
                    
                    theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary25: '#8DB38B',
                          primary: '#8DB38B',
                        },
                      })}
                />
                <Button 
                    className="addButton"
                    style={{
                        fontFamily: "Ubuntu",
                        color: "#202A44",
                        border: "2px solid #202A44",
                        boxShadow: "0 0 20px 2px rgba(0, 0, 0, 0.2)",
                        width: "150px",
                        marginTop: "10px",
                        cursor: "pointer",
                    }}
                    
                    type="submit" data-testid="submit button"  disabled={!isLatitudeValid || !isLongitudeValid || !selectedTurbineModel}>Update Turbine</Button>
            </form>
            </div>
        </div>

    );
};
export default editTurbine;    