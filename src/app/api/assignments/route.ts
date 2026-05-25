import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all assignments
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const staffId = searchParams.get("staffId");

        const where: any = {};
        if (staffId) where.StaffID = parseInt(staffId);

        const assignments = await prisma.studentMentor.findMany({
            where,
            include: {
                Student: true,
                Staff: { select: { StaffID: true, StaffName: true, EmailAddress: true, Role: true } },
                MentoringLogs: true,
            },
            orderBy: { Created: "desc" },
        });

        return NextResponse.json(assignments);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch assignments" }, { status: 500 });
    }
}

// POST create assignment
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { StudentID, StaffID, FromDate, ToDate, Description } = body;

        if (!StudentID || !StaffID || !FromDate) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const assignment = await prisma.studentMentor.create({
            data: {
                StudentID: parseInt(StudentID),
                StaffID: parseInt(StaffID),
                FromDate: new Date(FromDate),
                ToDate: ToDate ? new Date(ToDate) : null,
                Description: Description || null,
            },
            include: { Student: true, Staff: true },
        });

        return NextResponse.json(assignment, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create assignment" }, { status: 500 });
    }
}
