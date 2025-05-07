import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import rideRoutes from './routes/rideRoutes.js';
import shuttleRoutes from './routes/shuttleRoutes.js';
import { PrismaClient } from '@prisma/client';
import http from 'http';
const app = express();
const prisma = new PrismaClient();

console.log("Open to requests from", process.env.CORS_ORIGIN);

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: "GET,POST,PUT,DELETE",
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/ride", rideRoutes);
app.use("/api/shuttle", shuttleRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

(async () => {
  try {
    await prisma.$connect();
    console.log("Connected to database");
  } catch (error) {
    console.error("Error connecting to the database", error);
  }
})();

const keepAlive = () => {
  setInterval(() => {
    http.get(`http://localhost:${process.env.PORT || 3000}`, (res) => {
      console.log(`Keepalive pinged server, status: ${res.statusCode}`);
    }).on('error', (err) => {
      console.error('Error pinging server:', err.message);
    });
  }, 30000);
};

keepAlive();

export default app;
