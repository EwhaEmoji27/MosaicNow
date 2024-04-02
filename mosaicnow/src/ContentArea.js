import React, { useEffect, useRef } from 'react';
import './App.css';

function ContentArea() {
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

  return (
    <div className="ContentArea">
      <video className="Camera" ref={videoRef} autoPlay playsInline />
    </div>
  );
}

export default ContentArea;
