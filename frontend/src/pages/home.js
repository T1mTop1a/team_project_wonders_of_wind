import React from "react";
import "./css/home.css";
//import Home from './homepage.js';
import { Link } from "react-router-dom";

//import './App.css';
//import React, { useState, useEffect }  from 'react';
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
//import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

//var moment = require('moment-timezone');

const Header = () => {
  let appName = "Wonders of Wind";

  return (
    <>
      <AppBar class="NavBar">
        <Toolbar>
          <Link style={{ textDecoration: "none" }} to="/" className="link">
            <Button
              variant="h6"
              align="left"
              component="div"
              sx={{ mr: 2, flexGrow: 1 }}
            >
              {appName}
            </Button>
          </Link>
          <Link to="/login">
            <Button class="linkBoxes">Login </Button>
          </Link>
          <Link to="/signup">
            <Button class="linkBoxes">Sign up</Button>
          </Link>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
