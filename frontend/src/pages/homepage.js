import Header from "./navBar.js";
import "./css/homepage.css"

import React, { useState, useEffect } from "react";

import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import API from "../API.js";
import zoomPlugin from 'chartjs-plugin-zoom';

var moment = require("moment-timezone");
Chart.defaults.font.size = 12;
Chart.register(zoomPlugin);

const Home = () => {
  const createChartData = (rawData, labels, data) => ({
    rawData: rawData,
    labels: labels,
    datasets: [
      {
        label: "Power/MWe (Time is in UTC)",
        backgroundColor: "rgb(75, 192, 192)",
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
        data: data,
      },
    ],
  });
  
  const [chartData, setChartData] = useState(createChartData([], [], []));

  function formatDateTime(dateString) {
    return moment(dateString).tz("UTC").format("llll");
  }

  async function updateDataFromCustomTurbine(e) {
    console.log(e);
    let formData = new FormData(document.getElementById("turbineModelForm"));
    let lat = Number(formData.get("lat"));
    let lon = Number(formData.get("lon"));
    // validate
    if (isNaN(lat) || !(lat >= -90 && lat <= 90)) {
      alert("Please enter a valid latitude");
      return;
    }
    if (isNaN(lon) || !(lon >= -180 && lat <= 180)) {
      alert("Please enter a valid longitude");
      return;
    }
    let powerData = await API.predictCustomTurbine(formData).then(r => r.json());
    setChartData(
      createChartData(
        powerData,
        powerData.map(({ date }) => formatDateTime(date)),
        powerData.map(({ power }) => power/1000000)
      )
    );
  }

  async function updateDataFromSavedTurbine(e) {
    console.log(e);
    let formData = new FormData(document.getElementById("savedTurbineForm"));
    let powerData = await API.predictSavedTurbine(formData).then(r => r.json());
    setChartData(
      createChartData(
        powerData,
        powerData.map(({ date }) => formatDateTime(date)),
        powerData.map(({ power }) => power/1000000)
      )
    );
  }

  const LineChart = () => {
    return (
      <div>
        <div
          style={{
            width: "90%",
            height: "480px",
          }}
        >
          <Line
            data={chartData}
            height="480px"
            options={{ 
              plugins: {
                title: {
                    display: true,
                    text: 'Power Prediction',
                    font: {
                      size: 18,
                    },
                },
                zoom: {
                  pan: {
                    enabled: true,
                    mode: 'x',
                    modifierKey: 'ctrl',

                  },
                  limits: {
                    // axis limits
                  },
                  zoom: {
                    mode: 'x',
                    pinch: {
                      enabled: true,
                    },
                    wheel: {
                      enabled: true,
                    },
                  },
                },
              },
              layout: {
                padding: 20
              },
              maintainAspectRatio: false,
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Date and time (UTC)',
                    align: 'center',
                    font: {
                      size: 16,
                    },
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Power (MWe)',
                    align: 'center',
                    font: {
                      size: 16,
                    },
                  },
                  min: 0,
                  max: 10,
                },
              },
            }}
          />
        </div>
        
      </div>
    );
  };

  const DataTable = () => {
    return (
      <div className="table">
        <TableContainer
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
        >
          <Table
            sx={{ minWidth: 50 }}
            size="small"
            aria-label="a dense table"
          >
            <TableHead>
              <TableRow>
                <TableCell>Date and time (UTC)</TableCell>
                <TableCell>Power (MWe)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {chartData.rawData.map((row) => (
              <TableRow
                key={row.date}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {formatDateTime(row.date)}
                </TableCell>
                <TableCell>{row.power/1000000}</TableCell>
              </TableRow>
            ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  };

  const InputBox = (props) => {
    return (
      <div>
        <input class="inputBox"
          placeholder={props.text}
          id={props.id}
          name={props.name}
        >
        </input>
      </div>
    );
  };

  // Turbine models 
  const [modelList, setModelList] = useState([]);
  // date Selector
  const [customStartDate, setCustomStartDate] = useState(new Date());
  const [savedStartDate, setSavedStartDate] = useState(new Date());
  // User turbine form
  const [turbineList, setTurbineList] = useState([]);
  const [turbineFormVisibility, setTurbineFormVisibility] = useState("hidden");
  const [descriptionDate, setdescriptionDate] = useState('');

  useEffect(() => {
    API.getTurbineModels().then(setModelList);

    API.isLoggedIn().then(loggedIn => {
      if (loggedIn) {
        API.getUserTurbines()
        .then(data => data.json())
        .then(items => items.map(opt => ({ label: opt.name, value: opt.turbineId })))
        .then(setTurbineList);
        setTurbineFormVisibility("");
      }
    });
  }, []);

  const dropdownStyles = {
    control: base => ({
      ...base,
      fontFamily: "Arial",
      background: "rgba(255, 255, 255, 0.3);",
      borderColor: "#202A44",
      borderWidth: "1.5px",
      text: "red"
    }),
    menu: base => ({
      ...base,
      fontFamily: "Arial",
      background: "#4686AE",
      color : "#202A44"

    })
  };


  function showDescription() {
    return(
       <div className="description">
          Predictions are generated based on weather data from NOAA.
        </div>
    )
  }

  return (
    <div className="base">
      <Header />
      <div className="inputBase2 overallBox">
      <form className= "newTurbine" onSubmit={e => e.preventDefault()} id="turbineModelForm"
        style={{
          float: "left",
        }}
      >
        <h3 className="searchTitle">Input New turbine</h3>
        <div>
          <input type="text" class="inputBox" name="lat" placeholder="Input your turbine latitude" />
        </div>
        <div>
          <input type="text" class="inputBox" name="lon" placeholder="Input your turbine longitude" />
        </div>
        <Select 
            className="modelDropDown" styles ={dropdownStyles}
            options={modelList}
            name="modelName"
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                text: 'orangered',
                primary25: '#8DB38B',
                primary: '#8DB38B',
              },
            })}
          />
        <DatePicker name="date" className="datePicker" selected={customStartDate} onChange={setCustomStartDate}/>
        <div className="searchButtonPositionLeft">
          <button className="searchButton" onClick={updateDataFromCustomTurbine}>
            Search
          </button>
        </div>
      </form>
      <form className= "userTurbine" onSubmit={e => e.preventDefault()} id="savedTurbineForm"
        style={{
          float: "right",
          visibility: turbineFormVisibility,
        }}>
        <h3 className="searchTitle">Select saved turbine</h3>
        <Select
            className="modelDropDown" styles={dropdownStyles}
            options={turbineList}
            name="turbineId"
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                text: 'red',
                primary25: '#8DB38B',
                primary: '#8DB38B',
              },
            })}
        />
        <DatePicker name="date" className="datePicker" selected={savedStartDate} onChange={setSavedStartDate}/>
        <div className="searchButtonPositionRight">
          <button className="searchButton" onClick={updateDataFromSavedTurbine}>
            Search
          </button>
        </div>
      </form>
      </div>
      {showDescription()}
      <div id="chartContainer">
        <LineChart />
      </div>
      <div>
      <DataTable />
      </div>
    </div>
  );
};

export default Home;
