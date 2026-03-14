import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function formatTime(seconds) {
  if (!seconds || seconds < 0) return "0s";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function focusPercent(focus, distracted) {
  const total = focus + distracted;
  if (total === 0) return 0;
  return Math.round((focus / total) * 100);
}

export default function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      if (!supabase) {
        console.error("Supabase client not initialized");
        setLoading(false);
        return;
      }
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
  const totalTime = sessions.reduce((sum, s) => sum + (s.total_time || 0), 0);
  const overallScore = focusPercent(totalFocus, totalDistracted);

  // Today's sessions
  const today = new Date().toDateString();
  const todaySessions = sessions.filter(
    (s) => new Date(s.started_at).toDateString() === today,
  );
  const todayFocus = todaySessions.reduce(
    (sum, s) => sum + (s.focus_time || 0),
    0,
  );
  const todayDistracted = todaySessions.reduce(
    (sum, s) => sum + (s.distracted_time || 0),
    0,
  );
  const todayScore = focusPercent(todayFocus, todayDistracted);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-green-400 text-xl animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-green-400">
          Focus Summary
        </h1>
        <button
          onClick={() => navigate("/prefocus")}
          className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-2 rounded-xl transition"
        >
          + New Session
        </button>
      </div>

      {/* Today's Stats */}
      <div className="mb-8">
        <h2 className="text-lg text-gray-400 mb-3">Today</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <p className="text-sm text-gray-400">Focus Time</p>
            <p className="text-2xl font-bold text-green-400">
              {formatTime(todayFocus)}
            </p>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <p className="text-sm text-gray-400">Distracted</p>
            <p className="text-2xl font-bold text-red-400">
              {formatTime(todayDistracted)}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-sm text-gray-400">Sessions</p>
            <p className="text-2xl font-bold">{todaySessions.length}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-sm text-gray-400">Focus Score</p>
            <p
              className={`text-2xl font-bold ${todayScore >= 70 ? "text-green-400" : todayScore >= 40 ? "text-yellow-400" : "text-red-400"}`}
            >
              {todaySessions.length > 0 ? `${todayScore}%` : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* All-time Stats */}
      <div className="mb-8">
        <h2 className="text-lg text-gray-400 mb-3">All Time</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-sm text-gray-400">Total Focus</p>
            <p className="text-xl font-bold text-green-400">
              {formatTime(totalFocus)}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-sm text-gray-400">Total Distracted</p>
            <p className="text-xl font-bold text-red-400">
              {formatTime(totalDistracted)}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-sm text-gray-400">Total Time</p>
            <p className="text-xl font-bold">{formatTime(totalTime)}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-sm text-gray-400">Avg Score</p>
            <p
              className={`text-xl font-bold ${overallScore >= 70 ? "text-green-400" : overallScore >= 40 ? "text-yellow-400" : "text-red-400"}`}
            >
              {sessions.length > 0 ? `${overallScore}%` : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <h2 className="text-xl font-semibold mb-4">Recent Sessions</h2>
      <div className="space-y-3">
        {sessions.length === 0 && (
          <p className="text-gray-500">No sessions yet. Start one!</p>
        )}

        {sessions.map((s) => {
          const score = focusPercent(
            s.focus_time || 0,
            s.distracted_time || 0,
          );
          return (
            <div
              key={s.id}
              className="border border-green-500/20 bg-white/5 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
            >
              <div>
                <p className="text-green-300 font-bold text-lg">
                  {s.task || "Unnamed Task"}
                </p>
                <p className="text-sm text-gray-400">
                  {new Date(s.started_at).toLocaleString()} →{" "}
                  {new Date(s.ended_at).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-green-400">
                  Focus: {formatTime(s.focus_time || 0)}
                </span>
                <span className="text-red-400">
                  Dist: {formatTime(s.distracted_time || 0)}
                </span>
                <span
                  className={`font-bold px-2 py-1 rounded-lg text-xs ${score >= 70 ? "bg-green-500/20 text-green-400" : score >= 40 ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}
                >
                  {score}%
                </span>
                <span className="text-gray-500 capitalize">{s.mode}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
