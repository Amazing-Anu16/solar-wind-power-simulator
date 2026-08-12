/**
 * DC-DC Boost Converter and Inverter Models
 * For DC bus regulation and AC output
 */

// DC Bus constants
const TARGET_DC_VOLTAGE = 400; // V
const DC_BUS_CAPACITANCE = 2200e-6; // F (2200 µF)
const SWITCHING_FREQUENCY = 20000; // Hz (20 kHz)

// Inverter constants
const TARGET_AC_VOLTAGE = 230; // V RMS
const AC_FREQUENCY = 50; // Hz
const INVERTER_EFFICIENCY = 0.95;
const LC_FILTER_EFFICIENCY = 0.98;

/**
 * Calculate DC bus voltage based on input power
 * Uses boost converter model: V_out = V_in / (1 - D)
 */
export function calculateDCBusVoltage(
  pvPower: number,
  windPower: number,
  loadDemand: number
): { voltage: number; stability: number } {
  const totalPower = pvPower + windPower;
  
  // Base voltage (400V target)
  let voltage = TARGET_DC_VOLTAGE;
  
  // Voltage droop based on load vs generation
  const powerBalance = totalPower - loadDemand;
  
  if (powerBalance < 0) {
    // Voltage drops when load exceeds generation
    const dropFactor = Math.abs(powerBalance) / (loadDemand + 0.1);
    voltage -= dropFactor * 15; // Max 15V drop
  } else {
    // Slight voltage rise when generation exceeds load
    const riseFactor = Math.min(powerBalance / (totalPower + 0.1), 0.1);
    voltage += riseFactor * 10; // Max 10V rise
  }
  
  // Add small ripple (simulate switching)
  const ripple = 0.5 * Math.sin(Date.now() / 10);
  voltage += ripple;
  
  // Clamp voltage to reasonable range
  voltage = Math.max(385, Math.min(415, voltage));
  
  // Calculate stability (deviation from 400V)
  const deviation = Math.abs(voltage - TARGET_DC_VOLTAGE);
  const stability = (deviation / TARGET_DC_VOLTAGE) * 100;
  
  return { voltage, stability };
}

/**
 * Calculate AC output voltage and frequency
 * Uses SPWM (Sinusoidal PWM) inverter model
 */
export function calculateACOutput(dcVoltage: number): {
  voltage: number;
  frequency: number;
} {
  // AC voltage depends on DC bus voltage
  // Vac = (ma × Vdc) / (2√2) for SPWM
  const modulationIndex = 0.9; // 90% modulation
  const theoreticalVoltage = (modulationIndex * dcVoltage) / (2 * Math.SQRT2);
  
  // Apply inverter efficiency
  const voltage = theoreticalVoltage * INVERTER_EFFICIENCY * LC_FILTER_EFFICIENCY;
  
  // Frequency is tightly controlled
  const frequency = AC_FREQUENCY + (Math.random() - 0.5) * 0.1; // ±0.05 Hz variation
  
  return { voltage, frequency };
}

/**
 * Calculate Total Harmonic Distortion (THD)
 * Based on SPWM control and LC filter performance
 */
export function calculateTHD(
  dcVoltage: number,
  loadDemand: number,
  totalPower: number
): number {
  // Base THD with good SPWM and LC filter: 2-4%
  let baseTHD = 3.0;
  
  // THD increases with load (non-linear loads)
  const loadFactor = loadDemand / 10; // Normalize to 0-1
  baseTHD += loadFactor * 1.5;
  
  // THD affected by DC bus stability
  const voltageDeviation = Math.abs(dcVoltage - TARGET_DC_VOLTAGE) / TARGET_DC_VOLTAGE;
  baseTHD += voltageDeviation * 10;
  
  // THD decreases with higher power quality
  const powerQualityFactor = totalPower > 0 ? Math.min(totalPower / loadDemand, 1.2) : 0;
  baseTHD *= (1 - powerQualityFactor * 0.1);
  
  // Add small random variation
  baseTHD += (Math.random() - 0.5) * 0.5;
  
  return Math.max(1.5, Math.min(8, baseTHD));
}

/**
 * Calculate power factor
 */
export function calculatePowerFactor(loadDemand: number, totalPower: number): number {
  // Base power factor (resistive load)
  let pf = 0.98;
  
  // Decrease with load imbalance
  if (totalPower > 0) {
    const balance = Math.min(loadDemand / totalPower, 1);
    pf = 0.95 + balance * 0.03;
  }
  
  return Math.max(0.85, Math.min(1.0, pf));
}
