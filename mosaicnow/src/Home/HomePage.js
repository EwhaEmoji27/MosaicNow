import React, {
  useRef,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import ImageContext from "../ImageContext/ImageContext";
import { Link } from "react-router-dom";
import usericon from "./img/user_icon.png";
import setupicon from "./img/setup.png";
import "./HomePage.css";
import Top from "./Top";
import axios from "axios";

const HomePage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { resultImageUrl, setResultImageUrl } = useContext(ImageContext);
  const [streamActive, setStreamActive] = useState(false);
  const [resultImageVisible, setResultImageVisible] = useState(false);
  const intervalRef = useRef(null);
  const [buttonTxt, setButtonTxt] = useState("미리보기");
  const [buttonNum, setButtonNum] = useState(0);
  const [capturing, setCapturing] = useState(false);
  const [previewActive, setPreviewActive] = useState(false);
  const [startSendFrame, setStartSendFrame] = useState(true);

  const [userList, setUserList] = useState([]);

  const [selectedUsers, setSelectedUsers] = useState([]);

  const [isVideoBoxVisible, setIsVideoBoxVisible] = useState(true);
  
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
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
        }
      } catch (err) {
        console.error("카메라에 연결할 수 없습니다:", err);
        setStreamActive(false);
      }
    };

    getUserMedia();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        setStreamActive(false);
      }
    };
  }, []);

  useEffect(() => {
    if (streamActive && (previewActive || capturing)) {
      intervalRef.current = setInterval(captureAndSendFrame, 100);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [streamActive, previewActive, capturing]);

  useEffect(() => {
    console.log(buttonNum);
  }, [buttonNum]);

  const handleUserSelection = (user) => {
    if (selectedUsers.includes(user)) {
      setSelectedUsers(selectedUsers.filter((selectedUser) => selectedUser !== user));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };
  
  const handlePreviewClick = useCallback(() => {
    if (!streamActive) return;
    setResultImageVisible(true);
    setPreviewActive((prev) => !prev);

    if (buttonNum === 0) {
      setStreaming();
      setButtonTxt("시작하기");
      Click();
      setButtonNum(1);
    } else if (buttonNum === 1) {
      setButtonTxt("멈추기");
      startStreaming();
      console.log('이것도 안되면 진짜 노답');
      setButtonNum(2);
    } else if (buttonNum === 2) {
      setButtonTxt("미리보기");
      setButtonNum(0);
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
        sendFrameAdd(blob, selectedUsers);
      }
    }, "image/jpeg");
  };

  const sendFrameAdd = (blob, selectedUsers) => {
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
      console.log("startSendFrame");
      fetch("http://localhost:5000/process_face", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.blob())
        .then((blob) => {
          const objectURL = URL.createObjectURL(blob);
          setResultImageUrl(objectURL);
        })
        .catch((error) => console.error("Error:", error));
   
  };

  const setStreaming = () => {
    let formData = new FormData();
    formData.append("user_id", "1");
    formData.append("stream_key", "60h0-eeq6-8yh3-tktj-cx33");
    fetch("http://localhost:5000/set_streaming", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.blob())
      .then((blob) => {
        // 처리된 이미지 업데이트
      })
      .catch((error) => console.error("Error:", error));
  };

  const startStreaming = () => {
    setCapturing(true);
    console.log('0');
    if (!streamActive) {
      console.log('1');
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
          setCapturing(true);
          captureFrameLoopStreaming();
          // 처리 후 영상 보여주기
        })
        .catch((error) => console.error(error));
    } else if (capturing) {
      console.log('2');
      stopCapture(); // 캡처 중지
      let formData = new FormData();
      formData.append("user_id", "1");
      fetch("http://localhost:5000/stop_streaming", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          console.log("Streaming stopped");
        })
        .catch((error) => console.error("Error:", error));
    }
  };

  function captureFrameLoopStreaming() {
    if (!streamActive || !capturing) {
      console.log('3');
      return;
    }
    const context = canvasRef.current.getContext("2d");
    console.log('4');
    context.drawImage(videoRef.current, 0, 0, (canvasRef.current.width*2), (canvasRef.current.height*2));
    canvasRef.current.toBlob((blob) => {
      sendFrameStreaming(blob);
      console.log('5');
    }, "image/jpeg");
    setTimeout(captureFrameLoopStreaming, 100); // 0.1초 간격으로 프레임 캡처
  }

  function sendFrameStreaming(blob) {
    let formData = new FormData();
    formData.append("user_id", "1");
    formData.append("selected_user_ids[]", 1);
    formData.append("frame", blob, ["frame.jpg"]);
    console.log('6');
    fetch("http://localhost:5000/start_streaming", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.blob())
      .then((blob) => {
        // 처리된 이미지 업데이트
        console.log('7');
      })
      .catch((error) => console.error("Error:", error));
  }

  const [userID, setUserID] = useState("");

  useEffect(() => {
    const userIDFromCookie = getCookie("userID");
    setUserID(userIDFromCookie);
  }, []);

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  const Click = () => {
    setIsVideoBoxVisible(false);
  };

  return (
    <div className="Home-all">
      <div className="Topbox">
        <Top />
      </div>
      <div className="Home-contents">
        <div className="videobox" style={{ width: "840px"}}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: "800px", height: "530px", display: isVideoBoxVisible ? 'block' : 'none' }}
            
          />
          <canvas
            ref={canvasRef}
            style={{ display: "none" }}
            width="713"
            height="525"
          ></canvas>
          {resultImageUrl && resultImageVisible && (
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
                <input type="checkbox" onChange={() => handleUserSelection(user)} />
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
            onClick={handlePreviewClick}
            className="startProcessButton "
            style={{
              height: "7%",
              width: "100%",
              fontSize: "22px",
              border: "none",
              fontFamily: '"Do Hyeon", sans-serif',
              color: "#8f8e8e",
            }}
          >
            {buttonTxt}
          </button>

        </div>
      </div>
    </div>
  );
};

export default HomePage;
