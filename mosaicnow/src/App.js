import React from 'react';
import Top from './Top';
import UserInfoPanel from './UserInfoPanel';
import ContentArea from './ContentArea';
import './App.css';

function App() {
  return (
      <div className="App">
        <div className='Top'></div>
        <div className="ContentWrapper">
          
          <ContentArea />
          <UserInfoPanel />
        </div>
      </div>
    );
}

export default App;
