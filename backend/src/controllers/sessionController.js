// src/controllers/sessionController.js — Full Supabase
import { supabase } from "../db.js";

// POST /api/sessions — Simpan sesi fokus baru
export const createSession = async (req, res) => {
  try {
    const {
      task,
      mode,
      focusTime,
      distractedTime,
      totalTime,
      startedAt,
      endedAt,
    } = req.body;

    // Validasi input
    if (!task || task.trim() === "") {
      return res.status(400).json({ error: "Task is required" });
    }
    if (focusTime == null || distractedTime == null || totalTime == null) {
      return res.status(400).json({ error: "Duration fields are required" });
    }
    if (!startedAt || !endedAt) {
      return res
        .status(400)
        .json({ error: "startedAt and endedAt are required" });
    }

    const { data, error } = await supabase
      .from("focus_sessions")
      .insert({
        task: task.trim(),
        mode: mode || "stopwatch",
        focus_time: focusTime,
        distracted_time: distractedTime,
        total_time: totalTime,
        started_at: new Date(startedAt).toISOString(),
        ended_at: new Date(endedAt).toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ error: "Failed to create session" });
  }
};

// GET /api/sessions/today — Ambil semua sesi hari ini
export const getTodaySessions = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("focus_sessions")
      .select("*")
      .gte("started_at", today.toISOString())
      .order("started_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};

// GET /api/sessions — Ambil semua sesi (dengan optional date range)
export const getAllSessions = async (req, res) => {
  try {
    const { from, to } = req.query;

    let query = supabase
      .from("focus_sessions")
      .select("*")
      .order("started_at", { ascending: false });

    if (from) query = query.gte("started_at", new Date(from).toISOString());
    if (to) query = query.lte("started_at", new Date(to).toISOString());

    const { data, error } = await query;

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error fetching all sessions:", error);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};

// GET /api/sessions/summary — Ringkasan statistik
export const getSessionSummary = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);

    const [todayRes, weekRes] = await Promise.all([
      supabase
        .from("focus_sessions")
        .select("focus_time, distracted_time, total_time")
        .gte("started_at", today.toISOString()),
      supabase
        .from("focus_sessions")
        .select("focus_time, distracted_time, total_time")
        .gte("started_at", weekAgo.toISOString()),
    ]);

    if (todayRes.error) throw todayRes.error;
    if (weekRes.error) throw weekRes.error;

    const aggregate = (rows) => ({
      totalFocus: rows.reduce((sum, r) => sum + (r.focus_time || 0), 0),
      totalDistracted: rows.reduce(
        (sum, r) => sum + (r.distracted_time || 0),
        0,
      ),
      totalTime: rows.reduce((sum, r) => sum + (r.total_time || 0), 0),
      sessionCount: rows.length,
    });

    res.json({
      today: aggregate(todayRes.data),
      week: aggregate(weekRes.data),
    });
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
};
