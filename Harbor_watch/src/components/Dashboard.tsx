// Dashboard.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  MapPin, 
  Activity, 
  Bell,
  Waves,
  Eye
} from 'lucide-react';
import GujaratThreatMap from './GujaratThreatMap';
import AlertPanel from './AlertPanel';
import EnhancedDataMetrics from './EnhancedDataMetrics';
import VirtualDecisionAssistant from './VirtualDecisionAssistant';
import GraphsPanel from './GraphsPanel';
import OperationalLogger from './OperationalLogger';

// 👇 Import your chatbot
import Chatbot from './Chatbot';

export type ThreatLevel = 'safe' | 'watch' | 'warning' | 'critical';

interface ThreatData {
  id: string;
  location: string;
  level: ThreatLevel;
  type: string;
  timestamp: Date;
  severity: number;
  coordinates: [number, number];
}

const Dashboard = () => {
  const [currentThreatLevel, setCurrentThreatLevel] = useState<ThreatLevel>('warning');
  const [activeThreats, setActiveThreats] = useState<ThreatData[]>([
    {
      id: '1',
      location: 'Veraval Port',
      level: 'critical',
      type: 'Cyclone Alert',
      timestamp: new Date(),
      severity: 8.5,
      coordinates: [70.3667, 20.9]
    },
    {
      id: '2',
      location: 'Porbandar Coast',
      level: 'warning',
      type: 'High Tidal Surge',
      timestamp: new Date(),
      severity: 6.2,
      coordinates: [69.6293, 21.6417]
    },
    {
      id: '3',
      location: 'Dwarka Shore',
      level: 'watch',
      type: 'Strong Winds',
      timestamp: new Date(),
      severity: 4.1,
      coordinates: [68.9685, 22.2394]
    }
  ]);

  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [showGraphs, setShowGraphs] = useState(false);
  const [executedActions, setExecutedActions] = useState<string[]>([]);

  const getThreatLevelColor = (level: ThreatLevel) => {
    switch (level) {
      case 'safe': return 'bg-safe text-safe-foreground';
      case 'watch': return 'bg-watch text-watch-foreground';
      case 'warning': return 'bg-warning text-warning-foreground';
      case 'critical': return 'bg-critical text-critical-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getThreatIcon = (level: ThreatLevel) => {
    switch (level) {
      case 'critical': return <AlertTriangle className="h-5 w-5" />;
      case 'warning': return <AlertTriangle className="h-5 w-5" />;
      case 'watch': return <Eye className="h-5 w-5" />;
      case 'safe': return <Activity className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setActiveThreats(prev => prev.map(threat => ({
        ...threat,
        severity: Math.max(1, Math.min(10, threat.severity + (Math.random() - 0.5) * 0.5)),
        timestamp: new Date()
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 👇 Build AI context string from current dashboard state
  const aiContext = `
    Current threat level: ${currentThreatLevel}.
    Active threats count: ${activeThreats.length}.
    Critical alerts: ${activeThreats.filter(t => t.level === 'critical').length}.
    Active threats summary: 
    ${activeThreats.map(t => `${t.location} - ${t.type} (${t.level}, severity ${t.severity.toFixed(1)})`).join('; ')}
  `;

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Waves className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Harbor Watch: Coastal Threat Alert System</h1>
          </div>
          <Badge 
            className={`${getThreatLevelColor(currentThreatLevel)} flex items-center space-x-1 px-3 py-1`}
          >
            {getThreatIcon(currentThreatLevel)}
            <span className="uppercase font-semibold">{currentThreatLevel}</span>
          </Badge>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <div className="text-sm text-muted-foreground">
            Last Update: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Threat Overview & Data */}
        <div className="lg:col-span-1 space-y-6">
          {/* Current Threat Level */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                <span>Threat Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${getThreatLevelColor(currentThreatLevel)}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold uppercase">{currentThreatLevel}</span>
                    {getThreatIcon(currentThreatLevel)}
                  </div>
                  <p className="text-sm mt-1 opacity-90">
                    {currentThreatLevel === 'critical' && 'Immediate action required'}
                    {currentThreatLevel === 'warning' && 'Prepare for possible evacuation'}
                    {currentThreatLevel === 'watch' && 'Monitor conditions closely'}
                    {currentThreatLevel === 'safe' && 'Normal conditions'}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{activeThreats.length}</div>
                    <div className="text-sm text-muted-foreground">Active Threats</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {activeThreats.filter(t => t.level === 'critical').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Critical Alerts</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Environmental Data */}
          <EnhancedDataMetrics 
            onMetricClick={setSelectedLocation} 
            onGraphsView={() => setShowGraphs(true)} 
          />
        </div>

        {/* Center Column - Map */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="h-[75vh] min-h-[420px] overflow-hidden isolate flex flex-col">
            <CardHeader className="shrink-0">
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Threat Map</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 relative flex-1">
              <div className="absolute inset-0">
                <GujaratThreatMap 
                  threats={activeThreats} 
                  onLocationClick={setSelectedLocation}
                />
              </div>
            </CardContent>
          </Card>

          {/* Assistant below map */}
          <div className="relative z-10">
            <VirtualDecisionAssistant 
              currentLevel={currentThreatLevel} 
              threats={activeThreats}
              onActionExecute={(actionId) => setExecutedActions(prev => [...prev, actionId])}
            />
          </div>
        </div>

        {/* Right Column - Active Alerts & Logs */}
        <div className="lg:col-span-1 space-y-6 max-h-[600px]">
          <AlertPanel threats={activeThreats} onUpdateThreat={setActiveThreats} />
          <OperationalLogger executedActions={executedActions} />
        </div>
      </div>
