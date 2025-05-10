import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useWebSocket } from './WebSocketContext';
import {
  HealthData,
  HistoricalData,
  DataPoint,
  MAX_DATA_POINTS,
} from '../types';

interface HealthDataContextType {
  currentData: HealthData | null;
  historicalData: HistoricalData;
  clearData: () => void;
  exportData: () => void;
}

const HealthDataContext = createContext<HealthDataContextType>({
  currentData: null,
  historicalData: { bmpTemp: [], probeTemp: [], pressure: [] },
  clearData: () => {},
  exportData: () => {},
});

export const useHealthData = () => useContext(HealthDataContext);

interface HealthDataProviderProps {
  children: ReactNode;
}

export const HealthDataProvider: React.FC<HealthDataProviderProps> = ({
  children,
}) => {
  const { websocket, connectionStatus, connect } = useWebSocket();
  const [currentData, setCurrentData] = useState<HealthData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData>({
    bmpTemp: [],
    probeTemp: [],
    pressure: [],
  });

  // 🔁 Auto-connect WebSocket on mount if not connected
  useEffect(() => {
    if (!connectionStatus.connected) {
      connect();
    }
  }, [connect, connectionStatus.connected]);

  // 🔊 Listen for WebSocket messages
  useEffect(() => {
    if (!websocket) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const raw = JSON.parse(event.data);
        console.log('WebSocket raw payload:', raw);

        const wrapper = raw.SensorData || raw;
        const sensorData = wrapper?.M ? wrapper.M : wrapper;

        const getNum = (snake: string, camel: string) => {
          const attr = sensorData[snake] ?? sensorData[camel];
          if (!attr) return null;
          if (typeof attr === 'number') return attr;
          if (typeof attr === 'string') return parseFloat(attr);
          if ((attr as any).N) return parseFloat((attr as any).N);
          if ((attr as any).value) return Number((attr as any).value);
          return null;
        };

        const bmpTempValue = getNum('bmp_temp', 'bmpTemp');
        const probeTempValue = getNum('probe_temp', 'probeTemp');
        const pressureValue = getNum('pressure', 'pressure');
        const timestamp = Date.now();

        if (
          bmpTempValue == null ||
          probeTempValue == null ||
          pressureValue == null
        ) {
          console.error('Incomplete data received, skipping:', raw);
          return;
        }

        setCurrentData({
          bmp_temp: { N: String(bmpTempValue) },
          probe_temp: { N: String(probeTempValue) },
          pressure: { N: String(pressureValue) },
          timestamp,
        });

        setHistoricalData((prev) => {
          const next = (arr: DataPoint[], val: number) =>
            [...arr, { value: val, timestamp }].slice(-MAX_DATA_POINTS);

          return {
            bmpTemp: next(prev.bmpTemp, bmpTempValue),
            probeTemp: next(prev.probeTemp, probeTempValue),
            pressure: next(prev.pressure, pressureValue),
          };
        });
      } catch (err) {
        console.error('Error processing WebSocket message:', err);
      }
    };

    websocket.addEventListener('message', handleMessage);
    return () => {
      websocket.removeEventListener('message', handleMessage);
    };
  }, [websocket]);

  const clearData = () => {
    setCurrentData(null);
    setHistoricalData({
      bmpTemp: [],
      probeTemp: [],
      pressure: [],
    });
  };

  const exportData = () => {
    if (historicalData.bmpTemp.length === 0) {
      alert('No data to export');
      return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Timestamp,BMP Temperature,Probe Temperature,Pressure\n';

    const maxLength = Math.max(
      historicalData.bmpTemp.length,
      historicalData.probeTemp.length,
      historicalData.pressure.length
    );

    for (let i = 0; i < maxLength; i++) {
      const bmpTemp =
        i < historicalData.bmpTemp.length
          ? historicalData.bmpTemp[i]
          : { value: '', timestamp: 0 };
      const probeTemp =
        i < historicalData.probeTemp.length
          ? historicalData.probeTemp[i]
          : { value: '', timestamp: 0 };
      const pressure =
        i < historicalData.pressure.length
          ? historicalData.pressure[i]
          : { value: '', timestamp: 0 };

      const timestamp = new Date(
        bmpTemp.timestamp || probeTemp.timestamp || pressure.timestamp
      ).toISOString();

      csvContent += `${timestamp},${bmpTemp.value},${probeTemp.value},${pressure.value}\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `health_data_${new Date().toISOString()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <HealthDataContext.Provider
      value={{
        currentData,
        historicalData,
        clearData,
        exportData,
      }}
    >
      {children}
    </HealthDataContext.Provider>
  );
};
