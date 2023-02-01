import Header from "./home.js";
import React from "react";
import "./css/viewTurbines.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
//import { getAccordionDetailsUtilityClass } from "@mui/material";

const ViewTurbines = () => {

    const [turbineList, setTurbineList] =  useState([]);


    useEffect(() => {
        let mounted = true;
        fetch(`${process.env.REACT_APP_BACKEND}/api/v1/userTurbines`)
        .then(data => data.json())
        .then(items => {
            if (mounted){
                setTurbineList(items)
            }
        })
        return () => mounted = false;
    } , [])
        

    const turbines=turbineList.map((turbine)=>{
       return <div key={turbine}>
        <div className="label">{turbine.turbineName}Turbine 1
             {/* <Button onClick={()=>this.deleteTurbine(this.props.id)} class="deleteBox">Delete</Button> */}
        </div>

        <div className="turbineDetails">Turbine Longitude:{turbine.turbineLongitude}  </div>
        <div className="turbineDetails">Turbine Latitude:{turbine.turbineLatitude}  </div>
                
        </div>
    })

    // function loadTurbines(){
    //     fetch(`${process.env.REACT_APP_BACKEND}/api/v1/turbines`) 
    //     .then((response) => response.json())
    //     .then((data) => setTurbineList(data.turbineList));

    // }

    // useEffect(() => {loadTurbines()})

    //  deleteTurbine() = id =>{
    //       fetch(`${process.env.REACT_APP_BACKEND}/api/v1/turbines` + id, 
    //       {method: 'DELETE', mode: 'CORS'})
    //       .then(res => res)};


    return (
        <div className="base">
            <Header />
            <h2 className="myTurbines">My Turbines</h2>

            <div className="box turbinebox">
                
                <Link style={{ textDecoration: "none"}} to="/EditTurbine">
                    <Button class="addTurbineButton"> Add another turbine </Button>
                </Link>
                {turbines}
            </div>
        </div>
    )
}



export default ViewTurbines;