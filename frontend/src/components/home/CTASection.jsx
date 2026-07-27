import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready to Transform Your Smile?</h2>
        <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied patients. Sign in to access your personal dental dashboard.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/login" className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 shadow-lg text-lg">
            <span>Get Started</span><ArrowRight size={20} />
          </Link>
          <a href="tel:+15551234567" className="inline-flex items-center space-x-2 bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold border-2 border-gray-200 hover:border-cyan-300 text-lg">
            <Phone size={20} /><span>Schedule a Visit</span>
          </a>
        </div>
      </div>
    </section>
  );
}
