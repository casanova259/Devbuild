import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Heart, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <section className="pt-24 pb-12 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-lg opacity-90 max-w-2xl">
            Connecting alumni worldwide to create meaningful relationships and opportunities.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="border-border shadow-card">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h2 className="font-serif text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground">
                  To build and nurture a vibrant global community of alumni by providing innovative 
                  tools and opportunities for networking, professional development, and lifelong learning. 
                  We strive to strengthen the bonds between alumni and their alma mater while fostering 
                  meaningful connections that transcend graduation.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border shadow-card">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <h2 className="font-serif text-2xl font-bold mb-4">Our Vision</h2>
                <p className="text-muted-foreground">
                  To be the premier platform connecting alumni worldwide, creating a network where 
                  every member can contribute to and benefit from a thriving community. We envision 
                  a future where our alumni network serves as a cornerstone for professional success, 
                  personal growth, and positive societal impact.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Story */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-serif text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Alumni Connect was founded in 2010 by a group of passionate alumni who recognized 
                the need for a comprehensive platform to maintain and strengthen connections after graduation.
              </p>
              <p>
                What started as a simple directory has evolved into a comprehensive ecosystem serving 
                over 15,000 alumni across 50 countries. Our platform has facilitated thousands of 
                career connections, mentorship relationships, and collaborative opportunities.
              </p>
              <p>
                Today, we continue to innovate and expand our services, always keeping our core mission 
                at heart: to empower alumni to support each other and create lasting impact in their 
                communities and industries.
              </p>
            </div>
          </div>

          {/* Values */}
          <div>
            <h2 className="font-serif text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Heart,
                  title: "Community First",
                  description: "We prioritize building genuine connections and fostering a supportive network."
                },
                {
                  icon: Award,
                  title: "Excellence",
                  description: "We strive for excellence in everything we do, from platform features to member support."
                },
                {
                  icon: Target,
                  title: "Impact",
                  description: "We measure our success by the positive impact we create in our alumni's lives."
                },
                {
                  icon: Eye,
                  title: "Innovation",
                  description: "We continuously evolve to meet the changing needs of our global alumni community."
                }
              ].map((value, index) => (
                <Card key={index} className="border-border text-center">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">Our Impact in Numbers</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "15,000+", label: "Active Alumni" },
              { number: "50+", label: "Countries" },
              { number: "500+", label: "Partner Companies" },
              { number: "1,200+", label: "Successful Hires" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-serif text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
