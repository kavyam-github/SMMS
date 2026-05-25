import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

// GET current student's data
export async function GET() {
    try {
        const session = await auth();
        if (!session || (session.user as any)?.role !== "STUDENT") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const studentId = parseInt((session.user as any).id);

        const student = await prisma.student.findUnique({
            where: { StudentID: studentId },
            include: {
                Mentorships: {
                    include: {
                        Staff: {
                            select: { StaffID: true, StaffName: true, EmailAddress: true, MobileNo: true },
                        },
                        MentoringLogs: {
                            orderBy: { DateOfMentoring: "desc" },
                        },
                    },
                },
            },
        });

        if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

        const { Password, ...safeStudent } = student;
        return NextResponse.json(safeStudent);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}
