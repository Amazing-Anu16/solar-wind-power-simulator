import express, { Request, Response } from 'express';
import cors from 'cors';
import { calculateHRESPerformance } from './models/systemModel.js';
import { generate24HourProfile } from './utils/simulationGenerator.js';
import type { HRESInputParams } from './types/hres.js';

const app = express();

const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)
  : undefined;

app.use(cors({
  origin: allowedOrigins ?? true,
}));

app.use(express.json());

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'HRES Backend Server is running',
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/simulate/instant', (req: Request, res: Response) => {
  try {
    const params: HRESInputParams = req.body;

    if (!params || typeof params.solarIrradiance !== 'number') {
      return res.status(400).json({
        error: 'Invalid input parameters',
        message: 'Please provide valid solar, wind, and load parameters',
      });
    }

    const results = calculateHRESPerformance(params);

    res.json(results);
  } catch (error) {
    console.error('Calculation error:', error);
    res.status(500).json({
      error: 'Calculation failed',
      message: 'Unable to calculate simulation results',
    });
  }
});

app.post('/api/simulate/daily', (req: Request, res: Response) => {
  try {
    const baseParams = req.body;
    const profile = generate24HourProfile(baseParams);

    res.json(profile);
  } catch (error) {
    console.error('Simulation error:', error);
    res.status(500).json({
      error: 'Simulation failed',
      message: 'Unable to generate daily simulation profile',
    });
  }
});

export default app;
