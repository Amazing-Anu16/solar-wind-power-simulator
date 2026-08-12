import React from 'react';
import { Zap, Wind, Battery, BarChart3, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Solar-Wind Hybrid DC Microgrid Simulation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Interactive real-time simulation of a 10 kW hybrid renewable energy system with
            MPPT control, battery storage, and comprehensive power flow analysis
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={() => onNavigate('simulation')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
            >
              Start Simulation
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate('formulas')}
              className="px-8 py-6 text-lg"
            >
              View Formulas
            </Button>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Solar PV */}
          <Card className="border-2 hover:border-orange-300 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle className="text-xl">Solar PV Modeling</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Single-diode equivalent circuit with Newton-Raphson solver for accurate I-V characteristics and MPP tracking
              </p>
            </CardContent>
          </Card>

          {/* Wind Power */}
          <Card className="border-2 hover:border-cyan-300 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <Wind className="w-6 h-6 text-cyan-600" />
              </div>
              <CardTitle className="text-xl">Wind Power Model</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Aerodynamic power model with Cp(λ) curve, accounting for cut-in, rated, and cut-out wind speeds
              </p>
            </CardContent>
          </Card>

          {/* Battery Storage */}
          <Card className="border-2 hover:border-purple-300 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Battery className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Battery Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                SOC tracking via coulomb counting with voltage-SOC characteristics and charge/discharge limits
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* System Overview */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2">
          <CardHeader>
            <CardTitle className="text-2xl text-center">System Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">PV Array</h3>
                <p className="text-sm text-gray-600">6.25 kW capacity</p>
                <p className="text-xs text-gray-500">25 modules × 250W (5S5P)</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">Wind Turbine</h3>
                <p className="text-sm text-gray-600">5 kW capacity</p>
                <p className="text-xs text-gray-500">PMSG-based, direct drive</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">DC Bus</h3>
                <p className="text-sm text-gray-600">400V target</p>
                <p className="text-xs text-gray-500">±2.1% stability</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">AC Output</h3>
                <p className="text-sm text-gray-600">230V, 50Hz</p>
                <p className="text-xs text-gray-500">SPWM control, THD &lt; 5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Features Overview */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">What You Can Do</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Real-Time Simulation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-600">• Adjust solar irradiance, temperature, wind speed, and load demand</p>
              <p className="text-sm text-gray-600">• See instant power generation and DC bus voltage updates</p>
              <p className="text-sm text-gray-600">• Monitor power quality metrics (THD, power factor)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                24-Hour Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-600">• Complete daily profiles for all environmental conditions</p>
              <p className="text-sm text-gray-600">• Energy balance calculations (generation vs. demand)</p>
              <p className="text-sm text-gray-600">• System performance metrics and availability analysis</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Advanced Visualizations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-600">• 7 comprehensive interactive charts</p>
              <p className="text-sm text-gray-600">• Power generation, voltage regulation, and quality metrics</p>
              <p className="text-sm text-gray-600">• Environmental conditions and system performance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-600" />
                Educational Tool
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-600">• Learn about hybrid renewable energy systems</p>
              <p className="text-sm text-gray-600">• Understand solar-wind complementarity</p>
              <p className="text-sm text-gray-600">• Explore mathematical models and formulas</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
            <p className="text-lg mb-6 text-blue-100">
              Experience the power of hybrid renewable energy simulation
            </p>
            <Button
              size="lg"
              onClick={() => onNavigate('simulation')}
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg"
            >
              Launch Simulator
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600">
          <p>D. Y. Patil Institute of Technology - SIT Batch</p>
          <p className="mt-2">
            Anupriya Kundu • Namita Lal Deo • Phulesh Sirvi • Aditya Tayade
          </p>
          <p className="mt-4 text-xs text-gray-500">
            Solar-Wind Hybrid Power © 2025
          </p>
        </div>
      </footer>
    </div>
  );
};
