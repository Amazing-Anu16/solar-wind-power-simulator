/**
 * Wind Turbine System Model
 * Based on PMSG (Permanent Magnet Synchronous Generator)
 */

// Constants for wind turbine
const AIR_DENSITY = 1.225; // kg/m³ at sea level
const ROTOR_DIAMETER = 5.64; // meters (for 5kW turbine)
const ROTOR_AREA = Math.PI * (ROTOR_DIAMETER / 2) ** 2; // m²
const CUT_IN_SPEED = 3; // m/s
const RATED_SPEED = 12; // m/s
const CUT_OUT_SPEED = 15; // m/s
const RATED_POWER = 5; // kW

/**
 * Calculate power coefficient (Cp) based on tip-speed ratio
 * Using simplified Cp curve for a typical wind turbine
 */
function calculateCp(windSpeed: number): number {
  if (windSpeed < CUT_IN_SPEED || windSpeed > CUT_OUT_SPEED) {
    return 0;
  }
  
  // Optimal Cp is around 0.45-0.48 (Betz limit is 0.593)
  const maxCp = 0.45;
  
  // Cp curve: peaks at rated speed
  if (windSpeed <= RATED_SPEED) {
    // Gradually increase to rated speed
    const factor = (windSpeed - CUT_IN_SPEED) / (RATED_SPEED - CUT_IN_SPEED);
    return maxCp * Math.pow(factor, 0.3);
  } else {
    // Decrease after rated speed (pitch control simulation)
    const factor = (CUT_OUT_SPEED - windSpeed) / (CUT_OUT_SPEED - RATED_SPEED);
    return maxCp * factor;
  }
}

/**
 * Calculate wind turbine power output
 * P_w = 0.5 × ρ × A × Cp × V³
 */
export function calculateWindPower(
  windSpeed: number,
  capacity: number
): { power: number; efficiency: number } {
  // Check operating range
  if (windSpeed < CUT_IN_SPEED) {
    return { power: 0, efficiency: 0 };
  }
  
  if (windSpeed > CUT_OUT_SPEED) {
    return { power: 0, efficiency: 0 };
  }
  
  // Calculate Cp
  const cp = calculateCp(windSpeed);
  
  // Calculate theoretical power
  const theoreticalPower = 0.5 * AIR_DENSITY * ROTOR_AREA * cp * Math.pow(windSpeed, 3) / 1000; // Convert to kW
  
  // Limit to rated capacity
  let power = Math.min(theoreticalPower, capacity);
  
  // Apply generator and converter efficiency (92-95%)
  const systemEfficiency = 0.93;
  power *= systemEfficiency;
  
  // Calculate efficiency
  const maxPossiblePower = 0.5 * AIR_DENSITY * ROTOR_AREA * 0.593 * Math.pow(windSpeed, 3) / 1000;
  const efficiency = maxPossiblePower > 0 ? (power / maxPossiblePower) * 100 : 0;
  
  return {
    power: Math.max(0, power),
    efficiency: Math.max(0, Math.min(100, efficiency))
  };
}

/**
 * PMSG model with rectifier and boost converter
 */
export function applyPMSGConversion(power: number): number {
  // Rectifier efficiency: 95%
  const rectifierEff = 0.95;
  
  // Boost converter efficiency: 96%
  const converterEff = 0.96;
  
  return power * rectifierEff * converterEff;
}
