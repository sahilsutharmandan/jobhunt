import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Job, JobApiResponse } from '../models/job.model';

@Injectable({ providedIn: 'root' })
export class JobService {
  private readonly apiUrl = 'https://www.arbeitnow.com/api/job-board-api';

  readonly jobs = signal<Job[]>([]);
  readonly loading = signal(false);
  readonly currentPage = signal(1);
  readonly lastPage = signal(1);
  readonly selectedJob = signal<Job | null>(null);

  constructor(private http: HttpClient) {}

  selectJob(job: Job | null): void {
    this.selectedJob.set(job);
  }

  fetchJobs(page: number = 1): Observable<JobApiResponse> {
    const cacheKey = `jobhunt_jobs_page_${page}`;
    const cached = sessionStorage.getItem(cacheKey);

    if (cached) {
      const parsed: JobApiResponse = JSON.parse(cached);
      this.applyResponse(parsed, page);
      return of(parsed);
    }

    this.loading.set(true);
    const url = page > 1 ? `${this.apiUrl}?page=${page}` : this.apiUrl;

    return this.http.get<JobApiResponse>(url).pipe(
      tap(response => {
        sessionStorage.setItem(cacheKey, JSON.stringify(response));
        this.applyResponse(response, page);
        this.loading.set(false);
      })
    );
  }

  loadMore(): void {
    const next = this.currentPage() + 1;
    if (next <= this.lastPage()) {
      this.fetchJobs(next).subscribe();
    }
  }

  private applyResponse(response: JobApiResponse, page: number): void {
    if (page === 1) {
      this.jobs.set(response.data);
    } else {
      this.jobs.update(existing => [...existing, ...response.data]);
    }
    this.currentPage.set(response.meta.current_page);
    this.lastPage.set(response.meta.last_page);
  }
}
