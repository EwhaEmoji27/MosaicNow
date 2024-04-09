import React, { useState } from "react";
//import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Top from "./Top";
import UserInfoPanel from "./UserInfoPanel";
import ContentArea from "./ContentArea";
import ProcessFace from "./ProcessFace";

import "./App.css";

function HomePage() {
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [userInput, setUserInput] = useState(""); // 사용자 입력 값을 상태로 관리

  const handlePreviewClick = () => {
    setIsPreviewing(true);
  };

  const handleAddUser = (input) => {
    // 사용자가 등록 버튼을 눌렀을 때 실행되는 함수
    // input은 HTML 파일에서 받은 인풋 값입니다.
    setUserInput(input); // 입력 값 업데이트
  };

  // React Native WebView 메시지 수신
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.onMessage = (event) => {
      const inputFromHtml = event.data;
      handleAddUser(inputFromHtml);
    };
  }

  return (
    <div className="App">
      <div className="Top">
        <Top />
      </div>

      <div className="ContentWrapper">
        {isPreviewing ? <ProcessFace /> : <ContentArea />}

        <UserInfoPanel
          onPreviewClick={handlePreviewClick}
          userInput={userInput}
        />
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
