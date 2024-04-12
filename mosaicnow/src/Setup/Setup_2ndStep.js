/*확인 눌렀을 때 비밀번호 같으면 스트리밍키 입력으로*/

import React from "react";
import Top from "../Home/Top";
import "./Setup.css";
import usericon from "../Home/img/user_icon.png";

function Setup() {
  return (
    <div className="SetupPage" style={{ height: "100%" }}>
      <div>
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
              <div className="pw_text"> 스트림 키:</div>
              <div className="input_PW">여기에 스트림키 입력</div>
            </div>
            <button className="check">확인</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setup;
