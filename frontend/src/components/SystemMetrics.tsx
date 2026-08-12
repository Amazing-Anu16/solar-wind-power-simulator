import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Zap, TrendingUp, AlertCircle } from 'lucide-react';
import type { HRESOutputResults } from '@/types/hres';

interface SystemMetricsProps {
  results: HRESOutputResults | null;
  loading: boolean;
}

export const SystemMetrics: React.FC<SystemMetricsProps> = ({ results, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!results) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">
            Adjust parameters to see simulation results
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (value: number, threshold: number) => {
    return value >= threshold ? 'text-green-600' : 'text-yellow-600';
  };

  const getTHDColor = (thd: number) => {
    if (thd < 5) return 'text-green-600';
    if (thd < 8) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Power Generation Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              PV Power
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.pvPower.toFixed(2)} kW</div>
            <p className="text-xs text-muted-foreground mt-1">
              Efficiency: {results.pvEfficiency.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              Wind Power
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.windPower.toFixed(2)} kW</div>
            <p className="text-xs text-muted-foreground mt-1">
              Efficiency: {results.windEfficiency.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              Total Power
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.totalPower.toFixed(2)} kW</div>
            <p className="text-xs text-muted-foreground mt-1">
              Overall Efficiency: {results.efficiency.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-purple-500" />
              Availability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(results.availability, 90)}`}>
              {results.availability.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Shortfall: {results.energyShortfall.toFixed(2)} kW
            </p>
          </CardContent>
        </Card>
      </div>

      {/* DC Bus and Power Quality */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">DC Bus Voltage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Voltage:</span>
              <span className="text-lg font-semibold">{results.dcBusVoltage.toFixed(2)} V</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Stability (Deviation):</span>
              <span className={`text-lg font-semibold ${getStatusColor(100 - results.dcBusStability, 95)}`}>
                ±{results.dcBusStability.toFixed(2)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full ${results.dcBusStability < 2.5 ? 'bg-green-500' : 'bg-yellow-500'}`}
                style={{ width: `${Math.min(100, (1 - results.dcBusStability / 10) * 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Target: 400V ±2.1% for optimal inverter performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">AC Output Quality</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Voltage:</span>
              <span className="text-lg font-semibold">{results.acVoltage.toFixed(1)} V</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Frequency:</span>
              <span className="text-lg font-semibold">{results.acFrequency.toFixed(2)} Hz</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">THD:</span>
              <span className={`text-lg font-semibold ${getTHDColor(results.thd)}`}>
                {results.thd.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Power Factor:</span>
              <span className="text-lg font-semibold">{results.powerFactor.toFixed(3)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              IEEE 519 Standard: THD {'<'} 5%, PF {'>'} 0.95
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
