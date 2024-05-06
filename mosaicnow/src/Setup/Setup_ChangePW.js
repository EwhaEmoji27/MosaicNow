import React from "react";
import Top from "../Home/Top";
import "./Setup_ChangeStreamKey.css";
import usericon from "../Home/img/user_icon.png";
import { Link } from "react-router-dom";
function Setup_ChangePW() {
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
  function changePW() {
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
      alert("새 비밀번호를 입력하세요.");
      return;
    }

    const data = { id, pw };

    fetch("/changePW", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 200) {
          alert("비밀번호가 변경되었습니다.");
          window.location.href = "/home";
        } else if (response.status === 500) {
          alert("다시 시도해주세요");
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
