import React, { useEffect, useRef } from 'react';
import './Adduser.css';
import Top from "../Home/Top";

function Adduser(){

    const videoRef = useRef(null);
    useEffect(() => {
        if (navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
              // video 태그에 스트림 연결
              if (videoRef.current) {
                videoRef.current.srcObject = stream;
              }
            })
            .catch(err => {
              console.error("카메라에 연결할 수 없습니다:", err);
            });
        }
      }, []);
    

    return(
        <div className="Adduser_background">
            <div><Top/></div>
            <div className="Adduser">
                <video className="Camera" ref={videoRef} autoPlay playsInline />
            </div>
        </div>
    );

   


}
export default Adduser;