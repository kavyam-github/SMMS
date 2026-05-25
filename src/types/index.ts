export type Role = "ADMIN" | "MENTOR" | "STUDENT";

export interface Staff {
    StaffID: number;
    StaffName: string;
    EmailAddress: string;
    MobileNo?: string | null;
    Description?: string | null;
    Role: Role;
    Created: Date;
    Modified: Date;
    Mentors?: StudentMentor[];
}

export interface Student {
    StudentID: number;
    StudentName: string;
    EnrollmentNo: string;
    EmailAddress: string;
    MobileNo?: string | null;
    Description?: string | null;
    Created: Date;
    Modified: Date;
    Mentorships?: StudentMentor[];
}

export interface StudentMentor {
    StudentMentorID: number;
    StudentID: number;
    StaffID: number;
    FromDate: Date;
    ToDate?: Date | null;
    Description?: string | null;
    Created: Date;
    Modified: Date;
    Student?: Student;
    Staff?: Staff;
    MentoringLogs?: StudentMentoring[];
}

export interface StudentMentoring {
    StudentMentoringID: number;
    StudentMentorID: number;
    DateOfMentoring: Date;
    ScheduledMeetingDate?: Date | null;
    NextMentoringDate?: Date | null;
    IssuesDiscussed?: string | null;
    MentoringMeetingAgenda?: string | null;
    AttendanceStatus: string;
    AbsentRemarks?: string | null;
    IsParentPresent: boolean;
    ParentName?: string | null;
    ParentMobileNo?: string | null;
    StudentsOpinion?: string | null;
    ParentsOpinion?: string | null;
    StudentMentor?: StudentMentor;
}

export interface DashboardStats {
    totalStaff: number;
    totalStudents: number;
    totalAssignments: number;
    totalMentoringRecords: number;
    totalMentors: number;
    recentAssignments: StudentMentor[];
    recentMentoring: StudentMentoring[];
}
