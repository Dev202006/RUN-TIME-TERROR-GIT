import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  CheckCircle,
  XCircle,
  MoreVertical,
  Eye
} from 'lucide-react';

interface ThreatData {
  id: string;
  location: string;
  level: 'safe' | 'watch' | 'warning' | 'critical';
  type: string;
  timestamp: Date;
  severity: number;
  coordinates: [number, number];
}

interface AlertPanelProps {
  threats: ThreatData[];
  onUpdateThreat: (threats: ThreatData[]) => void;
}

const AlertPanel = ({ threats, onUpdateThreat }: AlertPanelProps) => {
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Set<string>>(new Set());

  const getThreatLevelBadge = (level: string) => {
    const baseClass = "text-xs font-semibold";
    switch (level) {
      case 'safe': return `${baseClass} bg-safe text-safe-foreground`;
      case 'watch': return `${baseClass} bg-watch text-watch-foreground`;
      case 'warning': return `${baseClass} bg-warning text-warning-foreground`;
      case 'critical': return `${baseClass} bg-critical text-critical-foreground`;
      default: return `${baseClass} bg-muted text-muted-foreground`;
    }
  };

  const getThreatIcon = (level: string) => {
    switch (level) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-critical" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'watch': return <Eye className="h-4 w-4 text-watch" />;
      case 'safe': return <CheckCircle className="h-4 w-4 text-safe" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const acknowledgeAlert = (threatId: string) => {
    setAcknowledgedAlerts(prev => new Set([...prev, threatId]));
  };

  const dismissAlert = (threatId: string) => {
    onUpdateThreat(threats.filter(threat => threat.id !== threatId));
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const sortedThreats = [...threats].sort((a, b) => {
    const levelPriority = { critical: 4, warning: 3, watch: 2, safe: 1 };
    return levelPriority[b.level] - levelPriority[a.level];
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <span>Active Alerts</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {threats.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          <div className="space-y-3 p-4">
            {sortedThreats.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-safe" />
                <p className="text-sm">No active threats</p>
                <p className="text-xs mt-1">All systems normal</p>
              </div>
            ) : (
              sortedThreats.map((threat) => {
                const isAcknowledged = acknowledgedAlerts.has(threat.id);
                
                return (
                  <div
                    key={threat.id}
                    className={`border rounded-lg p-4 transition-all duration-300 ${
                      isAcknowledged 
                        ? 'bg-muted/50 border-muted opacity-75' 
                        : 'bg-card border-border hover:border-primary/50'
                    } ${
                      threat.level === 'critical' && !isAcknowledged
                        ? 'shadow-alert animate-pulse'
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="flex-shrink-0 mt-0.5">
                          {getThreatIcon(threat.level)}
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-sm">{threat.location}</h4>
                            <Badge className={getThreatLevelBadge(threat.level)}>
                              {threat.level.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-sm text-foreground">{threat.type}</p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{threat.coordinates[1].toFixed(2)}, {threat.coordinates[0].toFixed(2)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{getTimeAgo(threat.timestamp)}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between pt-2">
                              <div className="text-xs">
                                <span className="text-muted-foreground">Severity: </span>
                                <span className={`font-semibold ${
                                  threat.severity >= 8 ? 'text-critical' :
                                  threat.severity >= 6 ? 'text-warning' :
                                  threat.severity >= 4 ? 'text-watch' :
                                  'text-safe'
                                }`}>
                                  {threat.severity.toFixed(1)}/10
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-1">
                                {!isAcknowledged ? (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => acknowledgeAlert(threat.id)}
                                      className="h-6 px-2 text-xs"
                                    >
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Acknowledge
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => dismissAlert(threat.id)}
                                      className="h-6 px-2 text-xs"
                                    >
                                      <XCircle className="h-3 w-3" />
                                    </Button>
                                  </>
                                ) : (
                                  <Badge variant="outline" className="text-xs text-muted-foreground">
                                    Acknowledged
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AlertPanel;