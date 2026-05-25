"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search, Users, ShieldCheck, Mail, Phone, Info, Filter } from "lucide-react";

export default function StaffManagement() {
    const [staff, setStaff] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<any>(null);
    const [form, setForm] = useState({
        StaffName: "",
        EmailAddress: "",
        Password: "",
        MobileNo: "",
        Description: "",
        Role: "MENTOR",
    });

    const fetchStaff = async () => {
        const res = await fetch("/api/staff");
        const data = await res.json();
        setStaff(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const resetForm = () => {
        setForm({ StaffName: "", EmailAddress: "", Password: "", MobileNo: "", Description: "", Role: "MENTOR" });
        setEditingStaff(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = editingStaff ? `/api/staff/${editingStaff.StaffID}` : "/api/staff";
        const method = editingStaff ? "PUT" : "POST";

        const body: any = { ...form };
        if (editingStaff && !body.Password) delete body.Password;

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (res.ok) {
            toast.success(editingStaff ? "Staff updated successfully" : "Staff created successfully");
            setDialogOpen(false);
            resetForm();
            fetchStaff();
        } else {
            const err = await res.json();
            toast.error(err.error || "Something went wrong");
        }
    };

    const handleEdit = (s: any) => {
        setEditingStaff(s);
        setForm({
            StaffName: s.StaffName,
            EmailAddress: s.EmailAddress,
            Password: "",
            MobileNo: s.MobileNo || "",
            Description: s.Description || "",
            Role: s.Role,
        });
        setDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this staff member?")) return;

        const res = await fetch(`/api/staff/${id}`, { method: "DELETE" });
        if (res.ok) {
            toast.success("Staff deleted successfully");
            fetchStaff();
        } else {
            toast.error("Failed to delete staff member");
        }
    };

    const filteredStaff = staff.filter(
        (s) =>
            s.StaffName.toLowerCase().includes(search.toLowerCase()) ||
            s.EmailAddress.toLowerCase().includes(search.toLowerCase())
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
                            Staff <span className="text-amber-600">Personnel</span>
                        </h1>
                        <p className="text-slate-500 mt-1 font-medium italic">
                            Manage your administrators and academic mentors
                        </p>
                    </div>

                    <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
                        <DialogTrigger asChild>
                            <Button className="h-12 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 shadow-xl shadow-amber-100 font-bold uppercase tracking-widest text-xs">
                                <Plus size={16} className="mr-2" />
                                Add New Staff
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xl bg-white border border-slate-200 shadow-2xl p-8 rounded-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black text-slate-900">{editingStaff ? "Edit Profile" : "Create New Profile"}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name *</Label>
                                        <Input
                                            value={form.StaffName}
                                            onChange={(e) => setForm({ ...form, StaffName: e.target.value })}
                                            placeholder="Enter full name"
                                            className="h-12 rounded-xl bg-white border border-slate-200 focus:border-amber-500 shadow-sm"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">System Role *</Label>
                                        <Select value={form.Role} onValueChange={(v) => setForm({ ...form, Role: v })}>
                                            <SelectTrigger className="h-12 rounded-xl bg-white border border-slate-200 shadow-sm focus:ring-amber-500"><SelectValue /></SelectTrigger>
                                            <SelectContent className="rounded-xl border-slate-200 shadow-lg bg-white">
                                                <SelectItem value="ADMIN">Administrator</SelectItem>
                                                <SelectItem value="MENTOR">Academic Mentor</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address *</Label>
                                    <Input
                                        type="email"
                                        value={form.EmailAddress}
                                        onChange={(e) => setForm({ ...form, EmailAddress: e.target.value })}
                                        placeholder="email@smms.com"
                                        className="h-12 rounded-xl bg-white border border-slate-200 focus:border-amber-500 shadow-sm"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                                        Password {editingStaff ? "(leave blank to keep)" : "*"}
                                    </Label>
                                    <Input
                                        type="password"
                                        value={form.Password}
                                        onChange={(e) => setForm({ ...form, Password: e.target.value })}
                                        placeholder="••••••••"
                                        className="h-12 rounded-xl bg-white border border-slate-200 focus:border-amber-500 shadow-sm"
                                        required={!editingStaff}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Mobile Contact</Label>
                                    <Input
                                        value={form.MobileNo}
                                        onChange={(e) => setForm({ ...form, MobileNo: e.target.value })}
                                        placeholder="+91..."
                                        className="h-12 rounded-xl bg-white border border-slate-200 focus:border-amber-500 shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Professional Bio / Description</Label>
                                    <Textarea
                                        value={form.Description}
                                        onChange={(e) => setForm({ ...form, Description: e.target.value })}
                                        placeholder="Add relevant highlights or department details"
                                        className="rounded-xl bg-white border border-slate-200 focus:border-amber-500 shadow-sm min-h-[100px] p-4"
                                        rows={3}
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6 pt-6">
                                    <Button type="button" variant="outline" className="rounded-xl h-12 px-6 font-bold uppercase tracking-widest text-xs border-slate-200" onClick={() => { setDialogOpen(false); resetForm(); }}>
                                        Discard
                                    </Button>
                                    <Button type="submit" className="rounded-xl h-12 px-8 bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase tracking-widest text-xs shadow-xl shadow-amber-100 border-none m-0">
                                        {editingStaff ? "Sync Changes" : "Confirm Addition"}
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
                            placeholder="Filter by name or identity..."
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
                                    <TableHead className="px-8 h-20 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Personnel</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Identity / Email</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">System Role</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Network</TableHead>
                                    <TableHead className="px-8 h-20 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Management</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-20">
                                            <div className="animate-spin w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full mx-auto" />
                                        </TableCell>
                                    </TableRow>
                                ) : filteredStaff.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-20 text-slate-400">
                                            <Users size={48} className="mx-auto mb-4 opacity-10" />
                                            <p className="font-black uppercase tracking-[0.2em] text-xs">No records found matching your search</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredStaff.map((s) => (
                                        <TableRow key={s.StaffID} className="group hover:bg-slate-50/50 transition-colors border-slate-50">
                                            <TableCell className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all shadow-sm ${s.Role === 'ADMIN' ? 'bg-indigo-50 text-indigo-700' : 'bg-blue-50 text-blue-700'}`}>
                                                        {s.StaffName[0]}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 leading-none group-hover:text-amber-600 transition-colors">{s.StaffName}</div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{s.MobileNo || "No Mobile"}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium text-slate-600">{s.EmailAddress}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant={s.Role === "ADMIN" ? "destructive" : "default"}
                                                    className={`px-4 py-1.5 rounded-full border-none font-bold text-[10px] uppercase tracking-widest ${s.Role === 'MENTOR' ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' : ''}`}
                                                >
                                                    {s.Role === 'ADMIN' ? <ShieldCheck size={10} className="mr-1 inline" /> : <Users size={10} className="mr-1 inline" />}
                                                    {s.Role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg text-xs font-bold text-slate-500">
                                                    {s.Mentors?.length || 0} mentees
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-8 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-10 w-10 p-0 rounded-xl hover:bg-amber-50 hover:text-amber-600 transition-all"
                                                        onClick={() => handleEdit(s)}
                                                    >
                                                        <Pencil size={16} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-10 w-10 p-0 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
                                                        onClick={() => handleDelete(s.StaffID)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
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
