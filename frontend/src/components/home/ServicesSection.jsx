import { Stethoscope, Smile, Shield, Heart, Star, Award } from 'lucide-react';

const services = [
  { icon: Stethoscope, title: "General Checkup", desc: "Comprehensive oral exams with digital diagnostics" },
  { icon: Smile, title: "Teeth Whitening", desc: "Professional whitening for a brighter, confident smile" },
  { icon: Shield, title: "Root Canal", desc: "Painless root canal therapy with modern techniques" },
  { icon: Heart, title: "Dental Implants", desc: "Permanent tooth replacement that looks and feels natural" },
  { icon: Star, title: "Orthodontics", desc: "Braces and aligners for perfectly aligned teeth" },
  { icon: Award, title: "Cosmetic Dentistry", desc: "Veneers, bonding, and smile makeovers" }
];

export default function ServicesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-cyan-600 font-semibold text-sm uppercase tracking-wider">Our Services</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Comprehensive Dental Care</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">We offer a full range of dental services to keep your smile healthy</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map(({ icon: Icon, title, desc }, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Icon size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
