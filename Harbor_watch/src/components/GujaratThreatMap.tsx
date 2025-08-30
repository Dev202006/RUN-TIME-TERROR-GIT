import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MapPin, Waves, Eye, Zap, Wind } from 'lucide-react';

interface ThreatData {
  id: string;
  location: string;
  level: 'safe' | 'watch' | 'warning' | 'critical';
  type: string;
  timestamp: Date;
  severity: number;
  coordinates: [number, number];
}

interface GujaratThreatMapProps {
  threats: ThreatData[];
  onLocationClick: (location: { name: string; coordinates: [number, number]; data: any }) => void;
}

const GujaratThreatMap = ({ threats, onLocationClick }: GujaratThreatMapProps) => {
  const [selectedThreat, setSelectedThreat] = useState<string | null>(null);

  // Gujarat coastal locations with their coordinates
  const gujaratLocations = [
    { name: 'Veraval', coordinates: [70.3667, 20.9], type: 'major_port' },
    { name: 'Porbandar', coordinates: [69.6293, 21.6417], type: 'port' },
    { name: 'Dwarka', coordinates: [68.9685, 22.2394], type: 'coastal_town' },
    { name: 'Jamnagar', coordinates: [70.0671, 22.4707], type: 'city' },
    { name: 'Bhavnagar', coordinates: [72.1519, 21.7645], type: 'port' },
    { name: 'Diu', coordinates: [70.9127, 20.7144], type: 'coastal_town' },
    { name: 'Mangrol', coordinates: [70.1194, 21.1167], type: 'fishing_harbor' },
    { name: 'Chorwad', coordinates: [70.2167, 21.0333], type: 'fishing_harbor' }
  ];

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
    return Math.max(12, Math.min(32, severity * 3));
  };

  const getLocationTypeIcon = (type: string) => {
    switch (type) {
      case 'major_port': return <Waves className="h-3 w-3" />;
      case 'port': return <MapPin className="h-3 w-3" />;
      case 'fishing_harbor': return <Waves className="h-3 w-3" />;
      default: return <MapPin className="h-3 w-3" />;
    }
  };

  // Convert real coordinates to SVG positions
  const coordToSVG = (coords: [number, number]): [number, number] => {
    // Gujarat coast spans roughly from 68.5°E to 72.5°E and 20.0°N to 23.5°N
    const [lon, lat] = coords;
    const x = ((lon - 68.5) / (72.5 - 68.5)) * 600; // Map width 600px
    const y = ((23.5 - lat) / (23.5 - 20.0)) * 400; // Map height 400px (inverted Y)
    return [Math.max(50, Math.min(550, x)), Math.max(50, Math.min(350, y))];
  };

  const handleLocationClick = (location: typeof gujaratLocations[0]) => {
    // Generate sample data for the location
    const locationData = {
      name: location.name,
      coordinates: location.coordinates as [number, number],
      data: {
        tidalHeight: (Math.random() * 3 + 1).toFixed(1),
        windSpeed: (Math.random() * 50 + 20).toFixed(1),
        waterTemp: (27 + Math.random() * 4).toFixed(1),
        pressure: (1005 + Math.random() * 15).toFixed(1),
        cycloneRisk: (Math.random() * 100).toFixed(0),
        algaeBloom: (Math.random() * 5).toFixed(1)
      }
    };
    
    onLocationClick(locationData);
  };

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg overflow-hidden border">
      {/* Map Background - Gujarat coastline */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Gujarat Coastline */}
        <path
          d="M 80 200 Q 120 180 180 190 Q 240 185 300 195 Q 360 200 420 185 Q 480 175 540 180"
          stroke="hsl(var(--primary))"
          strokeWidth="4"
          fill="none"
          className="opacity-70"
        />
        <path
          d="M 80 220 Q 120 200 180 210 Q 240 205 300 215 Q 360 220 420 205 Q 480 195 540 200"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          fill="none"
          className="opacity-50"
        />
        
        {/* Arabian Sea label */}
        <text x="300" y="120" textAnchor="middle" className="fill-primary text-sm font-medium opacity-60">
          Arabian Sea
        </text>
        
        {/* State boundary indication */}
        <text x="450" y="300" textAnchor="middle" className="fill-primary text-xs opacity-40">
          Gujarat State
        </text>
      </svg>

      {/* Location Labels */}
      <div className="absolute top-4 left-4 text-sm font-medium text-primary">
        Gujarat Coastal Alert System
      </div>
      <div className="absolute top-4 right-4 text-xs text-muted-foreground">
        Real-time Monitoring Network
      </div>

      {/* Gujarat Locations */}
      {gujaratLocations.map((location) => {
        const [x, y] = coordToSVG(location.coordinates as [number, number]);
        const locationThreat = threats.find(t => 
          Math.abs(t.coordinates[0] - location.coordinates[0]) < 0.5 &&
          Math.abs(t.coordinates[1] - location.coordinates[1]) < 0.5
        );
        
        return (
          <div
            key={location.name}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110"
            style={{ left: x, top: y }}
            onClick={() => handleLocationClick(location)}
          >
            {/* Location Marker */}
            <div className="relative">
              {locationThreat && (
                <div
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{
                    backgroundColor: getThreatColor(locationThreat.level),
                    width: getThreatSize(locationThreat.severity),
                    height: getThreatSize(locationThreat.severity),
                    opacity: 0.4
                  }}
                />
              )}
              
              <div
                className={`relative rounded-full border-2 border-background flex items-center justify-center shadow-lg transition-all ${
                  locationThreat ? 'bg-opacity-90' : 'bg-primary/80 hover:bg-primary'
                }`}
                style={{
                  backgroundColor: locationThreat ? getThreatColor(locationThreat.level) : undefined,
                  width: locationThreat ? getThreatSize(locationThreat.severity) : 20,
                  height: locationThreat ? getThreatSize(locationThreat.severity) : 20
                }}
              >
                {locationThreat ? (
                  <AlertTriangle 
                    className="text-white" 
                    size={Math.max(8, (locationThreat ? getThreatSize(locationThreat.severity) : 20) * 0.5)} 
                  />
                ) : (
                  getLocationTypeIcon(location.type)
                )}
              </div>
              
              {/* Location Label */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-card/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium border shadow-sm whitespace-nowrap">
                {location.name}
              </div>
            </div>
          </div>
        );
      })}

      {/* Threat Markers for additional threats not tied to specific locations */}
      {threats.filter(threat => 
        !gujaratLocations.some(loc => 
          Math.abs(threat.coordinates[0] - loc.coordinates[0]) < 0.5 &&
          Math.abs(threat.coordinates[1] - loc.coordinates[1]) < 0.5
        )
      ).map((threat) => {
        const [x, y] = coordToSVG(threat.coordinates);
        const isSelected = selectedThreat === threat.id;

        return (
          <div
            key={threat.id}
            className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110"
            style={{ left: x, top: y }}
            onClick={() => setSelectedThreat(isSelected ? null : threat.id)}
          >
            {threat.level === 'critical' && (
              <div
                className="absolute inset-0 rounded-full animate-ping"
                style={{
                  backgroundColor: getThreatColor(threat.level),
                  width: getThreatSize(threat.severity),
                  height: getThreatSize(threat.severity),
                  opacity: 0.3
                }}
              />
            )}
            
            <div
              className="relative rounded-full border-2 border-background flex items-center justify-center shadow-lg"
              style={{
                backgroundColor: getThreatColor(threat.level),
                width: getThreatSize(threat.severity),
                height: getThreatSize(threat.severity)
              }}
            >
              <AlertTriangle 
                className="text-white" 
                size={Math.max(12, getThreatSize(threat.severity) * 0.5)} 
              />
            </div>

            {isSelected && (
              <Card className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-56 z-10 shadow-xl">
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
                      {threat.timestamp.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLocationClick({
                        name: threat.location,
                        coordinates: threat.coordinates as [number, number],
                        type: 'threat_location'
                      });
                    }}
                    className="w-full text-xs mt-2"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                </div>
              </Card>
            )}
          </div>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border shadow-lg">
        <h4 className="text-sm font-semibold mb-2">Alert Levels</h4>
        <div className="space-y-1">
          {[
            { level: 'safe', label: 'Safe', icon: <MapPin className="h-3 w-3" /> },
            { level: 'watch', label: 'Watch', icon: <Eye className="h-3 w-3" /> },
            { level: 'warning', label: 'Warning', icon: <AlertTriangle className="h-3 w-3" /> },
            { level: 'critical', label: 'Critical', icon: <Zap className="h-3 w-3" /> }
          ].map(({ level, label, icon }) => (
            <div key={level} className="flex items-center space-x-2 text-xs">
              <div
                className="w-3 h-3 rounded-full border border-background flex items-center justify-center"
                style={{ backgroundColor: getThreatColor(level) }}
              >
                <div className="text-white" style={{ fontSize: '8px' }}>
                  {icon}
                </div>
              </div>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
          Click locations for detailed metrics
        </div>
      </div>

      {/* Scale */}
      <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-2 border shadow-lg">
        <div className="text-xs text-muted-foreground mb-1">Scale</div>
        <div className="flex items-center space-x-1">
          <div className="w-8 h-0.5 bg-primary"></div>
          <span className="text-xs">50 km</span>
        </div>
      </div>
    </div>
  );
};

export default GujaratThreatMap;