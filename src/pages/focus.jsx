import React, { useEffect, useRef, useState } from "react";
import { saveSession } from "../services/sessionService";

export default function FocusScreen() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [status, setStatus] = useState("DISTRACTED");
  const [focusTime, setFocusTime] = useState(0);
  const [distractedTime, setDistractedTime] = useState(0);

  const [sessionData, setSessionData] = useState(null);
  const [focusHistory, setFocusHistory] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("antyo_session");
    if (stored) setSessionData(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("focus_history");
    if (stored) setFocusHistory(JSON.parse(stored));
  }, []);

  // FOCUS timer
  useEffect(() => {
    let timer;
    if (status === "FOCUS [ON]") {
      timer = setInterval(() => setFocusTime((t) => t + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [status]);

  // DISTRACTED timer
  useEffect(() => {
    let timer;
    if (status === "DISTRACTED") {
      timer = setInterval(() => setDistractedTime((t) => t + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [status]);

  // STOP SESSION
  const handleStop = async () => {
    const endTime = Date.now();

    const newSession = {
      task: sessionData?.task || "Unnamed Task",
      focus: focusTime,
      distracted: distractedTime,
      startedAt:
        sessionData?.startTime ||
        endTime - (focusTime + distractedTime) * 1000,
      endedAt: endTime,
      created_at: new Date().toISOString(),
    };

    // Save to Supabase
    await saveSession(newSession);

    // Fallback to localStorage
    const updatedHistory = [...focusHistory, newSession];
    localStorage.setItem("focus_history", JSON.stringify(updatedHistory));
    localStorage.removeItem("antyo_session");

    // Redirect
    window.location.href = "/dashboard";
  };

  return (
    <div className="relative w-screen h-screen bg-black text-white overflow-hidden">
      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" autoPlay playsInline muted />
      <canvas ref={canvasRef} width={1280} height={720} className="absolute inset-0 w-full h-full" />

      <div className="absolute top-4 left-6 text-2xl font-bold">{status}</div>
      <div className="absolute top-4 right-6 text-lg">Focus Time: {focusTime}s</div>

      {sessionData && (
        <div className="absolute top-16 left-6 text-lg text-green-300">
          Task: {sessionData.task}
        </div>
      )}

      <button
        onClick={handleStop}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-red-500 px-8 py-3 rounded-full"
      >
        STOP
      </button>
    </div>
  );
}
