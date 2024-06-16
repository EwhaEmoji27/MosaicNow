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
  const [buttonTxt, setbuttonTxt] = useState("미리보기");
  const [buttonNum, setbuttonNum] = useState(0);
  const [capturing, setCapturing] = useState(false);
  const [previewActive, setPreviewActive] = useState(false);
  const [startSendFrame, setStartSendFrame] = useState(true);

  const [startSetStream, setStartSetStream] = useState(false);
  const [userList, setUserList] = useState([]);

  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://110.9.11.9:8000/api/users")
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
    } else if (startSendFrame === false) {
      intervalRef.current = setInterval(captureFrameLoop_streaming, 100);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [streamActive, previewActive, capturing, startSendFrame]);

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
      setbuttonTxt("시작하기");
      setbuttonNum(1);
    } else if (buttonNum === 1) {
      setStartSetStream(true);
      console.log("startsetStream은 ");
      console.log(startSetStream);
      stopCapture();

      setTimeout(() => {
        start_streaming();
      }, 0);
      setStartSendFrame(false);

      setbuttonTxt("멈추기");
      console.log("!!");
      console.log(startSendFrame);
      setbuttonNum(2);
    } else if (buttonNum === 2) {
      console.log("버튼 누름");
      window.location.reload(true);
    }
  }, [streamActive, buttonNum]);
  const stopCapture = () => {
    if (streamActive) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      setStreamActive(false);
      setCapturing(false);
      setPreviewActive(false);
      setStartSendFrame(false);
      videoRef.current.srcObject = null;

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
        if (startSendFrame) {
          sendFrameAdd(blob, selectedUsers);
        } else {
          console.log("멈춰라 얍");
        }
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
    if (startSendFrame === true) {
      console.log("시작");
      console.log("startsendFrame");
      fetch("http://110.9.11.9:5000/process_face", {
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
      console.log(startSendFrame);
    }
  };

  useEffect(() => {
    console.log("바뀜 startSendFrame:", startSendFrame);
  }, [startSendFrame]);

  useEffect(() => {
    if (startSetStream) {
      console.log("불러짐0");
      let formData = new FormData();
      formData.append("user_id", "1");
      formData.append("stream_key", "60h0-eeq6-8yh3-tktj-cx33");

      console.log("불러짐1");
      console.log(startSetStream);
      if (startSetStream === true) {
        console.log("불러짐1-2");
        fetch("http://110.9.11.9:5000/set_streaming", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.blob())
          .then((blob) => {
            //resultImage.src = URL.createObjectURL(blob); // 처리된 이미지 업데이트
          })
          .catch((error) => console.error("Error:", error));
      } else {
        console.log("스트리밍 중지");
      }
    }
  }, [startSetStream]);
  const start_streaming = () => {
    console.log("start_streaming입니다");
    setCapturing(true);
    if (!streamActive) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
          capturing = true;
          setStreamActive(true);
          captureFrameLoop_streaming();
          setCapturing(true);
          resultImageUrl.style.display = "block"; // 처리 후 영상 보여주기
        })
        .catch((error) => console.error(error));
    } else if (capturing) {
      // 캡처 중지

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
    console.log("스트리밍 과정에 들어가나");

    const context = canvasRef.current.getContext("2d");
    console.log("호출");
    context.drawImage(videoRef.current, 0, 0, (canvasRef.current.width*2), (canvasRef.current.height*2));
    canvasRef.current.toBlob((blob) => {
      console.log("함수 호출");
      sendFrame_streaming(blob, selectedUsers);
    }, "image/jpeg");
    setTimeout(captureFrameLoop_streaming, 100); // 0.1초 간격으로 프레임 캡처
  }

  function sendFrame_streaming(blob, selectedUsers) {
    console.log("스트리밍 과정!");
    let formData = new FormData();
    formData.append("user_id", "1");
    if (selectedUsers) {
      for (let i = 0; i < selectedUsers.length; i++) {
          const user = selectedUsers[i];
          formData.append('selected_embedding_ids[]', user);
      }
  } else {
      console.error("selectedUsers is undefined");
  }
  
    formData.append("frame", blob, ["frame.jpg"]);
    fetch("http://110.9.11.9:5000/start_streaming", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.blob())
      .then((blob) => {
        setResultImageUrl(URL.createObjectURL(blob)); // 수정된 부분
      })
      .catch((error) => console.error("Error:", error));
  }

  const [userID, setUserID] = useState("");

  const handleResetClick = () => {
    window.location.reload();
  };

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
