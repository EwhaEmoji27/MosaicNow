import React, { useState } from "react";
import { Link } from "react-router-dom";
import usericon from "./img/user_icon.png";
import setupicon from "./img/setup.png";

function UserInfoPanel({ onPreviewClick, userInput, handleInputChange }) {
  return (
    <div className="UserInfoPanel">
      <div className="UserInfo_top">
        <div className="emptybox"></div>
        <div className="usericon_box">
          <div className="usericon">
            <img
              className="user_icon"
              src={usericon}
              alt="User Icon"
              style={{ width: "70%", height: "auto" }}
            />
          </div>
        </div>
        <div className="gosetup">
          <p id="al">
            <Link to="/setup" className="gosetup">
              <img src={setupicon} alt="setupicon" />
            </Link>
          </p>
        </div>
      </div>
      <div className="this"></div>

      <p className="id_text">id:letgogogo </p>

      <div className="RegisteredUser">
        &nbsp;&nbsp;등록된 사용자&nbsp;&nbsp;
      </div>
      <div className="usermanagement">
        <div className="username">user</div>

        <div className="username"></div>
        <button className="userplus">
          <Link to="/adduser" className="adduser">
            <div>+</div>
          </Link>
        </button>
      </div>

      <button onClick={onPreviewClick} className="startButton">
        미리보기
      </button>
      <a href="/video.html">
        <button className="startButton">html 코드</button>
      </a>
    </div>
  );
}

export default UserInfoPanel;
/*
                <ul>
                <li>
                    <Link to="/Adduser" className="adduser" style={{ textDecoration: 'none' }}>
                        <div className='userplus'>+</div>
                    </Link>
                </li>
                </ul>
                */
