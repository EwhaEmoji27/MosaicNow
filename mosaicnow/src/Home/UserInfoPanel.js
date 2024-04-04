import React from 'react';
import { Link } from 'react-router-dom';
import usericon from './img/user_icon.png'  


function UserInfoPanel() {
  return (
    <div className="UserInfoPanel">
      <div className='UserInfo_top'>
        <div className='emptybox'></div>
          <div className='usericon_box'>
            <div className='usericon'>
                <img className='user_icon' src={usericon} alt="User Icon" style={{ width: '70%', height: 'auto' }} />
            </div>
          </div>
        <div className='gosetup'><p id='al'><Link to="/setup">알람</Link></p></div>
      </div>
        <div><p>id:letgogogo  </p></div>
            <div className='RegisteredUser'>
                &nbsp;&nbsp;등록된 사용자&nbsp;&nbsp;
            </div>
            <div className='usermanagement'>
                <div className='username'>name</div>
                
                <div className='userplus'><strong>+</strong></div>
            </div>
            <div className='startButton'>미리보기</div>
        
    </div>
  );
}

export default UserInfoPanel;