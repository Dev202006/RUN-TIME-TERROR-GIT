import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
  TrendingUp, 
  Clock, 
  Activity,
  Waves,
  Wind,
  Thermometer,
  Gauge,
  Zap,
  BarChart3
} from 'lucide-react';

interface DataPoint {
  timestamp: string;
  value: number;
  status: 'normal' | 'warning' | 'critical';
}

interface MetricChart {
  id: string;
  label: string;
  unit: string;
  icon: React.ReactNode;
  color: string;
  data: DataPoint[];
  currentValue: number;
  trend: 'up' | 'down' | 'stable';
}

const GraphsPanel = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [metrics, setMetrics] = useState<MetricChart[]>([]);

  useEffect(() => {
    // Generate historical data for the past 24 hours
    const generateData = (baseValue: number, variance: number, label: string): DataPoint[] => {
      const data: DataPoint[] = [];
      const now = new Date();
      
      for (let i = 47; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 30 * 60 * 1000); // 30-minute intervals
        const variation = (Math.random() - 0.5) * variance;
        const value = Math.max(0, baseValue + variation + Math.sin(i * 0.1) * (variance * 0.3));
        
        let status: 'normal' | 'warning' | 'critical' = 'normal';
        if (label === 'Barometric') {
          if (value < 1000) status = 'critical';
          else if (value < 1010) status = 'warning';
        } else if (label === 'Cyclone Risk') {
          if (value > 80) status = 'critical';
          else if (value > 60) status = 'warning';
        } else {
          const percentage = (value / (baseValue * 2)) * 100;
          if (percentage > 70) status = 'critical';
          else if (percentage > 50) status = 'warning';
        }
        
        data.push({
          timestamp: timestamp.toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit',
            timeZone: 'Asia/Kolkata'
          }),
          value: Number(value.toFixed(2)),
          status
        });
      }
      
      return data;
    };

    const metricsData: MetricChart[] = [
      {
        id: 'tidal',
        label: 'Tidal Height',
        unit: 'm',
        icon: <Waves className="h-4 w-4" />,
        color: '#3b82f6',
        data: generateData(2.8, 1.2, 'Tidal Height'),
        currentValue: 2.8,
        trend: 'up'
      },
      {
        id: 'wind',
        label: 'Wind Speed',
        unit: 'km/h',
        icon: <Wind className="h-4 w-4" />,
        color: '#10b981',
        data: generateData(45, 20, 'Wind Speed'),
        currentValue: 45,
        trend: 'up'
      },
      {
        id: 'temperature',
        label: 'Water Temperature',
        unit: '°C',
        icon: <Thermometer className="h-4 w-4" />,
        color: '#f59e0b',
        data: generateData(28.5, 3, 'Water Temperature'),
        currentValue: 28.5,
        trend: 'stable'
      },
      {
        id: 'pressure',
        label: 'Barometric Pressure',
        unit: 'hPa',
        icon: <Gauge className="h-4 w-4" />,
        color: '#ef4444',
        data: generateData(1008.2, 15, 'Barometric'),
        currentValue: 1008.2,
        trend: 'down'
      },
      {
        id: 'cyclone',
        label: 'Cyclone Risk',
        unit: '%',
        icon: <Zap className="h-4 w-4" />,
        color: '#8b5cf6',
        data: generateData(75, 20, 'Cyclone Risk'),
        currentValue: 75,
        trend: 'up'
      },
      {
        id: 'algae',
        label: 'Algae Bloom Level',
        unit: 'mg/m³',
        icon: <Activity className="h-4 w-4" />,
        color: '#06b6d4',
        data: generateData(3.2, 1.5, 'Algae Bloom'),
        currentValue: 3.2,
        trend: 'stable'
      }
    ];

    setMetrics(metricsData);
  }, [selectedTimeRange]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-warning" />;
      case 'down': return <TrendingUp className="h-3 w-3 text-safe rotate-180" />;
      case 'stable': return <Activity className="h-3 w-3 text-muted-foreground" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'normal': return '#10b981';
      default: return '#6b7280';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{`Time: ${label}`}</p>
          <p className="text-sm" style={{ color: data.color }}>
            {`${data.dataKey}: ${data.value} ${data.payload.unit || ''}`}
          </p>
          <p className="text-xs text-muted-foreground capitalize">
            Status: {data.payload.status}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>Coastal Metrics - Time Series Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Last 24 Hours
              </Badge>
              <Badge variant="outline" className="text-xs">
                30-min intervals
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tidal" className="space-y-4">
            <TabsList className="grid w-full grid-cols-6">
              {metrics.map((metric) => (
                <TabsTrigger 
                  key={metric.id} 
                  value={metric.id}
                  className="text-xs flex items-center space-x-1"
                >
                  {metric.icon}
                  <span className="hidden sm:inline">{metric.label.split(' ')[0]}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {metrics.map((metric) => (
              <TabsContent key={metric.id} value={metric.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {metric.icon}
                      <h3 className="font-semibold">{metric.label}</h3>
                    </div>
                    <Badge style={{ backgroundColor: metric.color, color: 'white' }} className="text-xs">
                      Current: {metric.currentValue} {metric.unit}
                    </Badge>
                    {getTrendIcon(metric.trend)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Gujarat Coast - Veraval Region
                  </div>
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={metric.data}>
                      <defs>
                        <linearGradient id={`gradient-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={metric.color} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={metric.color} stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="timestamp" 
                        interval={3}
                        tick={{ fontSize: 12 }}
                        className="text-muted-foreground"
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        className="text-muted-foreground"
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={metric.color}
                        strokeWidth={2}
                        fill={`url(#gradient-${metric.id})`}
                        dot={(props: any) => {
                          const { payload } = props;
                          return (
                            <circle
                              {...props}
                              fill={getStatusColor(payload.status)}
                              stroke={getStatusColor(payload.status)}
                              strokeWidth={2}
                              r={3}
                            />
                          );
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: metric.color }}>
                      {Math.max(...metric.data.map(d => d.value)).toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">24h Peak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: '#6b7280' }}>
                      {Math.min(...metric.data.map(d => d.value)).toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">24h Low</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: '#10b981' }}>
                      {(metric.data.reduce((sum, d) => sum + d.value, 0) / metric.data.length).toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">24h Average</div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default GraphsPanel;