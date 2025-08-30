import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Brain,
  Users,
  Megaphone,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Target,
  Zap,
  Shield,
  Building,
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

interface ActionStep {
  id: string;
  step: number;
  action: string;
  description: string;
  timeframe: string;
  responsible: string;
  resources: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
  icon: React.ReactNode;
  status: 'pending' | 'in-progress' | 'completed';
}

interface VirtualDecisionAssistantProps {
  currentLevel: ThreatLevel;
  threats: ThreatData[];
  onActionExecute: (actionId: string) => void;
}

const VirtualDecisionAssistant = ({ currentLevel, threats, onActionExecute }: VirtualDecisionAssistantProps) => {
  const [executedActions, setExecutedActions] = useState<Set<string>>(new Set());

  const getActionPlan = (): ActionStep[] => {
    const criticalThreats = threats.filter((t) => t.level === 'critical').length;
    const warningThreats = threats.filter((t) => t.level === 'warning').length;

    if (currentLevel === 'critical' || criticalThreats > 0) {
      return [
        {
          id: 'emergency-1',
          step: 1,
          action: 'Activate Emergency Operations Center',
          description:
            'Immediately activate the District Emergency Operations Center. Deploy all emergency response teams.',
          timeframe: 'Immediate (0-2 minutes)',
          responsible: 'District Collector',
          resources: ['Emergency Control Room', 'Communication Systems', 'Response Teams'],
          priority: 'critical',
          icon: <Building className="h-4 w-4" />,
          status: 'pending',
        },
        {
          id: 'emergency-2',
          step: 2,
          action: 'Issue Red Alert & Evacuation Orders',
          description:
            'Broadcast emergency evacuation orders for Veraval, Porbandar coastal areas. Use all communication channels.',
          timeframe: 'Within 5 minutes',
          responsible: 'Emergency Coordinator',
          resources: ['All India Radio', 'Mobile Alert System', 'Public Address', 'TV Channels'],
          priority: 'critical',
          icon: <Megaphone className="h-4 w-4" />,
          status: 'pending',
        },
        {
          id: 'emergency-3',
          step: 3,
          action: 'Deploy Search & Rescue Teams',
          description:
            'Position NDRF, Coast Guard, and local rescue teams at strategic locations. Ensure helicopter support.',
          timeframe: 'Within 15 minutes',
          responsible: 'NDRF Commandant',
          resources: ['NDRF Teams', 'Coast Guard', 'Helicopters', 'Rescue Boats'],
          priority: 'critical',
          icon: <Users className="h-4 w-4" />,
          status: 'pending',
        },
        {
          id: 'emergency-4',
          step: 4,
          action: 'Open Emergency Shelters',
          description:
            'Activate all cyclone shelters, schools, and community centers. Ensure food, water, and medical supplies.',
          timeframe: 'Within 20 minutes',
          responsible: 'Relief Commissioner',
          resources: ['Cyclone Shelters', 'Schools', 'Food Supplies', 'Medical Kits'],
          priority: 'high',
          icon: <Shield className="h-4 w-4" />,
          status: 'pending',
        },
        {
          id: 'emergency-5',
          step: 5,
          action: 'Secure Critical Infrastructure',
          description:
            'Shut down power in flood-prone areas. Secure ports, airports. Ensure hospital generators operational.',
          timeframe: 'Within 30 minutes',
          responsible: 'Infrastructure Team',
          resources: ['Power Grid', 'Port Authority', 'Airport', 'Hospital Systems'],
          priority: 'high',
          icon: <Zap className="h-4 w-4" />,
          status: 'pending',
        },
      ];
    } else if (currentLevel === 'warning' || warningThreats > 0) {
      return [
        {
          id: 'warning-1',
          step: 1,
          action: 'Issue Orange Alert',
          description:
            'Send warning alerts to all residents in coastal areas. Advise to stay indoors and avoid sea-facing areas.',
          timeframe: 'Within 10 minutes',
          responsible: 'Information Officer',
          resources: ['Emergency Broadcasting', 'Social Media', 'Local Announcements'],
          priority: 'high',
          icon: <AlertTriangle className="h-4 w-4" />,
          status: 'pending',
        },
        {
          id: 'warning-2',
          step: 2,
          action: 'Prepare Evacuation Routes',
          description: 'Clear all evacuation routes. Position traffic control personnel. Ensure emergency vehicle access.',
          timeframe: 'Within 30 minutes',
          responsible: 'Traffic Police',
          resources: ['Traffic Personnel', 'Road Clearing Equipment', 'Emergency Vehicles'],
          priority: 'high',
          icon: <MapPin className="h-4 w-4" />,
          status: 'pending',
        },
        {
          id: 'warning-3',
          step: 3,
          action: 'Alert Vulnerable Communities',
          description:
            'Contact fishing communities, coastal villages, and vulnerable populations. Arrange transportation if needed.',
          timeframe: 'Within 1 hour',
          responsible: 'Community Liaisons',
          resources: ['Community Leaders', 'Transportation', 'Communication Teams'],
          priority: 'medium',
          icon: <Users className="h-4 w-4" />,
          status: 'pending',
        },
      ];
    } else if (currentLevel === 'watch') {
      return [
        {
          id: 'watch-1',
          step: 1,
          action: 'Increase Monitoring',
          description: 'Enhance weather monitoring. Contact IMD for latest updates. Brief all emergency teams.',
          timeframe: 'Continuous',
          responsible: 'Weather Officer',
          resources: ['Weather Stations', 'IMD Coordination', 'Monitoring Equipment'],
          priority: 'medium',
          icon: <Clock className="h-4 w-4" />,
          status: 'pending',
        },
        {
          id: 'watch-2',
          step: 2,
          action: 'Standby Emergency Teams',
          description: 'Put all emergency response teams on standby. Check equipment and resources availability.',
          timeframe: 'Within 2 hours',
          responsible: 'Emergency Coordinator',
          resources: ['Response Teams', 'Equipment Check', 'Resource Inventory'],
          priority: 'medium',
          icon: <Shield className="h-4 w-4" />,
          status: 'pending',
        },
      ];
    }

    return [
      {
        id: 'normal-1',
        step: 1,
        action: 'Routine Monitoring',
        description: 'Continue standard coastal and weather monitoring protocols.',
        timeframe: 'Ongoing',
        responsible: 'Monitoring Team',
        resources: ['Standard Equipment', 'Regular Staff'],
        priority: 'low',
        icon: <CheckCircle className="h-4 w-4" />,
        status: 'pending',
      },
    ];
  };

  const actionPlan = getActionPlan();

  const executeAction = (actionId: string) => {
    setExecutedActions((prev) => new Set([...prev, actionId]));
    onActionExecute(actionId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-critical text-critical-foreground';
      case 'high':
        return 'bg-warning text-warning-foreground';
      case 'medium':
        return 'bg-watch text-watch-foreground';
      case 'low':
        return 'bg-safe text-safe-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getAlgorithmRecommendation = () => {
    const totalThreats = threats.length;
    const criticalCount = threats.filter((t) => t.level === 'critical').length;
    const avgSeverity = threats.reduce((sum, t) => sum + t.severity, 0) / totalThreats || 0;

    let recommendation = 'MAINTAIN STANDARD OPERATIONS';
    let confidence = 95;

    if (criticalCount > 0 || avgSeverity > 8) {
      recommendation = 'IMMEDIATE EMERGENCY RESPONSE REQUIRED';
      confidence = 98;
    } else if (currentLevel === 'warning' || avgSeverity > 6) {
      recommendation = 'ACTIVATE PREPAREDNESS MEASURES';
      confidence = 92;
    } else if (currentLevel === 'watch' || avgSeverity > 4) {
      recommendation = 'ENHANCED MONITORING RECOMMENDED';
      confidence = 88;
    }

    return { recommendation, confidence };
  };

  const { recommendation, confidence } = getAlgorithmRecommendation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-primary" />
          <span>AI Decision Assistant</span>
          <Badge
            className={`ml-2 text-xs ${
              currentLevel === 'critical'
                ? 'bg-critical text-critical-foreground'
                : currentLevel === 'warning'
                ? 'bg-warning text-warning-foreground'
                : currentLevel === 'watch'
                ? 'bg-watch text-watch-foreground'
                : 'bg-safe text-safe-foreground'
            }`}
          >
            {currentLevel.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Algorithm Recommendation */}
        <div className="p-4 border rounded-lg bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm flex items-center space-x-2">
              <Target className="h-4 w-4 text-primary" />
              <span>AI Recommendation</span>
            </h4>
            <Badge variant="outline" className="text-xs">
              {confidence}% Confidence
            </Badge>
          </div>
          <p className="text-sm font-medium text-primary mb-2">{recommendation}</p>
          <p className="text-xs text-muted-foreground">
            Analysis based on {threats.length} active threats, severity patterns, and historical data.
          </p>
        </div>

        {/* Action Plan */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Recommended Action Plan</h4>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs">
                  <Brain className="h-3 w-3 mr-1" />
                  Full Guide
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <span>Virtual Decision Assistant - Complete Action Guide</span>
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[60vh] pr-4">
                  <div className="space-y-4">
                    {actionPlan.map((action) => {
                      const isExecuted = executedActions.has(action.id);

                      return (
                        <div
                          key={action.id}
                          className={`border rounded-lg p-4 transition-all ${
                            isExecuted ? 'bg-safe/10 border-safe' : 'bg-card border-border'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                                  isExecuted
                                    ? 'bg-safe text-safe-foreground'
                                    : 'bg-primary text-primary-foreground'
                                }`}
                              >
                                {isExecuted ? <CheckCircle className="h-4 w-4" /> : action.step}
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm flex items-center space-x-2">
                                  {action.icon}
                                  <span>{action.action}</span>
                                </h4>
                                <p className="text-xs text-muted-foreground">{action.timeframe}</p>
                              </div>
                            </div>
                            <Badge className={`${getPriorityColor(action.priority)} text-xs`}>
                              {action.priority.toUpperCase()}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3 ml-11">{action.description}</p>

                          <div className="ml-11 space-y-2">
                            <div className="flex items-center space-x-4 text-xs">
                              <div className="flex items-center space-x-1">
                                <Users className="h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground">Responsible: {action.responsible}</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {action.resources.map((resource, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {resource}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex justify-end pt-2">
                              {!isExecuted ? (
                                <Button size="sm" onClick={() => executeAction(action.id)} className="text-xs">
                                  Execute Action
                                  <ArrowRight className="h-3 w-3 ml-1" />
                                </Button>
                              ) : (
                                <Button size="sm" variant="outline" disabled className="text-xs">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Executed
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>

          {/* Quick Actions Preview */}
          <div className="space-y-2">
            {actionPlan.slice(0, 3).map((action) => {
              const isExecuted = executedActions.has(action.id);

              return (
                <div
                  key={action.id}
                  className={`flex items-center justify-between p-3 border rounded-lg transition-all ${
                    isExecuted ? 'bg-safe/10 border-safe' : 'bg-card border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                        isExecuted ? 'bg-safe text-safe-foreground' : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      {isExecuted ? <CheckCircle className="h-3 w-3" /> : action.step}
                    </div>
                    <div>
                      <h5 className="text-sm font-medium">{action.action}</h5>
                      <p className="text-xs text-muted-foreground">{action.timeframe}</p>
                    </div>
                  </div>
                  {!isExecuted ? (
                    <Button size="sm" onClick={() => executeAction(action.id)} className="text-xs">
                      Execute
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  ) : (
                    <Badge className="bg-safe text-safe-foreground text-xs flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3" />
                      <span>Done</span>
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VirtualDecisionAssistant;
