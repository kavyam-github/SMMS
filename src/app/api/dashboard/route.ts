import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const [totalStaff, totalStudents, totalAssignments, totalMentoringRecords, mentors] = await Promise.all([
            prisma.staff.count(),
            prisma.student.count(),
            prisma.studentMentor.count(),
            prisma.studentMentoring.count(),
            prisma.staff.count({ where: { Role: "MENTOR" } }),
        ]);

        const recentAssignments = await prisma.studentMentor.findMany({
            include: { Student: true, Staff: true },
            orderBy: { Created: "desc" },
            take: 5,
        });

        const recentMentoring = await prisma.studentMentoring.findMany({
            include: {
                StudentMentor: {
                    include: { Student: true, Staff: true },
                },
            },
            orderBy: { DateOfMentoring: "desc" },
            take: 5,
        });

        return NextResponse.json({
            totalStaff,
            totalStudents,
            totalAssignments,
            totalMentoringRecords,
            totalMentors: mentors,
            recentAssignments,
            recentMentoring,
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 });
    }
}
