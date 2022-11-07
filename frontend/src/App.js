import './App.css';
import { BrowserRouter as Router, Routes, Route}
    from 'react-router-dom';
import React from 'react';
//import React, { useState, useEffect }  from 'react';

import Header from './pages/home';
import Home from './pages/homepage';

//var moment = require('moment-timezone');

function App() {
 
  return(
  <Router>
    <Routes>
      <Route exact2 path='/' exact element={<Home />} />
      <Route exact1 path='/header' exact element={<Header />} />
      

    </Routes>
  </Router>
  
  )
}

export default App;
