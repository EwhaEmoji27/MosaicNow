/*import React from "react";
import { Router } from "react-router-dom";
import Top from "./Home/Top";


function Setup(){
    return(
        <Router>
          <div className='Top'>
            <Top />
          </div>
          <div>설정 페이지입니다</div>
        </Router>
    )
    

}

export default Setup;*/

import React from 'react';
import Top from "../Home/Top";
import './Setup.css'

function Setup() {
  return (
    <div className='SetupPage'>
        <div>
            <Top/>
        </div>
        <div className='SetupPage_info'>
          <div className='background'>
            <div className ='userimg'>이미지</div>
            <div className='userid'>아이디 출력</div>
            <div className='userPW'>비밀번호 입력</div>
            <div className='check'>비밀번호 확인</div>
          </div>
        </div>
    </div>
  );
}

export default Setup;