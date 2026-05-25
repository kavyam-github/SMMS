"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ClipboardList, Download, FileText, Filter, ArrowUpRight } from "lucide-react";
import { StudentMentoring } from "@/types";

export default function ReportsPage() {
    const [records, setRecords] = useState<StudentMentoring[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        status: "All",
    });

    useEffect(() => {
        fetch("/api/mentoring")
            .then((r) => r.json())
            .then((data) => {
                setRecords(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filteredRecords = records.filter((r) => {
        const date = new Date(r.DateOfMentoring);
        const start = filters.startDate ? new Date(filters.startDate) : null;
        const end = filters.endDate ? new Date(filters.endDate) : null;

        if (start && date < start) return false;
        if (end && date > end) return false;
        if (filters.status !== "All" && r.AttendanceStatus !== filters.status) return false;
        return true;
    });

    const handleExport = () => {
        const headers = ["Date", "Student", "Mentor", "Attendance", "Issues"];
        const rows = filteredRecords.map((r) => [
            new Date(r.DateOfMentoring).toLocaleDateString(),
            r.StudentMentor?.Student?.StudentName || "",
            r.StudentMentor?.Staff?.StaffName || "",
            r.AttendanceStatus,
            (r.IssuesDiscussed || "").replace(/,/g, ";"),
        ]);

        const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Mentoring_Report_${new Date().toLocaleDateString()}.csv`;
        a.click();
    };

    return (
        <div className="min-h-screen subtle-mesh p-8 relative overflow-hidden">
            {/* Decorative Blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-[30%] h-[30%] bg-amber-400/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-rose-400/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-8 relative z-10 page-transition">
                <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                            Report <span className="text-amber-600">Center</span>
                        </h1>
                        <p className="text-slate-500 mt-1 font-medium italic">
                            Generate and export mentoring reports
                        </p>
                    </div>
                    <Button onClick={handleExport} className="h-12 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 shadow-xl shadow-amber-100 font-bold uppercase tracking-widest text-xs">
                        <Download size={16} className="mr-2" />
                        Export to CSV
                    </Button>
                </header>

                {/* Filters */}
                <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white/80 backdrop-blur-xl">
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Start Date</Label>
                                <Input
                                    type="date"
                                    value={filters.startDate}
                                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                    className="h-12 rounded-xl bg-white border border-slate-200 focus:border-amber-500 shadow-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">End Date</Label>
                                <Input
                                    type="date"
                                    value={filters.endDate}
                                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                                    className="h-12 rounded-xl bg-white border border-slate-200 focus:border-amber-500 shadow-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Attendance</Label>
                                <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
                                    <SelectTrigger className="h-12 rounded-xl bg-white border border-slate-200 shadow-sm focus:ring-amber-500"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-xl border-slate-200 shadow-lg bg-white">
                                        <SelectItem value="All">All Statuses</SelectItem>
                                        <SelectItem value="Present">Present Only</SelectItem>
                                        <SelectItem value="Absent">Absent Only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button variant="outline" className="h-12 rounded-2xl border-slate-100 px-6 font-bold text-slate-400 uppercase tracking-widest text-xs hover:bg-white hover:text-amber-600 transition-all" onClick={() => setFilters({ startDate: "", endDate: "", status: "All" })}>
                                <Filter size={16} className="mr-2" />
                                Reset Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 rounded-[2rem] overflow-hidden group bg-white/80 backdrop-blur-md">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">
                                Filtered Sessions
                            </CardTitle>
                            <div className="bg-blue-50 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                                <ClipboardList size={20} className="text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-slate-900">{filteredRecords.length}</div>
                            <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-tight">
                                <ArrowUpRight size={12} />
                                <span>Total records</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 rounded-[2rem] overflow-hidden group bg-white/80 backdrop-blur-md">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">
                                Present Count
                            </CardTitle>
                            <div className="bg-emerald-50 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                                <ClipboardList size={20} className="text-emerald-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-emerald-600">
                                {filteredRecords.filter(r => r.AttendanceStatus === "Present").length}
                            </div>
                            <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-tight">
                                <ArrowUpRight size={12} />
                                <span>Attended</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 rounded-[2rem] overflow-hidden group bg-white/80 backdrop-blur-md">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">
                                Absent Count
                            </CardTitle>
                            <div className="bg-red-50 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                                <ClipboardList size={20} className="text-red-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-red-600">
                                {filteredRecords.filter(r => r.AttendanceStatus === "Absent").length}
                            </div>
                            <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-red-500 uppercase tracking-tight">
                                <ArrowUpRight size={12} />
                                <span>Missed</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Table */}
                <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white/90 backdrop-blur-xl overflow-hidden">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-slate-50">
                                    <TableHead className="px-8 h-20 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Student</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Mentor</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Attendance</TableHead>
                                    <TableHead className="px-8 h-20 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Issues</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-20">
                                            <div className="animate-spin w-8 h-8 border-4 border-amber-100 border-t-amber-600 rounded-full mx-auto" />
                                        </TableCell>
                                    </TableRow>
                                ) : filteredRecords.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-20 text-slate-400">
                                            <FileText size={48} className="mx-auto mb-4 opacity-10" />
                                            <p className="font-black uppercase tracking-[0.2em] text-xs">No records match your filters</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredRecords.map((r) => (
                                        <TableRow key={r.StudentMentoringID} className="group hover:bg-slate-50/50 transition-colors border-slate-50">
                                            <TableCell className="px-8 py-6 font-bold text-slate-900">{new Date(r.DateOfMentoring).toLocaleDateString()}</TableCell>
                                            <TableCell className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{r.StudentMentor?.Student?.StudentName}</TableCell>
                                            <TableCell className="font-medium text-slate-600">{r.StudentMentor?.Staff?.StaffName}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant={r.AttendanceStatus === "Present" ? "default" : "destructive"}
                                                    className="px-4 py-1.5 rounded-full border-none font-bold text-[10px] uppercase tracking-widest"
                                                >
                                                    {r.AttendanceStatus}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-8 max-w-xs">
                                                <div className="text-slate-500 text-sm truncate">{r.IssuesDiscussed || "—"}</div>
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
