import React from "react";

import { Link } from "react-router-dom";

import "./Login_Join.css";

function Join() {
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
