"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle, Mail, Phone, Calendar, MessageSquare } from "lucide-react";

export default function StudentMentorPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/student/me")
            .then((r) => r.json())
            .then((d) => { setData(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full subtle-mesh">
                <div className="animate-spin w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full" />
            </div>
        );
    }

    const mentorship = data?.Mentorships?.[0];
    const mentor = mentorship?.Staff;

    return (
        <div className="min-h-screen subtle-mesh p-8 relative overflow-hidden">
            {/* Decorative Blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-[30%] h-[30%] bg-amber-400/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-rose-400/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-8 relative z-10 page-transition">
                <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                            My <span className="text-amber-600">Mentor</span>
                        </h1>
                        <p className="text-slate-500 mt-1 font-medium italic">
                            Your assigned mentor information
                        </p>
                    </div>
                </header>

                {!mentor ? (
                    <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white/90 backdrop-blur-xl overflow-hidden">
                        <CardContent className="text-center py-20">
                            <UserCircle size={48} className="mx-auto mb-4 text-slate-300 opacity-50" />
                            <p className="font-black uppercase tracking-[0.2em] text-xs text-slate-400">No Mentor Assigned</p>
                            <p className="text-slate-400 text-sm mt-2 font-medium">Please contact the administration.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Mentor Profile Card */}
                        <Card className="border-none shadow-xl shadow-amber-100/50 rounded-[2.5rem] bg-gradient-to-br from-amber-600 to-orange-700 text-white overflow-hidden relative">
                            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                            <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-xl" />
                            <CardContent className="pt-10 pb-10">
                                <div className="flex items-center gap-5 mb-8">
                                    <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-black text-3xl border border-white/10 shadow-lg">
                                        {mentor.StaffName?.[0] || "M"}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold uppercase tracking-widest text-amber-100 mb-1">Your Assigned Mentor</div>
                                        <div className="text-3xl font-black">{mentor.StaffName}</div>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 text-xs font-bold w-fit">
                                    <MessageSquare size={14} />
                                    Contact Mentor
                                </div>
                            </CardContent>
                        </Card>

                        {/* Mentor Details Card */}
                        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white/80 backdrop-blur-xl">
                            <CardHeader className="border-b border-slate-50 pb-6">
                                <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                                        <UserCircle size={20} />
                                    </div>
                                    Contact Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-5">
                                <div className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50/50 border border-transparent hover:bg-white hover:shadow-md hover:border-slate-100 transition-all duration-300">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                                        <Mail size={18} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</div>
                                        <div className="font-bold text-slate-900">{mentor.EmailAddress}</div>
                                    </div>
                                </div>
                                {mentor.MobileNo && (
                                    <div className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50/50 border border-transparent hover:bg-white hover:shadow-md hover:border-slate-100 transition-all duration-300">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                            <Phone size={18} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mobile</div>
                                            <div className="font-bold text-slate-900">{mentor.MobileNo}</div>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50/50 border border-transparent hover:bg-white hover:shadow-md hover:border-slate-100 transition-all duration-300">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assigned Since</div>
                                        <div className="font-bold text-slate-900">{new Date(mentorship.FromDate).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                {mentorship.ToDate && (
                                    <div className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50/50 border border-transparent hover:bg-white hover:shadow-md hover:border-slate-100 transition-all duration-300">
                                        <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                                            <Calendar size={18} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Until</div>
                                            <div className="font-bold text-slate-900">{new Date(mentorship.ToDate).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
