import Logo from "@/assets/icons/Logo";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";

const featuresData = [
  {
    role: "Rider",
    capabilities: [
      "Request rides quickly and easily",
      "Track ride status in real-time",
      "View ride history and receipts",
      "Rate drivers and provide feedback",
    ],
    color: "bg-blue-600",
  },
  {
    role: "Driver",
    capabilities: [
      "Accept or reject ride requests",
      "Navigate to pickup and destination locations",
      "Track earnings and ride statistics",
      "Manage availability and profile",
    ],
    color: "bg-green-600",
  },
  {
    role: "Admin",
    capabilities: [
      "View and manage all rides, riders, and drivers",
      "Generate analytics and revenue reports",
      "Block/unblock users or drivers",
      "Configure system settings and permissions",
    ],
    color: "bg-purple-600",
  },
];

const Features = () => {
  return (
    <div className="container mx-auto p-6 space-y-12">
        <Link to="/"><Logo></Logo></Link>
      {/* Page Title */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Platform Features</h1>
        <p className="text-gray-700 max-w-3xl mx-auto">
          Explore the capabilities available for Riders, Drivers, and Admins on our platform. 
          Each role has unique tools to enhance the ride experience, manage operations, and track performance.
        </p>
      </section>

      {/* Feature Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuresData.map((feature) => (
          <Card key={feature.role} className="shadow-md hover:shadow-lg transition-all">
            <CardContent className="space-y-4">
              <div
                className={`w-16 h-16 flex items-center justify-center rounded-full text-white text-2xl font-bold ${feature.color}`}
              >
                {feature.role[0]}
              </div>
              <h2 className="text-xl font-semibold">{feature.role}</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {feature.capabilities.map((capability, index) => (
                  <li key={index}>{capability}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
};

export default Features;
