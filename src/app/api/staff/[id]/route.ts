import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET single staff
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const staff = await prisma.staff.findUnique({
            where: { StaffID: parseInt(id) },
            include: {
                Mentors: {
                    include: { Student: true, MentoringLogs: true },
                },
            },
        });

        if (!staff) return NextResponse.json({ error: "Staff not found" }, { status: 404 });

        const { Password, ...safeStaff } = staff;
        return NextResponse.json(safeStaff);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 });
    }
}

// PUT update staff
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { StaffName, EmailAddress, Password, MobileNo, Description, Role } = body;

        const updateData: any = {};
        if (StaffName) updateData.StaffName = StaffName;
        if (EmailAddress) updateData.EmailAddress = EmailAddress;
        if (MobileNo !== undefined) updateData.MobileNo = MobileNo;
        if (Description !== undefined) updateData.Description = Description;
        if (Role) updateData.Role = Role;
        if (Password) updateData.Password = await bcrypt.hash(Password, 10);

        const staff = await prisma.staff.update({
            where: { StaffID: parseInt(id) },
            data: updateData,
        });

        const { Password: _, ...safeStaff } = staff;
        return NextResponse.json(safeStaff);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update staff" }, { status: 500 });
    }
}

// DELETE staff
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.staff.delete({ where: { StaffID: parseInt(id) } });
        return NextResponse.json({ message: "Staff deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete staff" }, { status: 500 });
    }
}
