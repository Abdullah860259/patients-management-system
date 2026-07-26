const stats = [
  { number: "15,000+", label: "Happy Patients" },
  { number: "25+", label: "Expert Dentists" },
  { number: "10+", label: "Years Experience" },
  { number: "98%", label: "Satisfaction Rate" }
];

export default function StatsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ number, label }, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">{number}</div>
              <div className="text-gray-600 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
