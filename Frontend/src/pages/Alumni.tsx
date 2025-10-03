import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Briefcase, GraduationCap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Mock alumni data
const alumniData = [
  {
    id: 1,
    name: "Sarah Johnson",
    graduationYear: "2015",
    degree: "Computer Science",
    company: "Google",
    position: "Senior Software Engineer",
    location: "San Francisco, CA",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
  },
  {
    id: 2,
    name: "Michael Chen",
    graduationYear: "2012",
    degree: "Business Administration",
    company: "McKinsey & Company",
    position: "Senior Consultant",
    location: "New York, NY",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    graduationYear: "2018",
    degree: "Marketing",
    company: "Meta",
    position: "Product Marketing Manager",
    location: "Los Angeles, CA",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily"
  },
  {
    id: 4,
    name: "David Park",
    graduationYear: "2010",
    degree: "Engineering",
    company: "Tesla",
    position: "Lead Engineer",
    location: "Austin, TX",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David"
  },
  {
    id: 5,
    name: "Jessica Williams",
    graduationYear: "2016",
    degree: "Finance",
    company: "Goldman Sachs",
    position: "Investment Analyst",
    location: "London, UK",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica"
  },
  {
    id: 6,
    name: "James Lee",
    graduationYear: "2014",
    degree: "Design",
    company: "Apple",
    position: "UX Design Lead",
    location: "Cupertino, CA",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=James"
  }
];

const Alumni = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredAlumni = alumniData.filter(alumni =>
    alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alumni.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alumni.degree.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <section className="pt-24 pb-12 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Alumni Directory</h1>
          <p className="text-lg opacity-90 max-w-2xl">
            Connect with fellow alumni around the world. Search by name, company, or field of study.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-muted/50 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, company, or degree..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">Filters</Button>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredAlumni.length} alumni
          </div>
        </div>
      </section>

      {/* Alumni Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlumni.map((alumni) => (
              <Card key={alumni.id} className="border-border shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={alumni.image}
                      alt={alumni.name}
                      className="h-16 w-16 rounded-full bg-muted"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{alumni.name}</h3>
                      <p className="text-sm text-muted-foreground">Class of {alumni.graduationYear}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      <span>{alumni.degree}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-primary" />
                      <span>{alumni.position} at {alumni.company}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{alumni.location}</span>
                    </div>
                  </div>

                  <Button className="w-full mt-4" variant="outline">
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAlumni.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No alumni found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Alumni;
