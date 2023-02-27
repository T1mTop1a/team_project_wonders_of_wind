import Header from "./navBar.js";
import React from "react";
import API from "../API";
import "./css/viewTurbines.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

const ViewTurbines = () => {

    const [turbineList, setTurbineList] =  useState([]);

    useEffect(() => {
        API.getUserTurbines()
            .then(data => data.json())
            .then(items => {
                setTurbineList(items)
            })
    } , [])
        

    const turbines=turbineList.map((turbine)=>{
       return <div className="turbineBox" key={turbine}>
        <div className="label turbineLabel">{turbine.name}
             {/* <Button onClick={()=>this.deleteTurbine(this.props.id)} class="deleteBox">Delete</Button> */}
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
        </div>
    })

    //code for testing without populating
    // useEffect(() => {
    //     setTurbineList([{turbineName: 'Turbine1',turbineModel : 'm', turbineLatitude : '5', turbineLongitude: '4'},{turbineName: 'Turbine1',turbineModel : 'm', turbineLatitude : '5', turbineLongitude: '4'},{turbineName: 'Turbine1',turbineModel : 'm', turbineLatitude : '5',turbineName: 'Turbine1', turbineLongitude: '4'},{turbineName: "Turbine1",turbineModel : 'm', turbineLatitude : '5', turbineLongitude: '4'}])
    // })

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