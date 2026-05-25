"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, ShieldCheck, GraduationCap, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden">
      {/* Dynamic Animated Gradient Background */}
      <div className="fixed inset-0 -z-10 bg-orange-50/30">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.08)_0%,transparent_50%)]" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-400/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            x: [0, -50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-400/20 rounded-full blur-[120px]"
        />
      </div>

      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-rose-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-200">
            S
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900">
            SMMS<span className="text-orange-500">.</span>
          </span>
        </motion.div>

        <div className="hidden md:flex items-center gap-10 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
          <a href="#features" className="hover:text-orange-600 transition-colors">Features</a>
          <a href="#roles" className="hover:text-orange-600 transition-colors">Roles</a>
          <Link href="/login">
            <Button className="bg-gradient-to-r from-orange-500 to-rose-500 text-white px-8 h-12 rounded-2xl hover:from-orange-600 hover:to-rose-600 transition-all shadow-xl shadow-orange-200 border-none font-bold">
              Sign In
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-20 pb-32">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 space-y-10 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white shadow-sm border border-orange-100 text-orange-600 text-[10px] font-black tracking-[0.2em] uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-600"></span>
              </span>
              Next-Generation Mentoring v2.0
            </div>

            <h1 className="text-6xl lg:text-8xl font-black text-slate-900 leading-[0.95] tracking-tighter">
              Guiding <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500 animate-gradient">
                Ambition.
              </span>
            </h1>

            <p className="text-lg text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              A sophisticated management ecosystem that synchronizes mentors and students.
              Data-driven insights for academic excellence.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start">
              <Link href="/login">
                <Button className="w-full sm:w-auto h-16 px-10 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:from-orange-600 hover:to-rose-600 transition-all shadow-2xl shadow-orange-200 flex items-center justify-center gap-3 border-none group">
                  Enter Dashboard
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="ghost" className="w-full sm:w-auto h-16 px-10 bg-white text-slate-900 border border-slate-100 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                Documentation
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex-1 relative"
          >
            {/* 3D-like container */}
            <motion.div
              whileHover={{ rotateY: 5, rotateX: -5 }}
              className="relative z-10 transition-transform duration-500 ease-out"
              style={{ perspective: "1000px" }}
            >
              <div className="rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(249,115,22,0.3)] border-[10px] border-white bg-white group ring-4 ring-white">
                <Image
                  src="/smms_hero_illustration.png"
                  alt="Mentoring Dashboard Illustration"
                  width={1000}
                  height={800}
                  priority
                  className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
                {/* Gradient Overlay for the card effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent pointer-events-none" />
              </div>
            </motion.div>

            {/* Floating Stats */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-10 -left-10 z-20 bg-white p-6 rounded-[2.5rem] shadow-2xl border border-slate-50 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-rose-500 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                <CheckCircle size={24} />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 leading-none">94%</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Growth Index</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter">
              Professional <span className="text-orange-500 underline decoration-orange-200 underline-offset-8">Modules</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard
              icon={<ShieldCheck className="text-orange-500" />}
              title="Identity Guard"
              desc="Next-generation authentication protocols keeping academic records safe."
              delay={0.1}
            />
            <FeatureCard
              icon={<BookOpen className="text-rose-500" />}
              title="Session Intelligence"
              desc="Highly detailed logs capture every nuance of the mentor-student journey."
              delay={0.2}
            />
            <FeatureCard
              icon={<GraduationCap className="text-orange-600" />}
              title="Role Harmony"
              desc="Seamlessly switch between administrative control and mentor guidance."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Roles Section - Explicitly added for the anchor link */}
      <section id="roles" className="py-32 bg-slate-900 text-white rounded-[4rem] mx-6 mb-32 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-500/20 to-transparent" />
        <div className="container mx-auto px-12 relative z-10 text-center space-y-12">
          <h2 className="text-4xl font-black tracking-tight">One Platform, Three Perspectives.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-4">
              <div className="text-orange-400 font-black text-6xl opacity-20">01</div>
              <h3 className="text-xl font-bold">Admins</h3>
              <p className="text-slate-400 text-sm italic">System-wide orchestration and auditing.</p>
            </div>
            <div className="space-y-4">
              <div className="text-orange-400 font-black text-6xl opacity-20">02</div>
              <h3 className="text-xl font-bold">Mentors</h3>
              <p className="text-slate-400 text-sm italic">Direct student engagement and growth tracking.</p>
            </div>
            <div className="space-y-4">
              <div className="text-orange-400 font-black text-6xl opacity-20">03</div>
              <h3 className="text-xl font-bold">Students</h3>
              <p className="text-slate-400 text-sm italic">Transparent access to guidance and history.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="container mx-auto px-6 py-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-sm">S</div>
          <span className="font-bold text-slate-900">SMMS.</span>
        </div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest italic">
          Professional Mentoring Excellence © 2026
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -10 }}
      className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-orange-50 transition-all group"
    >
      <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:bg-gradient-to-br from-orange-500 to-rose-500 transition-colors duration-500">
        <div className="group-hover:text-white transition-colors duration-500">
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{title}</h3>
      <p className="text-slate-500 leading-relaxed font-medium">{desc}</p>
    </motion.div>
  );
}
