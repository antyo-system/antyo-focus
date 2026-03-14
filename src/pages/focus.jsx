import React, { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export default function FocusScreen() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [status, setStatus] = useState("DISTRACTED");
  const [focusTime, setFocusTime] = useState(0);
  const [sessionData, setSessionData] = useState(null);

  // ✅ Tambahan Step 1: state untuk menyimpan history lama
  const [focusHistory, setFocusHistory] = useState([]);
  const [distractedTime, setDistractedTime] = useState(0);

  // 🟩 Ambil data dari PreFocus
  useEffect(() => {
    const storedSession = localStorage.getItem("antyo_session");
    if (storedSession) {
      setSessionData(JSON.parse(storedSession));
    }
  }, []);

  useEffect(() => {
    let landmarker;
    let animationId;
    const ctx = canvasRef.current.getContext("2d");

    const init = async () => {
      try {
        // ✅ Load Mediapipe WASM
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2/wasm",
        );

        // ✅ Load model FaceLandmarker dari Google Cloud Storage (link resmi)
        landmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          },
          runningMode: "VIDEO",
          numFaces: 1,
        });

        // ✅ Akses kamera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;

        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            resolve();
          };
        });

        // ✅ Deteksi wajah secara terus-menerus
        const detect = async () => {
          if (videoRef.current.readyState >= 2) {
            const results = await landmarker.detectForVideo(
              videoRef.current,
              performance.now(),
            );

            ctx.clearRect(
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height,
            );

            if (results.faceLandmarks && results.faceLandmarks.length > 0) {
              setStatus("FOCUS [ON]");
              ctx.strokeStyle = "lime";
              ctx.lineWidth = 3;

              // Ambil titik tengah wajah (nose bridge)
              const nose = results.faceLandmarks[0][1];
              const x = nose.x * canvasRef.current.width;
              const y = nose.y * canvasRef.current.height;
              ctx.beginPath();
              ctx.arc(x, y, 8, 0, 2 * Math.PI);
              ctx.stroke();
            } else {
              setStatus("DISTRACTED");
            }
          }
          animationId = requestAnimationFrame(detect);
        };

        detect();
      } catch (err) {
        console.error("⚠️ Mediapipe error:", err);
        setStatus("MODEL ERROR");
      }
    };

    init();

    // Cleanup saat komponen di-unmount
    return () => {
      cancelAnimationFrame(animationId);
      if (landmarker) landmarker.close();
      const stream = videoRef.current?.srcObject;
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // ✅ Step 1: Load history lama dari localStorage saat halaman pertama kali dibuka
  useEffect(() => {
    const stored = localStorage.getItem("focus_history");
    if (stored) {
      setFocusHistory(JSON.parse(stored));
    }
  }, []);

  // ✅ Timer logic
  useEffect(() => {
    let timer;
    if (status === "FOCUS [ON]") {
      timer = setInterval(() => setFocusTime((t) => t + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [status]);
  // 🔵 Timer logic — hitung focusTime

  // ⭐ Count distracted time
  useEffect(() => {
    let disTimer;
    if (status === "DISTRACTED") {
      disTimer = setInterval(() => setDistractedTime((t) => t + 1), 1000);
    }
    return () => clearInterval(disTimer);
  }, [status]);

  // ✅ Step 3: Handle Stop Session — kirim ke Supabase via API
  const handleStop = async () => {
    const endTime = Date.now();
    const startTime =
      sessionData?.startTime || endTime - (focusTime + distractedTime) * 1000;

    const newSession = {
      task: sessionData?.task || "Unnamed Task",
      mode: sessionData?.mode || "stopwatch",
      focusTime,
      distractedTime,
      totalTime: focusTime + distractedTime,
      startedAt: new Date(startTime).toISOString(),
      endedAt: new Date(endTime).toISOString(),
    };

    try {
      const res = await fetch("http://localhost:4000/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSession),
      });

      if (!res.ok) {
        console.error("Failed to save session to server");
      }
    } catch (err) {
      console.error("Error sending session to backend:", err);
    }

    // Backup ke localStorage juga
    const localSession = {
      ...newSession,
      focus: focusTime,
      distracted: distractedTime,
      total: focusTime + distractedTime,
    };
    const updatedHistory = [...focusHistory, localSession];
    localStorage.setItem("focus_history", JSON.stringify(updatedHistory));
    localStorage.removeItem("antyo_session");

    window.location.href = "/dashboard";
  };

  return (
    <div className="relative w-screen h-screen bg-black text-white overflow-hidden">
      {/* Webcam */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        playsInline
        muted
      />

      {/* Canvas overlay */}
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        className="absolute inset-0 w-full h-full"
      />

      {/* Status bar */}
      <div className="absolute top-4 left-6 text-2xl font-bold drop-shadow-md">
        {status}
      </div>
      <div className="absolute top-4 right-6 text-lg drop-shadow-md">
        Focus Time: {focusTime}s
      </div>
      {/* Task name display */}
      {sessionData && (
        <div className="absolute top-16 left-6 text-lg text-green-300 drop-shadow-md">
          Task: {sessionData.task}
        </div>
      )}

      {/* Stop button */}
      <button
        onClick={handleStop}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-3 rounded-full shadow-lg"
      >
        STOP
      </button>
    </div>
  );
}
