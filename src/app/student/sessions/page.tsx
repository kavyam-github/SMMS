"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { BookOpen } from "lucide-react";

export default function StudentSessionsPage() {
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

    const sessions = data?.Mentorships?.[0]?.MentoringLogs || [];

    return (
        <div className="min-h-screen subtle-mesh p-8 relative overflow-hidden">
            {/* Decorative Blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-[30%] h-[30%] bg-amber-400/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-rose-400/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-8 relative z-10 page-transition">
                <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                            Session <span className="text-amber-600">History</span>
                        </h1>
                        <p className="text-slate-500 mt-1 font-medium italic">
                            Complete history of your mentoring sessions
                        </p>
                    </div>
                </header>

                <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white/90 backdrop-blur-xl overflow-hidden">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-slate-50">
                                    <TableHead className="px-8 h-20 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Attendance</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Agenda</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Issues Discussed</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Next Date</TableHead>
                                    <TableHead className="px-8 h-20 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Parent Present</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sessions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-20 text-slate-400">
                                            <BookOpen size={48} className="mx-auto mb-4 opacity-10" />
                                            <p className="font-black uppercase tracking-[0.2em] text-xs">No sessions recorded yet</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    sessions.map((s: any) => (
                                        <TableRow key={s.StudentMentoringID} className="group hover:bg-slate-50/50 transition-colors border-slate-50">
                                            <TableCell className="px-8 py-6 font-bold text-slate-900">{new Date(s.DateOfMentoring).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant={s.AttendanceStatus === "Present" ? "default" : "destructive"}
                                                    className="px-4 py-1.5 rounded-full border-none font-bold text-[10px] uppercase tracking-widest"
                                                >
                                                    {s.AttendanceStatus}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-slate-500 max-w-xs truncate">{s.MentoringMeetingAgenda || "—"}</TableCell>
                                            <TableCell className="text-slate-500 max-w-xs truncate">{s.IssuesDiscussed || "—"}</TableCell>
                                            <TableCell className="font-medium text-slate-600">{s.NextMentoringDate ? new Date(s.NextMentoringDate).toLocaleDateString() : "—"}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant={s.IsParentPresent ? "default" : "secondary"}
                                                    className="px-4 py-1.5 rounded-full border-none font-bold text-[10px] uppercase tracking-widest"
                                                >
                                                    {s.IsParentPresent ? "Yes" : "No"}
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
    );
}
