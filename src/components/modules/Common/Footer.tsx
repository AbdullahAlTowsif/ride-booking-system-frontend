import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Car } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand */}
        <div>
          <div className="flex items-center space-x-2">
            <Car className="w-7 h-7 text-yellow-400" />
            <span className="text-2xl font-bold text-white">RideNow</span>
          </div>
          <p className="mt-3 text-sm">
            Book your ride anytime, anywhere. Fast, safe, and reliable ride booking at your fingertips.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#how-it-works" className="hover:text-yellow-400">How It Works</a></li>
            <li><a href="#services" className="hover:text-yellow-400">Services</a></li>
            <li><a href="#testimonials" className="hover:text-yellow-400">Testimonials</a></li>
            <li><a href="#contact" className="hover:text-yellow-400">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-yellow-400" />
              <span>Dhaka, Bangladesh</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-yellow-400" />
              <span>+880 123-456-789</span>
            </li>
            <li className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-yellow-400" />
              <span>support@ridenow.com</span>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-yellow-400">
              <Facebook className="w-6 h-6" />
            </a>
            <a href="#" className="hover:text-yellow-400">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="#" className="hover:text-yellow-400">
              <Instagram className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 text-center py-6 text-sm">
        <p>© {new Date().getFullYear()} RideNow. All rights reserved.</p>
      </div>
    </footer>
  );
}
