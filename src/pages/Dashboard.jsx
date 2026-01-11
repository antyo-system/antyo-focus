import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Dashboard() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function loadSessions() {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .order("startedAt", { ascending: false });

      if (!error && data && data.length > 0) {
        setHistory(data);
        return;
      }

      const stored = localStorage.getItem("focus_history");
      if (stored) setHistory(JSON.parse(stored));
    }

    loadSessions();
  }, []);

  const totalFocus = history.reduce((sum, s) => sum + s.focus, 0);
  const totalDistracted = history.reduce((sum, s) => sum + s.distracted, 0);

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold text-green-400 mb-8">Focus Summary</h1>

      <div className="mb-6">
        <p>Total Focus Time: {Math.floor(totalFocus / 60)} min</p>
        <p>Total Distracted Time: {Math.floor(totalDistracted / 60)} min</p>
        <p>Total Sessions: {history.length}</p>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Recent Sessions</h2>

      <div className="space-y-4">
        {history.length === 0 && (
          <p className="text-gray-400">No sessions yet. Start one!</p>
        )}

        {history.map((s, i) => (
          <div
            key={i}
            className="border border-green-500/40 bg-black/40 rounded-xl p-4"
          >
            <p className="text-green-300 font-bold">{s.task || "Unnamed Task"}</p>

            <p>
              Focus: {Math.floor(s.focus / 60)} min | Distracted:{" "}
              {Math.floor(s.distracted / 60)} min
            </p>

            <p className="text-sm text-gray-400">
              {new Date(s.startedAt).toLocaleString()} →{" "}
              {new Date(s.endedAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
