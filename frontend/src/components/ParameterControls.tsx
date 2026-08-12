import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Sun, Wind, Zap } from 'lucide-react';
import type { HRESInputParams } from '@/types/hres';

interface ParameterControlsProps {
  params: HRESInputParams;
  onParamsChange: (params: HRESInputParams) => void;
}

export const ParameterControls: React.FC<ParameterControlsProps> = ({
  params,
  onParamsChange,
}) => {
  const updateParam = (key: keyof HRESInputParams, value: number) => {
    onParamsChange({ ...params, [key]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Solar Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-yellow-500" />
            Solar Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="irradiance">Solar Irradiance (W/m²)</Label>
              <Input
                id="irradiance-input"
                type="number"
                value={params.solarIrradiance}
                onChange={(e) => updateParam('solarIrradiance', Number(e.target.value))}
                className="w-20 h-8 text-right"
                min={0}
                max={1000}
              />
            </div>
            <Slider
              id="irradiance"
              min={0}
              max={1000}
              step={10}
              value={[params.solarIrradiance]}
              onValueChange={([value]) => updateParam('solarIrradiance', value)}
            />
            <p className="text-xs text-muted-foreground">
              Peak sunlight: 1000 W/m², Cloudy: 200-400 W/m²
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input
                id="temperature-input"
                type="number"
                value={params.temperature}
                onChange={(e) => updateParam('temperature', Number(e.target.value))}
                className="w-20 h-8 text-right"
                min={15}
                max={45}
              />
            </div>
            <Slider
              id="temperature"
              min={15}
              max={45}
              step={1}
              value={[params.temperature]}
              onValueChange={([value]) => updateParam('temperature', value)}
            />
            <p className="text-xs text-muted-foreground">
              Standard test condition: 25°C
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Wind Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wind className="w-5 h-5 text-blue-500" />
            Wind Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="windSpeed">Wind Speed (m/s)</Label>
              <Input
                id="windSpeed-input"
                type="number"
                value={params.windSpeed}
                onChange={(e) => updateParam('windSpeed', Number(e.target.value))}
                className="w-20 h-8 text-right"
                min={0}
                max={15}
                step={0.1}
              />
            </div>
            <Slider
              id="windSpeed"
              min={0}
              max={15}
              step={0.1}
              value={[params.windSpeed]}
              onValueChange={([value]) => updateParam('windSpeed', value)}
            />
            <p className="text-xs text-muted-foreground">
              Cut-in: 3 m/s, Rated: 12 m/s, Cut-out: 15 m/s
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Load Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-500" />
            Load Demand
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="loadDemand">Load Demand (kW)</Label>
              <Input
                id="loadDemand-input"
                type="number"
                value={params.loadDemand}
                onChange={(e) => updateParam('loadDemand', Number(e.target.value))}
                className="w-20 h-8 text-right"
                min={0}
                max={10}
                step={0.1}
              />
            </div>
            <Slider
              id="loadDemand"
              min={0}
              max={10}
              step={0.1}
              value={[params.loadDemand]}
              onValueChange={([value]) => updateParam('loadDemand', value)}
            />
            <p className="text-xs text-muted-foreground">
              Base: 1 kW, Peak evening: 4 kW
            </p>
          </div>
        </CardContent>
      </Card>

      {/* System Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            System Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>PV Array Capacity: {params.pvArrayCapacity} kW</Label>
            <p className="text-xs text-muted-foreground">
              24 modules × 250W, 5S5P configuration
            </p>
          </div>
          <div className="space-y-2">
            <Label>Wind Turbine Capacity: {params.windTurbineCapacity} kW</Label>
            <p className="text-xs text-muted-foreground">
              PMSG-based, Direct drive, 6-pole
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
