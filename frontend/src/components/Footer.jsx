import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe, MessageCircle, Camera, Briefcase } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="text-xl font-bold text-white">DentalCare</span>
            </div>
            <p className="text-sm leading-relaxed">
              Your trusted dental clinic providing exceptional care with modern technology and experienced professionals.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link></li>
              <li><Link to="/login" className="hover:text-cyan-400 transition-colors">Patient Login</Link></li>
              <li><Link to="/register" className="hover:text-cyan-400 transition-colors">Register</Link></li>
              <li><Link to="/patient/dashboard" className="hover:text-cyan-400 transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>General Checkup</li>
              <li>Teeth Cleaning</li>
              <li>Root Canal</li>
              <li>Teeth Whitening</li>
              <li>Dental Implants</li>
              <li>Orthodontics</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <MapPin size={16} className="text-cyan-400 shrink-0" />
                <span>123 Dental Ave, Medical District, NY 10001</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={16} className="text-cyan-400 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={16} className="text-cyan-400 shrink-0" />
                <span>info@dentalcare.com</span>
              </li>
            </ul>
            <div className="flex space-x-3 mt-4">
              {[Globe, MessageCircle, Camera, Briefcase].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-cyan-600 transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} DentalCare. All rights reserved. Built for patient satisfaction.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
