"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Mail, Phone, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function MentorStudentsPage() {
    const { data: session } = useSession();
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const mentorId = (session?.user as any)?.id;

    useEffect(() => {
        if (!mentorId) return;
        fetch(`/api/assignments?staffId=${mentorId}`)
            .then((r) => r.json())
            .then((data) => { setAssignments(data); setLoading(false); });
    }, [mentorId]);

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
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                            My <span className="text-amber-600">Students</span>
                        </h1>
                        <p className="text-slate-500 mt-1 font-medium italic">
                            Students assigned to you for mentoring
                        </p>
                    </div>
                </header>

                {assignments.length === 0 ? (
                    <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white/90 backdrop-blur-xl overflow-hidden">
                        <CardContent className="text-center py-20">
                            <GraduationCap size={48} className="mx-auto mb-4 text-amber-300 opacity-50" />
                            <p className="font-black uppercase tracking-[0.2em] text-xs text-slate-400">No students assigned to you yet.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {assignments.map((a: any) => (
                            <Card key={a.StudentMentorID} className="border-none shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-300 rounded-[2.5rem] bg-white/90 backdrop-blur-xl group overflow-hidden">
                                <CardHeader className="p-6 pb-4 border-b border-slate-50">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center text-amber-700 font-black text-xl shadow-sm group-hover:scale-110 transition-transform">
                                                {a.Student?.StudentName?.[0] || "S"}
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg font-bold text-slate-900 leading-tight group-hover:text-amber-600 transition-colors">
                                                    {a.Student?.StudentName}
                                                </CardTitle>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                    {a.Student?.EnrollmentNo}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-3 text-sm text-slate-600 font-medium bg-slate-50 px-4 py-2 rounded-xl">
                                            <Mail size={16} className="text-amber-500" />
                                            <span className="truncate">{a.Student?.EmailAddress}</span>
                                        </div>
                                        {a.Student?.MobileNo && (
                                            <div className="flex items-center gap-3 text-sm text-slate-600 font-medium bg-slate-50 px-4 py-2 rounded-xl">
                                                <Phone size={16} className="text-amber-500" />
                                                <span>{a.Student?.MobileNo}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between mt-auto">
                                        <div>
                                            <Badge variant="secondary" className="px-3 py-1 rounded-lg border-none text-[10px] font-bold uppercase tracking-widest bg-amber-50 text-amber-700">
                                                {a.MentoringLogs?.length || 0} Sessions
                                            </Badge>
                                        </div>
                                        <Link href={`/mentor/students/${a.Student?.StudentID}`}>
                                            <Button variant="ghost" className="h-10 px-4 bg-slate-900 hover:bg-amber-600 text-white hover:text-white rounded-xl font-bold text-xs shadow-lg transition-all group-hover:px-6">
                                                PROFILE
                                                <ArrowUpRight size={14} className="ml-1 opacity-50 group-hover:opacity-100" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
