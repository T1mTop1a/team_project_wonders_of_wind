import React, {useState, useEffect} from "react";
import API from '../API';
import "./css/navBar.css";
import { Link } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
//import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";


const Header = () => {
  let appName = "Wonders of Wind";
  const [buttons, setButtons] = useState(<></>);

  function logOutAndRefresh() {
    API.logOut();
    window.location.assign("/");
  }

  useEffect(() => {
    API.isLoggedIn().then(loggedIn => {
      if (loggedIn) {
        setButtons(
          <div>
            <Link to="/viewTurbines">
              <Button class="linkBoxes">My turbines </Button>
            </Link>
            <Link to="/">
              <Button class="linkBoxes" onClick={logOutAndRefresh}>Log out</Button>
            </Link>
          </div>
        );
      } else {
        setButtons(
          <div>
            <Link to="/login">
              <Button class="linkBoxes">Login</Button>
            </Link>
            <Link to="/signup">
              <Button class="linkBoxes">Sign up</Button>
            </Link>
          </div>
        );
      }
    });
  }, []);

  return (
    <>
      <AppBar class="NavBar" data-testid="nav bar">
        <Toolbar>
          <Link style={{ textDecoration: "none" }} to="/" className="link">
            <Button
              class = "link"
              data-testid="home button"
              variant="h6"
              align="left"
              component="div"
              // sx={{fontFamily: 'Jost, sans-serif', fontSize: '32px',textTransform: 'none', mr: 2, flexGrow: 1 }}
            >
              {appName}
            </Button>
          </Link>

          {buttons}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
