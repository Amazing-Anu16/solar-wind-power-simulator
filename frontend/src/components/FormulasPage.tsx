import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export const FormulasPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mathematical Formulas</h1>
          <p className="text-lg text-gray-600">
            Complete mathematical models used in the simulation engine
          </p>
        </div>

        {/* PV Model */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">1. Photovoltaic (PV) System Model</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">PV Power Output</h3>
              <div className="bg-blue-50 p-4 rounded-lg font-mono text-sm">
                P<sub>pv</sub> = C<sub>pv</sub> × f<sub>pv</sub> × (G<sub>t</sub> / G<sub>stc</sub>) × [1 + α<sub>p</sub> × (T<sub>c</sub> - T<sub>stc</sub>)]
              </div>
              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <p>• C<sub>pv</sub> = PV array capacity = 6.25 kW</p>
                <p>• f<sub>pv</sub> = Derating factor = 0.85</p>
                <p>• G<sub>stc</sub> = Standard irradiance = 1000 W/m²</p>
                <p>• α<sub>p</sub> = Temperature coefficient = -0.004 /°C</p>
                <p>• T<sub>stc</sub> = Standard temperature = 25°C</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">MPPT Efficiency</h3>
              <div className="bg-blue-50 p-4 rounded-lg font-mono text-sm">
                P<sub>mppt</sub> = P<sub>pv</sub> × η<sub>mppt</sub> × (1 + Δ<sub>osc</sub>)
              </div>
              <div className="mt-3 text-sm text-gray-600">
                <p>• η<sub>mppt</sub> = MPPT efficiency = 98%</p>
                <p>• Δ<sub>osc</sub> = Oscillation around MPP ≈ ±0.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wind Model */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">2. Wind Turbine System Model</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Wind Power Output</h3>
              <div className="bg-cyan-50 p-4 rounded-lg font-mono text-sm">
                P<sub>w</sub> = 0.5 × ρ × A × C<sub>p</sub> × V³
              </div>
              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <p>• ρ = Air density = 1.225 kg/m³</p>
                <p>• A = Rotor swept area = 24.97 m²</p>
                <p>• C<sub>p</sub> = Power coefficient (max 0.45)</p>
                <p>• V = Wind speed (m/s)</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Operating Range</h3>
              <div className="bg-cyan-50 p-4 rounded-lg text-sm space-y-1">
                <p>• Cut-in speed: 3 m/s</p>
                <p>• Rated speed: 12 m/s</p>
                <p>• Cut-out speed: 15 m/s</p>
                <p>• Rated power: 5 kW</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">PMSG Conversion</h3>
              <div className="bg-cyan-50 p-4 rounded-lg font-mono text-sm">
                P<sub>out</sub> = P<sub>w</sub> × η<sub>gen</sub> × η<sub>rect</sub> × η<sub>boost</sub>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                <p>• Combined efficiency = 84.8%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* DC Bus */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">3. DC Bus Voltage Regulation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Boost Converter</h3>
              <div className="bg-purple-50 p-4 rounded-lg font-mono text-sm">
                V<sub>out</sub> = V<sub>in</sub> / (1 - D)
              </div>
              <div className="mt-3 text-sm text-gray-600">
                <p>• Target DC voltage = 400V</p>
                <p>• Operating range: 385V - 415V</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Voltage Stability</h3>
              <div className="bg-purple-50 p-4 rounded-lg font-mono text-sm">
                Stability = |V<sub>dc</sub> - V<sub>target</sub>| / V<sub>target</sub> × 100%
              </div>
              <div className="mt-3 text-sm text-gray-600">
                <p>• Target stability: &lt; 2.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inverter */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">4. SPWM Inverter Model</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">AC Voltage Output</h3>
              <div className="bg-green-50 p-4 rounded-lg font-mono text-sm">
                V<sub>ac,rms</sub> = (m<sub>a</sub> × V<sub>dc</sub>) / (2√2) × η<sub>inv</sub> × η<sub>filter</sub>
              </div>
              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <p>• m<sub>a</sub> = Modulation index = 0.9</p>
                <p>• η<sub>inv</sub> = Inverter efficiency = 95%</p>
                <p>• η<sub>filter</sub> = LC filter efficiency = 98%</p>
                <p>• Target AC voltage = 230V RMS, 50Hz</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Power Quality */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">5. Power Quality Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Total Harmonic Distortion (THD)</h3>
              <div className="bg-orange-50 p-4 rounded-lg font-mono text-sm">
                THD = THD<sub>base</sub> + THD<sub>load</sub> + THD<sub>voltage</sub>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                <p>• IEEE 519 Standard: THD &lt; 5%</p>
                <p>• Base THD with SPWM + LC filter: 2-4%</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Power Factor</h3>
              <div className="bg-orange-50 p-4 rounded-lg font-mono text-sm">
                PF = 0.95 + min(P<sub>load</sub> / P<sub>total</sub>, 1) × 0.03
              </div>
              <div className="mt-3 text-sm text-gray-600">
                <p>• Target: PF &gt; 0.95</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">6. System Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">System Availability</h3>
              <div className="bg-indigo-50 p-4 rounded-lg font-mono text-sm">
                Availability = min(100, P<sub>total</sub> / P<sub>load</sub> × 100%)
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Overall Efficiency</h3>
              <div className="bg-indigo-50 p-4 rounded-lg font-mono text-sm">
                η<sub>system</sub> = P<sub>total</sub> / (P<sub>pv,capacity</sub> + P<sub>wind,capacity</sub>) × 100%
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Energy Shortfall</h3>
              <div className="bg-indigo-50 p-4 rounded-lg font-mono text-sm">
                P<sub>shortfall</sub> = max(0, P<sub>load</sub> - P<sub>total</sub>)
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
