import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all mentoring records
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const studentMentorId = searchParams.get("studentMentorId");
        const staffId = searchParams.get("staffId");

        const where: any = {};
        if (studentMentorId) where.StudentMentorID = parseInt(studentMentorId);
        if (staffId) {
            where.StudentMentor = { StaffID: parseInt(staffId) };
        }

        const records = await prisma.studentMentoring.findMany({
            where,
            include: {
                StudentMentor: {
                    include: {
                        Student: true,
                        Staff: { select: { StaffID: true, StaffName: true, EmailAddress: true } },
                    },
                },
            },
            orderBy: { DateOfMentoring: "desc" },
        });

        return NextResponse.json(records);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch mentoring records" }, { status: 500 });
    }
}

// POST create mentoring record
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            StudentMentorID,
            DateOfMentoring,
            ScheduledMeetingDate,
            NextMentoringDate,
            IssuesDiscussed,
            MentoringMeetingAgenda,
            AttendanceStatus,
            AbsentRemarks,
            IsParentPresent,
            ParentName,
            ParentMobileNo,
            StudentsOpinion,
            ParentsOpinion,
        } = body;

        if (!StudentMentorID || !DateOfMentoring || !AttendanceStatus) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const record = await prisma.studentMentoring.create({
            data: {
                StudentMentorID: parseInt(StudentMentorID),
                DateOfMentoring: new Date(DateOfMentoring),
                ScheduledMeetingDate: ScheduledMeetingDate ? new Date(ScheduledMeetingDate) : null,
                NextMentoringDate: NextMentoringDate ? new Date(NextMentoringDate) : null,
                IssuesDiscussed: IssuesDiscussed || null,
                MentoringMeetingAgenda: MentoringMeetingAgenda || null,
                AttendanceStatus,
                AbsentRemarks: AbsentRemarks || null,
                IsParentPresent: IsParentPresent || false,
                ParentName: ParentName || null,
                ParentMobileNo: ParentMobileNo || null,
                StudentsOpinion: StudentsOpinion || null,
                ParentsOpinion: ParentsOpinion || null,
            },
            include: {
                StudentMentor: {
                    include: { Student: true, Staff: true },
                },
            },
        });

        return NextResponse.json(record, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create mentoring record" }, { status: 500 });
    }
}
