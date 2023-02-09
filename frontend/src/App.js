import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";

import Header from "./pages/home";
import Home from "./pages/homepage";
import SignUp from "./pages/signup";
import LogIn from "./pages/login";
import EditTurbine from "./pages/EditTurbine";
import ViewTurbines from "./pages/viewTurbines";


function App() {
  return (
    <Router>
      <Routes>
          <Route exact path="/" exact element={<Home />} />
          <Route exact path="/header" exact element={<Header />} />
          <Route exact path="/signup" exact element={<SignUp />} />
          <Route exact path="/login" exact element={<LogIn />} />
          <Route exact path="/editTurbine" exact element={<EditTurbine />} />
          <Route exact path="/viewTurbines" exact element={<ViewTurbines />} />
      </Routes>
    </Router>
  );
}

export default App;
