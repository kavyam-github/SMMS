import AppSidebar from "@/components/AppSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <AppSidebar role="admin" />
            <main className="flex-1 overflow-auto">{children}</main>
        </div>
    );
}
