import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const assignment = await prisma.studentMentor.findUnique({
            where: { StudentMentorID: parseInt(id) },
            include: {
                Student: true,
                Staff: { select: { StaffID: true, StaffName: true, EmailAddress: true, Role: true } },
                MentoringLogs: true,
            },
        });

        if (!assignment) return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
        return NextResponse.json(assignment);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch assignment" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { StudentID, StaffID, FromDate, ToDate, Description } = body;

        const updateData: any = {};
        if (StudentID) updateData.StudentID = parseInt(StudentID);
        if (StaffID) updateData.StaffID = parseInt(StaffID);
        if (FromDate) updateData.FromDate = new Date(FromDate);
        if (ToDate !== undefined) updateData.ToDate = ToDate ? new Date(ToDate) : null;
        if (Description !== undefined) updateData.Description = Description;

        const assignment = await prisma.studentMentor.update({
            where: { StudentMentorID: parseInt(id) },
            data: updateData,
            include: { Student: true, Staff: true },
        });

        return NextResponse.json(assignment);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update assignment" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.studentMentor.delete({ where: { StudentMentorID: parseInt(id) } });
        return NextResponse.json({ message: "Assignment deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete assignment" }, { status: 500 });
    }
}
