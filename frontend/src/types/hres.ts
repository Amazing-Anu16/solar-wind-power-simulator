// Input parameters for the HRES simulation
export interface HRESInputParams {
  // Solar parameters
  solarIrradiance: number; // W/m² (0-1000)
  temperature: number; // °C (15-45)
  
  // Wind parameters
  windSpeed: number; // m/s (0-15)
  
  // Load parameters
  loadDemand: number; // kW (0-10)
  
  // System configuration
  pvArrayCapacity: number; // kW (default: 6.25)
  windTurbineCapacity: number; // kW (default: 5)
}

// Output results from the simulation
export interface HRESOutputResults {
  // Power generation
  pvPower: number; // kW
  windPower: number; // kW
  totalPower: number; // kW
  
  // DC bus
  dcBusVoltage: number; // V
  dcBusStability: number; // percentage deviation
  
  // AC output
  acVoltage: number; // V
  acFrequency: number; // Hz
  
  // Power quality
  thd: number; // percentage
  powerFactor: number;
  
  // System performance
  availability: number; // percentage
  energyShortfall: number; // kW
  efficiency: number; // percentage
  
  // Additional metrics
  pvEfficiency: number; // percentage
  windEfficiency: number; // percentage
}

// Data point for time-series simulation
export interface SimulationDataPoint extends HRESOutputResults {
  time: number; // hours (0-24)
  solarIrradiance: number;
  temperature: number; // °C
  windSpeed: number;
  loadDemand: number;
}

// 24-hour simulation profile
export interface DailyProfile {
  dataPoints: SimulationDataPoint[];
  totalEnergyGenerated: number; // kWh
  totalEnergyDemand: number; // kWh
  averageAvailability: number; // percentage
  peakPower: number; // kW
}
