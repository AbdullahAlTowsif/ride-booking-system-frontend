import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Navbar from "@/components/modules/Common/Navbar";

const teamMembers = [
  {
    name: "Abdullah Al Towsif",
    role: "CEO",
    bio: "Visionary leader driving the company's mission.",
  },
  {
    name: "Bob Smith",
    role: "CTO",
    bio: "Responsible for technology strategy and development.",
  },
  {
    name: "Charlie Lee",
    role: "Product Manager",
    bio: "Ensures products meet customer needs and market trends.",
  },
  {
    name: "Diana Rose",
    role: "Lead Designer",
    bio: "Crafts the visual experience and user interface.",
  },
];

const AboutUs = () => {
  return (
    <div>
        <Navbar></Navbar>
      <div className="container mx-auto p-6 space-y-12">
        {/* Company Background */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold">About Our Company</h1>
          <p className="text-gray-700 max-w-3xl mx-auto">
            We are dedicated to delivering innovative solutions that empower
            businesses and individuals alike. Our mission is to create seamless
            experiences, foster growth, and make a meaningful impact in the
            communities we serve.
          </p>
        </section>

        {/* Mission */}
        <section className="text-center space-y-4">
          <h2 className="text-3xl font-semibold">Our Mission</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            To leverage technology and creativity to solve real-world problems,
            while maintaining integrity, excellence, and collaboration in
            everything we do.
          </p>
        </section>

        {/* Team Profiles */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => {
              // Generate initials
              const initials = member.name
                .split(" ")
                .map((n) => n[0])
                .join("");

              return (
                <Card key={member.name} className="text-center p-6">
                  <CardContent className="space-y-4">
                    <Avatar className="mx-auto w-24 h-24 bg-primary text-white text-2xl font-semibold">
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-sm text-gray-500">{member.role}</p>
                    <p className="text-gray-700 text-sm">{member.bio}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
