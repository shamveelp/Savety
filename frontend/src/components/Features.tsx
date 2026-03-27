"use client";

import { motion } from "framer-motion";
import { 
  Brain, 
  Layers, 
  ShieldCheck, 
  Users, 
  CloudLightning, 
  Code2,
  ChevronRight
} from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "Intelligent Organization",
      description: "Harness AI to automatically tag, categorize, and sort your entire image library with unparalleled accuracy.",
      icon: <Brain className="w-8 h-8" />,
    },
    {
      title: "Seamless Integration",
      description: "Connect Savety to your existing toolchain and workflows with a single click. No more context switching.",
      icon: <Layers className="w-8 h-8" />,
    },
    {
      title: "Advanced Encryption",
      description: "Your data is secured with AES-256 bit encryption, ensuring your visual assets stay yours, and yours alone.",
      icon: <ShieldCheck className="w-8 h-8" />,
    },
    {
      title: "Shared Libraries",
      description: "Collaborate across teams and timezones with real-time shared galleries and permissions.",
      icon: <Users className="w-8 h-8" />,
    },
    {
      title: "Custom Domain CDN",
      description: "Deliver pixel-perfect images globally at lightning speed using our edge network and custom domains.",
      icon: <CloudLightning className="w-8 h-8" />,
    },
    {
      title: "Full API Access",
      description: "Built for developers. Automate your image management lifecycle with our robust REST and GraphQL APIs.",
      icon: <Code2 className="w-8 h-8" />,
    },
  ];

  return (
    <section id="features" className="py-44 bg-black px-8 md:px-12 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-dot-pattern opacity-20"></div>
      
      <div className="max-w-[1600px] mx-auto relative z-10">
        <div className="max-w-4xl mb-32">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-white text-sm font-black tracking-[0.4em] uppercase mb-6 block"
          >
            Engineered for Excellence
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tight uppercase leading-[0.85] text-white"
          >
            Designed to make <br />
            <span className="text-neutral-500 text-7xl md:text-9xl italic">precision</span> effortless.
          </motion.h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative p-12 glass-dark rounded-[48px] hover:border-white transition-all duration-700 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px] group-hover:bg-white/10 transition-colors"></div>
              
              <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[24px] flex items-center justify-center mb-10 text-white group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-700">
                {feature.icon}
              </div>
              
              <h3 className="text-3xl font-black mb-6 tracking-tight text-white">{feature.title}</h3>
              <p className="text-xl text-neutral-500 leading-relaxed font-light mb-10 group-hover:text-neutral-300 transition-colors">{feature.description}</p>
              
              <div className="flex items-center gap-3 text-sm font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-6 group-hover:translate-y-0 text-white cursor-pointer">
                Learn More <ChevronRight className="w-5 h-5" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
