import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Smartphone, Car } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto text-center space-y-8">
        {/* Main Heading */}
        <h2 className="text-4xl font-bold">
          Ready to Ride? Book Your Journey Today!
        </h2>
        <p className="text-lg opacity-90">
          Experience comfort, safety, and reliability with every trip.  
          Download our app or book directly from the website.
        </p>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600"
          >
            <Car className="mr-2 h-5 w-5" /> Book a Ride
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600 font-semibold dark:border-gray-400 dark:hover:bg-gray-200 dark:hover:text-gray-900"
          >
            <Smartphone className="mr-2 h-5 w-5" /> Download App
          </Button>
        </div>

        {/* Promo Card */}
        <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl mt-10 shadow-xl dark:bg-gray-800/60 dark:border-gray-700">
          <CardContent className="py-8 px-6">
            <p className="text-xl font-semibold mb-2 text-white dark:text-gray-100">
              🔥 Limited Time Offer
            </p>
            <p className="mb-4 text-gray-100 dark:text-gray-300">
              Get <span className="font-bold">20% OFF</span> your first 3 rides.  
              Use code{" "}
              <span className="bg-yellow-400 text-black px-2 py-1 rounded">
                RIDE20
              </span>.
            </p>
            <Button
              size="lg"
              className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold dark:bg-yellow-500 dark:hover:bg-yellow-600"
            >
              Claim Offer <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
