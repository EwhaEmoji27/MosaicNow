// App.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Adduser.css";

function Adduser() {
  const [inputFieldValue, setInputFieldValue] = useState("");
  const [streamActive, setStreamActive] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [frameCount, setFrameCount] = useState(0);
  const [resultImageUrl, setResultImageUrl] = useState(""); // 결과 이미지 URL 상태
  const navigate = useNavigate();

  useEffect(() => {
    addFace();
  }, []);

  useEffect(() => {
    if (resultImageUrl) {
      const resultImage = document.getElementById("resultImage");
      if (resultImage) {
        resultImage.style.display = "block";
      }
    }
  }, [resultImageUrl]); // resultImageUrl이 변경될 때마다 실행
  const handleInputChange = (event) => {
    setInputFieldValue(event.target.value);
  };

  const handleSubmit = () => {
    console.log("button");
    const userInput = inputFieldValue;
    console.log("Submitted:", userInput);
    navigate("/"); // 등록 후 homepage로 이동
  };

  const addFace = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const videoElement = document.getElementById("videoElement");
        videoElement.srcObject = stream;
        setStreamActive(true);
        setFrameCount(0);
        captureFrameLoopAdd();
        const resultImage = document.getElementById("resultImage");
        resultImage.style.display = "block";
        processFace();
      })
      .catch((error) => console.error(error));
  };

  const captureFrameLoopAdd = () => {
    if (!streamActive || frameCount > 50) {
      stopCapture();
      return;
    }
    const videoElement = document.getElementById("videoElement");
    const canvasElement = document.getElementById("canvasElement");
    const context = canvasElement.getContext("2d");
    context.drawImage(
      videoElement,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    canvasElement.toBlob((blob) => {
      sendFrameAdd(blob);
      setFrameCount(frameCount + 1);
    }, "image/jpeg");
    setTimeout(captureFrameLoopAdd, 100);
  };

  const stopCapture = () => {
    if (streamActive) {
      const videoElement = document.getElementById("videoElement");
      const tracks = videoElement.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      setStreamActive(false);
      setCapturing(false);
      videoElement.srcObject = null;
      console.log("Streaming and capturing stopped.");
    }
  };

  const sendFrameAdd = (blob) => {
    console.log("sendFramAdd start");
    const formData = new FormData();
    formData.append("user_id", 1);
    formData.append("frame", blob, "frame.jpg");
    fetch("http://127.0.0.1:5000/add_face", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setResultImageUrl(url); // 결과 이미지 URL 설정
        console.log("Result Image URL:", url); // URL 로그 확인
      })
      .catch((error) => console.error("Error:", error));
  };

  const processFace = () => {
    if (!streamActive) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          const videoElement = document.getElementById("videoElement");
          videoElement.srcObject = stream;
          setStreamActive(true);
          setCapturing(true);
          captureFrameLoopProcess();
          const resultImage = document.getElementById("resultImage");
          resultImage.style.display = "block";
        })
        .catch((error) => console.error(error));
    } else if (capturing) {
      stopCapture();
    }
  };

  const captureFrameLoopProcess = () => {
    if (!streamActive || !capturing) {
      return;
    }
    const videoElement = document.getElementById("videoElement");
    const canvasElement = document.getElementById("canvasElement");
    const context = canvasElement.getContext("2d");
    context.drawImage(
      videoElement,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    canvasElement.toBlob((blob) => {
      sendFrameProcess(blob);
    }, "image/jpeg");
    setTimeout(captureFrameLoopProcess, 100);
  };

  const sendFrameProcess = (blob) => {
    const formData = new FormData();
    formData.append("user_id", "1");
    formData.append("selected_user_ids[]", 1);
    formData.append("frame", blob, ["frame.jpg"]);
    fetch("http://127.0.0.1:5000/process_face", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.blob())
      .then((blob) => {
        setResultImageUrl(URL.createObjectURL(blob));
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div>
      <div className="video_background">
        <video
          id="videoElement"
          autoPlay={true}
          width="640"
          height="480"
          style={{ display: "none" }}
        ></video>
      </div>
      <canvas
        id="canvasElement"
        width="640"
        height="480"
        style={{ display: "none" }}
      ></canvas>
      <div className="resultImageContainer">
        <img
          id="resultImage"
          src={resultImageUrl}
          alt="Processed Image"
          style={{ maxWidth: "640px" }}
        />
      </div>
      <div className="input-container">
        <label htmlFor="inputField">이름을 입력하세요:</label>
        <input
          type="text"
          id="inputField"
          name="inputField"
          value={inputFieldValue}
          onChange={handleInputChange}
        />
        <button id="submitButton" onClick={handleSubmit}>
          등록
        </button>
      </div>
    </div>
  );
}

export default Adduser;
