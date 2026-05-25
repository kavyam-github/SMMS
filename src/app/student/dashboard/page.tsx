"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    UserCircle,
    ClipboardList,
    CheckCircle2,
    AlertCircle,
    Calendar,
    MessageSquare,
    ArrowUpRight,
} from "lucide-react";

export default function StudentDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/student/me")
            .then((r) => r.json())
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full subtle-mesh">
                <div className="animate-spin w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full" />
            </div>
        );
    }

    const attendanceRate = data?.sessions?.length
        ? Math.round((data.sessions.filter((s: any) => s.AttendanceStatus === "Present").length / data.sessions.length) * 100)
        : 0;

    return (
        <div className="min-h-screen subtle-mesh p-8 relative overflow-hidden">
            {/* Decorative Blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-[30%] h-[30%] bg-amber-400/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-rose-400/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-8 relative z-10 page-transition">
                <header>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-amber-100 text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 mb-2">
                        <CheckCircle2 size={12} />
                        Student Portal
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        Hi, <span className="text-amber-600">{data?.student?.StudentName}</span>
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium italic">
                        "Education is the most powerful weapon which you can use to change the world."
                    </p>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-none shadow-xl shadow-amber-100/50 rounded-[2.5rem] bg-gradient-to-br from-amber-600 to-orange-700 text-white overflow-hidden relative">
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                        <CardContent className="pt-8">
                            <div className="text-sm font-bold uppercase tracking-widest text-amber-100 mb-2">My Mentor</div>
                            <div className="text-2xl font-black">{data?.mentor?.StaffName || "Not Assigned"}</div>
                            <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 text-xs font-bold w-fit">
                                <MessageSquare size={14} />
                                Contact Mentor
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 rounded-[2.5rem] bg-white/80 backdrop-blur-xl group">
                        <CardContent className="pt-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform duration-500">
                                    <ClipboardList size={22} />
                                </div>
                                <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Attendance</div>
                            </div>
                            <div className="text-4xl font-black text-slate-900">{attendanceRate}%</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Average Rate</div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 rounded-[2.5rem] bg-white/80 backdrop-blur-xl group">
                        <CardContent className="pt-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform duration-500">
                                    <Calendar size={22} />
                                </div>
                                <div className="text-purple-500 text-[10px] font-black uppercase tracking-widest">Sessions</div>
                            </div>
                            <div className="text-4xl font-black text-slate-900">{data?.sessions?.length || 0}</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Total Logs</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Sessions */}
                <div className="grid grid-cols-1 gap-8">
                    <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white/90 backdrop-blur-xl overflow-hidden">
                        <CardHeader className="border-b border-slate-50 p-8">
                            <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-3">
                                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                                    <AlertCircle size={20} />
                                </div>
                                Recent Sessions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-50">
                                {data?.sessions?.length > 0 ? (
                                    data.sessions.slice(0, 5).map((s: any) => (
                                        <div key={s.StudentMentoringID} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 group-hover:scale-110 transition-transform duration-500">
                                                    <Calendar size={18} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 leading-tight">
                                                        {new Date(s.DateOfMentoring).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </div>
                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                                        Status: {s.AttendanceStatus}
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge
                                                variant={s.AttendanceStatus === "Present" ? "default" : "destructive"}
                                                className="rounded-full px-4 border-none text-[10px] font-bold uppercase tracking-widest"
                                            >
                                                View Details
                                            </Badge>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">
                                        No session history available
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
