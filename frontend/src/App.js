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
        <Route exact path="/" element={<Home />} />
        <Route exact path="/header" element={<Header />} />
        <Route exact path="/signup" element={<SignUp />} />
        <Route exact path="/login" element={<LogIn />} />
        <Route exact path="/editTurbine" element={<EditTurbine />} />
      </Routes>
    </Router>
  );
}

export default App;
