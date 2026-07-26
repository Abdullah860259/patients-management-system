import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Star } from 'lucide-react';

const testimonials = [
  { name: "Sarah Johnson", rating: 5, text: "Best dental experience ever! The staff was incredibly gentle and professional. My kids actually look forward to their checkups now.", role: "Patient since 2020" },
  { name: "Michael Chen", rating: 5, text: "Dr. Martinez completely transformed my smile with veneers. The process was smooth and the results exceeded my expectations!", role: "Patient since 2019" },
  { name: "Emily Rodriguez", rating: 5, text: "The online patient portal makes it so easy to track my treatments and payments. Very transparent and modern clinic.", role: "Patient since 2021" }
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-cyan-200 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">What Our Patients Say</h2>
        </div>
        <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }} spaceBetween={30} slidesPerView={1}
          breakpoints={{ 768: { slidesPerView: 3 } }} className="pb-12">
          {testimonials.map(({ name, rating, text, role }, i) => (
            <SwiperSlide key={i}>
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 h-full">
                <div className="flex space-x-1 mb-4">
                  {Array.from({ length: rating }, (_, j) => <Star key={j} size={18} className="text-yellow-400 fill-current" />)}
                </div>
                <p className="text-white/90 leading-relaxed mb-6 italic">"{text}"</p>
                <p className="text-white font-semibold">{name}</p>
                <p className="text-cyan-200 text-sm">{role}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
