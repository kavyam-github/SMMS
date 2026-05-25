"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Search, ClipboardList, Filter } from "lucide-react";

export default function AdminRecordsPage() {
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch("/api/mentoring")
            .then((r) => r.json())
            .then((data) => { setRecords(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const filtered = records.filter(
        (r) =>
            r.StudentMentor?.Student?.StudentName?.toLowerCase().includes(search.toLowerCase()) ||
            r.StudentMentor?.Staff?.StaffName?.toLowerCase().includes(search.toLowerCase()) ||
            r.AttendanceStatus?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen subtle-mesh p-8 relative overflow-hidden">
            {/* Decorative Blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-[30%] h-[30%] bg-amber-400/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-rose-400/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-8 relative z-10 page-transition">
                <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                            Mentoring <span className="text-amber-600">Records</span>
                        </h1>
                        <p className="text-slate-500 mt-1 font-medium italic">
                            View all mentoring sessions across the system
                        </p>
                    </div>
                </header>

                <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors" size={18} />
                        <Input
                            placeholder="Filter by student, mentor, or status..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-12 pl-12 rounded-2xl border-slate-100 bg-white/50 focus:bg-white shadow-inner transition-all font-medium text-sm"
                        />
                    </div>
                    <Button variant="outline" className="h-12 rounded-2xl border-slate-100 px-6 font-bold text-slate-400 uppercase tracking-widest text-xs hover:bg-white hover:text-amber-600 transition-all">
                        <Filter size={16} className="mr-2" />
                        Filters
                    </Button>
                </div>

                <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white/90 backdrop-blur-xl overflow-hidden">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-slate-50">
                                    <TableHead className="px-8 h-20 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Student</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Mentor</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Attendance</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Issues Discussed</TableHead>
                                    <TableHead className="px-8 h-20 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Parent Present</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-20">
                                            <div className="animate-spin w-8 h-8 border-4 border-amber-100 border-t-amber-600 rounded-full mx-auto" />
                                        </TableCell>
                                    </TableRow>
                                ) : filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-20 text-slate-400">
                                            <ClipboardList size={48} className="mx-auto mb-4 opacity-10" />
                                            <p className="font-black uppercase tracking-[0.2em] text-xs">No mentoring records found</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filtered.map((r) => (
                                        <TableRow key={r.StudentMentoringID} className="group hover:bg-slate-50/50 transition-colors border-slate-50">
                                            <TableCell className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all shadow-sm bg-purple-50 text-purple-700">
                                                        {r.StudentMentor?.Student?.StudentName?.[0] || "S"}
                                                    </div>
                                                    <div className="font-bold text-slate-900 leading-none group-hover:text-amber-600 transition-colors">
                                                        {r.StudentMentor?.Student?.StudentName}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium text-slate-600">{r.StudentMentor?.Staff?.StaffName}</TableCell>
                                            <TableCell className="font-medium text-slate-600">{new Date(r.DateOfMentoring).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant={r.AttendanceStatus === "Present" ? "default" : "destructive"}
                                                    className="px-4 py-1.5 rounded-full border-none font-bold text-[10px] uppercase tracking-widest"
                                                >
                                                    {r.AttendanceStatus}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-slate-500 max-w-xs truncate">{r.IssuesDiscussed || "—"}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant={r.IsParentPresent ? "default" : "secondary"}
                                                    className="px-4 py-1.5 rounded-full border-none font-bold text-[10px] uppercase tracking-widest"
                                                >
                                                    {r.IsParentPresent ? "Yes" : "No"}
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
