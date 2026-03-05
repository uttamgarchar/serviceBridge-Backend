import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Tag,
  Settings,
  DollarSign,
  TrendingUp,
  UserPlus,
  ChevronRight,
  Wallet,
  BarChart3,
  ShieldCheck
} from 'lucide-react';

const adminNavItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Providers', href: '/admin/providers', icon: Briefcase },
  { label: 'Services', href: '/admin/services', icon: Tag },
  { label: 'Coupons', href: '/admin/coupons', icon: Tag },
  { label: 'Withdrawals', href: '/admin/withdrawals', icon: Wallet },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

const recentActivity = [
  { id: '1', action: 'New provider registered', user: 'John Smith', time: '5m ago', type: 'provider' },
  { id: '2', action: 'Withdrawal approved', user: '$500 to Mike L.', time: '15m ago', type: 'withdrawal' },
  { id: '3', action: 'New user signup', user: 'alice@example.com', time: '30m ago', type: 'user' },
  { id: '4', action: 'Coupon created', user: 'SAVE20', time: '1h ago', type: 'coupon' },
  { id: '5', action: 'Service category added', user: 'Pet Care', time: '2h ago', type: 'service' },
];

const AdminDashboard: React.FC = () => {
  const stats = {
    totalRevenue: 125430,
    totalUsers: 8542,
    totalProviders: 423,
    totalBookings: 15678,
    pendingWithdrawals: 12,
    revenueGrowth: 23.5,
    userGrowth: 12.3,
  };

  return (
    <DashboardLayout navItems={adminNavItems} title="Admin Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-primary text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80">Total Revenue</p>
                  <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-white/50" />
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>+{stats.revenueGrowth}% this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-info" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-success text-sm">
                <UserPlus className="h-4 w-4" />
                <span>+{stats.userGrowth}% growth</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Providers</p>
                  <p className="text-2xl font-bold">{stats.totalProviders}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-secondary" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">89% verified</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold">{stats.totalBookings.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-success" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">94% completion rate</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/admin/users/new">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New Admin
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/admin/services/categories">
                  <Tag className="h-4 w-4 mr-2" />
                  Manage Categories
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/admin/coupons/new">
                  <Tag className="h-4 w-4 mr-2" />
                  Create Coupon
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/admin/withdrawals">
                  <Wallet className="h-4 w-4 mr-2" />
                  Pending Withdrawals
                  <Badge className="ml-auto" variant="secondary">{stats.pendingWithdrawals}</Badge>
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/admin/settings/commission">
                  <Settings className="h-4 w-4 mr-2" />
                  Commission Settings
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <Link to="/admin/activity" className="text-sm text-primary hover:underline flex items-center gap-1">
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'provider' ? 'bg-secondary' :
                        activity.type === 'withdrawal' ? 'bg-success' :
                        activity.type === 'user' ? 'bg-info' :
                        activity.type === 'coupon' ? 'bg-warning' :
                        'bg-primary'
                      }`} />
                      <div>
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.user}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-xl font-bold">$2,450</p>
                <p className="text-xs text-success">+15% vs yesterday</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-xl font-bold">$18,320</p>
                <p className="text-xs text-success">+8% vs last week</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-xl font-bold">$67,890</p>
                <p className="text-xs text-success">+23% vs last month</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Platform Commission</p>
                <p className="text-xl font-bold">$6,789</p>
                <p className="text-xs text-muted-foreground">10% of revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
