"use client";

import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { GraduationCap, UserCircle, ShieldCheck, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [userType, setUserType] = useState("STUDENT");

    // 3D Tilt Effect Setup
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const result = await signIn("credentials", {
                email,
                password,
                userType,
                redirect: false,
            });

            if (result?.error) {
                toast.error("Invalid credentials or user type selected");
            } else {
                toast.success("Identity verified! Redirecting...");
                // Force a full check by going to root, middleware will handle the rest
                window.location.href = "/";
            }
        } catch (error) {
            toast.error("Internal connection error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-orange-50/30 selection:bg-orange-500/30">
            {/* Ultra-Vibrant Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.08)_0%,transparent_50%)]" />
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.6, 0.9, 0.6],
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-orange-400/20 rounded-full blur-[150px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{ duration: 15, repeat: Infinity, delay: 2 }}
                    className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-rose-400/20 rounded-full blur-[150px]"
                />
            </div>

            <div className="w-full max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10 py-12">

                {/* Left Side: Dynamic Branding */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-10"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-rose-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-[0_0_40px_rgba(249,115,22,0.4)]">
                            S
                        </div>
                        <span className="text-4xl font-black tracking-tighter text-slate-900">
                            SMMS<span className="text-orange-500">.</span>
                        </span>
                    </div>

                    <h2 className="text-6xl lg:text-7xl font-black text-slate-900 leading-[0.9] tracking-tight">
                        Secure <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">Environment.</span>
                    </h2>

                    <p className="text-slate-600 text-xl font-medium max-w-md leading-relaxed">
                        Precision-engineered platform for academic mentoring and strategic growth management.
                    </p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="relative hidden lg:block"
                    >
                        <div className="rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(249,115,22,0.2)] border border-white bg-white group/img ring-4 ring-white">
                            <Image
                                src="/smms_login_hero.png"
                                alt="Mentoring Illustration"
                                width={800}
                                height={600}
                                priority
                                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover/img:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-transparent pointer-events-none" />
                        </div>
                    </motion.div>

                    <div className="flex items-center gap-6">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-50 bg-white overflow-hidden shadow-sm">
                                    <div className="w-full h-full bg-orange-100 flex items-center justify-center text-[10px] font-bold text-orange-600">U{i}</div>
                                </div>
                            ))}
                        </div>
                        <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                            Join <span className="text-slate-900">500+</span> Active Units
                        </div>
                    </div>
                </motion.div>

                {/* Right Side: 3D Login Terminal */}
                <div
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="relative group h-full flex items-center justify-center"
                    style={{ perspective: "1500px" }}
                >
                    <motion.div
                        style={{ rotateX, rotateY }}
                        className="w-full max-w-md preserve-3d"
                    >
                        <Card className="border-none shadow-[0_40px_80px_-20px_rgba(249,115,22,0.15)] rounded-[3rem] overflow-hidden bg-white/90 backdrop-blur-3xl border border-slate-100 ring-1 ring-slate-100/50">
                            <CardHeader className="pt-12 pb-8 text-center border-b border-slate-100 bg-slate-50/50">
                                <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">Security Terminal</CardTitle>
                                <CardDescription className="text-orange-500 font-bold uppercase tracking-[0.2em] text-[10px] py-2">
                                    Authorization Required
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-10">
                                <Tabs defaultValue="STUDENT" onValueChange={setUserType} className="mb-10">
                                    <TabsList className="grid grid-cols-3 bg-slate-100 p-1.5 rounded-2xl h-14 border border-slate-200">
                                        <TabsTrigger value="STUDENT" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm font-black text-[10px] uppercase tracking-widest transition-all text-slate-500">
                                            Student
                                        </TabsTrigger>
                                        <TabsTrigger value="MENTOR" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm font-black text-[10px] uppercase tracking-widest transition-all text-slate-500">
                                            Mentor
                                        </TabsTrigger>
                                        <TabsTrigger value="ADMIN" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm font-black text-[10px] uppercase tracking-widest transition-all text-slate-500">
                                            Admin
                                        </TabsTrigger>
                                    </TabsList>

                                    <form onSubmit={handleSubmit} className="space-y-8 mt-10">
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Identity Identifier</Label>
                                            <div className="relative group">
                                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                                                <Input
                                                    name="email"
                                                    type="email"
                                                    placeholder="Enter verified email address..."
                                                    className="h-16 pl-14 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all text-sm font-bold text-slate-900 placeholder:text-slate-400"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Secure Passkey</Label>
                                            <div className="relative group">
                                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                                                <Input
                                                    name="password"
                                                    type="password"
                                                    placeholder="Minimum 8 characters required..."
                                                    className="h-16 pl-14 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all text-sm font-bold text-slate-900 placeholder:text-slate-400"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full h-16 rounded-[2rem] bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-black text-sm uppercase tracking-[0.2em] transition-all shadow-[0_20px_40px_rgba(249,115,22,0.3)] group flex items-center justify-center gap-3 active:scale-95 border-none"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <Loader2 className="animate-spin" size={24} />
                                            ) : (
                                                <>
                                                    Verify & Access
                                                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </Tabs>

                                <div className="text-center pt-8">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Online</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>

        </div>
    );
}



