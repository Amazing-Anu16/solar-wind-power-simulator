/**
 * 24-Hour Simulation Generator
 * Creates realistic daily profiles for solar, wind, and load
 */

import type { SimulationDataPoint, DailyProfile, HRESInputParams } from '../types/hres.js';
import { calculateHRESPerformance } from '../models/systemModel.js';

/**
 * Generate solar irradiance profile for 24 hours with realistic variations
 */
function generateSolarProfile(hour: number, baseIrradiance: number = 800): number {
  // Solar is available from sunrise (5 AM) to sunset (7 PM) - 14 hours
  if (hour < 5 || hour >= 19) {
    return 0;
  }

  // Calculate hour from sunrise
  const hourFromSunrise = hour - 5;
  const totalDaylight = 14;
  const peakHour = totalDaylight / 2; // Peak at noon (7 hours after 5 AM = 12 PM)

  // More realistic bell curve with sharper rise/fall
  const sigma = 2.5;
  const normalizedDistance = (hourFromSunrise - peakHour) / sigma;
  const gaussianFactor = Math.exp(-0.5 * normalizedDistance * normalizedDistance);

  // Base irradiance following gaussian curve
  let irradiance = baseIrradiance * gaussianFactor;

  // Add realistic atmospheric effects
  // Morning haze (reduces early morning efficiency)
  if (hour >= 5 && hour <= 7) {
    const hazeFactor = 0.5 + 0.5 * ((hour - 5) / 2); // 0.5 to 1.0
    irradiance *= hazeFactor;
  }

  // Evening degradation
  if (hour >= 17 && hour < 19) {
    const eveningFactor = 1.0 - 0.3 * ((hour - 17) / 2); // 1.0 to 0.7
    irradiance *= eveningFactor;
  }

  // Cloud variations (random-like but deterministic)
  const cloudNoise = 
    0.08 * Math.sin(hour * 2.3) + 
    0.05 * Math.cos(hour * 3.7) + 
    0.04 * Math.sin(hour * 5.1);
  irradiance *= (1 + cloudNoise);

  // Occasional cloud cover (dips at specific hours)
  if (hour === 10 || hour === 14) {
    irradiance *= 0.7; // Passing clouds
  }

  return Math.max(0, Math.min(1000, irradiance));
}

/**
 * Generate wind speed profile for 24 hours with realistic patterns
 */
function generateWindProfile(hour: number, baseWindSpeed: number = 7): number {
  // Wind patterns are complementary to solar: stronger at night
  
  // Diurnal cycle: wind typically picks up in late afternoon/evening
  let windSpeed = baseWindSpeed;

  // Time-based variation (stronger at night, weaker during day)
  // Peak around midnight and early morning
  const nightBoost = 2.5 * Math.cos((hour - 2) * Math.PI / 12); // +2.5 at 2 AM, -2.5 at 2 PM
  windSpeed += nightBoost;

  // Afternoon sea breeze effect (increases 3 PM to 6 PM)
  if (hour >= 15 && hour <= 18) {
    windSpeed += 1.5 * Math.sin(((hour - 15) / 3) * Math.PI);
  }

  // Early morning calm (5 AM to 8 AM)
  if (hour >= 5 && hour <= 8) {
    windSpeed -= 1.8 * Math.sin(((hour - 5) / 3) * Math.PI);
  }

  // Turbulence and gusts (realistic variations)
  const turbulence = 
    0.8 * Math.sin(hour * 1.3) + 
    0.6 * Math.cos(hour * 2.1) + 
    0.4 * Math.sin(hour * 3.7);
  windSpeed += turbulence;

  // Wind lull periods
  if (hour === 7 || hour === 13) {
    windSpeed *= 0.75; // Calm periods
  }

  // Gusty periods
  if (hour === 20 || hour === 3) {
    windSpeed *= 1.25; // Strong wind periods
  }

  // Constrain to realistic range (cut-in: 3 m/s, cut-out: 15 m/s)
  return Math.max(2.5, Math.min(14.5, windSpeed));
}

/**
 * Generate load demand profile for 24 hours based on residential patterns
 */
