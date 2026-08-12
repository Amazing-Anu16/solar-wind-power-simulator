import { pathToFileURL } from 'url';
import app from './app.js';

const PORT = process.env.PORT || 3001;

const isDirectRun = process.argv[1]
  ? import.meta.url === pathToFileURL(process.argv[1]).href
  : false;

if (isDirectRun) {
  app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('HRES Backend Server Started');
    console.log('='.repeat(60));
    console.log(`Server running on: http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`Instant simulation: POST http://localhost:${PORT}/api/simulate/instant`);
    console.log(`24-hour simulation: POST http://localhost:${PORT}/api/simulate/daily`);
    console.log('='.repeat(60));
    console.log('');
    console.log('System Configuration:');
    console.log('  - PV Array Capacity: 6.25 kW (25 modules x 250W)');
    console.log('  - Wind Turbine: 5 kW PMSG-based');
    console.log('  - DC Bus: 400V target with +/-2.1% stability');
    console.log('  - AC Output: 230V, 50Hz with SPWM control');
    console.log('  - Power Quality: THD < 5% (IEEE 519 compliant)');
    console.log('');
    console.log('Ready to receive simulation requests.');
    console.log('='.repeat(60));
  });
}

export default app;
