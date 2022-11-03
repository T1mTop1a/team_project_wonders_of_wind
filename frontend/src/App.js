import './App.css';
import React, { useState, useEffect }  from 'react';
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

var moment = require('moment-timezone');

function App() {

  let appName = "Wonders of Wind"
  
  function Header() {
    return (
        <AppBar position="static" style={{ background: '#596a4b' }}>
          <Toolbar>
            <Typography variant="h6" align="left"
              component="div" sx={{ mr: 2, flexGrow: 1 }}>
              {appName}
            </Typography>
            <Button color="inherit">Login</Button>
            <Button color="inherit">Sign up</Button>
          </Toolbar>
        </AppBar>
    );
  }

  const [chartData, setState] = useState({
    rawData: [],
    labels: [],
    datasets: [
      {
        label: "Power/MWe (Time is in UTC)",
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgb(75, 192, 192)',
        color: "#83a96c",
        data: [],
      },
    ],
  });

  function formatDateTime(dateString) {
    return moment(dateString).tz("UTC").format('llll');
  }
 
  useEffect(() => {
    const getExampleData = async() => {
      console.log('getting data');
      let response = await fetch(`${process.env.REACT_APP_BACKEND}/api/v1/example_response`);
      let json = await response.json();
      setState({
        rawData: json,
        labels: json.map(entry => formatDateTime(entry.date)),
        datasets: [
          {
            label: "Power/MWe (Time is in UTC)",
            backgroundColor: 'rgb(75, 192, 192)',
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            data: json.map(entry => entry.power),
          },
        ],
      });
    }

    getExampleData();
  }, []);
  
  const LineChart = () => {
    return (
      <div>
        <div style={{
          float: "left",
          width: "60%",
          height: "480px"
        }}>
          <Line data={chartData} height="480px" options={{ maintainAspectRatio: false }}/>
        </div>
        <div style={{
          float: "right",
          width: "40%",
          height: "480px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <TableContainer>
            <Table sx={{ minWidth: 50 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Power</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {chartData.rawData.map((row) => (
                  <TableRow
                    key={row.date} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
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
        <input class="inputBox" style={{
          width: '500px',
          height: '50px',
          marginLeft: '64px',
          marginTop: '3px',
          marginBottom: '3px',
          textIndent: '10px',
        }} placeholder={props.text}></input>
      </div>
    );
  }

  return (
    <div className="App">
      <Header/>
      <form style={{
        marginTop: '56px',
      }}>
        <InputBox text="input your turbine location"/>
        <InputBox text="input your turbine model"/>
        <div style={{
          width: '500px',
          height: '50px',
          marginLeft: '70px',
          marginTop: '9px',
          marginBottom: '14px',
          alignContent: 'right',
          display: 'flex'
        }}>
          <button style={{
            background: '#193C0D',
            width: '128px',
            height: '51px',
            left: '433px',
            top: '295px',
            border: '0',
            fontFamily: 'Roboto',
            fontWeight: '600',
            fontSize: '20px',
            color: '#FFFFFF',
            marginRight: '0',
            marginLeft: 'auto',
          }}>Search</button>
        </div>
      </form>
      <div id="chartContainer">
        <LineChart/>
      </div>
    </div>
  );
}

export default App;
