"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
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
import { Plus, ClipboardList, Trash2, CalendarHeart } from "lucide-react";

export default function MentorMentoringPage() {
    const { data: session } = useSession();
    const [assignments, setAssignments] = useState<any[]>([]);
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);

    const mentorId = (session?.user as any)?.id;

    const [form, setForm] = useState({
        StudentMentorID: "",
        DateOfMentoring: "",
        ScheduledMeetingDate: "",
        NextMentoringDate: "",
        IssuesDiscussed: "",
        MentoringMeetingAgenda: "",
        AttendanceStatus: "Present",
        AbsentRemarks: "",
        IsParentPresent: false,
        ParentName: "",
        ParentMobileNo: "",
        StudentsOpinion: "",
        ParentsOpinion: "",
    });

    const fetchData = () => {
        if (!mentorId) return;
        Promise.all([
            fetch(`/api/assignments?staffId=${mentorId}`).then((r) => r.json()),
            fetch(`/api/mentoring?staffId=${mentorId}`).then((r) => r.json()),
        ]).then(([a, m]) => {
            setAssignments(a);
            setRecords(m);
            setLoading(false);
        });
    };

    useEffect(() => { fetchData(); }, [mentorId]);

    const resetForm = () => {
        setForm({
            StudentMentorID: "", DateOfMentoring: "", ScheduledMeetingDate: "", NextMentoringDate: "",
            IssuesDiscussed: "", MentoringMeetingAgenda: "", AttendanceStatus: "Present", AbsentRemarks: "",
            IsParentPresent: false, ParentName: "", ParentMobileNo: "", StudentsOpinion: "", ParentsOpinion: "",
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/mentoring", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        if (res.ok) {
            toast.success("Mentoring session recorded successfully");
            setDialogOpen(false);
            resetForm();
            fetchData();
        } else {
            const err = await res.json();
            toast.error(err.error || "Failed to record session");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this mentoring record?")) return;
        const res = await fetch(`/api/mentoring/${id}`, { method: "DELETE" });
        if (res.ok) {
            toast.success("Record deleted");
            fetchData();
        } else {
            toast.error("Failed to delete record");
        }
    };

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
                            Mentoring <span className="text-amber-600">Sessions</span>
                        </h1>
                        <p className="text-slate-500 mt-1 font-medium italic">
                            Record and view mentoring session details
                        </p>
                    </div>

                    <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
                        <DialogTrigger asChild>
                            <Button className="h-12 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 shadow-xl shadow-amber-100 font-bold uppercase tracking-widest text-xs">
                                <Plus size={16} className="mr-2" />
                                New Session
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl bg-white border border-slate-200 shadow-2xl p-8 rounded-2xl max-h-[85vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black text-slate-900">Record Mentoring Session</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Student *</Label>
                                        <Select value={form.StudentMentorID} onValueChange={(v) => setForm({ ...form, StudentMentorID: v })}>
                                            <SelectTrigger className="h-12 rounded-xl bg-white border border-slate-200 focus:border-amber-500 shadow-sm"><SelectValue placeholder="Select student" /></SelectTrigger>
                                            <SelectContent className="rounded-xl border-slate-200 shadow-lg bg-white">
                                                {assignments.map((a: any) => (
                                                    <SelectItem key={a.StudentMentorID} value={a.StudentMentorID.toString()}>
                                                        {a.Student?.StudentName} ({a.Student?.EnrollmentNo})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Attendance *</Label>
                                        <Select value={form.AttendanceStatus} onValueChange={(v) => setForm({ ...form, AttendanceStatus: v })}>
                                            <SelectTrigger className="h-12 rounded-xl bg-white border border-slate-200 focus:border-amber-500 shadow-sm"><SelectValue /></SelectTrigger>
                                            <SelectContent className="rounded-xl border-slate-200 shadow-lg bg-white">
                                                <SelectItem value="Present">Present</SelectItem>
                                                <SelectItem value="Absent">Absent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Date of Mentoring *</Label>
                                        <Input type="date" value={form.DateOfMentoring} onChange={(e) => setForm({ ...form, DateOfMentoring: e.target.value })} className="h-12 rounded-xl bg-white border border-slate-200 focus:border-amber-500 shadow-sm" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Scheduled Date</Label>
                                        <Input type="date" value={form.ScheduledMeetingDate} onChange={(e) => setForm({ ...form, ScheduledMeetingDate: e.target.value })} className="h-12 rounded-xl bg-white border border-slate-200 focus:border-amber-500 shadow-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Next Mentoring Date</Label>
                                        <Input type="date" value={form.NextMentoringDate} onChange={(e) => setForm({ ...form, NextMentoringDate: e.target.value })} className="h-12 rounded-xl bg-white border border-slate-200 focus:border-amber-500 shadow-sm" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Meeting Agenda</Label>
                                    <Textarea value={form.MentoringMeetingAgenda} onChange={(e) => setForm({ ...form, MentoringMeetingAgenda: e.target.value })} rows={2} className="rounded-xl bg-white border border-slate-200 focus:border-amber-500 shadow-sm min-h-[80px] p-4" />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Issues Discussed</Label>
                                    <Textarea value={form.IssuesDiscussed} onChange={(e) => setForm({ ...form, IssuesDiscussed: e.target.value })} rows={3} className="rounded-xl bg-white border border-slate-200 focus:border-amber-500 shadow-sm min-h-[100px] p-4" />
                                </div>

                                {form.AttendanceStatus === "Absent" && (
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Absent Remarks</Label>
                                        <Textarea value={form.AbsentRemarks} onChange={(e) => setForm({ ...form, AbsentRemarks: e.target.value })} rows={2} className="rounded-xl bg-white border border-slate-200 focus:border-amber-500 shadow-sm min-h-[80px] p-4" />
                                    </div>
                                )}

                                <div className="border-t border-slate-100 pt-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                            <input type="checkbox" checked={form.IsParentPresent} onChange={(e) => setForm({ ...form, IsParentPresent: e.target.checked })} className="rounded text-amber-600 focus:ring-amber-600" />
                                            Parent Present
                                        </label>
                                    </div>
                                    {form.IsParentPresent && (
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Parent Name</Label>
                                                <Input value={form.ParentName} onChange={(e) => setForm({ ...form, ParentName: e.target.value })} className="h-12 rounded-xl bg-white border border-slate-200 focus:border-amber-500 shadow-sm" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Parent Mobile</Label>
                                                <Input value={form.ParentMobileNo} onChange={(e) => setForm({ ...form, ParentMobileNo: e.target.value })} className="h-12 rounded-xl bg-white border border-slate-200 focus:border-amber-500 shadow-sm" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Student's Opinion</Label>
                                        <Textarea value={form.StudentsOpinion} onChange={(e) => setForm({ ...form, StudentsOpinion: e.target.value })} rows={2} className="rounded-xl bg-white border border-slate-200 focus:border-amber-500 shadow-sm min-h-[80px] p-4" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Parent's Opinion</Label>
                                        <Textarea value={form.ParentsOpinion} onChange={(e) => setForm({ ...form, ParentsOpinion: e.target.value })} rows={2} className="rounded-xl bg-white border border-slate-200 focus:border-amber-500 shadow-sm min-h-[80px] p-4" />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 border-t border-slate-100 mt-6 pt-6">
                                    <Button type="button" variant="outline" className="rounded-xl h-12 px-6 font-bold uppercase tracking-widest text-xs border-slate-200" onClick={() => { setDialogOpen(false); resetForm(); }}>
                                        Discard
                                    </Button>
                                    <Button type="submit" className="rounded-xl h-12 px-8 bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase tracking-widest text-xs shadow-xl shadow-amber-100 border-none m-0">
                                        Save Session
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </header>

                <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white/90 backdrop-blur-xl overflow-hidden">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-slate-50">
                                    <TableHead className="px-8 h-20 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Student</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Attendance</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Issues</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Next Date</TableHead>
                                    <TableHead className="px-8 h-20 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {records.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-20 text-slate-400">
                                            <CalendarHeart size={48} className="mx-auto mb-4 opacity-10" />
                                            <p className="font-black uppercase tracking-[0.2em] text-xs">No sessions recorded yet</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    records.map((r: any) => (
                                        <TableRow key={r.StudentMentoringID} className="group hover:bg-slate-50/50 transition-colors border-slate-50">
                                            <TableCell className="font-bold text-slate-900 px-8 py-6 group-hover:text-amber-600 transition-colors">{r.StudentMentor?.Student?.StudentName}</TableCell>
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
                                            <TableCell className="text-slate-600 font-medium">
                                                {r.NextMentoringDate ? new Date(r.NextMentoringDate).toLocaleDateString() : "—"}
                                            </TableCell>
                                            <TableCell className="px-8 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-10 w-10 p-0 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
                                                    onClick={() => handleDelete(r.StudentMentoringID)}
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
