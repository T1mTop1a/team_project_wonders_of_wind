import Header from "./home.js";
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
import select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import API from "../API.js";

var moment = require("moment-timezone");

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

  useEffect(() => {
    (async () => {
      console.log("getting data");
      let response = await fetch(
        `${process.env.REACT_APP_BACKEND}/api/v1/example_response`
      );
      let powerData = await response.json();
      setChartData(
        createChartData(
          powerData,
          powerData.map(({ date }) => formatDateTime(date)),
          powerData.map(({ power }) => power)
        )
      );
    })();
  }, []);

  const LineChart = () => {
    return (
      <div>
        <div
          style={{
            float: "left",
            width: "60%",
            height: "480px",
          }}
        >
          <Line
            data={chartData}
            height="480px"
            options={{ maintainAspectRatio: false }}
          />
        </div>
        <div 
          style={{
            float: "right",
            width: "40%",
            height: "480px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TableContainer>
            <Table
              sx={{ minWidth: 50 }}
              size="small"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Power</TableCell>
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
                    <TableCell>{row.power}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    );
  };

  const InputBox = (props) => {
    return (
      <div>
        <input class="inputBox"
          placeholder={props.text}
          id={props.id}
        >
        </input>
      </div>
    );
  };

  // Turbine models 
  const [modelList, setModelList] = useState([]);
  // User turbines
  const [turbineList, setTurbineList] = useState([]);
  // date Selector
  const [startDate, setStartDate] = useState(new Date());
  // User turbine form
  const [turbineForm, setTurbineForm] = useState(<></>);

  useEffect(() => {
    let mounted = true;
    fetch(`${process.env.REACT_APP_BACKEND}/api/v1/turbines`)
    .then(data => data.json())
    .then(items => {
      if (mounted){
        setModelList(items)
      }
    });
    return () => mounted = false;
  }, []);

  useEffect(() => {
    let mounted = true;
    fetch(`${process.env.REACT_APP_BACKEND}/api/v1/get_user_turbines`)
    .then(data => data.json())
    .then(items => {
      if (mounted){
        setTurbineList(items)
      }
    });
    return () => mounted = false;
  }, []);

  useEffect(() => {
    API.isLoggedIn().then(loggedIn => {
      if (loggedIn) {
        setTurbineForm(
          <form className= "userTurbine"
            style={{
              float: "right",
            }}>
            <h3 className="searchTitle">Select saved turbine</h3>
            <select 
                className="modelDropDown"
                options={turbineList.map(opt => ({ label: opt.turbine_name, value: opt.turbineId }))}
                onChange={opt => console.log(opt.label, opt.value)}
            />
            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} className="datePicker" />
            <div className="searchButtonPositionRight">
              <button className="searchButton">
                Search
              </button>
            </div>
          </form>
        );
      }
    });
  }, []);

  return (
    <div className="base">
      <Header />
      <div className="inputBase">
      <form className= "newTurbine"
        style={{
          float: "left",
        }}
      >
        <h3 className="searchTitle">Input New turbine</h3>
        <InputBox type="number" text="Input your turbine latitude" />
        <InputBox type="number" text="Input your turbine longitude" />
        <select 
            className="modelDropDown"
            options={modelList.map(opt => ({ label: opt.model_name, value: opt.modelId }))}
            onChange={opt => console.log(opt.label, opt.value)}
        />
        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} className="datePicker" />
        <div className="searchButtonPositionLeft">
          <button className="searchButton">
            Search
          </button>
        </div>
      </form>
      {turbineForm}
      </div>
      <div id="chartContainer">
        <LineChart />
      </div>
    </div>
  );
};

export default Home;
