import React from "react";

import { Link } from "react-router-dom";

import "./Login_Join.css";

function Join() {
  function submitForm() {
    const id = document.getElementById("id").value;
    const pw = document.getElementById("pw").value;

    if (!id || !pw) {
      alert("ID와 PW를 모두 입력하세요.");
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
          window.location.href = "/home";
        } else if (response.status === 401) {
          alert("다시 시도해주세요!!");
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
    <div className="Login_Join_all">
      <div className="id_to_home">
        <input
          type="text"
          className="input_place_tohome"
          placeholder="아이디"
        />
      </div>
      <div>
        <input
          type="text"
          className="input_place_tohome_PW"
          placeholder="비밀번호"
        />
      </div>
      <Link to="/home">
        <button className="join_check_to_home">확인</button>
      </Link>
      {/*위에 버튼은 홈으로 가는 버튼임 만약 회원가입으로 간다면 아래*/}
    </div>
  );
}

export default Join;
