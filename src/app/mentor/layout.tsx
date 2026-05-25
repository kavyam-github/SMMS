import AppSidebar from "@/components/AppSidebar";

export default function MentorLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <AppSidebar role="mentor" />
            <main className="flex-1 overflow-auto">{children}</main>
        </div>
    );
}
