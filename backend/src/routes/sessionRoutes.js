// src/routes/sessionRoutes.js — Supabase PostgreSQL
import express from "express";
import {
  createSession,
  getTodaySessions,
  getAllSessions,
  getSessionSummary,
} from "../controllers/sessionController.js";

const router = express.Router();

router.post("/sessions", createSession);
router.get("/sessions/today", getTodaySessions);
router.get("/sessions/summary", getSessionSummary);
router.get("/sessions", getAllSessions);

export default router;
