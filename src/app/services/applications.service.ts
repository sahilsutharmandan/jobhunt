import { Injectable, signal, computed } from '@angular/core';
import { Application, ApplicationStatus } from '../models/application.model';

@Injectable({ providedIn: 'root' })
export class ApplicationsService {
  private readonly storageKey = 'jobhunt_applications';

  readonly applications = signal<Application[]>(this.load());

  readonly stats = computed(() => {
    const apps = this.applications();
    const count = (status: ApplicationStatus) => apps.filter(a => a.status === status).length;
    const applied = count('applied');
    const interview = count('interview');
    const offer = count('offer');
    const rejected = count('rejected');
    return {
      applied,
      interview,
      offer,
      rejected,
      total: apps.length,
      responseRate: Math.round(((interview + offer + rejected) / applied) * 100),
    };
  });

  addApplication(app: Application): void {
    this.applications.update(apps => [app, ...apps]);
    this.persist();
  }

  updateStatus(id: string, status: ApplicationStatus): void {
    this.applications.update(apps =>
      apps.map(a => a.id === id ? { ...a, status } : a)
    );
    this.persist();
  }

  hasApplied(jobSlug: string): boolean {
    return this.applications().some(a => a.jobSlug === jobSlug);
  }

  private load(): Application[] {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  }

  private persist(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.applications()));
  }
}
