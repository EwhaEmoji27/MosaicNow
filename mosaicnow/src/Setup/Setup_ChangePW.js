import React from "react";
import Top from "../Home/Top";
import "./Setup_ChangeStreamKey.css";
import usericon from "../Home/img/user_icon.png";
import { Link } from "react-router-dom";
function Setup_ChangePW() {
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
            <div className="Change_Info_box">
              <div className="input_place_box">
                <input
                  type="text"
                  className="input_place"
                  placeholder="새비밀번호 입력"
                />
              </div>
            </div>
            <Link to="/home">
              <button className="GOHome">확인</button>
            </Link>
            {/*유라야 여기서 비밀번호 수정해서 데이터 베이스로 전송*/}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setup_ChangePW;
