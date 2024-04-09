import React, { useState, useRef, useEffect } from "react";

const ProcessFace = () => {
  const [streamActive, setStreamActive] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [frameCount, setFrameCount] = useState(0);
  const videoElement = useRef(null);
  const canvasElement = useRef(null);
  const resultImage = useRef(null);

  useEffect(() => {
    if (streamActive) {
      const captureFrameLoopAdd = () => {
        if (!streamActive || frameCount > 50) {
          stopCapture();
          return;
        }
        const context = canvasElement.current.getContext("2d");
        context.drawImage(
          videoElement.current,
          0,
          0,
          canvasElement.current.width,
          canvasElement.current.height
        );
        canvasElement.current.toBlob((blob) => {
          sendFrameAdd(blob);
          setFrameCount((prevCount) => prevCount + 1);
        }, "image/jpeg");
        setTimeout(captureFrameLoopAdd, 100);
      };
      captureFrameLoopAdd();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamActive, frameCount]);

  const addFace = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoElement.current.srcObject = stream;
        setStreamActive(true);
        setFrameCount(0);
        resultImage.current.style.display = "block";
      })
      .catch((error) => console.error(error));
  };

  const stopCapture = () => {
    if (streamActive) {
      let tracks = videoElement.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      setStreamActive(false);
      setCapturing(false);
      videoElement.current.srcObject = null;
      console.log("Streaming and capturing stopped.");
    }
  };

  const sendFrameAdd = (blob) => {
    let formData = new FormData();
    formData.append("user_id", 1);
    formData.append("frame", blob, "frame.jpg");
    fetch("http://127.0.0.1:5000/add_face", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.blob())
      .then((blob) => {
        resultImage.current.src = URL.createObjectURL(blob);
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div>
      <video ref={videoElement} id="videoElement" />
      <canvas ref={canvasElement} id="canvasElement" />
      <img ref={resultImage} id="resultImage" style={{ display: "none" }} />
      <button id="startAddButton" onClick={addFace}>
        Start Add
      </button>
      {/* Add other buttons and UI elements here */}
    </div>
  );
};

export default ProcessFace;
