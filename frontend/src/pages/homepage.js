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

  const [modelList, setModelList] = useState([]);
  const [modelList2, setModelList2] = useState([]);


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
        setModelList2(items)
      }
    });
    return () => mounted = false;
  }, []);

  return (
    <div className="base">
      <Header />
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
        <div className="searchButtonPosition">
          <button className="searchButton">
            Search
          </button>
        </div>
      </form>

      <form className= "userTurbine"
        style={{
          float: "left",
        }}
      >
        <h3 className="searchTitle">Select saved turbine</h3>
        <select 
            className="modelDropDown"
            options={modelList2.map(opt => ({ label: opt.model_name, value: opt.modelId }))}
            onChange={opt => console.log(opt.label, opt.value)}
        />
        <div className="searchButtonPosition">
          <button className="searchButton">
            Search
          </button>
        </div>
      </form>

      <div id="chartContainer">
        <LineChart />
      </div>
    </div>
  );
};

export default Home;
