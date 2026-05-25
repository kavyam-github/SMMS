"use client";

import { useEffect, useState, use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    ArrowLeft, User, Mail, Phone, Calendar, ClipboardList, BookOpen, Clock,
} from "lucide-react";
import Link from "next/link";
import { Student, StudentMentor } from "@/types";

export default function StudentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/students/${id}`)
            .then((r) => r.json())
            .then((data) => {
                setStudent(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full subtle-mesh">
                <div className="animate-spin w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full" />
            </div>
        );
    }

    if (!student) {
        return (
            <div className="min-h-screen subtle-mesh p-8 flex flex-col items-center justify-center">
                <h2 className="text-xl font-black text-slate-900">Student not found</h2>
                <Link href="/mentor/students">
                    <Button variant="link" className="mt-4 text-amber-600 font-bold">Back to Student List</Button>
                </Link>
            </div>
        );
    }

    const mentorship = student.Mentorships?.[0];
    const sessions = mentorship?.MentoringLogs || [];

    return (
        <div className="min-h-screen subtle-mesh p-8 relative overflow-hidden">
            {/* Decorative Blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-[30%] h-[30%] bg-amber-400/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-rose-400/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-8 relative z-10 page-transition">
                <Link href="/mentor/students" className="flex items-center gap-2 text-slate-500 hover:text-amber-600 transition-colors group w-fit">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold uppercase tracking-widest">Back to My Students</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Profile Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white/90 backdrop-blur-xl overflow-hidden">
                            <div className="bg-gradient-to-br from-amber-500 to-orange-600 h-32 flex items-end justify-center pb-4 relative">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.15)_0%,transparent_70%)]" />
                                <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-xl flex items-center justify-center text-amber-700 text-3xl font-black translate-y-8">
                                    {student.StudentName[0]}
                                </div>
                            </div>
                            <CardContent className="pt-14 pb-8 text-center">
                                <h2 className="text-2xl font-black text-slate-900">{student.StudentName}</h2>
                                <Badge variant="secondary" className="mt-2 text-xs font-mono bg-amber-50 text-amber-700 px-3 py-1 rounded-full border-none pointer-events-none">{student.EnrollmentNo}</Badge>
                                <p className="text-slate-500 mt-4 text-sm px-4 font-medium italic">{student.Description || "No description provided."}</p>
                            </CardContent>
                            <div className="border-t border-slate-50 p-6 space-y-4">
                                <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                                        <Mail size={16} />
                                    </div>
                                    <div className="flex-1 text-sm font-bold text-slate-900 truncate">{student.EmailAddress}</div>
                                </div>
                                <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                        <Phone size={16} />
                                    </div>
                                    <div className="flex-1 text-sm font-bold text-slate-900">{student.MobileNo || "—"}</div>
                                </div>
                                <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                        <Calendar size={16} />
                                    </div>
                                    <div className="flex-1 text-sm font-bold text-slate-900">Joined {new Date(student.Created).toLocaleDateString()}</div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right: Stats & Session History */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 rounded-[2rem] overflow-hidden group bg-white/80 backdrop-blur-md">
                                <CardContent className="pt-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="bg-blue-50 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                                            <ClipboardList size={22} className="text-blue-600" />
                                        </div>
                                        <div className="text-blue-500 text-[10px] font-black uppercase tracking-widest">Sessions</div>
                                    </div>
                                    <div className="text-4xl font-black text-slate-900">{sessions.length}</div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Total Mentoring</div>
                                </CardContent>
                            </Card>
                            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 rounded-[2rem] overflow-hidden group bg-white/80 backdrop-blur-md">
                                <CardContent className="pt-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="bg-emerald-50 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                                            <Clock size={22} className="text-emerald-600" />
                                        </div>
                                        <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Last Visit</div>
                                    </div>
                                    <div className="text-xl font-black text-slate-900">
                                        {sessions[0] ? new Date(sessions[0].DateOfMentoring).toLocaleDateString() : "Never"}
                                    </div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Last Session</div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white/90 backdrop-blur-xl overflow-hidden">
                            <CardHeader className="border-b border-slate-50 p-8">
                                <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                                        <BookOpen size={20} />
                                    </div>
                                    Session History
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent border-slate-50">
                                            <TableHead className="px-8 h-20 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Status</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Issues</TableHead>
                                            <TableHead className="px-8 h-20 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Parent</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sessions.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center py-20 text-slate-400">
                                                    <BookOpen size={48} className="mx-auto mb-4 opacity-10" />
                                                    <p className="font-black uppercase tracking-[0.2em] text-xs">No sessions recorded yet</p>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            sessions.map((s: any) => (
                                                <TableRow key={s.StudentMentoringID} className="group hover:bg-slate-50/50 transition-colors border-slate-50">
                                                    <TableCell className="px-8 py-6">
                                                        <div className="font-bold text-slate-900">{new Date(s.DateOfMentoring).toLocaleDateString()}</div>
                                                        {s.NextMentoringDate && (
                                                            <div className="text-[10px] text-amber-600 font-bold mt-1 uppercase tracking-widest">Next: {new Date(s.NextMentoringDate).toLocaleDateString()}</div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge
                                                            variant={s.AttendanceStatus === "Present" ? "default" : "destructive"}
                                                            className="px-4 py-1.5 rounded-full border-none font-bold text-[10px] uppercase tracking-widest"
                                                        >
                                                            {s.AttendanceStatus}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="max-w-[200px]">
                                                        <div className="text-sm text-slate-600 truncate font-medium">{s.IssuesDiscussed || "—"}</div>
                                                    </TableCell>
                                                    <TableCell className="text-center px-8">
                                                        <Badge
                                                            variant={s.IsParentPresent ? "default" : "secondary"}
                                                            className="px-4 py-1.5 rounded-full border-none font-bold text-[10px] uppercase tracking-widest"
                                                        >
                                                            {s.IsParentPresent ? "Present" : "Absent"}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
