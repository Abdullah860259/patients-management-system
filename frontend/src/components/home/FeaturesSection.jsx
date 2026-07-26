import { Link } from 'react-router-dom';
import { Users, Clock, Shield, ArrowRight } from 'lucide-react';

const features = [
  { icon: Users, title: "Patient Dashboard", desc: "View your complete profile, treatment history, and upcoming appointments", color: "from-cyan-500 to-blue-600" },
  { icon: Clock, title: "Treatment Tracking", desc: "Track every treatment from scheduling to completion with detailed notes", color: "from-emerald-500 to-teal-600" },
  { icon: Shield, title: "Secure Payments", desc: "View payment history, insurance claims, and manage expenses transparently", color: "from-purple-500 to-indigo-600" }
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-cyan-600 font-semibold text-sm uppercase tracking-wider">Patient Portal</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Your Dental Journey, Simplified</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Access your complete dental care information from anywhere</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, desc, color }, i) => (
            <div key={i} className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-100 hover:border-cyan-200 transition-all duration-300 h-full">
              <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-5`}>
                <Icon size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-600">{desc}</p>
              <Link to="/login" className="inline-flex items-center space-x-1 text-cyan-600 font-medium mt-4 hover:space-x-2 transition-all">
                <span>Get Started</span><ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
