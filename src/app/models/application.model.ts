export type ApplicationStatus = 'applied' | 'interview' | 'offer' | 'rejected';

export interface Application {
  id: string;
  jobSlug: string;
  jobTitle: string;
  companyName: string;
  fullName: string;
  email: string;
  phone: string;
  resumeName: string;
  resumeSize: number;
  coverLetter: string;
  status: ApplicationStatus;
  appliedAt: number;
}
