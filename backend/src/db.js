// src/db.js
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// export as named + default to be safe for both import styles
export const prisma = new PrismaClient();
export default prisma;
