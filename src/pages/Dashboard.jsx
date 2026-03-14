import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from("focus_sessions")
        .select("*")
        .order("started_at", { ascending: false });

      if (error) {
        console.error("Error fetching sessions:", error);
      } else {
        setSessions(data || []);
      }
      setLoading(false);
    };

    fetchSessions();
  }, []);

  const totalFocus = sessions.reduce((sum, s) => sum + (s.focus_time || 0), 0);
  const totalDistracted = sessions.reduce(
    (sum, s) => sum + (s.distracted_time || 0),
    0,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-green-400 text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold text-green-400 mb-8">Focus Summary</h1>

      <div className="mb-6">
        <p>Total Focus Time: {Math.floor(totalFocus / 60)} min</p>
        <p>Total Distracted Time: {Math.floor(totalDistracted / 60)} min</p>
        <p>Total Sessions: {sessions.length}</p>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Recent Sessions</h2>
      <div className="space-y-4">
        {sessions.length === 0 && (
          <p className="text-gray-400">No sessions yet. Start one!</p>
        )}

        {sessions.map((s) => (
          <div
            key={s.id}
            className="border border-green-500/40 bg-black/40 rounded-xl p-4"
          >
            <p className="text-green-300 font-bold">
              {s.task || "Unnamed Task"}
            </p>
            <p>
              Focus: {Math.floor((s.focus_time || 0) / 60)} min | Distracted:{" "}
              {Math.floor((s.distracted_time || 0) / 60)} min
            </p>
            <p className="text-sm text-gray-400">
              {new Date(s.started_at).toLocaleString()} →{" "}
              {new Date(s.ended_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
