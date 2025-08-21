import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Rider",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    feedback:
      "Booking a ride is so quick and simple. I always feel safe and the drivers are really polite!",
  },
  {
    name: "Michael Lee",
    role: "Driver",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4,
    feedback:
      "Driving with this platform has been great. The app is smooth and payments are always on time.",
  },
  {
    name: "Amina Rahman",
    role: "Rider",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
    feedback:
      "I love the real-time tracking feature. I can always see when my driver is arriving!",
  },
]

export default function Testimonials() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Users Say</h2>
        <p className="text-gray-600 mb-12">
          Hear from riders and drivers who love using our platform.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-200">
              <CardHeader className="flex flex-col items-center">
                <Avatar className="w-16 h-16 mb-4">
                  <AvatarImage src={t.image} alt={t.name} />
                  <AvatarFallback>{t.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{t.name}</h3>
                <p className="text-sm text-gray-500">{t.role}</p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex justify-center mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-sm text-gray-600">{t.feedback}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
