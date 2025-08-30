import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  Download, 
  Clock, 
  User, 
  CheckCircle,
  AlertTriangle,
  FileText,
  Search,
  Filter
} from 'lucide-react';

interface OperationalLog {
  id: string;
  timestamp: Date;
  action: string;
  description: string;
  officer: string;
  status: 'completed' | 'pending' | 'failed';
  priority: 'high' | 'medium' | 'low';
  location: string;
  coordinates?: [number, number];
}

interface OperationalLoggerProps {
  executedActions: string[];
}

const OperationalLogger = ({ executedActions }: OperationalLoggerProps) => {
  const [logs, setLogs] = useState<OperationalLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<OperationalLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    // Add new logs when actions are executed
    const newLogs = executedActions.map((actionId, index) => ({
      id: `log-${actionId}-${Date.now()}`,
      timestamp: new Date(Date.now() - index * 1000),
      action: getActionName(actionId),
      description: getActionDescription(actionId),
      officer: getCurrentOfficer(),
      status: 'completed' as const,
      priority: getActionPriority(actionId) as 'high' | 'medium' | 'low',
      location: 'Veraval Emergency Operations Center',
      coordinates: [70.3667, 20.9] as [number, number]
    }));

    // Add sample historical logs
    const historicalLogs: OperationalLog[] = [
      {
        id: 'log-1',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        action: 'Weather Monitoring Alert',
        description: 'Received high wind speed alert from IMD Gujarat. Initiated enhanced monitoring protocol.',
        officer: 'S.K. Patel - Meteorological Officer',
        status: 'completed',
        priority: 'medium',
        location: 'IMD Ahmedabad',
        coordinates: [72.5714, 23.0225]
      },
      {
        id: 'log-2',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        action: 'Fishermen Advisory Issued',
        description: 'Issued advisory to fishing vessels to return to harbor due to rough sea conditions.',
        officer: 'R.M. Jadeja - Harbor Master',
        status: 'completed',
        priority: 'high',
        location: 'Veraval Port Authority',
        coordinates: [70.3667, 20.9]
      },
      {
        id: 'log-3',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        action: 'Equipment Check',
        description: 'Routine check of emergency communication equipment and backup power systems.',
        officer: 'A.B. Shah - Technical Officer',
        status: 'completed',
        priority: 'low',
        location: 'Emergency Control Room',
        coordinates: [70.3667, 20.9]
      }
    ];

    setLogs([...newLogs, ...historicalLogs]);
  }, [executedActions]);

  useEffect(() => {
    // Filter logs based on search and filter criteria
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.officer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedFilter !== 'all') {
      if (selectedFilter === 'today') {
        const today = new Date().toDateString();
        filtered = filtered.filter(log => log.timestamp.toDateString() === today);
      } else {
        filtered = filtered.filter(log => log.priority === selectedFilter);
      }
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    setFilteredLogs(filtered);
  }, [logs, searchTerm, selectedFilter]);

  const getActionName = (actionId: string): string => {
    const actionNames: { [key: string]: string } = {
      'emergency-1': 'Emergency Operations Center Activated',
      'emergency-2': 'Red Alert & Evacuation Orders Issued',
      'emergency-3': 'Search & Rescue Teams Deployed',
      'emergency-4': 'Emergency Shelters Opened',
      'emergency-5': 'Critical Infrastructure Secured',
      'warning-1': 'Orange Alert Issued',
      'warning-2': 'Evacuation Routes Prepared',
      'warning-3': 'Vulnerable Communities Alerted',
      'watch-1': 'Enhanced Monitoring Activated',
      'watch-2': 'Emergency Teams on Standby'
    };
    return actionNames[actionId] || 'Action Executed';
  };

  const getActionDescription = (actionId: string): string => {
    const descriptions: { [key: string]: string } = {
      'emergency-1': 'District Emergency Operations Center activated. All emergency response teams deployed.',
      'emergency-2': 'Emergency evacuation orders broadcasted for Veraval and Porbandar coastal areas.',
      'emergency-3': 'NDRF, Coast Guard, and local rescue teams positioned at strategic locations.',
      'emergency-4': 'All cyclone shelters, schools, and community centers activated with supplies.',
      'emergency-5': 'Power shut down in flood-prone areas. Ports, airports secured. Hospital generators operational.',
      'warning-1': 'Warning alerts sent to all coastal residents. Advisory to stay indoors issued.',
      'warning-2': 'All evacuation routes cleared. Traffic control personnel positioned.',
      'warning-3': 'Fishing communities and coastal villages contacted. Transportation arranged.',
      'watch-1': 'Weather monitoring enhanced. IMD coordination established.',
      'watch-2': 'All emergency response teams put on standby. Equipment checked.'
    };
    return descriptions[actionId] || 'Emergency action executed as per protocol.';
  };

  const getCurrentOfficer = (): string => {
    return 'D.K. Mehta - District Emergency Officer';
  };

  const getActionPriority = (actionId: string): string => {
    if (actionId.startsWith('emergency')) return 'high';
    if (actionId.startsWith('warning')) return 'medium';
    return 'low';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-safe text-safe-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'failed': return 'bg-critical text-critical-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-critical text-critical-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-safe text-safe-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'failed': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const exportToCSV = () => {
    const headers = ['Timestamp', 'Action', 'Description', 'Officer', 'Status', 'Priority', 'Location'];
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map(log => [
        log.timestamp.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        `"${log.action}"`,
        `"${log.description}"`,
        `"${log.officer}"`,
        log.status,
        log.priority,
        `"${log.location}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `operational_logs_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>Operational Logs</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {filteredLogs.length} Records
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
              className="text-xs"
            >
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filter */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search actions, descriptions, officers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm bg-background"
            >
              <option value="all">All Logs</option>
              <option value="today">Today</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Logs List */}
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm">No operational logs found</p>
                <p className="text-xs mt-1">Actions will be logged here automatically</p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="border rounded-lg p-4 bg-card hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getStatusIcon(log.status)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{log.action}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {log.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getPriorityColor(log.priority)} text-xs`}>
                        {log.priority.toUpperCase()}
                      </Badge>
                      <Badge className={`${getStatusColor(log.status)} text-xs`}>
                        {log.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{log.timestamp.toLocaleString('en-IN', { 
                          timeZone: 'Asia/Kolkata',
                          dateStyle: 'short',
                          timeStyle: 'short'
                        })} IST</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{log.officer}</span>
                      </div>
                    </div>
                    <div className="text-xs">
                      {log.location}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Auto-logging enabled • Real-time updates</span>
            <span>Gujarat Emergency Management System</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OperationalLogger;