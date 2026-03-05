import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Calendar, 
  MessageSquare, 
  Wallet,
  Star,
  User,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  ChevronRight
} from 'lucide-react';

const providerNavItems = [
  { label: 'Dashboard', href: '/provider', icon: LayoutDashboard },
  { label: 'Services', href: '/provider/services', icon: Briefcase },
  { label: 'Bookings', href: '/provider/bookings', icon: Calendar },
  { label: 'Messages', href: '/provider/messages', icon: MessageSquare },
  { label: 'Wallet', href: '/provider/wallet', icon: Wallet },
  { label: 'Profile', href: '/provider/profile', icon: User },
];

const recentBookings = [
  { id: '1', customer: 'Alice Johnson', service: 'Plumbing Repair', time: '10:00 AM', status: 'pending' },
  { id: '2', customer: 'Bob Smith', service: 'Pipe Installation', time: '2:00 PM', status: 'accepted' },
  { id: '3', customer: 'Carol Davis', service: 'Leak Fix', time: '4:30 PM', status: 'completed' },
];

const ProviderDashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = {
    totalEarnings: 2450,
    pendingBookings: 5,
    completedThisMonth: 23,
    rating: 4.8,
    responseRate: 95,
  };

  return (
    <DashboardLayout navItems={providerNavItems} title="Provider Dashboard">
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl bg-gradient-teal text-white">
          <div>
            <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.name?.split(' ')[0]}!</h1>
            <p className="text-white/80">You have {stats.pendingBookings} pending booking requests</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="bg-white text-secondary hover:bg-white/90" asChild>
              <Link to="/provider/services/new">Add Service</Link>
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link to="/provider/bookings">View Bookings</Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold">${stats.totalEarnings}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-success" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-success text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>+12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Bookings</p>
                  <p className="text-2xl font-bold">{stats.pendingBookings}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Needs your response</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{stats.completedThisMonth}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <p className="text-2xl font-bold flex items-center gap-1">
                    {stats.rating}
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                  <Star className="h-6 w-6 text-yellow-500" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Based on 89 reviews</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Bookings */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Bookings</CardTitle>
              <Link to="/provider/bookings" className="text-sm text-primary hover:underline flex items-center gap-1">
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{booking.customer}</p>
                        <p className="text-sm text-muted-foreground">{booking.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{booking.time}</p>
                      <Badge 
                        variant={booking.status === 'completed' ? 'default' : 'secondary'}
                        className={
                          booking.status === 'pending' ? 'bg-warning/10 text-warning' :
                          booking.status === 'accepted' ? 'bg-info/10 text-info' :
                          'bg-success/10 text-success'
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Response Rate</span>
                  <span className="text-sm font-medium">{stats.responseRate}%</span>
                </div>
                <Progress value={stats.responseRate} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Acceptance Rate</span>
                  <span className="text-sm font-medium">88%</span>
                </div>
                <Progress value={88} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Completion Rate</span>
                  <span className="text-sm font-medium">96%</span>
                </div>
                <Progress value={96} className="h-2" />
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Quick Actions</p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/provider/availability">
                      <Clock className="h-4 w-4 mr-2" />
                      Set Availability
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/provider/wallet/withdraw">
                      <Wallet className="h-4 w-4 mr-2" />
                      Request Withdrawal
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProviderDashboard;
