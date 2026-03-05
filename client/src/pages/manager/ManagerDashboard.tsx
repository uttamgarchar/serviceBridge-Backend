import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  AlertTriangle, 
  MessageSquare,
  Star,
  TrendingUp,
  TrendingDown,
  UserX,
  UserCheck,
  ChevronRight,
  Flag
} from 'lucide-react';

const managerNavItems = [
  { label: 'Dashboard', href: '/manager', icon: LayoutDashboard },
  { label: 'Providers', href: '/manager/providers', icon: Users },
  { label: 'Reviews', href: '/manager/reviews', icon: Star },
  { label: 'Complaints', href: '/manager/complaints', icon: AlertTriangle },
  { label: 'Reports', href: '/manager/reports', icon: Flag },
];

const recentComplaints = [
  { id: '1', reporter: 'John D.', subject: 'Service not completed', provider: 'Mike S.', status: 'pending', time: '2h ago' },
  { id: '2', reporter: 'Sarah K.', subject: 'Provider no-show', provider: 'Tom W.', status: 'investigating', time: '5h ago' },
  { id: '3', reporter: 'Alice M.', subject: 'Quality issue', provider: 'James L.', status: 'resolved', time: '1d ago' },
];

const suspiciousReviews = [
  { id: '1', customer: 'New User 1', rating: 5, provider: 'Quick Fix Pro', flagReason: 'New account, 5 star', time: '3h ago' },
  { id: '2', customer: 'John123', rating: 1, provider: 'Elite Plumbing', flagReason: 'Repeated 1-star pattern', time: '6h ago' },
];

const ManagerDashboard: React.FC = () => {
  return (
    <DashboardLayout navItems={managerNavItems} title="Provider Manager">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Providers</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-success" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-success text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>+8 this week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Suspended</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <UserX className="h-6 w-6 text-destructive" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">3 pending review</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Open Complaints</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-warning" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-destructive text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>+5 today</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Flagged Reviews</p>
                  <p className="text-2xl font-bold">18</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                  <Flag className="h-6 w-6 text-info" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Needs verification</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Complaints */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Complaints</CardTitle>
              <Link to="/manager/complaints" className="text-sm text-primary hover:underline flex items-center gap-1">
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentComplaints.map((complaint) => (
                  <div key={complaint.id} className="flex items-start justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {complaint.reporter.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{complaint.subject}</p>
                        <p className="text-xs text-muted-foreground">
                          By {complaint.reporter} • Against {complaint.provider}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant="secondary"
                        className={
                          complaint.status === 'pending' ? 'bg-warning/10 text-warning' :
                          complaint.status === 'investigating' ? 'bg-info/10 text-info' :
                          'bg-success/10 text-success'
                        }
                      >
                        {complaint.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{complaint.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Suspicious Reviews */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Suspicious Reviews</CardTitle>
              <Link to="/manager/reviews" className="text-sm text-primary hover:underline flex items-center gap-1">
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suspiciousReviews.map((review) => (
                  <div key={review.id} className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{review.customer}</span>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{review.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      For: {review.provider}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      <Flag className="h-3 w-3 mr-1" />
                      {review.flagReason}
                    </Badge>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="text-xs h-7">
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs h-7 text-destructive">
                        Remove
                      </Button>
                    </div>
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

export default ManagerDashboard;
