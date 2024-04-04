import React from 'react';
import { BrowserRouter as Router, Route,Routes, Link } from 'react-router-dom';
import Top from './Top';
import UserInfoPanel from './UserInfoPanel';
import ContentArea from './ContentArea';
import './App.css';
import HomePage from './HomePage';
import Setup from '../Setup/Setup';


function App(){
  return(
    <Router>
        <Routes>
          <Route path='/' element={<HomePage/>} />
          <Route path='/setup' element={<Setup/>}/>

        </Routes>


      </Router>
  )

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
