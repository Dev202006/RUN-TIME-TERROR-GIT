import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Waves, 
  Wind, 
  Thermometer, 
  Gauge, 
  Activity,
  TrendingUp,
  TrendingDown,
  Zap,
  AlertTriangle,
  Eye,
  BarChart3
} from 'lucide-react';

interface MetricData {
  label: string;
  value: number;
  unit: string;
  max: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  status: 'normal' | 'warning' | 'critical';
  location: string;
  coordinates: [number, number];
}

interface EnhancedDataMetricsProps {
  onMetricClick: (metric: MetricData) => void;
  onGraphsView: () => void;
}

const EnhancedDataMetrics = ({ onMetricClick, onGraphsView }: EnhancedDataMetricsProps) => {
  const [metrics, setMetrics] = useState<MetricData[]>([
    {
      label: 'Tidal Height',
      value: 2.8,
      unit: 'm',
      max: 5,
      trend: 'up',
      icon: <Waves className="h-4 w-4" />,
      status: 'warning',
      location: 'Veraval Port',
      coordinates: [70.3667, 20.9]
    },
    {
      label: 'Wind Speed',
      value: 45,
      unit: 'km/h',
      max: 120,
      trend: 'up',
      icon: <Wind className="h-4 w-4" />,
      status: 'warning',
      location: 'Veraval Coast',
      coordinates: [70.3667, 20.9]
    },
    {
      label: 'Water Temp',
      value: 28.5,
      unit: '°C',
      max: 35,
      trend: 'stable',
      icon: <Thermometer className="h-4 w-4" />,
      status: 'normal',
      location: 'Arabian Sea',
      coordinates: [70.2, 20.8]
    },
    {
      label: 'Barometric',
      value: 1008.2,
      unit: 'hPa',
      max: 1040,
      trend: 'down',
      icon: <Gauge className="h-4 w-4" />,
      status: 'critical',
      location: 'Veraval Station',
      coordinates: [70.3667, 20.9]
    },
    {
      label: 'Cyclone Risk',
      value: 75,
      unit: '%',
      max: 100,
      trend: 'up',
      icon: <Zap className="h-4 w-4" />,
      status: 'warning',
      location: 'Gujarat Coast',
      coordinates: [70.5, 21.0]
    },
    {
      label: 'Algae Bloom',
      value: 3.2,
      unit: 'mg/m³',
      max: 10,
      trend: 'stable',
      icon: <Activity className="h-4 w-4" />,
      status: 'normal',
      location: 'Coastal Waters',
      coordinates: [70.1, 20.7]
    }
  ]);

  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Simulate 3-minute data updates
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => {
        const variation = (Math.random() - 0.5) * 0.2;
        let newValue = metric.value + variation;
        
        // Keep values within reasonable bounds
        newValue = Math.max(0, Math.min(metric.max, newValue));
        
        // Determine trend
        const trend = variation > 0.1 ? 'up' : variation < -0.1 ? 'down' : 'stable';
        
        // Determine status based on thresholds
        let status: 'normal' | 'warning' | 'critical' = 'normal';
        const percentage = (newValue / metric.max) * 100;
        
        if (metric.label === 'Barometric') {
          if (newValue < 1000) status = 'critical';
          else if (newValue < 1010) status = 'warning';
        } else if (metric.label === 'Cyclone Risk') {
          if (percentage > 80) status = 'critical';
          else if (percentage > 60) status = 'warning';
        } else {
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
      setLastUpdate(new Date());
    }, 180000); // 3 minutes = 180000ms

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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-warning" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-safe" />;
      case 'stable': return <Activity className="h-3 w-3 text-muted-foreground" />;
      default: return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return <AlertTriangle className="h-3 w-3 text-critical" />;
      case 'warning': return <AlertTriangle className="h-3 w-3 text-warning" />;
      case 'normal': return <Activity className="h-3 w-3 text-safe" />;
      default: return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <span>Gujarat Coast Metrics</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onGraphsView}
            className="text-xs"
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            View Graphs
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric) => {
          const percentage = Math.min(100, (metric.value / metric.max) * 100);
          
          return (
            <div 
              key={metric.label} 
              className="space-y-2 p-3 rounded-lg border hover:border-primary/50 cursor-pointer transition-colors"
              onClick={() => onMetricClick(metric)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-primary">{metric.icon}</span>
                  <span className="text-sm font-medium">{metric.label}</span>
                  {getTrendIcon(metric.trend)}
                  {getStatusIcon(metric.status)}
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-semibold ${getStatusColor(metric.status)}`}>
                    {metric.value.toFixed(1)} {metric.unit}
                  </span>
                  <Eye className="h-3 w-3 text-muted-foreground" />
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
                <div className="flex items-center space-x-2">
                  <span className={getStatusColor(metric.status)}>
                    {metric.status.toUpperCase()}
                  </span>
                  <span className="text-muted-foreground">
                    {percentage.toFixed(0)}% of max
                  </span>
                </div>
                <span className="text-muted-foreground">
                  {metric.location}
                </span>
              </div>
            </div>
          );
        })}
        
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Auto-refresh: 3 minutes</span>
            <span>Last sync: {lastUpdate.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</span>
          </div>
          <div className="text-xs text-muted-foreground text-center mt-1">
            Data source: IMD Gujarat & Coastal Monitoring Network
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedDataMetrics;
