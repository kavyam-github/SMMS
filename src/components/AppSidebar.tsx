"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    Link as LinkIcon,
    ClipboardList,
    LogOut,
    BookOpen,
    UserCircle,
    ChevronRight,
    FileText,
} from "lucide-react";

interface MenuItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface AppSidebarProps {
    role: "admin" | "mentor" | "student";
}

export default function AppSidebar({ role }: AppSidebarProps) {
    const pathname = usePathname();
    const { data: session } = useSession();

    const menuItems: Record<string, MenuItem[]> = {
        admin: [
            { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
            { name: "Staff Management", href: "/admin/staff", icon: Users },
            { name: "Student Management", href: "/admin/students", icon: GraduationCap },
            { name: "Mentor Assignments", href: "/admin/assignments", icon: LinkIcon },
            { name: "Mentoring Records", href: "/admin/records", icon: ClipboardList },
            { name: "Reports Center", href: "/admin/reports", icon: FileText },
        ],
        mentor: [
            { name: "Dashboard", href: "/mentor/dashboard", icon: LayoutDashboard },
            { name: "My Students", href: "/mentor/students", icon: GraduationCap },
            { name: "Mentoring Sessions", href: "/mentor/mentoring", icon: BookOpen },
        ],
        student: [
            { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
            { name: "My Mentor", href: "/student/mentor", icon: UserCircle },
            { name: "Session History", href: "/student/sessions", icon: ClipboardList },
        ],
    };

    const items = menuItems[role] || [];

    return (
        <div className="w-72 h-screen border-r border-slate-100 bg-white flex flex-col sticky top-0 shadow-sm z-40">
            <div className="p-8 pb-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-rose-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-100">
                        S
                    </div>
                    <div>
                        <div className="text-xl font-black text-slate-900 tracking-tighter">
                            SMMS<span className="text-orange-500">.</span>
                        </div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] -mt-1">
                            Management
                        </div>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto page-transition">
                {items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                                isActive
                                    ? "bg-amber-50 text-amber-700 shadow-sm"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <item.icon
                                size={20}
                                className={cn(
                                    "transition-transform duration-300 group-hover:scale-110",
                                    isActive ? "text-amber-600" : "text-slate-400 group-hover:text-slate-600"
                                )}
                            />
                            <span className="text-sm font-bold tracking-tight">{item.name}</span>
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-amber-600 rounded-r-full" />
                            )}
                            <ChevronRight
                                size={14}
                                className={cn(
                                    "ml-auto opacity-0 -translate-x-2 transition-all",
                                    isActive ? "opacity-40 translate-x-0" : "group-hover:opacity-40 group-hover:translate-x-0"
                                )}
                            />
                        </Link>
                    );
                })}
            </nav>

            {/* User section */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700 font-bold text-sm">
                        {session?.user?.name?.[0] || "U"}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                        <div className="text-sm font-bold text-slate-900 truncate">
                            {session?.user?.name || "User"}
                        </div>
                        <div className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mt-0.5">
                            {(session?.user as any)?.role || "Role"}
                        </div>
                    </div>
                </div>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all w-full text-sm font-bold uppercase tracking-wider">
                            <LogOut size={16} />
                            Sign Out
                        </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-md bg-white border border-slate-200 shadow-xl p-8 rounded-2xl">
                        <AlertDialogHeader>
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mb-4 border border-red-100">
                                <LogOut className="h-8 w-8 text-red-600" aria-hidden="true" />
                            </div>
                            <AlertDialogTitle className="text-2xl font-bold text-center text-slate-900">
                                Sign out of your account
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-center text-slate-500 text-sm mt-2">
                                Are you sure you would like to sign out? You will be redirected to the secure login portal.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-6 flex-col sm:flex-row gap-3 sm:justify-center w-full">
                            <AlertDialogCancel className="flex-1 px-6 h-12 bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors mt-0">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => signOut({ callbackUrl: "/login" })}
                                className="flex-1 px-6 h-12 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors border-none m-0 shadow-sm"
                            >
                                Sign Out
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
