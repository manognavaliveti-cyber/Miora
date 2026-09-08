import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes';
import { requestLogger, errorHandler } from './middleware/errorHandler';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// REST API Base Route
app.use('/api', apiRoutes);

// Root fallback
app.get('/', (req, res) => {
  res.json({
    name: 'MIORA Dating API',
    tagline: 'Meet. Match. Belong.',
    version: '1.0.0',
    docs: '/api/health'
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`\n===========================================`);
  console.log(`💖 MIORA Dating Server running on http://localhost:${PORT}`);
  console.log(`✨ Tagline: Meet. Match. Belong.`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`===========================================\n`);
});

export default app;
