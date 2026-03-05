import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  FileText, 
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  Eye,
  User
} from 'lucide-react';

const verificationNavItems = [
  { label: 'Dashboard', href: '/verification', icon: LayoutDashboard },
  { label: 'Applications', href: '/verification/applications', icon: ClipboardCheck },
  { label: 'Documents', href: '/verification/documents', icon: FileText },
  { label: 'Analytics', href: '/verification/analytics', icon: BarChart3 },
];

const pendingApplications = [
  { 
    id: '1', 
    name: 'Michael Brown', 
    category: 'Plumbing',
    documents: 3,
    submittedAt: '2 hours ago',
    completeness: 100
  },
  { 
    id: '2', 
    name: 'Emily White', 
    category: 'Cleaning',
    documents: 2,
    submittedAt: '5 hours ago',
    completeness: 67
  },
  { 
    id: '3', 
    name: 'David Lee', 
    category: 'Electrical',
    documents: 3,
    submittedAt: '1 day ago',
    completeness: 100
  },
];

const VerificationDashboard: React.FC = () => {
  const stats = {
    pending: 15,
    approvedToday: 8,
    rejectedToday: 2,
    avgProcessingTime: '4.5h',
  };

  return (
    <DashboardLayout navItems={verificationNavItems} title="Verification Manager">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Applications waiting</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved Today</p>
                  <p className="text-2xl font-bold">{stats.approvedToday}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
              </div>
              <p className="text-sm text-success mt-2">+3 from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rejected Today</p>
                  <p className="text-2xl font-bold">{stats.rejectedToday}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-destructive" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Documents incomplete</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Processing</p>
                  <p className="text-2xl font-bold">{stats.avgProcessingTime}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-info" />
                </div>
              </div>
              <p className="text-sm text-success mt-2">15% faster than target</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Pending Applications</CardTitle>
            <Link to="/verification/applications" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {app.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{app.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {app.category} • {app.documents} documents
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-muted-foreground">Completeness</p>
                      <div className="flex items-center gap-2">
                        <Progress value={app.completeness} className="w-20 h-2" />
                        <span className="text-xs font-medium">{app.completeness}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{app.submittedAt}</p>
                      <Button size="sm" variant="outline" className="mt-1 h-7 text-xs" asChild>
                        <Link to={`/verification/applications/${app.id}`}>
                          <Eye className="h-3 w-3 mr-1" />
                          Review
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">This Week's Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Processed</span>
                  <span className="font-semibold">45</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Approval Rate</span>
                  <span className="font-semibold text-success">82%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Average Review Time</span>
                  <span className="font-semibold">3.2h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Pending Documents</span>
                  <span className="font-semibold">23</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Applications by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { category: 'Plumbing', count: 8, percentage: 35 },
                  { category: 'Cleaning', count: 5, percentage: 22 },
                  { category: 'Electrical', count: 4, percentage: 17 },
                  { category: 'Home Repair', count: 3, percentage: 13 },
                  { category: 'Others', count: 3, percentage: 13 },
                ].map((item) => (
                  <div key={item.category}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{item.category}</span>
                      <span className="text-sm text-muted-foreground">{item.count}</span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VerificationDashboard;
