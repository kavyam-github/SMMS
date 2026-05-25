import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const record = await prisma.studentMentoring.findUnique({
            where: { StudentMentoringID: parseInt(id) },
            include: {
                StudentMentor: {
                    include: { Student: true, Staff: true },
                },
            },
        });

        if (!record) return NextResponse.json({ error: "Record not found" }, { status: 404 });
        return NextResponse.json(record);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch record" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();

        const updateData: any = {};
        if (body.DateOfMentoring) updateData.DateOfMentoring = new Date(body.DateOfMentoring);
        if (body.ScheduledMeetingDate !== undefined) updateData.ScheduledMeetingDate = body.ScheduledMeetingDate ? new Date(body.ScheduledMeetingDate) : null;
        if (body.NextMentoringDate !== undefined) updateData.NextMentoringDate = body.NextMentoringDate ? new Date(body.NextMentoringDate) : null;
        if (body.IssuesDiscussed !== undefined) updateData.IssuesDiscussed = body.IssuesDiscussed;
        if (body.MentoringMeetingAgenda !== undefined) updateData.MentoringMeetingAgenda = body.MentoringMeetingAgenda;
        if (body.AttendanceStatus) updateData.AttendanceStatus = body.AttendanceStatus;
        if (body.AbsentRemarks !== undefined) updateData.AbsentRemarks = body.AbsentRemarks;
        if (body.IsParentPresent !== undefined) updateData.IsParentPresent = body.IsParentPresent;
        if (body.ParentName !== undefined) updateData.ParentName = body.ParentName;
        if (body.ParentMobileNo !== undefined) updateData.ParentMobileNo = body.ParentMobileNo;
        if (body.StudentsOpinion !== undefined) updateData.StudentsOpinion = body.StudentsOpinion;
        if (body.ParentsOpinion !== undefined) updateData.ParentsOpinion = body.ParentsOpinion;

        const record = await prisma.studentMentoring.update({
            where: { StudentMentoringID: parseInt(id) },
            data: updateData,
            include: {
                StudentMentor: {
                    include: { Student: true, Staff: true },
                },
            },
        });

        return NextResponse.json(record);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update record" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.studentMentoring.delete({ where: { StudentMentoringID: parseInt(id) } });
        return NextResponse.json({ message: "Record deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete record" }, { status: 500 });
    }
}
