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
      <div>두 번째 페이지 입니다</div>
      <div className="SetupPage_info">
        <div className="back">
          <div className="usericon_setup">
            <img className="user_icon_" src={usericon} alt="User Icon" />
          </div>
          <div>아이디</div>
          <div className="input_and_check">
            <div className="pw_check">
              <button className="Change_StreamKey">스트림키 변경</button>
              <button className="Change_PW">비밀번호 변경</button>
            </div>
            <button className="check">확인</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setup;