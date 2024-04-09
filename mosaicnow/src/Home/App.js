import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import HomePage from "./HomePage";
import Setup from "../Setup/Setup";
import Adduser from "../AddUser/AddUser";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/adduser" element={<Adduser />} />
      </Routes>
    </Router>
  );
}
/*function App() {
  return (
    <Router>
    <div className="App">

      <div className='Top'>
        <Top />
        
      </div>

    <div className="ContentWrapper">
      
      <ContentArea />
      
      <UserInfoPanel />

    </div>
  </div>
  </Router>
  );
}*/

export default App;
