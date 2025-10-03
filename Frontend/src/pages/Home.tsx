import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, Briefcase, TrendingUp, Award, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-alumni.jpg";
import featureDirectory from "@/assets/feature-directory.png";
import featureEvents from "@/assets/feature-events.png";
import featureJobs from "@/assets/feature-jobs.png";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight">
                Connect With Your
                <span className="text-primary"> Alumni Network</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Join thousands of alumni building meaningful connections, discovering opportunities, 
                and advancing their careers through our powerful networking platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild className="bg-gradient-hero shadow-elegant">
                  <Link to="/register">Join Network</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/alumni">Explore Alumni</Link>
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="font-bold text-2xl text-primary">15,000+</div>
                  <div className="text-sm text-muted-foreground">Active Alumni</div>
                </div>
                <div>
                  <div className="font-bold text-2xl text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Companies</div>
                </div>
                <div>
                  <div className="font-bold text-2xl text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">Countries</div>
                </div>
              </div>
            </div>
            <div className="relative animate-fade-in">
              <div className="absolute inset-0 bg-gradient-hero opacity-20 blur-3xl"></div>
              <img 
                src={heroImage}
                alt="Alumni networking at professional event"
                className="relative rounded-2xl shadow-elegant w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold mb-4">
              Everything You Need to <span className="text-primary">Stay Connected</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools you need to build and maintain 
              meaningful connections with your alumni network.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-card border-border shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 space-y-4">
                <div className="h-20 w-20 rounded-xl bg-primary/10 flex items-center justify-center">
                  <img src={featureDirectory} alt="Alumni Directory" className="h-16 w-16 object-contain" />
                </div>
                <h3 className="font-serif text-2xl font-bold">Alumni Directory</h3>
                <p className="text-muted-foreground">
                  Search and connect with thousands of alumni across different industries, 
                  locations, and graduation years.
                </p>
                <Button variant="link" className="p-0 h-auto" asChild>
                  <Link to="/alumni">Explore Directory →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 space-y-4">
                <div className="h-20 w-20 rounded-xl bg-primary/10 flex items-center justify-center">
                  <img src={featureEvents} alt="Events & News" className="h-16 w-16 object-contain" />
                </div>
                <h3 className="font-serif text-2xl font-bold">Events & News</h3>
                <p className="text-muted-foreground">
                  Stay updated with alumni events, reunions, webinars, and the latest news 
                  from your network.
                </p>
                <Button variant="link" className="p-0 h-auto" asChild>
                  <Link to="/events">View Events →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 space-y-4">
                <div className="h-20 w-20 rounded-xl bg-primary/10 flex items-center justify-center">
                  <img src={featureJobs} alt="Job Opportunities" className="h-16 w-16 object-contain" />
                </div>
                <h3 className="font-serif text-2xl font-bold">Job Opportunities</h3>
                <p className="text-muted-foreground">
                  Access exclusive job postings, career mentorship, and professional 
                  development opportunities.
                </p>
                <Button variant="link" className="p-0 h-auto" asChild>
                  <Link to="/jobs">Browse Jobs →</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold mb-4">
              Why Join <span className="text-primary">Alumni Connect</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover the benefits of being part of our thriving alumni community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "Expand Network",
                description: "Connect with professionals across industries and build lasting relationships"
              },
              {
                icon: TrendingUp,
                title: "Career Growth",
                description: "Access mentorship, job opportunities, and professional development resources"
              },
              {
                icon: Calendar,
                title: "Exclusive Events",
                description: "Attend networking events, workshops, and alumni reunions worldwide"
              },
              {
                icon: Award,
                title: "Recognition",
                description: "Showcase achievements and get recognized for your professional success"
              },
              {
                icon: Briefcase,
                title: "Business Opportunities",
                description: "Discover partnership and collaboration opportunities with fellow alumni"
              },
              {
                icon: Globe,
                title: "Global Community",
                description: "Join a worldwide network of alumni making impact in their fields"
              }
            ].map((benefit, index) => (
              <Card key={index} className="border-border hover:border-primary/50 transition-all">
                <CardContent className="p-6 space-y-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            Ready to Reconnect with Your Network?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of alumni who are already benefiting from our platform. 
            Create your profile today and start building meaningful connections.
          </p>
          <Button size="lg" variant="secondary" asChild className="shadow-elegant">
            <Link to="/register">Get Started Now</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
