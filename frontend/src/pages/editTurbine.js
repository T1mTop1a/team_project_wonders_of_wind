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





    
    return (
        <div className="base">
            <Header />
            <h2 className="myTurbines">Edit your Turbine</h2>
            <div className="box addTurbinebox">
        </div>
        </div>

    );
};
export default editTurbine;    