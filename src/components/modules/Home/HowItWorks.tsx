import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Car, SatelliteDish, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: <MapPin className="w-10 h-10 text-indigo-600 mb-4" />,
    title: "Enter Pickup & Destination",
    description: "Set where you want to go with a few taps.",
  },
  {
    icon: <Car className="w-10 h-10 text-indigo-600 mb-4" />,
    title: "Get Matched with a Driver",
    description: "We’ll connect you to the nearest available driver.",
  },
  {
    icon: <SatelliteDish className="w-10 h-10 text-indigo-600 mb-4" />,
    title: "Track Your Ride",
    description: "Follow your driver’s location in real time.",
  },
  {
    icon: <CheckCircle className="w-10 h-10 text-indigo-600 mb-4" />,
    title: "Arrive Safely",
    description: "Enjoy your ride and don’t forget to rate your driver.",
  },
]

export default function HowItWorks() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
        <p className="text-gray-600 mb-12">
          Booking a ride is simple, fast, and safe.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-all duration-200"
            >
              <CardHeader>
                <CardTitle className="flex flex-col items-center">
                  {step.icon}
                  <span className="mt-2 text-lg">{step.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
