/**
 * System Performance Calculator
 * Calculates overall system metrics
 */

import type { HRESInputParams, HRESOutputResults } from '../types/hres.js';
import { calculatePVPower, applyMPPT } from './pvModel.js';
import { calculateWindPower, applyPMSGConversion } from './windModel.js';
import {
  calculateDCBusVoltage,
  calculateACOutput,
  calculateTHD,
  calculatePowerFactor,
} from './converterModel.js';

/**
 * Main calculation function for HRES
 */
export function calculateHRESPerformance(params: HRESInputParams): HRESOutputResults {
  // 1. Calculate PV power
  const pvResult = calculatePVPower(
    params.solarIrradiance,
    params.temperature,
    params.pvArrayCapacity
  );
  const pvPower = applyMPPT(pvResult.power, params.solarIrradiance);

  // 2. Calculate wind power
  const windResult = calculateWindPower(params.windSpeed, params.windTurbineCapacity);
  const windPower = applyPMSGConversion(windResult.power);

  // 3. Total power
  const totalPower = pvPower + windPower;

  // 4. DC bus voltage and stability
  const dcBus = calculateDCBusVoltage(pvPower, windPower, params.loadDemand);

  // 5. AC output
  const acOutput = calculateACOutput(dcBus.voltage);

  // 6. Power quality
  const thd = calculateTHD(dcBus.voltage, params.loadDemand, totalPower);
  const powerFactor = calculatePowerFactor(params.loadDemand, totalPower);

  // 7. System performance
  const energyShortfall = Math.max(0, params.loadDemand - totalPower);
  const availability = params.loadDemand > 0
    ? Math.min(100, (totalPower / params.loadDemand) * 100)
    : 100;

  // 8. Overall efficiency
  // Includes MPPT, converter, inverter losses
  const theoreticalMax = params.pvArrayCapacity + params.windTurbineCapacity;
  const efficiency = theoreticalMax > 0 ? (totalPower / theoreticalMax) * 100 : 0;

  return {
    pvPower,
    windPower,
    totalPower,
    dcBusVoltage: dcBus.voltage,
    dcBusStability: dcBus.stability,
    acVoltage: acOutput.voltage,
    acFrequency: acOutput.frequency,
    thd,
    powerFactor,
    availability,
    energyShortfall,
    efficiency,
    pvEfficiency: pvResult.efficiency,
    windEfficiency: windResult.efficiency,
  };
}
