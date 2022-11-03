import logo from './logo.svg';
import './App.css';
import React, { Component }  from 'react';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

function App() {

  let appName = "Wonders of Wind"


  const getExampleData = async() =>{
    console.log('getting data');
    let response = await fetch(`${process.env.REACT_APP_BACKEND}/api/v1/example_response`);
    let json = await response.json();
    console.log(json);
  }
  // importing material UI components
  
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

  return (
    <div className="App">
      <Header/>
      <button onClick={getExampleData}>Get Example Data</button>
    </div>
  );
}

export default App;
