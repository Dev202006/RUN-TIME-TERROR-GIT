import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Waves, 
  Wind, 
  Thermometer, 
  Gauge, 
  Activity,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface MetricData {
  label: string;
  value: number;
  unit: string;
  max: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  status: 'normal' | 'warning' | 'critical';
}

const DataMetrics = () => {
  const [metrics, setMetrics] = useState<MetricData[]>([
    {
      label: 'Wave Height',
      value: 3.2,
      unit: 'm',
      max: 10,
      trend: 'up',
      icon: <Waves className="h-4 w-4" />,
      status: 'warning'
    },
    {
      label: 'Wind Speed',
      value: 45,
      unit: 'km/h',
      max: 120,
      trend: 'up',
      icon: <Wind className="h-4 w-4" />,
      status: 'warning'
    },
    {
      label: 'Water Temp',
      value: 28.5,
      unit: '°C',
      max: 35,
      trend: 'stable',
      icon: <Thermometer className="h-4 w-4" />,
      status: 'normal'
    },
    {
      label: 'Barometric',
      value: 1008.2,
      unit: 'hPa',
      max: 1040,
      trend: 'down',
      icon: <Gauge className="h-4 w-4" />,
      status: 'critical'
    }
  ]);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => {
        const variation = (Math.random() - 0.5) * 0.1;
        let newValue = metric.value + variation;
        
        // Keep values within reasonable bounds
        newValue = Math.max(0, Math.min(metric.max, newValue));
        
        // Determine trend
        const trend = variation > 0.05 ? 'up' : variation < -0.05 ? 'down' : 'stable';
        
        // Determine status based on value thresholds
        let status: 'normal' | 'warning' | 'critical' = 'normal';
        const percentage = (newValue / metric.max) * 100;
        
        if (metric.label === 'Barometric') {
          // Lower barometric pressure is more dangerous
          if (newValue < 1000) status = 'critical';
          else if (newValue < 1010) status = 'warning';
        } else {
          // Higher values are more dangerous for other metrics
          if (percentage > 70) status = 'critical';
          else if (percentage > 50) status = 'warning';
        }
        
        return {
          ...metric,
          value: newValue,
          trend,
          status
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-critical';
      case 'warning': return 'text-warning';
      case 'normal': return 'text-safe';
      default: return 'text-muted-foreground';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-critical';
      case 'warning': return 'bg-warning';
      case 'normal': return 'bg-safe';
      default: return 'bg-muted';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-warning" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-safe" />;
      case 'stable': return <Activity className="h-3 w-3 text-muted-foreground" />;
      default: return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-primary" />
          <span>Environmental Data</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric) => {
          const percentage = Math.min(100, (metric.value / metric.max) * 100);
          
          return (
            <div key={metric.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-primary">{metric.icon}</span>
                  <span className="text-sm font-medium">{metric.label}</span>
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-semibold ${getStatusColor(metric.status)}`}>
                    {metric.value.toFixed(1)} {metric.unit}
                  </span>
                </div>
              </div>
              
              <div className="space-y-1">
                <Progress 
                  value={percentage} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0 {metric.unit}</span>
                  <span>{metric.max} {metric.unit}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className={getStatusColor(metric.status)}>
                  {metric.status.toUpperCase()}
                </span>
                <span className="text-muted-foreground">
                  {percentage.toFixed(0)}% of maximum
                </span>
              </div>
            </div>
          );
        })}
        
        <div className="pt-4 border-t">
          <div className="text-xs text-muted-foreground text-center">
            Data updated every 3 seconds
          </div>
          <div className="text-xs text-muted-foreground text-center mt-1">
            Last sync: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataMetrics;
