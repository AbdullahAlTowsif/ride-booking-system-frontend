import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, ShieldCheck, Wallet, Star } from "lucide-react"

const highlights = [
  {
    icon: <Clock className="w-10 h-10 text-indigo-600 mb-4" />,
    title: "Fast & Reliable",
    description: "Book a ride instantly and get matched with nearby drivers within seconds.",
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-indigo-600 mb-4" />,
    title: "Safe & Secure",
    description: "Every ride is tracked, drivers are verified, and your safety comes first.",
  },
  {
    icon: <Wallet className="w-10 h-10 text-indigo-600 mb-4" />,
    title: "Affordable Pricing",
    description: "Transparent fares with no hidden charges. Pay online or with cash.",
  },
  {
    icon: <Star className="w-10 h-10 text-indigo-600 mb-4" />,
    title: "Top-rated Drivers",
    description: "Ride with professional, well-reviewed drivers for a smooth experience.",
  },
]

export default function ServiceHighlights() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Us?</h2>
        <p className="text-gray-600 mb-12">
          Experience convenience, safety, and comfort with every ride.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-all duration-200"
            >
              <CardHeader>
                <CardTitle className="flex flex-col items-center">
                  {item.icon}
                  <span className="mt-2 text-lg">{item.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