function generateLoadProfile(hour: number, baseLoad: number = 2.5): number {
  // Residential load profile with realistic patterns
  let loadFactor = 0.3; // Base load factor (always-on appliances)

  // Night time (12 AM to 5 AM) - minimum load
  if (hour >= 0 && hour < 5) {
    loadFactor = 0.25 + 0.05 * Math.random();
  }
  
  // Early morning wake-up (5 AM to 8 AM) - rapid rise
  else if (hour >= 5 && hour < 8) {
    const riseProgress = (hour - 5) / 3;
    loadFactor = 0.3 + 0.4 * Math.sin(riseProgress * Math.PI / 2);
  }
  
  // Morning peak (8 AM to 9 AM) - breakfast, preparation
  else if (hour >= 8 && hour < 10) {
    loadFactor = 0.7 + 0.15 * Math.sin((hour - 8) * Math.PI);
  }
  
  // Mid-day moderate (10 AM to 4 PM) - some people home, moderate usage
  else if (hour >= 10 && hour < 16) {
    loadFactor = 0.45 + 0.1 * Math.sin((hour - 10) * Math.PI / 3);
  }
  
  // Evening rise (4 PM to 6 PM) - people returning home
  else if (hour >= 16 && hour < 18) {
    const riseProgress = (hour - 16) / 2;
    loadFactor = 0.55 + 0.35 * riseProgress;
  }
  
  // Evening peak (6 PM to 10 PM) - maximum load (cooking, entertainment, HVAC)
  else if (hour >= 18 && hour < 22) {
    const peakProgress = (hour - 18) / 4;
    loadFactor = 0.9 + 0.1 * Math.sin(peakProgress * Math.PI);
  }
  
  // Late evening (10 PM to midnight) - wind down
  else if (hour >= 22 && hour < 24) {
    const fallProgress = (hour - 22) / 2;
    loadFactor = 0.7 - 0.4 * fallProgress;
  }

  // Add minor random variations (appliance cycling)
  const randomVariation = 0.03 * (Math.sin(hour * 7.3) + Math.cos(hour * 5.7));
  loadFactor += randomVariation;

  // Calculate actual load
  const load = baseLoad * Math.max(0.2, Math.min(1.0, loadFactor));

  return Math.max(0.3, Math.min(baseLoad * 1.2, load));
}

/**
 * Generate temperature profile for 24 hours with realistic diurnal variation
 */
function generateTemperatureProfile(hour: number, baseTemp: number = 25): number {
  // Typical diurnal temperature variation
  // Minimum around 6 AM, maximum around 3 PM
  const hourAngle = (hour - 6) * Math.PI / 12; // Shift so min is at 6 AM
  const dailyRange = 12; // °C variation
  
  // Cosine curve for temperature
  const temperature = baseTemp + (dailyRange / 2) * Math.cos(hourAngle);
  
  // Add small variations
  const microVariations = 0.5 * Math.sin(hour * 2.7) + 0.3 * Math.cos(hour * 4.1);
  
  return temperature + microVariations;
}

/**
 * Generate complete 24-hour simulation profile using user's base parameters
 */
export function generate24HourProfile(
  baseParams: Partial<HRESInputParams>
): DailyProfile {
  const dataPoints: SimulationDataPoint[] = [];
  let totalEnergyGenerated = 0;
  let totalEnergyDemand = 0;
  let peakPower = 0;
  let availabilitySum = 0;

  // Use user's input as base for variations
  const baseSolarIrradiance = baseParams.solarIrradiance || 800;
  const baseWindSpeed = baseParams.windSpeed || 7;
  const baseLoadDemand = baseParams.loadDemand || 2.5;
  const baseTemperature = baseParams.temperature || 25;

  // Generate hourly data points
  for (let hour = 0; hour < 24; hour++) {
    // Generate realistic profiles based on user's inputs
    const solarIrradiance = generateSolarProfile(hour, baseSolarIrradiance);
    const windSpeed = generateWindProfile(hour, baseWindSpeed);
    const loadDemand = generateLoadProfile(hour, baseLoadDemand);
    const temperature = generateTemperatureProfile(hour, baseTemperature);

    // Calculate system performance with dynamic parameters
    const params: HRESInputParams = {
      solarIrradiance,
      temperature,
      windSpeed,
      loadDemand,
      pvArrayCapacity: baseParams.pvArrayCapacity || 6.25,
      windTurbineCapacity: baseParams.windTurbineCapacity || 5,
    };

    const results = calculateHRESPerformance(params);

    // Create data point
    const dataPoint: SimulationDataPoint = {
      time: hour,
      solarIrradiance,
      windSpeed,
      loadDemand,
      temperature,
      ...results,
    };

    dataPoints.push(dataPoint);

    // Accumulate metrics
    totalEnergyGenerated += results.totalPower; // kWh (1 hour intervals)
    totalEnergyDemand += loadDemand;
    peakPower = Math.max(peakPower, results.totalPower);
    availabilitySum += results.availability;
  }

  const averageAvailability = availabilitySum / 24;

  return {
    dataPoints,
    totalEnergyGenerated,
    totalEnergyDemand,
    averageAvailability,
    peakPower,
  };
}
