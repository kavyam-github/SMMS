import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const mentorPassword = await bcrypt.hash("mentor123", 10);
    const studentPassword = await bcrypt.hash("student123", 10);

    // Create Admin
    const admin = await prisma.staff.upsert({
        where: { EmailAddress: "admin@smms.com" },
        update: {},
        create: {
            StaffName: "Super Admin",
            EmailAddress: "admin@smms.com",
            Password: hashedPassword,
            Role: "ADMIN",
            MobileNo: "9876543210",
            Modified: new Date(),
        },
    });

    // Create Mentors
    const mentor = await prisma.staff.upsert({ // Kept 'const mentor =' for console.log
        where: { EmailAddress: "mentor@smms.com" },
        update: {},
        create: {
            StaffName: "Dr. Sharma",
            EmailAddress: "mentor@smms.com",
            Password: mentorPassword,
            Role: "MENTOR",
            MobileNo: "9876543211",
            Description: "HOD, Computer Science",
            Modified: new Date(),
        },
    });

    await prisma.staff.upsert({
        where: { EmailAddress: "yash@smms.com" },
        update: {},
        create: {
            StaffName: "Yash Fraudy",
            EmailAddress: "yash@smms.com",
            Password: mentorPassword,
            Role: "MENTOR",
            MobileNo: "9876543233",
            Description: "Assistant Professor, IT",
            Modified: new Date(),
        },
    });

    // Create Students
    const student = await prisma.student.upsert({ // Kept 'const student =' for console.log
        where: { EmailAddress: "student@smms.com" },
        update: {},
        create: {
            StudentName: "Ravi Kumar",
            EnrollmentNo: "21BCE001",
            EmailAddress: "student@smms.com",
            Password: studentPassword,
            MobileNo: "9876543212",
            Description: "CSE, Semester 6",
            Modified: new Date(),
        },
    });

    await prisma.student.upsert({
        where: { EmailAddress: "priya@smms.com" },
        update: {},
        create: {
            StudentName: "Priya Singh",
            EnrollmentNo: "21BCE002",
            EmailAddress: "priya@smms.com",
            Password: studentPassword,
            MobileNo: "9876543244",
            Description: "CSE, Semester 4",
            Modified: new Date(),
        },
    });

    console.log("Seeded successfully:");
    console.log("  Admin:", admin.EmailAddress, "/ admin123");
    console.log("  Mentor A:", mentor.EmailAddress, "/ mentor123");
    console.log("  Mentor B (Yash):", "yash@smms.com", "/ mentor123");
    console.log("  Student A:", student.EmailAddress, "/ student123");
    console.log("  Student B (Priya):", "priya@smms.com", "/ student123");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
