import Header from "./navBar.js";
import React from "react";
import API from "../API";
import "./css/viewTurbines.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

const ViewTurbines = () => {

    const [turbineList, setTurbineList] =  useState([]);    

    const loadTurbines = () => API.getUserTurbines()
      .then(data => data.json())
      .then(items => {
          setTurbineList(items)
      })

    useEffect(() => { loadTurbines() } , [])

    const deleteTurbineAction = (turbineID) => function() {
      console.log("Delete " + turbineID);
      API.deleteTurbine(turbineID).then(i => loadTurbines());
    }

    const turbines=turbineList.map((turbine)=>{
       return <div className="turbineBox" key={turbine}>
        <div className="label turbineLabel">{turbine.name}
        </div>
        < table className="turbineDetails">
            <thread>
            <tr>Turbine Model:  
                <td className="value">{turbine.turbineModel}  </td>
            </tr>
            <tr>Turbine Longitude:  
                <td className="value"> {turbine.longitude}  </td>
            </tr>
            <tr>Turbine Latitude:   
                <td className="value"> {turbine.latitude} </td> 
            </tr>    
            <tr>Turbine Hub Height:   
                <td className="value"> {turbine.height} </td> 
            </tr>     
        
        </thread>
        </table>
        <Button onClick={deleteTurbineAction(turbine.turbineId)} class="deleteBox">Delete</Button>
        <Link state={turbine}
          to={{
            pathname:'/addTurbine', 
          }}>
            <Button class="deleteBox editBox">Edit</Button>
        </Link>
        
        </div>
    })

    function emptyTurbineList() {
        if (turbineList.length === 0){
            return (
                <>
                <div className = "noTurbines">You have not added any turbines yet.</div>
                <Link style={{ textDecoration: "none"}} to="/addTurbine">
                    <Button class="addTurbineButton addTurbineButtonEmpty"> Add your first turbine</Button>
                </Link>
                </>
            )
         }
         else{
           return( 
                <Link style={{ textDecoration: "none"}} to="/addTurbine">
                    <Button class="addTurbineButton"> Add another turbine </Button>
                </Link>
            )
        }
    }


    //code draft for delete button
    //  deleteTurbine() = id =>{
    //       fetch(`${process.env.REACT_APP_BACKEND}/api/v1/turbines` + id, 
    //       {method: 'DELETE', mode: 'CORS'})
    //       .then(res => res)};
    //      }

    return (
        <div className="base">
            <Header />
            <h2 className="myTurbines">My Turbines</h2>
            <div className="box turbinebox">
            {emptyTurbineList()}
            {turbines}
                
            </div>
        </div>
    )
}



export default ViewTurbines;
