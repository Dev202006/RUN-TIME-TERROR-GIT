import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, MapPin, Waves } from 'lucide-react';

interface ThreatData {
  id: string;
  location: string;
  level: 'safe' | 'watch' | 'warning' | 'critical';
  type: string;
  timestamp: Date;
  severity: number;
  coordinates: [number, number];
}

interface ThreatMapProps {
  threats: ThreatData[];
}

const ThreatMap = ({ threats }: ThreatMapProps) => {
  const [selectedThreat, setSelectedThreat] = useState<string | null>(null);

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'safe': return '#10b981';
      case 'watch': return '#f59e0b';
      case 'warning': return '#f97316';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getThreatSize = (severity: number) => {
    return Math.max(8, Math.min(24, severity * 2));
  };

  return (
    <div className="relative w-full h-[500px] bg-muted rounded-lg overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="text-primary/30">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Coastline Representation */}
      <svg className="absolute inset-0 w-full h-full">
        <path
          d="M 50 100 Q 150 80 250 120 Q 350 100 450 140 Q 550 120 600 160"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          fill="none"
          className="opacity-60"
        />
        <path
          d="M 50 120 Q 150 100 250 140 Q 350 120 450 160 Q 550 140 600 180"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          fill="none"
          className="opacity-40"
        />
      </svg>

      {/* Location Labels */}
      <div className="absolute top-4 left-4 text-sm font-medium text-primary">
        Florida Coast
      </div>
      <div className="absolute top-4 right-4 text-xs text-muted-foreground">
        Real-time Monitoring
      </div>

      {/* Threat Markers */}
      {threats.map((threat, index) => {
        const x = 100 + (index * 150) + (Math.random() * 50);
        const y = 120 + (index * 60) + (Math.random() * 100);
        const size = getThreatSize(threat.severity);
        const isSelected = selectedThreat === threat.id;

        return (
          <div
            key={threat.id}
            className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110"
            style={{ left: x, top: y }}
            onClick={() => setSelectedThreat(isSelected ? null : threat.id)}
          >
            {/* Pulse Animation for Critical Threats */}
            {threat.level === 'critical' && (
              <div
                className="absolute inset-0 rounded-full animate-ping"
                style={{
                  backgroundColor: getThreatColor(threat.level),
                  width: size,
                  height: size,
                  opacity: 0.3
                }}
              />
            )}
            
            {/* Threat Marker */}
            <div
              className="relative rounded-full border-2 border-background flex items-center justify-center shadow-lg"
              style={{
                backgroundColor: getThreatColor(threat.level),
                width: size,
                height: size
              }}
            >
              <AlertTriangle 
                className="text-white" 
                size={Math.max(12, size * 0.5)} 
              />
            </div>

            {/* Threat Info Popup */}
            {isSelected && (
              <Card className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 z-10 shadow-xl">
                <div className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">{threat.location}</h4>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        threat.level === 'critical' ? 'border-critical text-critical' :
                        threat.level === 'warning' ? 'border-warning text-warning' :
                        threat.level === 'watch' ? 'border-watch text-watch' :
                        'border-safe text-safe'
                      }`}
                    >
                      {threat.level.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Waves className="h-3 w-3" />
                      <span>{threat.type}</span>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <span>Severity: {threat.severity.toFixed(1)}/10</span>
                    </div>
                    <div className="mt-1">
                      {threat.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm rounded-lg p-3 border">
        <h4 className="text-sm font-semibold mb-2">Threat Levels</h4>
        <div className="space-y-1">
          {[
            { level: 'safe', label: 'Safe' },
            { level: 'watch', label: 'Watch' },
            { level: 'warning', label: 'Warning' },
            { level: 'critical', label: 'Critical' }
          ].map(({ level, label }) => (
            <div key={level} className="flex items-center space-x-2 text-xs">
              <div
                className="w-3 h-3 rounded-full border border-background"
                style={{ backgroundColor: getThreatColor(level) }}
              />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-1">
        <button className="w-8 h-8 bg-card/80 backdrop-blur-sm rounded border flex items-center justify-center text-sm font-bold hover:bg-card transition-colors">
          +
        </button>
        <button className="w-8 h-8 bg-card/80 backdrop-blur-sm rounded border flex items-center justify-center text-sm font-bold hover:bg-card transition-colors">
          −
        </button>
      </div>
    </div>
  );
};

export default ThreatMap;