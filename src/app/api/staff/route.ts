import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET all staff
export async function GET() {
    try {
        const staff = await prisma.staff.findMany({
            include: {
                Mentors: {
                    include: {
                        Student: true,
                    },
                },
            },
            orderBy: { Created: "desc" },
        });

        const safeStaff = staff.map(({ Password, ...rest }) => rest);
        return NextResponse.json(safeStaff);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 });
    }
}

// POST create new staff
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { StaffName, EmailAddress, Password, MobileNo, Description, Role } = body;

        if (!StaffName || !EmailAddress || !Password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const existing = await prisma.staff.findUnique({
            where: { EmailAddress },
        });

        if (existing) {
            return NextResponse.json({ error: "Email already exists" }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(Password, 10);

        const staff = await prisma.staff.create({
            data: {
                StaffName,
                EmailAddress,
                Password: hashedPassword,
                MobileNo: MobileNo || null,
                Description: Description || null,
                Role: Role || "MENTOR",
            },
        });

        const { Password: _, ...safeStaff } = staff;
        return NextResponse.json(safeStaff, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create staff" }, { status: 500 });
    }
}
