import { Injectable, signal } from '@angular/core';
import { Job } from '../models/job.model';

@Injectable({ providedIn: 'root' })
export class SavedJobsService {
  private readonly storageKey = 'jobhunt_saved_jobs';

  readonly savedJobs = signal<Job[]>(this.load());

  isJobSaved(slug: string): boolean {
    return this.savedJobs().some(j => j.slug === slug);
  }

  toggleSave(job: Job): void {
    if (this.isJobSaved(job.slug)) {
      this.remove(job.slug);
    } else {
      this.savedJobs.update(jobs => [...jobs, job]);
      this.persist();
    }
  }

  remove(slug: string): void {
    this.savedJobs.update(jobs => jobs.filter(j => j.slug !== slug));
    this.persist();
  }

  private load(): Job[] {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  }

  private persist(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.savedJobs()));
  }
}
