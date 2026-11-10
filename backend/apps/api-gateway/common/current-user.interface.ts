export interface AuthenticatedUser {
  sub: number;
  email: string;
  role: 'HRD' | 'EMPLOYEE';
  fullName: string;
}
