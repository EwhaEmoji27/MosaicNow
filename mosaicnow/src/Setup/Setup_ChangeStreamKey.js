import React from "react";
import Top from "../Home/Top";
import "./Setup_ChangeStreamKey.css";
import usericon from "../Home/img/user_icon.png";
import { Link } from "react-router-dom";
function Setup_ChangeStreamKey() {
  // 페이지 로드 시 실행되는 함수
  window.onload = function () {
    // 쿠키에서 사용자 ID를 가져와서 id_text 엘리먼트에 적용
    const userID = getCookie("userID");
    document.getElementById("userID").innerText = userID;
  };

  // 쿠키에서 특정 이름의 쿠키 값을 가져오는 함수
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
  function toSetUp2() {
    window.location.href = "/setUp2";
  }
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
                  placeholder="스트림키 입력"
                />
              </div>
            </div>
            <Link to="/home">
              <button className="GOHome">확인</button>
            </Link>
            {/*유라야 여기서 확인 누르면 스트림 키 수정해서 데이터베이스로 전송*/}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setup_ChangeStreamKey;
