import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";

import Header from "./pages/navBar";
import Home from "./pages/homepage";
import SignUp from "./pages/signup";
import LogIn from "./pages/login";
import AddTurbine from "./pages/addTurbine";
import ViewTurbines from "./pages/viewTurbines";
import EditTurbine from "./pages/editTurbine";


function App() {
  return (
    <Router>
      <Routes>
          <Route exact path="/" exact element={<Home />} />
          <Route exact path="/header" exact element={<Header />} />
          <Route exact path="/signup" exact element={<SignUp />} />
          <Route exact path="/login" exact element={<LogIn />} />
          <Route exact path="/addTurbine" exact element={<AddTurbine />} />
          <Route exact path="/viewTurbines" exact element={<ViewTurbines />} />
          <Route exact path="/editTurbine" exact element={<EditTurbine />} />
      </Routes>
    </Router>
  );
}

export default App;
