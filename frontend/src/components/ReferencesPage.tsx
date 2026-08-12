import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ExternalLink } from 'lucide-react';

export const ReferencesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">References</h1>
          <p className="text-lg text-gray-600">
            Standards, research papers, and technical documentation
          </p>
        </div>

        {/* Standards */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">IEEE & IEC Standards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <ExternalLink className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">IEEE 519-2014</h3>
                <p className="text-sm text-gray-600">
                  IEEE Recommended Practice for Harmonic Control in Electric Power Systems
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <ExternalLink className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">IEC 61727:2004</h3>
                <p className="text-sm text-gray-600">
                  Photovoltaic (PV) systems - Characteristics of the utility interface
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <ExternalLink className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">IEEE 1547-2018</h3>
                <p className="text-sm text-gray-600">
                  Standard for Interconnection and Interoperability of Distributed Energy Resources
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key References */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Key Technical References</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h3 className="font-semibold text-lg">Single-Diode PV Model</h3>
              <p className="text-sm text-gray-600 mt-1">
                Standard photovoltaic cell modeling approach using equivalent circuit parameters
                and Newton-Raphson iterative solution method
              </p>
            </div>

            <div className="border-l-4 border-cyan-500 pl-4 py-2">
              <h3 className="font-semibold text-lg">Betz's Law</h3>
              <p className="text-sm text-gray-600 mt-1">
                Maximum theoretical wind turbine efficiency of 59.3% (Cp = 0.593).
                Practical turbines achieve 40-50% due to mechanical and electrical losses.
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <h3 className="font-semibold text-lg">SPWM Technique</h3>
              <p className="text-sm text-gray-600 mt-1">
                Sinusoidal Pulse Width Modulation for voltage source inverters with LC filtering
                to achieve low THD and high power quality AC output
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h3 className="font-semibold text-lg">P&O MPPT Algorithm</h3>
              <p className="text-sm text-gray-600 mt-1">
                Perturb and Observe Maximum Power Point Tracking for photovoltaic systems
                with typical efficiency of 97-99%
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Research Papers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Research Literature</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold">Hybrid Renewable Energy Systems</h3>
              <p className="text-sm text-gray-600 mt-2">
                Studies on the complementary nature of solar and wind energy resources,
                demonstrating improved system availability and reduced energy storage requirements
                in hybrid configurations compared to standalone systems.
              </p>
            </div>

            <div className="p-4 bg-cyan-50 rounded-lg">
              <h3 className="font-semibold">PMSG Wind Turbine Control</h3>
              <p className="text-sm text-gray-600 mt-2">
                Research on permanent magnet synchronous generator-based wind turbines with
                direct-drive configuration, including power coefficient optimization and
                variable-speed operation strategies.
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold">DC Microgrid Architecture</h3>
              <p className="text-sm text-gray-600 mt-2">
                Literature on DC-coupled renewable energy systems, voltage regulation strategies,
                and power management in DC microgrids with multiple energy sources.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Technical Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Technical Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold mb-2">Solar PV Technology</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Temperature coefficient effects</li>
                  <li>• Irradiance impact on I-V curves</li>
                  <li>• Array configuration (series/parallel)</li>
                  <li>• MPPT tracking algorithms</li>
                </ul>
              </div>

              <div className="p-4 bg-cyan-50 rounded-lg">
                <h3 className="font-semibold mb-2">Wind Energy Systems</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Aerodynamic power extraction</li>
                  <li>• Tip-speed ratio optimization</li>
                  <li>• Cut-in/rated/cut-out speeds</li>
                  <li>• Generator types and efficiency</li>
                </ul>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold mb-2">Power Electronics</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• DC-DC boost converter design</li>
                  <li>• SPWM inverter control</li>
                  <li>• LC filter design</li>
                  <li>• Switching frequency selection</li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold mb-2">Power Quality</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• THD measurement and limits</li>
                  <li>• Power factor correction</li>
                  <li>• Voltage regulation standards</li>
                  <li>• Harmonic analysis</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Information */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="text-2xl">Project Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-lg">Project Title</h3>
                <p className="text-gray-700">
                  DC-Coupled Solar-Wind Hybrid Renewable Energy System
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Institution</h3>
                <p className="text-gray-700">
                  D. Y. Patil Institute of Technology
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Team Members</h3>
                <p className="text-gray-700">
                  Anupriya Kundu (SIT06) • Namita Lal Deo (SIT07) • Phulesh Sirvi (SIT08) • Aditya Tayade (SIT04)
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Key Achievement</h3>
                <p className="text-gray-700">
                  92.7% power availability with only 4.4 kWh shortfall over 24 hours,
                  demonstrating significant improvement over standalone systems
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
