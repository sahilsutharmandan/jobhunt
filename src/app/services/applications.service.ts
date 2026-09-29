import { Injectable, signal, computed } from '@angular/core';
import { Application, ApplicationStatus } from '../models/application.model';

@Injectable({ providedIn: 'root' })
export class ApplicationsService {
  private readonly storageKey = 'jobhunt_applications';

  readonly applications = signal<Application[]>(this.load());

  readonly stats = computed(() => {
    const apps = this.applications();
    return {
      applied: apps.filter(a => a.status === 'applied').length,
      interview: apps.filter(a => a.status === 'interview').length,
      offer: apps.filter(a => a.status === 'offer').length,
      rejected: apps.filter(a => a.status === 'rejected').length,
      total: apps.length,
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
