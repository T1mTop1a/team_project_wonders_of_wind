//This is the page that allows you to add a turbine
import React, { useState, useEffect } from 'react';
import Header from "./navBar.js";
import { TextField, Button } from "@mui/material";
import { default as Select } from 'react-select';
import { Link, useNavigate } from 'react-router-dom';
import API from '../API';
import { useLocation } from "react-router";
import "./css/addTurbine.css";

const addTurbine = (props) => {
    const editedTurbine = useLocation().state;
    const [turbineName, setTurbineName] = useState(editedTurbine ? editedTurbine.name : '');//Turbine name
    const [turbineLongitude, setTurbineLongitude] = useState(editedTurbine ? editedTurbine.longitude : '');//Turbine longitude
    const [turbineLatitude, setTurbineLatitude] = useState(editedTurbine ? editedTurbine.latitude : '');//Turbine latitude
    const [isLatitudeValid, setIsLatitudeValid] = useState(true);//is latitude valid
    const [isLongitudeValid, setIsLongitudeValid] = useState(true);//is longitude valid
    const [selectedTurbineModel, setSelectedTurbineModel] = useState(editedTurbine ? {"value": editedTurbine.turbineModelId, "label": editedTurbine.turbineModel} : null);//selected turbine model
    const [defaultTurbineModels, setDefaultTurbineModels] = useState([]);//default turbine models
    const [turbineHeight, setTurbineHeight] = useState(editedTurbine ? editedTurbine.height : null);

    useEffect(() => {
        loadDefaultTurbineModels();
    }, []);

    console.log(defaultTurbineModels); 

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!(turbineLatitude >= -90 && turbineLatitude < 90)) {
          alert('Please enter valid latitude');
          return;
        } else if (!(turbineLongitude >= -180 && turbineLongitude < 180)) {
          alert('Please enter valid longitude');
          return;
        }
        API.addTurbine(editedTurbine ? editedTurbine.turbineId : undefined, turbineName, turbineLatitude, turbineLongitude, turbineHeight || 135, selectedTurbineModel.value)
          .then(response => response.ok ? response : Promise.reject(response))
          // .then(_ => alert(editedTurbine ? 'Turbine edited successfully' : 'Turbine added successfully'))
          .then(_ => navigate('/viewTurbines'))
          .catch(error => {
              console.log(error);
              error.json()
                .then(err => alert(err.error))
                .catch(_ => alert("An error occured, try again."))
          })
          .catch(console.log);
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

    const pageTitle = editedTurbine ? "Edit turbine" : "Add a new Turbine";
    const buttonName = editedTurbine ? "Update Turbine" : "Add Turbine";

    return (
        <div className="base">
            <Header />
            <h2 className="myTurbines">{pageTitle}</h2>
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
                    onChange={(selectedOption) => {setSelectedTurbineModel(selectedOption); console.log(selectedOption);}}
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
                            color: "#202A44",
                        }),
                        menu: base => ({
                            ...base,
                            fontFamily: "Arial",
                            background: "#4686AE",
                            color: "white",
                        }),  
                    }}
                    
                    theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary: '#157263',
                          primary25: '#8DB38B',
                        },
                      })}
                />
                <Button 
                    class="updateCancelButtons"
                    type="submit" data-testid="submit button"  disabled={!isLatitudeValid || !isLongitudeValid || !selectedTurbineModel}>{buttonName}</Button>
                <Link style={{ textDecoration: "none" }} to="/viewTurbines">
                    <Button 
                    class="updateCancelButtons">Cancel</Button>
                </Link>
            </form>
            </div>
        </div>
    );
};

export default addTurbine;
