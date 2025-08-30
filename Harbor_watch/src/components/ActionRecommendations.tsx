import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, 
  Users, 
  Megaphone, 
  MapPin, 
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

type ThreatLevel = 'safe' | 'watch' | 'warning' | 'critical';

interface ThreatData {
  id: string;
  location: string;
  level: ThreatLevel;
  type: string;
  timestamp: Date;
  severity: number;
  coordinates: [number, number];
}

interface ActionRecommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  action: string;
  description: string;
  timeframe: string;
  icon: React.ReactNode;
  responsible: string;
}

interface ActionRecommendationsProps {
  currentLevel: ThreatLevel;
  threats: ThreatData[];
}

const ActionRecommendations = ({ currentLevel, threats }: ActionRecommendationsProps) => {
  const getRecommendations = (): ActionRecommendation[] => {
    const criticalThreats = threats.filter(t => t.level === 'critical').length;
    const warningThreats = threats.filter(t => t.level === 'warning').length;
    
    const baseRecommendations: ActionRecommendation[] = [];

    if (currentLevel === 'critical' || criticalThreats > 0) {
      baseRecommendations.push(
        {
          id: '1',
          priority: 'high',
          action: 'Initiate Emergency Evacuation',
          description: 'Begin immediate evacuation of high-risk coastal areas. Deploy emergency response teams.',
          timeframe: 'Immediate',
          icon: <Users className="h-4 w-4" />,
          responsible: 'Emergency Coordinator'
        },
        {
          id: '2',
          priority: 'high',
          action: 'Issue Emergency Broadcast',
          description: 'Send critical alert to all residents via emergency broadcast system and mobile alerts.',
          timeframe: 'Within 5 minutes',
          icon: <Megaphone className="h-4 w-4" />,
          responsible: 'Communications Team'
        },
        {
          id: '3',
          priority: 'high',
          action: 'Deploy Emergency Response',
          description: 'Mobilize search and rescue teams, medical personnel, and emergency shelters.',
          timeframe: 'Within 15 minutes',
          icon: <AlertTriangle className="h-4 w-4" />,
          responsible: 'Response Teams'
        }
      );
    } else if (currentLevel === 'warning' || warningThreats > 0) {
      baseRecommendations.push(
        {
          id: '4',
          priority: 'high',
          action: 'Prepare Evacuation Routes',
          description: 'Clear and secure evacuation routes. Position emergency vehicles at key locations.',
          timeframe: 'Within 30 minutes',
          icon: <MapPin className="h-4 w-4" />,
          responsible: 'Traffic Management'
        },
        {
          id: '5',
          priority: 'medium',
          action: 'Alert Vulnerable Populations',
          description: 'Contact hospitals, schools, and elderly care facilities in affected areas.',
          timeframe: 'Within 1 hour',
          icon: <Users className="h-4 w-4" />,
          responsible: 'Social Services'
        },
        {
          id: '6',
          priority: 'medium',
          action: 'Issue Public Advisory',
          description: 'Send warning message to residents. Advise preparation for possible evacuation.',
          timeframe: 'Within 15 minutes',
          icon: <Megaphone className="h-4 w-4" />,
          responsible: 'Public Information'
        }
      );
    } else if (currentLevel === 'watch') {
      baseRecommendations.push(
        {
          id: '7',
          priority: 'medium',
          action: 'Monitor Conditions',
          description: 'Increase monitoring frequency. Prepare emergency response systems for activation.',
          timeframe: 'Ongoing',
          icon: <Clock className="h-4 w-4" />,
          responsible: 'Monitoring Team'
        },
        {
          id: '8',
          priority: 'low',
          action: 'Inform Key Personnel',
          description: 'Notify emergency response leaders and key stakeholders of developing situation.',
          timeframe: 'Within 2 hours',
          icon: <Users className="h-4 w-4" />,
          responsible: 'Command Center'
        }
      );
    } else {
      baseRecommendations.push(
        {
          id: '9',
          priority: 'low',
          action: 'Routine Monitoring',
          description: 'Continue standard monitoring protocols. All systems operating normally.',
          timeframe: 'Ongoing',
          icon: <CheckCircle className="h-4 w-4" />,
          responsible: 'Monitoring Team'
        }
      );
    }

    return baseRecommendations;
  };

  const recommendations = getRecommendations();

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-critical text-critical-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-safe text-safe-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-3 w-3" />;
      case 'medium': return <Clock className="h-3 w-3" />;
      case 'low': return <CheckCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-primary" />
          <span>Action Recommendations</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <div className="space-y-3 p-4">
            {recommendations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm">No specific actions required</p>
                <p className="text-xs mt-1">Continue routine operations</p>
              </div>
            ) : (
              recommendations.map((recommendation) => (
                <div
                  key={recommendation.id}
                  className="border rounded-lg p-4 hover:border-primary/50 transition-colors bg-card"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="text-primary">{recommendation.icon}</div>
                      <h4 className="font-semibold text-sm">{recommendation.action}</h4>
                    </div>
                    <Badge className={`${getPriorityBadge(recommendation.priority)} text-xs flex items-center space-x-1`}>
                      {getPriorityIcon(recommendation.priority)}
                      <span>{recommendation.priority.toUpperCase()}</span>
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {recommendation.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{recommendation.timeframe}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{recommendation.responsible}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t flex justify-end">
                    <Button size="sm" variant="outline" className="text-xs">
                      Execute Action
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActionRecommendations;