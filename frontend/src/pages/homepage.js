import Header from "./navBar.js";
import "./css/homepage.css"

import React, { useState, useEffect, useMemo } from "react";

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
import Button from "@mui/material/Button";
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
  // Turbine models 
  const [modelList, setModelList] = useState([]);
  // date Selector
  const [allowedDateRange, setAllowedDateRange] = useState(undefined);
  // User turbine form
  const [turbineList, setTurbineList] = useState([]);
  const [turbineFormVisibility, setTurbineFormVisibility] = useState("hidden");
  const [descriptionDate, setdescriptionDate] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

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
    if (isNaN(lon) || !(lon >= -180 && lon <= 180)) {
      alert("Please enter a valid longitude");
      return;
    }
    let powerData = await API.predictCustomTurbine(formData).then(r => r.json());
    setChartData(
      createChartData(
        powerData,
        powerData.map(({ date }) => formatDateTime(date)),
        powerData.map(({ power }) => power / 1000000)
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
        powerData.map(({ power }) => power / 1000000)
      )
    );
  }
  
  useEffect(() => {
    API.isLoggedIn().then(loggedIn => {
      if (loggedIn) 
      {setLoggedIn(true)}
    });
  }, []);
     

  //tabs
  function Tabs(evt, tabName) {
    if (evt.currentTarget.className.includes("active")) {
      return;
    }
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
      tablinks[i].className = tablinks[i].className.replace(" hidden", "");

    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active hidden";
  }
  ///tabs
  function Addingtabs() {
    if(loggedIn){
    return (
      <div>
        <div className="tab">
          <button className="tablinks" onClick={(event) => Tabs(event, 'InputNewTurbine')}>Input your Turbine details</button>
          <button className="tablinks" onClick={(event) => Tabs(event, 'SelectSavedTurbine')} >Select one of your saved Turbine</button>
        </div>
      </div>
    );
    }
    else{
      return(<button className="tablinks" onClick={(event) => Tabs(event, 'InputNewTurbine')}>Input your Turbine details</button>);
    }
  }

     

  const lineChart = React.useMemo(() => {
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
                },
              },
            }}
          />
        </div>

      </div>
    );
  }, [chartData]);

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
                  <TableCell>{row.power / 1000000}</TableCell>
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

  useEffect(() => {
    API.getTurbineModels()
      .then(setModelList);
    API.predictionDateRange()
      .then(d => d.json())
      .then(setAllowedDateRange);

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
      color: "#202A44"

    })
  };

  const MyDatePicker = () => {
    const [[startDate, endDate], setState] = useState([new Date(), new Date()]);
    let minDate = undefined;
    let maxDate = undefined;
    if (allowedDateRange) {
      minDate = new Date(allowedDateRange.minDate);
      maxDate = new Date(allowedDateRange.maxDate);
    }
    return (
      <DatePicker name="date" className="datePicker"
        selected={startDate}
        startDate={startDate}
        endDate={endDate}
        onChange={setState}
        minDate={minDate}
        maxDate={maxDate}
        selectsRange={true}
        dateFormat="dd/MM/yyyy"
      />)
  }

  const [customTurbineDatePicker, savedTurbineDatePicker] = [MyDatePicker(), MyDatePicker()];

  function showDescription() {
    return (
      <div className="description">
        Predictions are generated based on weather data from NOAA.
      </div>
    )
  }
  
  function downloadCSV() {
    var buffer = "date,power\n";
    chartData.rawData.forEach(e => {
      buffer += `${e.date}, ${e.power}\n`
    });
    const url = URL.createObjectURL(
      new Blob([buffer], { type: "text/csv" })
    );
    window.location.assign(url);
  }

  return (
    <div className="base">
      <Header />

      <div class="inputBase2">
        < Addingtabs />
      </div>

      <div id="InputNewTurbine" class="inputBase2 tabcontent" >
       <form className="newTurbine" onSubmit={e => e.preventDefault()} id="turbineModelForm">
        <h3 className="searchTitle">Input turbine details to generate predictions</h3>
        <div>
          <input type="text" class="inputBox" name="lat" placeholder="Input your turbine latitude (-90 to 89)" />
        </div>
        <div>
          <input type="text" class="inputBox" name="lon" placeholder="Input your turbine longitude (-180 to 179)" />
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
        {customTurbineDatePicker}
        <div className="searchButtonPositionLeft">
          <button className="searchButton" onClick={updateDataFromCustomTurbine}>
            Search
          </button>
        </div>
        </form>
      </div>

      <div id="SelectSavedTurbine" className="inputBase2 tabcontent" >
        <form onSubmit={e => e.preventDefault()} id="savedTurbineForm"
            style={{
              visibility: turbineFormVisibility,
            }}>
          <h3 className="searchTitle">Select one of your saved turbines</h3>
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
        {savedTurbineDatePicker}
        <div className="searchButtonPositionRight">
          <button className="searchButton" onClick={updateDataFromSavedTurbine}>
            Search
          </button>
        </div>
      </form>
      </div>

      {showDescription()}
      <div id="chartContainer">
        <Button onClick={downloadCSV} class="csvButton">Download</Button>
        {lineChart}
      </div>
      <div>
        <DataTable />
      </div>
    </div>
  );
};

export default Home;