"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    GraduationCap,
    Link as LinkIcon,
    ClipboardList,
    ArrowUpRight,
    Calendar,
} from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/dashboard")
            .then((r) => r.json())
            .then((data) => {
                setStats(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const statCards = [
        {
            name: "Total Staff",
            value: stats?.totalStaff || 0,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            name: "Total Students",
            value: stats?.totalStudents || 0,
            icon: GraduationCap,
            color: "text-purple-600",
            bg: "bg-purple-50",
        },
        {
            name: "Mentor Assignments",
            value: stats?.totalAssignments || 0,
            icon: LinkIcon,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        },
        {
            name: "Mentoring Records",
            value: stats?.totalMentoringRecords || 0,
            icon: ClipboardList,
            color: "text-orange-600",
            bg: "bg-orange-50",
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full subtle-mesh">
                <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
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
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                            Admin <span className="text-amber-600">Overview</span>
                        </h1>
                        <p className="text-slate-500 mt-1 font-medium italic">
                            Monitoring system health and academic progress
                        </p>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <Calendar size={18} className="text-amber-500" />
                        <span className="text-sm font-bold text-slate-600">
                            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat) => (
                        <Card
                            key={stat.name}
                            className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 rounded-[2rem] overflow-hidden group bg-white/80 backdrop-blur-md"
                        >
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">
                                    {stat.name}
                                </CardTitle>
                                <div className={`${stat.bg} p-3 rounded-2xl group-hover:scale-110 transition-transform duration-500`}>
                                    <stat.icon size={20} className={stat.color} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black text-slate-900">
                                    {stat.value}
                                </div>
                                <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-tight">
                                    <ArrowUpRight size={12} />
                                    <span>+0.0% growth</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Assignments */}
                    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white/80 backdrop-blur-xl">
                        <CardHeader className="border-b border-slate-50 pb-6">
                            <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                    <LinkIcon size={20} />
                                </div>
                                Recent Assignments
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {stats?.recentAssignments?.length > 0 ? (
                                <div className="space-y-4">
                                    {stats.recentAssignments.map((a: any) => (
                                        <div
                                            key={a.StudentMentorID}
                                            className="flex items-center justify-between p-4 rounded-3xl bg-slate-50/50 hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-slate-100 group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-blue-700 font-black text-lg">
                                                    {a.Student?.StudentName?.[0] || "S"}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                        {a.Student?.StudentName}
                                                    </div>
                                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                                        Mentor: {a.Staff?.StaffName}
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge variant="secondary" className="rounded-full px-4 border-none bg-blue-50 text-blue-700 font-bold text-[10px] uppercase">
                                                {new Date(a.FromDate).toLocaleDateString()}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center space-y-4">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                                        <LinkIcon className="text-slate-200" size={32} />
                                    </div>
                                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
                                        No recent assignments
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Mentoring */}
                    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white/80 backdrop-blur-xl">
                        <CardHeader className="border-b border-slate-50 pb-6">
                            <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                    <ClipboardList size={20} />
                                </div>
                                Recent Sessions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {stats?.recentMentoring?.length > 0 ? (
                                <div className="space-y-4">
                                    {stats.recentMentoring.map((r: any) => (
                                        <div
                                            key={r.StudentMentoringID}
                                            className="flex items-center justify-between p-4 rounded-3xl bg-slate-50/50 hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-slate-100 group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center text-emerald-700 font-black text-lg">
                                                    {r.StudentMentor?.Student?.StudentName?.[0] || "S"}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                                                        {r.StudentMentor?.Student?.StudentName}
                                                    </div>
                                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                                        By {r.StudentMentor?.Staff?.StaffName}
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge
                                                variant={r.AttendanceStatus === "Present" ? "default" : "destructive"}
                                                className="rounded-full px-4 border-none font-bold text-[10px] uppercase tracking-widest"
                                            >
                                                {r.AttendanceStatus}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center space-y-4">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                                        <ClipboardList className="text-slate-200" size={32} />
                                    </div>
                                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
                                        No sessions recorded
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
