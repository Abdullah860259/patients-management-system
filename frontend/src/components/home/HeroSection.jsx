import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { ArrowRight, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  { title: "Your Smile, Our Priority", subtitle: "Experience world-class dental care with cutting-edge technology and compassionate professionals", gradient: "from-cyan-600 via-blue-700 to-indigo-800", emoji: "🦷" },
  { title: "Advanced Dental Technology", subtitle: "From digital X-rays to laser treatments — we use the latest innovations for precise, painless care", gradient: "from-teal-600 via-emerald-700 to-green-800", emoji: "⚡" },
  { title: "Affordable Care for Everyone", subtitle: "Flexible payment plans, insurance support, and transparent pricing with no hidden costs", gradient: "from-purple-600 via-violet-700 to-indigo-800", emoji: "💰" }
];

export default function HeroSection() {
  return (
    <section className="relative">
      <Swiper modules={[Autoplay, Pagination, EffectFade]} effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }} loop={true} className="h-[600px]">
        {slides.map((s, i) => (
          <SwiperSlide key={i}>
            <div className={`h-full bg-gradient-to-br ${s.gradient} flex items-center`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl text-white">
                  <span className="text-6xl mb-4 block">{s.emoji}</span>
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">{s.title}</h1>
                  <p className="text-xl md:text-2xl text-white/80 mb-8">{s.subtitle}</p>
                  <div className="flex flex-wrap gap-4">
                    <Link to="/login" className="inline-flex items-center space-x-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 shadow-xl text-lg">
                      <span>Get Started</span><ArrowRight size={20} />
                    </Link>
                    <a href="tel:+15551234567" className="inline-flex items-center space-x-2 border-2 border-white/50 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 text-lg">
                      <Phone size={20} /><span>Call Us</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
