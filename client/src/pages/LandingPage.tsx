import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Shield, 
  Star, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Wrench,
  Zap,
  Droplet,
  Brush,
  Scissors,
  Car
} from 'lucide-react';

const categories = [
  { name: 'Plumbing', icon: Droplet, description: 'Pipes, leaks & installations' },
  { name: 'Electrical', icon: Zap, description: 'Wiring, repairs & fixtures' },
  { name: 'Cleaning', icon: Brush, description: 'Deep cleaning & sanitization' },
  { name: 'Home Repair', icon: Wrench, description: 'General maintenance & fixes' },
  { name: 'Beauty', icon: Scissors, description: 'Salon & spa at home' },
  { name: 'Automotive', icon: Car, description: 'Car care & maintenance' },
];

const features = [
  {
    icon: Shield,
    title: 'Verified Providers',
    description: 'All providers undergo thorough background verification',
  },
  {
    icon: Star,
    title: 'Quality Assured',
    description: 'Rated and reviewed by thousands of customers',
  },
  {
    icon: Clock,
    title: 'On-Time Service',
    description: 'Punctual professionals at your doorstep',
  },
  {
    icon: CheckCircle,
    title: 'Secure Payments',
    description: 'Safe prepaid transactions with refund protection',
  },
];

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex h-16 items-center justify-between">
          <Logo size="md" />
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Services
            </Link>
            <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/auth/login">Sign in</Link>
            </Button>
            <Button className="bg-gradient-primary hover:opacity-90" asChild>
              <Link to="/auth/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5" />
        <div className="container py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Your Trusted <span className="text-gradient">Local Services</span> Platform
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with verified professionals for all your home and personal service needs. 
              Quality service, transparent pricing, guaranteed satisfaction.
            </p>
            
            {/* Search Box */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="What service do you need?"
                  className="w-full h-14 pl-12 pr-4 rounded-xl border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button size="lg" className="h-14 px-8 bg-gradient-primary hover:opacity-90">
                Find Services
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Trusted by <span className="font-semibold text-foreground">10,000+</span> customers
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from a wide range of professional services for your home and personal needs
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Link 
                  key={category.name} 
                  to={`/auth/register`}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card className="hover:shadow-hover transition-all hover-lift h-full">
                    <CardContent className="flex items-center gap-4 p-6">
                      <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose ServiceBridge?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We ensure quality, safety, and satisfaction with every service booking
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={feature.title} 
                  className="text-center p-6 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to get started?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join thousands of customers and service providers on ServiceBridge
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90" asChild>
                <Link to="/auth/register">
                  Find Services
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link to="/auth/register?role=provider">
                  Become a Provider
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-sidebar text-sidebar-foreground">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Logo size="sm" />
              <p className="mt-4 text-sm text-sidebar-foreground/70">
                Your trusted platform for local service providers. Quality, safety, and satisfaction guaranteed.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-sidebar-foreground/70">
                <li><Link to="#" className="hover:text-sidebar-foreground">Plumbing</Link></li>
                <li><Link to="#" className="hover:text-sidebar-foreground">Electrical</Link></li>
                <li><Link to="#" className="hover:text-sidebar-foreground">Cleaning</Link></li>
                <li><Link to="#" className="hover:text-sidebar-foreground">Home Repair</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-sidebar-foreground/70">
                <li><Link to="#" className="hover:text-sidebar-foreground">About Us</Link></li>
                <li><Link to="#" className="hover:text-sidebar-foreground">Careers</Link></li>
                <li><Link to="#" className="hover:text-sidebar-foreground">Press</Link></li>
                <li><Link to="#" className="hover:text-sidebar-foreground">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-sidebar-foreground/70">
                <li><Link to="#" className="hover:text-sidebar-foreground">Help Center</Link></li>
                <li><Link to="#" className="hover:text-sidebar-foreground">Terms of Service</Link></li>
                <li><Link to="#" className="hover:text-sidebar-foreground">Privacy Policy</Link></li>
                <li><Link to="#" className="hover:text-sidebar-foreground">FAQs</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-sidebar-border text-center text-sm text-sidebar-foreground/70">
            © 2024 ServiceBridge. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
