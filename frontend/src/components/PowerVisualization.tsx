import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { SimulationDataPoint } from '@/types/hres';

interface PowerVisualizationProps {
  data: SimulationDataPoint[];
}

// Custom tooltip for better data display
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
        <p className="font-semibold text-sm mb-1">{`Hour: ${label}:00`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {`${entry.name}: ${typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const PowerVisualization: React.FC<PowerVisualizationProps> = ({ data }) => {
  // Calculate dynamic Y-axis domains for better scaling
  const domains = useMemo(() => {
    if (!data || data.length === 0) return {};

    const maxPower = Math.max(...data.map(d => d.totalPower + d.loadDemand));
    const minVoltage = Math.min(...data.map(d => d.dcBusVoltage));
    const maxVoltage = Math.max(...data.map(d => d.dcBusVoltage));
    const maxIrradiance = Math.max(...data.map(d => d.solarIrradiance));
    const maxWindSpeed = Math.max(...data.map(d => d.windSpeed));
    const maxTemp = Math.max(...data.map(d => d.temperature));
    const minTemp = Math.min(...data.map(d => d.temperature));

    return {
      power: [0, Math.ceil(maxPower * 1.2)],
      voltage: [Math.floor(minVoltage - 5), Math.ceil(maxVoltage + 5)],
      irradiance: [0, Math.min(1000, Math.ceil(maxIrradiance * 1.1))],
      windSpeed: [0, Math.ceil(maxWindSpeed * 1.1)],
      temperature: [Math.floor(minTemp - 2), Math.ceil(maxTemp + 2)],
    };
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">
            Run the 24-hour simulation to see detailed graphs
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Power Generation and Load Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Power Generation vs Load Demand (24-Hour Profile)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="time"
                label={{ value: 'Time of Day (hours)', position: 'insideBottom', offset: -10 }}
                ticks={[0, 3, 6, 9, 12, 15, 18, 21, 24]}
              />
              <YAxis
                yAxisId="left"
                label={{ value: 'Power (kW)', angle: -90, position: 'insideLeft' }}
                domain={domains.power}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              
              {/* Stacked area for generation sources */}
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="pvPower"
                stackId="generation"
                stroke="#f59e0b"
                fill="#fbbf24"
                fillOpacity={0.6}
                name="Solar Power (kW)"
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="windPower"
                stackId="generation"
                stroke="#3b82f6"
                fill="#60a5fa"
                fillOpacity={0.6}
                name="Wind Power (kW)"
              />
              
              {/* Load demand as line */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="loadDemand"
                stroke="#ef4444"
                strokeWidth={3}
                dot={false}
                name="Load Demand (kW)"
              />
              
              {/* Total power as line */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="totalPower"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Total Generation (kW)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* DC Bus Voltage and AC Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>DC Bus Voltage Regulation</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="time"
                  label={{ value: 'Hour', position: 'insideBottom', offset: -10 }}
                  ticks={[0, 6, 12, 18, 24]}
                />
                <YAxis
                  domain={domains.voltage}
                  label={{ value: 'Voltage (V)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                
                <ReferenceLine
                  y={400}
                  stroke="#22c55e"
                  strokeDasharray="3 3"
                  label={{ value: 'Target: 400V', position: 'right' }}
                />
                <ReferenceLine
                  y={408}
                  stroke="#eab308"
                  strokeDasharray="2 2"
                  opacity={0.5}
                />
                <ReferenceLine
                  y={392}
                  stroke="#eab308"
                  strokeDasharray="2 2"
                  opacity={0.5}
                />
                
                <Line
                  type="monotone"
                  dataKey="dcBusVoltage"
                  stroke="#8b5cf6"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  name="DC Bus Voltage (V)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AC Output Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="time"
                  label={{ value: 'Hour', position: 'insideBottom', offset: -10 }}
                  ticks={[0, 6, 12, 18, 24]}
                />
                <YAxis
                  yAxisId="left"
                  label={{ value: 'Voltage (V)', angle: -90, position: 'insideLeft' }}
                  domain={[220, 240]}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{ value: 'Frequency (Hz)', angle: 90, position: 'insideRight' }}
                  domain={[49.5, 50.5]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                
                <ReferenceLine yAxisId="left" y={230} stroke="#22c55e" strokeDasharray="3 3" />
                <ReferenceLine yAxisId="right" y={50} stroke="#3b82f6" strokeDasharray="3 3" />
                
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="acVoltage"
                  stroke="#a855f7"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  name="AC Voltage (V)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="acFrequency"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  name="Frequency (Hz)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Environmental Conditions */}
      <Card>
        <CardHeader>
          <CardTitle>Environmental Conditions (Solar & Wind Complementarity)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={data} margin={{ top: 5, right: 40, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="time"
                label={{ value: 'Time of Day (hours)', position: 'insideBottom', offset: -10 }}
                ticks={[0, 3, 6, 9, 12, 15, 18, 21, 24]}
              />
              <YAxis
                yAxisId="left"
                label={{ value: 'Solar Irradiance (W/m²)', angle: -90, position: 'insideLeft' }}
                domain={domains.irradiance}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{ value: 'Wind Speed (m/s)', angle: 90, position: 'insideRight' }}
                domain={domains.windSpeed}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="solarIrradiance"
                stroke="#f59e0b"
                fill="#fde047"
                fillOpacity={0.5}
                name="Solar Irradiance (W/m²)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="windSpeed"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ r: 3 }}
                name="Wind Speed (m/s)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Temperature Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Temperature Variation (Affects PV Efficiency)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="time"
                label={{ value: 'Time of Day (hours)', position: 'insideBottom', offset: -10 }}
                ticks={[0, 3, 6, 9, 12, 15, 18, 21, 24]}
              />
              <YAxis
                label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
                domain={domains.temperature}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#fb923c" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              
              <Area
                type="monotone"
                dataKey="temperature"
                stroke="#ea580c"
                fill="url(#tempGradient)"
                strokeWidth={2}
                name="Temperature (°C)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* System Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>System Performance & Power Quality</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="time"
                label={{ value: 'Time of Day (hours)', position: 'insideBottom', offset: -10 }}
                ticks={[0, 3, 6, 9, 12, 15, 18, 21, 24]}
              />
              <YAxis
                label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              
              <ReferenceLine y={5} stroke="#ef4444" strokeDasharray="3 3" label="THD Limit" />
              <ReferenceLine y={95} stroke="#22c55e" strokeDasharray="3 3" label="Target Efficiency" />
              
              <Bar
                dataKey="thd"
                fill="#ef4444"
                fillOpacity={0.6}
                name="THD (%)"
                maxBarSize={30}
              />
              <Line
                type="monotone"
                dataKey="efficiency"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 3 }}
                name="System Efficiency (%)"
              />
              <Line
                type="monotone"
                dataKey="availability"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ r: 3 }}
                name="Power Availability (%)"
              />
              <Line
                type="monotone"
                dataKey="powerFactor"
                stroke="#8b5cf6"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Power Factor"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Energy Shortfall Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Energy Shortfall Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="time"
                label={{ value: 'Time of Day (hours)', position: 'insideBottom', offset: -10 }}
                ticks={[0, 3, 6, 9, 12, 15, 18, 21, 24]}
              />
              <YAxis
                label={{ value: 'Power (kW)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              
              <Bar
                dataKey="energyShortfall"
                fill="#ef4444"
                fillOpacity={0.7}
                name="Energy Shortfall (kW)"
                maxBarSize={40}
              />
              <Line
                type="monotone"
                dataKey="loadDemand"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 2 }}
                name="Load Demand (kW)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
