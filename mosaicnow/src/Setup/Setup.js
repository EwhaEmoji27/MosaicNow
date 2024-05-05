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

import React, { useState } from "react";
import Top from "../Home/Top";
import "./Setup.css";
import usericon from "../Home/img/user_icon.png";
import { Link } from "react-router-dom";

function Setup({ toggleView }) {
  return (
    <div className="SetupPage" style={{ height: "100%" }}>
      <div className="Top">
        <Top />
      </div>

      <div className="SetupPage_info">
        <div className="back">
          <div className="usericon_setup">
            <img className="user_icon_" src={usericon} alt="User Icon" />
          </div>
          <div>아이디</div>
          <div className="input_and_check">
            <div className="pw_check">
              <div className="input_place_PW">
                <input
                  type="text"
                  className="input_place"
                  placeholder="비밀번호 확인"
                />
              </div>
            </div>

            <button onClick={toggleView} className="check">
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Setup_2ndStep() {
  return (
    <div className="SetupPage" style={{ height: "100%" }}>
      <div className="Top">
        <Top />
      </div>

      <div className="SetupPage_info">
        <div className="back">
          <div className="usericon_setup">
            <img className="user_icon_" src={usericon} alt="User Icon" />
          </div>
          <div>아이디</div>
          <div className="input_and_check">
            <div className="Change_info">
              <Link to="/setup_stk">
                <button className="Change_StreamKey">스트림키 변경</button>
              </Link>
              <Link to="/setup_pw">
                <button className="Change_PW">비밀번호 변경</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ViewChange() {
  //여기서 데이터베이스 연결, 비밀번호 확인
  const [viewNext, setViewNext] = useState(false); // 초기 상태를 false로 설정

  const toggleView = () => {
    setViewNext(!viewNext); // 현재 상태를 반전시킴
  };

  return (
    <div>
      {viewNext ? <Setup_2ndStep /> : <Setup toggleView={toggleView} />}
    </div>
  );
}

export default ViewChange;
