"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Trash2, Search, Link as LinkIcon, Filter } from "lucide-react";

export default function AssignmentsPage() {
    const [assignments, setAssignments] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [staff, setStaff] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [form, setForm] = useState({
        StudentID: "",
        StaffID: "",
        FromDate: "",
        ToDate: "",
        Description: "",
    });

    const fetchData = async () => {
        const [aRes, sRes, stRes] = await Promise.all([
            fetch("/api/assignments"),
            fetch("/api/students"),
            fetch("/api/staff"),
        ]);
        setAssignments(await aRes.json());
        setStudents(await sRes.json());
        setStaff(await stRes.json());
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const mentors = staff.filter((s) => s.Role === "MENTOR");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/assignments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        if (res.ok) {
            toast.success("Mentor assigned to student successfully");
            setDialogOpen(false);
            setForm({ StudentID: "", StaffID: "", FromDate: "", ToDate: "", Description: "" });
            fetchData();
        } else {
            const err = await res.json();
            toast.error(err.error || "Failed to create assignment");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Remove this mentor-student assignment?")) return;
        const res = await fetch(`/api/assignments/${id}`, { method: "DELETE" });
        if (res.ok) {
            toast.success("Assignment removed");
            fetchData();
        } else {
            toast.error("Failed to remove assignment");
        }
    };

    const filtered = assignments.filter(
        (a) =>
            a.Student?.StudentName.toLowerCase().includes(search.toLowerCase()) ||
            a.Staff?.StaffName.toLowerCase().includes(search.toLowerCase())
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
                            Mentor <span className="text-amber-600">Assignments</span>
                        </h1>
                        <p className="text-slate-500 mt-1 font-medium italic">
                            Assign and manage mentor-student relationships
                        </p>
                    </div>

                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-12 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 shadow-xl shadow-amber-100 font-bold uppercase tracking-widest text-xs">
                                <Plus size={16} className="mr-2" />
                                New Assignment
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xl bg-white border border-slate-200 shadow-2xl p-8 rounded-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black text-slate-900">Assign Mentor</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Select Student *</Label>
                                    <Select value={form.StudentID} onValueChange={(v) => setForm({ ...form, StudentID: v })}>
                                        <SelectTrigger className="h-12 rounded-xl bg-white border border-slate-200 focus:border-amber-500 shadow-sm"><SelectValue placeholder="Choose a student" /></SelectTrigger>
                                        <SelectContent className="rounded-xl border-slate-200 shadow-lg bg-white">
                                            {students.map((s) => (
                                                <SelectItem key={s.StudentID} value={s.StudentID.toString()}>
                                                    {s.StudentName} ({s.EnrollmentNo})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Select Mentor *</Label>
                                    <Select value={form.StaffID} onValueChange={(v) => setForm({ ...form, StaffID: v })}>
                                        <SelectTrigger className="h-12 rounded-xl bg-white border border-slate-200 focus:border-amber-500 shadow-sm"><SelectValue placeholder="Choose a mentor" /></SelectTrigger>
                                        <SelectContent className="rounded-xl border-slate-200 shadow-lg bg-white">
                                            {mentors.map((m) => (
                                                <SelectItem key={m.StaffID} value={m.StaffID.toString()}>
                                                    {m.StaffName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">From Date *</Label>
                                        <Input type="date" value={form.FromDate} onChange={(e) => setForm({ ...form, FromDate: e.target.value })} className="h-12 rounded-xl bg-white border border-slate-200 focus:border-amber-500 shadow-sm" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">To Date</Label>
                                        <Input type="date" value={form.ToDate} onChange={(e) => setForm({ ...form, ToDate: e.target.value })} className="h-12 rounded-xl bg-white border border-slate-200 focus:border-amber-500 shadow-sm" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Description / Notes</Label>
                                    <Textarea value={form.Description} onChange={(e) => setForm({ ...form, Description: e.target.value })} placeholder="Add relevant notes here" className="rounded-xl bg-white border border-slate-200 focus:border-amber-500 shadow-sm min-h-[100px] p-4" rows={3} />
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6 pt-6">
                                    <Button type="button" variant="outline" className="rounded-xl h-12 px-6 font-bold uppercase tracking-widest text-xs border-slate-200" onClick={() => setDialogOpen(false)}>
                                        Discard
                                    </Button>
                                    <Button type="submit" className="rounded-xl h-12 px-8 bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase tracking-widest text-xs shadow-xl shadow-amber-100 border-none m-0">
                                        Confirm Assignment
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </header>

                <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors" size={18} />
                        <Input
                            placeholder="Filter by student or mentor name..."
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
                                    <TableHead className="px-8 h-20 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Student Info</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Mentor</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Duration</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Sessions Logged</TableHead>
                                    <TableHead className="px-8 h-20 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-20">
                                            <div className="animate-spin w-8 h-8 border-4 border-amber-100 border-t-amber-600 rounded-full mx-auto" />
                                        </TableCell>
                                    </TableRow>
                                ) : filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-20 text-slate-400">
                                            <LinkIcon size={48} className="mx-auto mb-4 opacity-10" />
                                            <p className="font-black uppercase tracking-[0.2em] text-xs">No assignments found</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filtered.map((a) => (
                                        <TableRow key={a.StudentMentorID} className="group hover:bg-slate-50/50 transition-colors border-slate-50">
                                            <TableCell className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all shadow-sm bg-purple-50 text-purple-700">
                                                        {a.Student?.StudentName[0]}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 leading-none group-hover:text-amber-600 transition-colors">{a.Student?.StudentName}</div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{a.Student?.EnrollmentNo}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium text-slate-600">{a.Staff?.StaffName}</TableCell>
                                            <TableCell>
                                                <div className="text-xs font-bold text-slate-600">
                                                    {new Date(a.FromDate).toLocaleDateString()}
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase">
                                                    to {a.ToDate ? new Date(a.ToDate).toLocaleDateString() : "Ongoing"}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant="secondary"
                                                    className="px-4 py-1.5 rounded-full border-none font-bold text-[10px] uppercase tracking-widest bg-amber-50 text-amber-700 pointer-events-none"
                                                >
                                                    {a.MentoringLogs?.length || 0}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-8 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-10 w-10 p-0 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
                                                    onClick={() => handleDelete(a.StudentMentorID)}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
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
