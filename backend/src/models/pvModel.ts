/**
 * Solar PV System Model
 * Based on single-diode model and P&O MPPT algorithm
 */

import type { HRESInputParams } from '../types/hres.js';

// Constants for PV system
const PV_MODULE_POWER = 0.25; // kW (250W)
const PV_MODULES_COUNT = 25; // Total modules (5S5P)
const PV_STC_IRRADIANCE = 1000; // W/m²
const PV_STC_TEMPERATURE = 25; // °C
const PV_TEMP_COEFFICIENT = -0.004; // %/°C (-0.4%/°C)
const PV_DERATING_FACTOR = 0.85; // 85% derating for real-world conditions

/**
 * Calculate PV power output
 * P_pv = C_pv × f_pv × (G_t / G_stc) × [1 + α_p × (T_c - T_stc)]
 */
export function calculatePVPower(
  irradiance: number,
  temperature: number,
  capacity: number
): { power: number; efficiency: number } {
  // Irradiance factor
  const irradianceFactor = irradiance / PV_STC_IRRADIANCE;
  
  // Temperature factor
  const tempDifference = temperature - PV_STC_TEMPERATURE;
  const temperatureFactor = 1 + PV_TEMP_COEFFICIENT * tempDifference;
  
  // Calculate power
  const power = capacity * PV_DERATING_FACTOR * irradianceFactor * temperatureFactor;
  
  // Calculate efficiency
  // Peak efficiency around 18-20%, adjusted for conditions
  const baseEfficiency = 18;
  const efficiency = baseEfficiency * temperatureFactor * (irradiance / PV_STC_IRRADIANCE);
  
  return {
    power: Math.max(0, power),
    efficiency: Math.max(0, Math.min(100, efficiency))
  };
}

/**
 * P&O MPPT Algorithm simulation
 * Adds slight efficiency variation to simulate tracking
 */
export function applyMPPT(power: number, irradiance: number): number {
  // MPPT efficiency: 97-99%
  const mpptEfficiency = 0.98;
  
  // Add small oscillation around MPP (±0.5%)
  const oscillation = 0.005 * Math.sin(Date.now() / 1000);
  
  return power * mpptEfficiency * (1 + oscillation);
}
