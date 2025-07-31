import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { useWebSocket } from '../contexts/WebSocketContext';
import { format } from 'date-fns';

// Get WebSocket URL from Vite env variable
const WS_URL = import.meta.env.VITE_WS_URL;

const ConnectionPanel: React.FC = () => {
  const { connectionStatus, connect } = useWebSocket();
  const [showDetails, setShowDetails] = useState(false);

  // Automatically connect on mount
  useEffect(() => {
    if (WS_URL) {
      connect(WS_URL);
    } else {
      console.error('VITE_WS_URL is not defined in the environment variables.');
    }
  }, [connect]);

  const formatTimestamp = (timestamp: number | null) => {
    if (!timestamp) return 'N/A';
    return format(new Date(timestamp), 'HH:mm:ss');
  };

  return (
    <div className="mb-6 bg-white card">
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex items-center mb-2 mr-4">
          {connectionStatus.connected ? (
            <Wifi size={20} className="mr-2 text-success-500" />
          ) : (
            <WifiOff size={20} className="mr-2 text-gray-400" />
          )}
          <span className="font-medium">
            {connectionStatus.connected ? 'Connected' : 'Disconnected'}
          </span>
          {connectionStatus.connected && (
            <div className="flex items-center ml-2">
              <div className="w-2 h-2 mr-1 rounded-full bg-success-500 animate-pulse"></div>
              <span className="text-xs text-success-600">Live</span>
            </div>
          )}
        </div>

        {connectionStatus.error && (
          <div className="flex items-center mb-2 text-error-500">
            <AlertCircle size={16} className="mr-1" />
            <span className="text-sm">{connectionStatus.error}</span>
          </div>
        )}

        <button 
          className="text-sm underline text-primary-500"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {showDetails && (
        <div className="pt-4 mt-4 text-sm text-gray-600 border-t">
          <p><span className="font-semibold">Status:</span> {connectionStatus.connected ? 'Connected' : 'Disconnected'}</p>
          <p><span className="font-semibold">Last updated:</span> {formatTimestamp(connectionStatus.lastUpdated)}</p>
          {connectionStatus.error && (
            <p><span className="font-semibold">Error:</span> {connectionStatus.error}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectionPanel;
