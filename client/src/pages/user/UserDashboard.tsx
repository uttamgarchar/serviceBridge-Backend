import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Calendar, 
  MessageSquare, 
  Star, 
  User,
  ChevronRight,
  MapPin,
  Wrench,
  Zap,
  Droplet,
  Car,
  Brush,
  Home as HomeIcon,
  Scissors,
  Monitor
} from 'lucide-react';

const userNavItems = [
  { label: 'Home', href: '/user', icon: Home },
  { label: 'Services', href: '/user/services', icon: Search },
  { label: 'My Bookings', href: '/user/bookings', icon: Calendar },
  { label: 'Messages', href: '/user/messages', icon: MessageSquare },
  { label: 'Profile', href: '/user/profile', icon: User },
];

const categories = [
  { id: '1', name: 'Plumbing', icon: Droplet, color: 'bg-blue-500' },
  { id: '2', name: 'Electrical', icon: Zap, color: 'bg-yellow-500' },
  { id: '3', name: 'Cleaning', icon: Brush, color: 'bg-green-500' },
  { id: '4', name: 'Home Repair', icon: Wrench, color: 'bg-orange-500' },
  { id: '5', name: 'Automotive', icon: Car, color: 'bg-red-500' },
  { id: '6', name: 'Beauty', icon: Scissors, color: 'bg-pink-500' },
  { id: '7', name: 'IT Support', icon: Monitor, color: 'bg-purple-500' },
  { id: '8', name: 'Moving', icon: HomeIcon, color: 'bg-teal-500' },
];

const featuredServices = [
  {
    id: '1',
    title: 'Professional Plumbing Service',
    category: 'Plumbing',
    price: 50,
    rating: 4.8,
    reviewCount: 124,
    providerName: 'John Smith',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
  },
  {
    id: '2',
    title: 'Home Deep Cleaning',
    category: 'Cleaning',
    price: 80,
    rating: 4.9,
    reviewCount: 89,
    providerName: 'Clean Pro',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
  },
  {
    id: '3',
    title: 'Electrical Installation',
    category: 'Electrical',
    price: 65,
    rating: 4.7,
    reviewCount: 67,
    providerName: 'ElectriPro',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400',
  },
];

const UserDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout navItems={userNavItems} title="Customer Dashboard">
      <div className="space-y-8">
        {/* Welcome Section */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-primary p-6 md:p-8 text-white">
          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Hello, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-white/80 mb-6 max-w-md">
              Find trusted professionals for all your service needs
            </p>
            
            {/* Search Bar */}
            <div className="flex gap-2 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="What service do you need?" 
                  className="pl-10 bg-white text-foreground h-12"
                />
              </div>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 h-12 px-6">
                Search
              </Button>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 mt-4 text-white/80">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">New York, NY</span>
              <button className="text-sm underline hover:no-underline">Change</button>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2" />
        </section>

        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Categories</h2>
            <Link to="/user/services" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.id}
                  to={`/user/services?category=${category.id}`}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card hover:shadow-card transition-all hover-lift"
                >
                  <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs font-medium text-center">{category.name}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Featured Services */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Featured Services</h2>
            <Link to="/user/services" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredServices.map((service) => (
              <Link key={service.id} to={`/user/services/${service.id}`}>
                <Card className="overflow-hidden hover:shadow-hover transition-all hover-lift h-full">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 left-2 bg-white/90 text-foreground">
                      {service.category}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1 line-clamp-1">{service.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{service.providerName}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{service.rating}</span>
                        <span className="text-xs text-muted-foreground">({service.reviewCount})</span>
                      </div>
                      <p className="font-semibold text-primary">
                        ${service.price}<span className="text-xs text-muted-foreground font-normal">/hr</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Active Bookings</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Star className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Reviews Given</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">Unread Messages</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
