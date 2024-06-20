import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Link } from "react-router-dom";
import usericon from "./img/user_icon.png";
import setupicon from "./img/setup.png";
import "./HomePage.css";
import Top from "./Top";
import axios from "axios";

const HomePage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null); // intervalRef 선언
  const [resultImageUrl, setResultImageUrl] = useState('');
  const [streamActive, setStreamActive] = useState(false);
  const [capturing, setCapturing] = useState(false);
<<<<<<< Updated upstream
  const [previewActive, setPreviewActive] = useState(false);
  const [startsendFrame, setStartSendFrame] = useState(true);

  const [userList, setUserList] = useState([]);
=======
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userList, setUserList] = useState([]);
  const [userID, setUserID] = useState("");
  const [curState, setCurState] = useState(0);


  const handleResetClick = () => {
    window.location.reload();
  };
>>>>>>> Stashed changes

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/users")
      .then((response) => {
        console.log(response.data);
        setUserList(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the user list!", error);
      });
  }, []);

  useEffect(() => {
    const userIDFromCookie = getCookie("userID");
    setUserID(userIDFromCookie);
  }, []);

<<<<<<< Updated upstream
  useEffect(() => {
    if (streamActive && (previewActive || capturing)) {
      intervalRef.current = setInterval(captureAndSendFrame, 100);
    } else {
      clearInterval(intervalRef.current);
=======

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  const stopCapture = () => {
    if (streamActive || capturing) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      setStreamActive(false);
      setCapturing(false);
      videoRef.current.srcObject = null;
      console.log("Streaming and capturing stopped.");
>>>>>>> Stashed changes
    }
  };

<<<<<<< Updated upstream
    return () => clearInterval(intervalRef.current);
  }, [streamActive, previewActive, capturing]);
=======
  const process_face = () => {
    console.log("process");
    if (!streamActive) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setStreamActive(true);
            setCapturing(true);
            setCurState(1);
          }
        })
        .catch(error => console.error(error));
    } else if (capturing) {
      setCurState(0);
    }
  };
>>>>>>> Stashed changes

  const captureFrameLoop_process = () => {
    console.log("process_loop");
    console.log(streamActive);
    console.log(capturing);

    if (!streamActive || !capturing) {
      return;
    }
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasRef.current.toBlob(blob => {
      sendFrame_process(blob);
    }, 'image/jpeg');
  };

  const sendFrame_process = (blob) => {
    console.log("process_send");
    let formData = new FormData();
    formData.append("user_id", 1);
    if (selectedUsers) {
      for (let i = 0; i < selectedUsers.length; i++) {
        const user = selectedUsers[i];
        formData.append('selected_embedding_ids[]', user);
      }
    } else {
      console.error("selectedUsers is undefined");
    }
    formData.append("frame", blob, "frame.jpg");

    fetch('http://110.9.11.9:5000/process_face', {
      method: 'POST',
      body: formData
    })
    .then(response => response.blob())
    .then(blob => {
      setResultImageUrl(URL.createObjectURL(blob)); // 처리된 이미지 업데이트
    })
    .catch(error => console.error('Error:', error));
  };

  const set_streaming = () => {
    let formData = new FormData();
    formData.append('user_id', '1');
    formData.append('stream_key', '60h0-eeq6-8yh3-tktj-cx33');
    fetch('http://110.9.11.9:5000/set_streaming', {
      method: 'POST',
      body: formData
    })
    .then(response => response.blob())
    .then(blob => {
      // 처리된 이미지 업데이트 (필요시)
    })
    .catch(error => console.error('Error:', error));
  };

  const start_streaming = () => {
    if (!streamActive) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            set_streaming();
            videoRef.current.srcObject = stream;
            setStreamActive(true);
            setCapturing(true);
            setCurState(2);
          }
        })
        .catch(error => console.error(error));
    } else if (capturing) {
      setCurState(0);
      let formData = new FormData();
      formData.append('user_id', '1');
      fetch('http://110.9.11.9:5000/stop_streaming', {
        method: 'POST',
        body: formData
      }).then(response => {
        console.log('Streaming stopped');
      }).catch(error => console.error('Error:', error));
    }
  };

  const captureFrameLoop_streaming = () => {
    if (!streamActive || !capturing) {
      return;
    }
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasRef.current.toBlob(blob => {
      sendFrame_streaming(blob);
    }, 'image/jpeg');
  };

  const sendFrame_streaming = (blob) => {
    let formData = new FormData();
    formData.append("user_id", 1);
    if (selectedUsers) {
      for (let i = 0; i < selectedUsers.length; i++) {
        const user = selectedUsers[i];
        formData.append('selected_embedding_ids[]', user);
      }
    } else {
      console.error("selectedUsers is undefined");
    }
    formData.append("frame", blob, "frame.jpg");

    fetch('http://110.9.11.9:5000/start_streaming', {
      method: 'POST',
      body: formData
    })
    .then(response => response.blob())
    .then(blob => {
      setResultImageUrl(URL.createObjectURL(blob)); // 처리된 이미지 업데이트
    })
    .catch(error => console.error('Error:', error));
  };

