import { motion } from "framer-motion";
import { Star, CheckCircle2, Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "Alex Davydov",
    role: "Senior AI Engineer",
    avatar: "https://i.pravatar.cc/150?img=12",
    content: "The components are incredibly well-architected. I literally bought the AI agent boilerplate on Friday and launched my SaaS by Monday. Crazy ROI for the price.",
    rating: 5,
  },
  {
    name: "Sarah Jenkins",
    role: "Frontend Architect",
    avatar: "https://i.pravatar.cc/150?img=5",
    content: "Digital Swarm saved me over 3 weeks of miserable API integration work. The documentation is pristine and the codebase is completely type-safe. Highly recommend the Agent Swarms.",
    rating: 5,
  },
  {
    name: "Marcus Thorne",
    role: "SaaS Founder",
    avatar: "https://i.pravatar.cc/150?img=11",
    content: "Best UI kits I have ever purchased. period. Better than most subscriptions that charge $100/month. The pricing strategy here is wildly generous for the quality provided.",
    rating: 5,
  },
  {
    name: "Elena Rodriguez",
    role: "Solution Architect",
    avatar: "https://i.pravatar.cc/150?img=19",
    content: "I've purchased templates before that were spaghetti code. These are different. The code looks like it was written by an elite engineering team at a top-tier tech firm.",
    rating: 5,
  }
];

export function Testimonials() {
  return (
    <section className="py-32 bg-white border-t border-black/5 overflow-hidden relative">
      <div className="container mx-auto px-6 w-full max-w-7xl">
        
        <div className="flex flex-col items-center text-center gap-6 mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 border border-cyan-100 shadow-sm">
            <Quote className="w-4 h-4 text-cyan-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-600 italic">Peer Verification</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase italic">
            Trusted by <span className="text-cyan-500">2,400+ Elite</span> Devs
          </h2>
          <p className="text-gray-500 font-bold text-lg max-w-2xl uppercase tracking-tight">
            The collective standard for autonomous implementation and high-conversion UI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group relative bg-white rounded-[2.5rem] p-8 border border-black/5 flex flex-col h-full hover:shadow-[0_30px_60px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all"
            >
                <div className="flex gap-1 mb-6">
                    {[...Array(t.rating)].map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-cyan-500 text-cyan-500" />
                    ))}
                </div>
                
                <p className="text-gray-600 text-sm font-medium mb-8 grow leading-relaxed uppercase tracking-tight italic">
                    &quot;{t.content}&quot;
                </p>
                
                <div className="mt-auto pt-6 border-t border-black/5 flex items-center gap-4">
                    <div className="relative">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-black/5 bg-gray-100 grayscale-[0.5] group-hover:grayscale-0 transition-all">
                        <Image src={t.avatar} alt={t.name} width={48} height={48} className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-black/5">
                        <CheckCircle2 className="w-4 h-4 text-cyan-500 fill-white" />
                      </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-gray-900 text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                          {t.name}
                        </span>
                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest italic">{t.role}</span>
                    </div>
                </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

