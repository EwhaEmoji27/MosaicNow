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

  function submitForm() {
    // 쿠키에서 사용자 ID를 가져옵니다.
    const id = getCookie("userID");

    // 사용자 ID가 없으면 알림을 표시하고 함수를 종료합니다.
    if (!id) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 입력된 비밀번호를 가져옵니다.
    const pw = document.getElementById("input_place").value;

    // 만약 입력된 비밀번호가 없다면 알림을 표시하고 함수를 종료합니다.
    if (!pw) {
      alert("비밀번호를 입력하세요.");
      return;
    }

    const data = { id, pw };

    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 200) {
          window.location.href = "/setUp2";
        } else if (response.status === 401) {
          alert("비밀번호가 잘못되었습니다. 다시 시도해주세요!!");
        } else {
          throw new Error("Something went wrong on the server");
        }
      })
      .catch((error) => {
        console.error("Error occurred:", error);
        alert("Error occurred. Please try again.");
      });
  }
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