<<<<<<< Updated upstream
  const handlePreviewClick = useCallback(() => {
    if (!streamActive) return;
    setResultImageVisible(true);
    setPreviewActive((prev) => !prev);

    if (buttonNum === 0) {
      setbuttonTxt("시작하기");
      setbuttonNum(1);
    } else if (buttonNum === 1) {
      stopCapture();
      start_streaming();
      setStartSendFrame(false);
      setbuttonTxt("멈추기");
      setbuttonNum(2);
    } else if (buttonNum === 2) {
      setbuttonTxt("미리보기");
      setbuttonNum(0);
      stopCapture();
    }
  }, [streamActive, buttonNum]);
  const stopCapture = () => {
    if (streamActive) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      setStreamActive(false);
      setCapturing(false);
      videoRef.current.srcObject = null;
      setPreviewActive(false);
      console.log("Streaming and capturing stopped.");
    }
  };

  const captureAndSendFrame = () => {
    if (!canvasRef.current || !videoRef.current) {
      console.error("Canvas or video element is not ready.");
      return;
    }
    const context = canvasRef.current.getContext("2d");
    context.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    canvasRef.current.toBlob((blob) => {
      if (previewActive || capturing) {
        sendFrameAdd(blob);
      }
    }, "image/jpeg");
  };

  const sendFrameAdd = (blob) => {
    let formData = new FormData();
    formData.append("user_id", 1);
    formData.append("selected_user_ids[]", 1);
    formData.append("frame", blob, "frame.jpg");
    if (startsendFrame === true) {
      console.log("시작");
      console.log("startsendFrame");
      fetch("http://127.0.0.1:5000/process_face", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.blob())
        .then((blob) => {
          const objectURL = URL.createObjectURL(blob);
          setResultImageUrl(objectURL);
        })
        .catch((error) => console.error("Error:", error));
    } else {
      console.log("멈춰야하는데?");
      console.log(startsendFrame);
    }
  };

  const set_streaming = (blob) => {
    let formData = new FormData();
    formData.append("user_id", "1");
    formData.append("stream_key", "60h0-eeq6-8yh3-tktj-cx33");
    fetch("http://110.9.11.9:5000/set_streaming", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.blob())
      .then((blob) => {
        //resultImage.src = URL.createObjectURL(blob); // 처리된 이미지 업데이트
      })
      .catch((error) => console.error("Error:", error));
  };
  const start_streaming = () => {
    setCapturing(true);
    if (!streamActive) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.srcObject = stream;
          streamActive = true;
          capturing = true;
          setStreamActive(true);
          captureFrameLoop_streaming();
          setCapturing(true);
          resultImageUrl.style.display = "block"; // 처리 후 영상 보여주기
        })
        .catch((error) => console.error(error));
    } else if (capturing) {
      stopCapture(); // 캡처 중지
      let formData = new FormData();
      formData.append("user_id", "1");
      fetch("http://110.9.11.9:5000/stop_streaming", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          console.log("Streaming stopped");
        })
        .catch((error) => console.error("Error:", error));
    }
  };

  function captureFrameLoop_streaming() {
    if (!streamActive || !capturing) {
      return;
    }
    const context = canvasRef.current.getContext("2d");

    context.drawImage(videoRef, 0, 0, canvasRef.width, canvasRef.height);
    canvasRef.toBlob((blob) => {
      sendFrame_streaming(blob);
    }, "image/jpeg");
    setTimeout(captureFrameLoop_streaming, 100); // 0.1초 간격으로 프레임 캡처
  }

  function sendFrame_streaming(blob) {
    let formData = new FormData();
    formData.append("user_id", "1");
    formData.append("selected_user_ids[]", 1);
    formData.append("frame", blob, ["frame.jpg"]);
    fetch("http://110.9.11.9:5000/start_streaming", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.blob())
      .then((blob) => {
        resultImageUrl.src = URL.createObjectURL(blob); // 처리된 이미지 업데이트
      })
      .catch((error) => console.error("Error:", error));
  }

  const [userID, setUserID] = useState("");

  useEffect(() => {
    // 페이지 로드 시 실행되는 함수
    const userIDFromCookie = getCookie("userID");
    setUserID(userIDFromCookie);
  }, []);

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
=======
  const handleUserSelection = (user) => {
    if (selectedUsers.includes(user)) {
      setSelectedUsers(selectedUsers.filter((selectedUser) => selectedUser !== user));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  useEffect(() => {
    if (curState === 1){
      if (streamActive && capturing) {
        intervalRef.current = setInterval(() => {
          captureFrameLoop_process();
        }, 100);
      }
    }  
    else if(curState === 2){
      if (streamActive && capturing) {
        intervalRef.current = setInterval(() => {
          captureFrameLoop_streaming();
        }, 100);
      }
    }
    else {
      console.log("0");
      stopCapture();
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [curState, streamActive, capturing, captureFrameLoop_process, captureFrameLoop_streaming, stopCapture]);

>>>>>>> Stashed changes
  return (
    <div className="Home-all">
      <div className="Topbox">
        <Top />
      </div>
      <div className="Home-contents">
        <div className="videobox">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: "640px", height: "480px", display: "none" }}
          />
          <canvas
            ref={canvasRef}
            style={{ display: "none" }}
            width="640"
            height="480"
          ></canvas>
          {resultImageUrl && (
            <img src={resultImageUrl} alt="Processed Image" />
          )}
        </div>
        <div className="userbox">
          <div className="UserInfo_top">
            <div className="emptybox"></div>
            <div className="usericon_box">
              <div className="usericon">
                <img
                  className="user_icon"
                  src={usericon}
                  alt="User Icon"
                  style={{ width: "7vh", height: "auto" }}
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
          <div className="users-box">
            <p className="id_text">
              <span>{userID}</span>
            </p>
            <div className="RegisteredUser">
              &nbsp;&nbsp;등록된 사용자&nbsp;&nbsp;
            </div>
            {userList.map((user, index) => (
              <div className="testuser" key={index}>
                <input type="checkbox" />
                <div className="testuserbox">{user}</div>
              </div>
            ))}
            <button className="userplus">
              <Link to="/adduser" className="adduser">
                <div className="plusbutton">+</div>
              </Link>
            </button>
          </div>

          <button
            onClick={process_face}
            className="startProcessButton"
            style={{
              height: "7%",
              width: "100%",
              fontSize: "22px",
              border: "none",
              fontFamily: '"Do Hyeon", sans-serif',
              color: "#8f8e8e",
            }}
          >
            미리보기
          </button>

          <button
            onClick={start_streaming}
            className="startStreamingButton"
            style={{
              height: "7%",
              width: "100%",
              fontSize: "22px",
              border: "none",
              fontFamily: '"Do Hyeon", sans-serif',
              color: "#8f8e8e",
            }}
          >
            시작하기
          </button>
        </div>
      </div>
    </div>
  );
};
export default HomePage;