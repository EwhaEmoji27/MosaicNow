import React from "react";
import Top from "../Home/Top";
import "./Setup_ChangeStreamKey.css";
import usericon from "../Home/img/user_icon.png";
import { Link } from "react-router-dom";
function Setup_ChangeStreamKey() {
  return (
    <div className="Setup_Page" style={{ height: "100%" }}>
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
              <div className="input_STK">여기에 스트림키 입력</div>

              <button className="Change_StreamKey">스트림키 변경</button>

              <Link to="/">
                <button className="GOHome">확인 누르면 홈으로 가야 함</button>
              </Link>
            </div>
          </div>

          <button className="check">확인</button>
        </div>
      </div>
    </div>
  );
}

export default Setup_ChangeStreamKey;
