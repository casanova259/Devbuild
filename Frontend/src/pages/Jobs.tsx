import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Clock, DollarSign } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const jobsData = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Google",
    location: "Mountain View, CA",
    type: "Full-time",
    salary: "$150,000 - $200,000",
    postedBy: "Sarah Johnson '15",
    posted: "2 days ago",
    description: "Join our innovative team building next-generation cloud infrastructure."
  },
  {
    id: 2,
    title: "Product Marketing Manager",
    company: "Meta",
    location: "Menlo Park, CA",
    type: "Full-time",
    salary: "$130,000 - $170,000",
    postedBy: "Emily Rodriguez '18",
    posted: "5 days ago",
    description: "Lead marketing strategy for our flagship products reaching billions of users."
  },
  {
    id: 3,
    title: "Management Consultant",
    company: "McKinsey & Company",
    location: "New York, NY",
    type: "Full-time",
    salary: "$140,000 - $180,000",
    postedBy: "Michael Chen '12",
    posted: "1 week ago",
    description: "Work with Fortune 500 clients on strategic business challenges."
  },
  {
    id: 4,
    title: "UX Design Lead",
    company: "Apple",
    location: "Cupertino, CA",
    type: "Full-time",
    salary: "$160,000 - $210,000",
    postedBy: "James Lee '14",
    posted: "1 week ago",
    description: "Shape the future of user experience for millions of Apple users worldwide."
  },
  {
    id: 5,
    title: "Investment Analyst",
    company: "Goldman Sachs",
    location: "London, UK",
    type: "Full-time",
    salary: "£90,000 - £120,000",
    postedBy: "Jessica Williams '16",
    posted: "2 weeks ago",
    description: "Analyze investment opportunities in emerging markets and tech sectors."
  },
  {
    id: 6,
    title: "Lead Engineer",
    company: "Tesla",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$145,000 - $190,000",
    postedBy: "David Park '10",
    posted: "2 weeks ago",
    description: "Drive innovation in sustainable energy and electric vehicle technology."
  }
];

const Jobs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <section className="pt-24 pb-12 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Job Board</h1>
          <p className="text-lg opacity-90 max-w-2xl">
            Discover exclusive job opportunities posted by alumni and companies seeking talented individuals like you.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-muted/50 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="font-bold text-2xl text-primary">350+</div>
              <div className="text-sm text-muted-foreground">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl text-primary">200+</div>
              <div className="text-sm text-muted-foreground">Companies</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl text-primary">1,200+</div>
              <div className="text-sm text-muted-foreground">Hires Made</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl text-primary">$145K</div>
              <div className="text-sm text-muted-foreground">Avg. Salary</div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="font-serif text-2xl font-bold mb-2">Latest Opportunities</h2>
              <p className="text-muted-foreground">Showing {jobsData.length} jobs</p>
            </div>
            <Button>Post a Job</Button>
          </div>

          <div className="space-y-4">
            {jobsData.map((job) => (
              <Card key={job.id} className="border-border shadow-card hover:shadow-elegant transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-serif text-xl font-bold mb-1">{job.title}</h3>
                          <p className="text-lg font-medium text-primary">{job.company}</p>
                        </div>
                        <Badge variant="secondary">{job.type}</Badge>
                      </div>

                      <p className="text-muted-foreground text-sm mb-4">{job.description}</p>

                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-primary" />
                          <span>{job.salary}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Briefcase className="h-4 w-4 text-primary" />
                          <span>Posted by {job.postedBy}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>{job.posted}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-2">
                      <Button className="flex-1 md:flex-none">Apply Now</Button>
                      <Button variant="outline" className="flex-1 md:flex-none">Save</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button variant="outline" size="lg">Load More Jobs</Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">
            Looking to Hire Alumni?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Post your job openings and connect with talented professionals from our alumni network.
          </p>
          <Button size="lg" className="bg-gradient-hero">Post a Job Opening</Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Jobs;
