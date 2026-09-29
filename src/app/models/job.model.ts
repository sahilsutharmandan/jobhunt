export interface Job {
  slug: string;
  company_name: string;
  title: string;
  description: string;
  remote: boolean;
  url: string;
  tags: string[];
  job_types: string[];
  location: string;
  created_at: number;
}

export interface JobApiResponse {
  data: Job[];
  links: {
    next: string | null;
  };
  meta: {
    current_page: number;
    last_page: number;
  };
}
