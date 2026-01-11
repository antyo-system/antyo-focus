import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PreFocus() {
  const navigate = useNavigate();

  const [task, setTask] = useState("");
  const [mode, setMode] = useState("timer"); 
  const [duration, setDuration] = useState(25);

  const handleStart = () => {
    if (task.trim() === "") {
      alert("Task cannot be empty!");
      return;
    }

    const session = {
      task,
      mode,
      duration: mode === "timer" ? duration : null,
      startTime: Date.now(),
    };

    localStorage.setItem("antyo_session", JSON.stringify(session));
    navigate("/focus");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-30 backdrop-blur-md p-6">
      <div className="bg-black/40 border border-green-400/40 rounded-2xl p-10 max-w-2xl w-full shadow-xl">
        <h1 className="text-4xl font-bold text-green-400 text-center mb-10">
          Prepare Your Focus
        </h1>

        <label className="block text-xl text-white mb-2">Task Label</label>
        <input
          type="text"
          placeholder="Write your task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="w-full p-4 rounded-xl bg-black/40 border border-green-300/40 text-white mb-6"
        />

        <div className="flex items-center gap-6 mb-6">
          <label className="flex items-center gap-2 text-white text-lg">
            <input
              type="radio"
              name="mode"
              value="timer"
              checked={mode === "timer"}
              onChange={() => setMode("timer")}
            />
            Timer
          </label>

          <label className="flex items-center gap-2 text-white text-lg">
            <input
              type="radio"
              name="mode"
              value="stopwatch"
              checked={mode === "stopwatch"}
              onChange={() => setMode("stopwatch")}
            />
            Stopwatch
          </label>
        </div>

        {mode === "timer" && (
          <>
            <label className="block text-xl text-white mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full p-4 rounded-xl bg-black/40 border border-green-300/40 text-white mb-6"
            />
          </>
        )}

        <button
          onClick={handleStart}
          className="w-full bg-green-400 text-black font-bold py-4 rounded-xl text-xl hover:bg-green-300 transition"
        >
          START FOCUS
        </button>
      </div>
    </div>
  );
}
