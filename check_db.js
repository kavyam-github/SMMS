const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const staff = await prisma.staff.findMany();
    console.log("Staff Records:");
    staff.forEach(s => {
        console.log(`- ${s.EmailAddress} | Role: ${s.Role} | Name: ${s.StaffName}`);
    });

    const students = await prisma.student.findMany();
    console.log("\nStudent Records:");
    students.forEach(s => {
        console.log(`- ${s.EmailAddress} | Name: ${s.StudentName}`);
    });

    await prisma.$disconnect();
}

check();
