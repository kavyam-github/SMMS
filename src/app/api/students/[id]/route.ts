import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const student = await prisma.student.findUnique({
            where: { StudentID: parseInt(id) },
            include: {
                Mentorships: {
                    include: { Staff: true, MentoringLogs: true },
                },
            },
        });

        if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

        const { Password, ...safeStudent } = student;
        return NextResponse.json(safeStudent);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { StudentName, EnrollmentNo, EmailAddress, Password, MobileNo, Description } = body;

        const updateData: any = {};
        if (StudentName) updateData.StudentName = StudentName;
        if (EnrollmentNo) updateData.EnrollmentNo = EnrollmentNo;
        if (EmailAddress) updateData.EmailAddress = EmailAddress;
        if (MobileNo !== undefined) updateData.MobileNo = MobileNo;
        if (Description !== undefined) updateData.Description = Description;
        if (Password) updateData.Password = await bcrypt.hash(Password, 10);

        const student = await prisma.student.update({
            where: { StudentID: parseInt(id) },
            data: updateData,
        });

        const { Password: _, ...safeStudent } = student;
        return NextResponse.json(safeStudent);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.student.delete({ where: { StudentID: parseInt(id) } });
        return NextResponse.json({ message: "Student deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete student" }, { status: 500 });
    }
}
