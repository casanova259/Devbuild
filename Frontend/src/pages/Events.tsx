import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const eventsData = [
  {
    id: 1,
    title: "Annual Alumni Reunion 2025",
    date: "June 15, 2025",
    time: "6:00 PM - 10:00 PM",
    location: "University Campus, Main Hall",
    attendees: 250,
    category: "Reunion",
    description: "Join us for our biggest alumni gathering of the year with networking, dinner, and entertainment."
  },
  {
    id: 2,
    title: "Tech Leaders Panel Discussion",
    date: "May 20, 2025",
    time: "2:00 PM - 4:00 PM",
    location: "Virtual Event",
    attendees: 180,
    category: "Workshop",
    description: "Hear from successful tech alumni about their journey and the future of technology."
  },
  {
    id: 3,
    title: "Career Mentorship Mixer",
    date: "May 5, 2025",
    time: "5:30 PM - 8:00 PM",
    location: "Downtown Business Center",
    attendees: 120,
    category: "Networking",
    description: "Connect with experienced alumni mentors to advance your career path."
  },
  {
    id: 4,
    title: "Regional Alumni Meet - New York",
    date: "April 28, 2025",
    time: "7:00 PM - 9:00 PM",
    location: "The Plaza Hotel, NYC",
    attendees: 95,
    category: "Social",
    description: "Regional gathering for alumni living in the New York metropolitan area."
  },
  {
    id: 5,
    title: "Entrepreneurship Workshop",
    date: "April 15, 2025",
    time: "1:00 PM - 5:00 PM",
    location: "Innovation Hub, Campus",
    attendees: 65,
    category: "Workshop",
    description: "Learn from alumni entrepreneurs about starting and scaling your business."
  },
  {
    id: 6,
    title: "Sports & Recreation Day",
    date: "April 8, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "University Sports Complex",
    attendees: 150,
    category: "Social",
    description: "Fun-filled day of sports, games, and outdoor activities for alumni and families."
  }
];

const Events = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <section className="pt-24 pb-12 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Events & News</h1>
          <p className="text-lg opacity-90 max-w-2xl">
            Stay connected through our exciting events, reunions, and networking opportunities.
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4">Upcoming Events</h2>
            <p className="text-muted-foreground">
              Register early to secure your spot at these exclusive alumni events.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {eventsData.map((event) => (
              <Card key={event.id} className="border-border shadow-card hover:shadow-elegant transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="secondary">{event.category}</Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{event.attendees} attending</span>
                    </div>
                  </div>

                  <h3 className="font-serif text-xl font-bold mb-3">{event.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{event.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <Button className="w-full">Register Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-2xl font-bold mb-8">Latest News</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Alumni Achievements in Fortune 500",
                date: "March 15, 2025",
                excerpt: "Celebrating our alumni who have reached executive positions in Fortune 500 companies."
              },
              {
                title: "New Mentorship Program Launch",
                date: "March 10, 2025",
                excerpt: "Introducing our revamped mentorship program connecting experienced alumni with recent graduates."
              },
              {
                title: "Global Alumni Network Expansion",
                date: "March 5, 2025",
                excerpt: "We're now in 50 countries! Join regional chapters worldwide."
              }
            ].map((news, index) => (
              <Card key={index} className="border-border">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-2">{news.date}</p>
                  <h3 className="font-semibold text-lg mb-2">{news.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{news.excerpt}</p>
                  <Button variant="link" className="p-0 h-auto">
                    Read More →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events;
