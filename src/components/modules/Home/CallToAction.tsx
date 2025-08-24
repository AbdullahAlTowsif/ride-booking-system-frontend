import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";
import { Link } from "react-router";

export default function CallToAction() {
  return (
    <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto text-center space-y-8">
        {/* Main Heading */}
        <h2 className="text-4xl font-bold">
          Ready to Ride? Book Your Journey Today!
        </h2>
        <p className="text-lg opacity-90">
          Experience comfort, safety, and reliability with every trip. Download
          our app or book directly from the website.
        </p>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600"
          >
            <Car className="mr-2 h-5 w-5" />{" "}
            <Link to="/rider/ride-request">Book a Ride</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
