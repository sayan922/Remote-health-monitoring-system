import React from 'react';
import { Activity, Heart, Thermometer, Gauge } from 'lucide-react';
import ConnectionPanel from './ConnectionPanel';
import MetricCard from './MetricCard';
import ChartPanel from './ChartPanel';
import HistoricalDataTable from './HistoricalDataTable';
import { useHealthData } from '../contexts/HealthDataContext';
import { useWebSocket } from '../contexts/WebSocketContext';

const Dashboard: React.FC = () => {
  const { currentData, exportData, clearData } = useHealthData();
  const { connectionStatus } = useWebSocket();
  
  return (
    <div className="min-h-screen p-4 md:p-6">
      <header className="mb-8">
        <div className="flex flex-col items-start justify-between mb-4 md:flex-row md:items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Activity size={32} className="mr-3 text-primary-500" />
            <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
              SyncPulse
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {connectionStatus.connected && (
              <>
                <button 
                  onClick={exportData}
                  className="btn btn-secondary"
                >
                  Export Data
                </button>
                <button 
                  onClick={clearData}
                  className="btn btn-outline"
                >
                  Clear Data
                </button>
              </>
            )}
          </div>
        </div>
        
        <ConnectionPanel />
      </header>
      
      <main>
        {/* Current Metrics Section */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">Current Readings</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <MetricCard 
              title="BMP Temperature" 
              value={currentData?.bmp_temp.N || '29'} 
              unit="°C"
              icon={<Thermometer className="text-primary-500" />}
              status="normal"
              range="25-32°C"
            />
            <MetricCard 
              title="Probe Temperature" 
              value={currentData?.probe_temp.N || '34'} 
              unit="°C"
              icon={<Heart className="text-error-500" />}
              status="normal"
              range="27-34°C"
            />
            <MetricCard 
              title="Pressure" 
              value={currentData?.pressure.N || '989'} 
              unit="hPa"
              icon={<Gauge className="text-secondary-500" />}
              status="normal"
              range="900-1000 hPa"
            />
          </div>
        </section>
        
        {/* Charts Section */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">Trend Analysis</h2>
          <ChartPanel />
        </section>
        
        {/* Historical Data Section */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-700">Historical Data</h2>
          <HistoricalDataTable />
        </section>
      </main>
      
      <footer className="pt-6 mt-12 text-sm text-center text-gray-500 border-t border-gray-200">
        <p>© {new Date().getFullYear()} SyncPulse</p>
      </footer>
    </div>
  );
};

export default Dashboard;