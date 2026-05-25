"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    ClipboardList,
    GraduationCap,
    Calendar,
    Clock,
    ArrowRight,
    UserCheck,
} from "lucide-react";
import Link from "next/link";

export default function MentorDashboard() {
    const { data: session } = useSession();
    const [mentorData, setMentorData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user) {
            fetch("/api/dashboard")
                .then((r) => r.json())
                .then((data) => {
                    setMentorData(data);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [session]);

    const stats = [
        {
            name: "Assigned Students",
            value: mentorData?.totalStudents || 0,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            name: "Total Sessions",
            value: mentorData?.totalMentoringRecords || 0,
            icon: ClipboardList,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        },
        {
            name: "Pending Meetings",
            value: 2,
            icon: Clock,
            color: "text-orange-600",
            bg: "bg-orange-50",
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full subtle-mesh">
                <div className="animate-spin w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen subtle-mesh p-8 relative overflow-hidden">
            {/* Decorative Blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-[30%] h-[30%] bg-amber-400/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-rose-400/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-8 relative z-10 page-transition">
                <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-amber-100 text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 mb-2">
                            <UserCheck size={12} />
                            Mentor Workspace
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                            Welcome, <span className="text-amber-600">{session?.user?.name}</span>
                        </h1>
                        <p className="text-slate-500 mt-1 font-medium italic">
                            Empowering students through consistent guidance
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/mentor/mentoring">
                            <button className="h-12 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 shadow-xl shadow-amber-100 font-bold uppercase tracking-widest text-xs text-white transition-all active:scale-95 flex items-center gap-2">
                                New Session
                                <ArrowRight size={16} />
                            </button>
                        </Link>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat) => (
                        <Card
                            key={stat.name}
                            className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 rounded-[2rem] overflow-hidden group bg-white/80 backdrop-blur-md"
                        >
                            <CardContent className="pt-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`${stat.bg} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500`}>
                                        <stat.icon size={24} className={stat.color} />
                                    </div>
                                    <Badge variant="outline" className="text-[10px] font-bold border-slate-100 px-3">Live Stats</Badge>
                                </div>
                                <div className="text-4xl font-black text-slate-900">{stat.value}</div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                                    {stat.name}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* My Students */}
                    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white/80 backdrop-blur-xl h-full">
                        <CardHeader className="border-b border-slate-50 pb-6">
                            <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-3">
                                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                                    <GraduationCap size={20} />
                                </div>
                                My Students
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                {mentorData?.recentAssignments?.slice(0, 3).map((a: any) => (
                                    <div key={a.StudentMentorID} className="flex items-center justify-between p-4 rounded-3xl bg-slate-50/50 hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-slate-100 group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center text-amber-700 font-black text-lg">
                                                {a.Student?.StudentName?.[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{a.Student?.StudentName}</div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{a.Student?.EnrollmentNo}</div>
                                            </div>
                                        </div>
                                        <Link href={`/mentor/students/${a.Student?.StudentID}`}>
                                            <button className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-amber-600 hover:text-white transition-all">
                                                <ArrowRight size={18} />
                                            </button>
                                        </Link>
                                    </div>
                                ))}
                                <Link href="/mentor/students" className="block text-center pt-4 text-sm font-bold text-amber-600 hover:underline uppercase tracking-widest">
                                    View All Students
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upcoming Sessions */}
                    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white/80 backdrop-blur-xl h-full">
                        <CardHeader className="border-b border-slate-50 pb-6">
                            <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                                    <Calendar size={20} />
                                </div>
                                Upcoming Sessions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <div className="p-5 rounded-3xl bg-amber-50/50 border border-amber-100 hover:shadow-md transition-all duration-300">
                                    <div className="flex items-center justify-between mb-3">
                                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none rounded-full px-4 font-bold text-[10px] uppercase tracking-widest">Tomorrow</Badge>
                                        <span className="text-xs font-bold text-amber-600">10:30 AM</span>
                                    </div>
                                    <div className="font-bold text-slate-900">Follow-up with Ravi Kumar</div>
                                    <div className="text-xs text-slate-500 mt-1 italic font-medium">Agenda: Academic progress review</div>
                                </div>
                                <div className="p-5 rounded-3xl bg-slate-50/80 border border-slate-100 hover:shadow-md transition-all duration-300">
                                    <div className="flex items-center justify-between mb-3">
                                        <Badge variant="outline" className="border-slate-200 text-slate-500 rounded-full px-4 font-bold text-[10px] uppercase tracking-widest">Friday, 07 Mar</Badge>
                                        <span className="text-xs font-bold text-slate-400">02:00 PM</span>
                                    </div>
                                    <div className="font-bold text-slate-900">Orientation for Priya Singh</div>
                                    <div className="text-xs text-slate-500 mt-1 italic font-medium">Agenda: Mentor-student introduction</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
