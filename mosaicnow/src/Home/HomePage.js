import React from 'react';
//import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Top from './Top';
import UserInfoPanel from './UserInfoPanel';
import ContentArea from './ContentArea';

import './App.css';

function HomePage() {
    return(
        <div className="App">

            <div className='Top'>
                <Top />
            </div>

            <div className="ContentWrapper">
            
                <ContentArea />
                
                <UserInfoPanel />
            
            </div>
        </div>
);
    
}

export default HomePage;

/*function App(){
  return(
    <Router>
      

        <div className="App">

          <div className='Top'>
            <Top />
            
          </div>
        <Routes>
          <Route path='/' component={HomePage} />
          <Route path='/setup' element={<Setup/>}/>

        </Routes>

          <div className="ContentWrapper">

            <ContentArea />

            <UserInfoPanel />

          </div>
        </div>
      </Router>
  )

}*/