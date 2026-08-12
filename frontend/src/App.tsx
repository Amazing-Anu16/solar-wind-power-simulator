import { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { FormulasPage } from './components/FormulasPage';
import { ReferencesPage } from './components/ReferencesPage';
import { FutureScopePage } from './components/FutureScopePage';
import { ParameterControls } from './components/ParameterControls';
import { SystemMetrics } from './components/SystemMetrics';
import { PowerVisualization } from './components/PowerVisualization';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { hresApi } from './lib/api';
import { Play, BarChart3, Zap, AlertCircle } from 'lucide-react';
import type { HRESInputParams, HRESOutputResults, DailyProfile } from './types/hres';

function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [params, setParams] = useState<HRESInputParams>({
    solarIrradiance: 800,
    temperature: 25,
    windSpeed: 8,
    loadDemand: 3,
    pvArrayCapacity: 6.25,
    windTurbineCapacity: 5,
  });

  const [results, setResults] = useState<HRESOutputResults | null>(null);
  const [dailyProfile, setDailyProfile] = useState<DailyProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [simulationLoading, setSimulationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  // Check backend health on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await hresApi.healthCheck();
        setBackendStatus('connected');
      } catch (err) {
        setBackendStatus('disconnected');
        setError('Backend server is not running. Please start the backend server.');
      }
    };
    checkBackend();
  }, []);

  // Calculate instant results when parameters change
  const calculateInstant = useCallback(async () => {
    if (backendStatus !== 'connected') return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await hresApi.calculateInstant(params);
      setResults(data);
    } catch (err) {
      console.error('Calculation error:', err);
      setError('Failed to calculate results. Please check your parameters.');
    } finally {
      setLoading(false);
    }
  }, [params, backendStatus]);

  // Debounced automatic calculation
  useEffect(() => {
    const timer = setTimeout(() => {
      calculateInstant();
    }, 500);

    return () => clearTimeout(timer);
  }, [calculateInstant]);

  // Run 24-hour simulation with current parameters
  const runDailySimulation = async () => {
    setSimulationLoading(true);
    setError(null);
    try {
      // Pass current parameters to create realistic variations
      const profile = await hresApi.simulate24Hours({
        solarIrradiance: params.solarIrradiance,
        temperature: params.temperature,
        windSpeed: params.windSpeed,
        loadDemand: params.loadDemand,
        pvArrayCapacity: params.pvArrayCapacity,
        windTurbineCapacity: params.windTurbineCapacity,
      });
      setDailyProfile(profile);
    } catch (err) {
      console.error('Simulation error:', err);
      setError('Failed to run 24-hour simulation. Please try again.');
    } finally {
      setSimulationLoading(false);
    }
  };

  // Render pages based on navigation
  const renderPage = () => {
    if (currentPage === 'home') {
      return <HomePage onNavigate={setCurrentPage} />;
    }
    if (currentPage === 'formulas') {
      return <FormulasPage />;
    }
    if (currentPage === 'references') {
      return <ReferencesPage />;
    }
    if (currentPage === 'future-scope') {
      return <FutureScopePage />;
    }
    // Default is simulation page
    return renderSimulationPage();
  };

  // Simulation page content
  const renderSimulationPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Zap className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Solar-Wind Hybrid Power
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            DC-Coupled Renewable Energy System
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className={`w-3 h-3 rounded-full ${backendStatus === 'connected' ? 'bg-green-500' : backendStatus === 'disconnected' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
            <span className="text-sm text-gray-600">
              {backendStatus === 'connected' ? 'Backend Connected' : backendStatus === 'disconnected' ? 'Backend Disconnected' : 'Checking Backend...'}
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="flex items-center gap-3 py-4">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Parameter Controls */}
        <ParameterControls params={params} onParamsChange={setParams} />

        {/* System Metrics */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Real-Time System Performance
          </h2>
          <SystemMetrics results={results} loading={loading} />
        </div>

        {/* 24-Hour Simulation */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Play className="w-6 h-6" />
              24-Hour Simulation
            </h2>
            <Button
              onClick={runDailySimulation}
              disabled={simulationLoading || backendStatus !== 'connected'}
              size="lg"
            >
              {simulationLoading ? 'Running...' : 'Run Full Day Simulation'}
            </Button>
          </div>

          {dailyProfile && (
            <div className="space-y-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">Total Energy Generated</div>
                    <div className="text-2xl font-bold">{dailyProfile.totalEnergyGenerated.toFixed(2)} kWh</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">Total Energy Demand</div>
                    <div className="text-2xl font-bold">{dailyProfile.totalEnergyDemand.toFixed(2)} kWh</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">Average Availability</div>
                    <div className="text-2xl font-bold text-green-600">{dailyProfile.averageAvailability.toFixed(1)}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">Peak Power</div>
                    <div className="text-2xl font-bold">{dailyProfile.peakPower.toFixed(2)} kW</div>
                  </CardContent>
                </Card>
              </div>

              {/* Visualization */}
              <PowerVisualization data={dailyProfile.dataPoints} />
            </div>
          )}
        </div>

        {/* Footer */}
        <Card className="bg-white/50">
          <CardContent className="pt-6">
            <div className="text-center text-sm text-gray-600 space-y-2">
              <p className="font-semibold">D. Y. Patil Institute of Technology - SIT Batch</p>
              <p>
                <strong>Team Members:</strong> Anupriya Kundu (SIT06), Namita Lal Deo (SIT07), 
                Phulesh Sirvi (SIT08), Aditya Tayade (SIT04)
              </p>
              <p className="text-xs text-gray-500">
                DC-Coupled Hybrid Renewable Energy System with P&O MPPT and PMSG Technology
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
    </div>
  );
}

export default App;
