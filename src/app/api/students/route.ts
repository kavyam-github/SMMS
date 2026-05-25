import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET all students
export async function GET() {
    try {
        const students = await prisma.student.findMany({
            include: {
                Mentorships: {
                    include: { Staff: true },
                },
            },
            orderBy: { Created: "desc" },
        });

        const safeStudents = students.map(({ Password, ...rest }) => rest);
        return NextResponse.json(safeStudents);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
    }
}

// POST create student
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { StudentName, EnrollmentNo, EmailAddress, Password, MobileNo, Description } = body;

        if (!StudentName || !EnrollmentNo || !EmailAddress || !Password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const existingEmail = await prisma.student.findUnique({ where: { EmailAddress } });
        if (existingEmail) {
            return NextResponse.json({ error: "Email already exists" }, { status: 409 });
        }

        const existingEnroll = await prisma.student.findUnique({ where: { EnrollmentNo } });
        if (existingEnroll) {
            return NextResponse.json({ error: "Enrollment number already exists" }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(Password, 10);

        const student = await prisma.student.create({
            data: {
                StudentName,
                EnrollmentNo,
                EmailAddress,
                Password: hashedPassword,
                MobileNo: MobileNo || null,
                Description: Description || null,
            },
        });

        const { Password: _, ...safeStudent } = student;
        return NextResponse.json(safeStudent, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create student" }, { status: 500 });
    }
}
