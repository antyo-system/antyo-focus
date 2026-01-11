// src/controllers/sessionController.js
import { prisma } from '../db.js';

// Simpan sesi fokus baru
export const createSession = async (req, res) => {
  try {
    const { task, focusTime, distracted, totalTime } = req.body;

    const newSession = await prisma.focusSession.create({
      data: { task, focusTime, distracted, totalTime },
    });

    res.status(201).json(newSession);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
};

// Ambil semua sesi hari ini
export const getTodaySessions = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // format YYYY-MM-DD
    const sessions = await prisma.focusSession.findMany({
      where: {
        createdAt: {
          gte: new Date(today),
        },
      },
    });

    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
};
