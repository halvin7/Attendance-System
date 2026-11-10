export type User = { id: number; employeeCode: string; fullName: string; email: string; department: string; position: string; role: 'HRD'|'EMPLOYEE'; isActive: boolean };
export type Attendance = { id: number; employeeId: number; attendanceDate: string; checkInAt: string|null; checkInPhoto: string|null; checkOutAt: string|null; employee?: User };
