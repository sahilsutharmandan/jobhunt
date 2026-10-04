import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SavedJobsService } from '../../services/saved-jobs.service';
import { Job } from '../../models/job.model';

@Component({
  selector: 'app-saved-jobs',
  standalone: true,
  template: `
    <div class="saved-page">
      <div class="page-head">
        <h1 class="page-title">Saved Jobs</h1>
        @if (savedJobsService.savedJobs().length > 1) {
          <button class="btn-clear" (click)="clearAll()">Clear all</button>
        }
      </div>

      @if (savedJobsService.savedJobs().length === 0) {
        <div class="empty-state">
          <p>No saved jobs yet</p>
          <p class="empty-hint">Browse jobs and save the ones you like</p>
        </div>
      } @else {
        <div class="saved-grid">
          @for (job of savedJobsService.savedJobs(); track job.slug) {
            <div class="saved-card">
              <div class="saved-card-top">
                <div class="avatar">{{ getInitials(job.company_name) }}</div>
                <div class="saved-card-info">
                  <h3 class="saved-card-title">{{ job.title }}</h3>
                  <p class="saved-card-company">{{ job.company_name }}</p>
                  <p class="saved-card-location">{{ job.location || 'Remote' }}</p>
                </div>
              </div>
              <div class="saved-card-tags">
                @for (tag of job.tags.slice(0, 3); track tag) {
                  <span class="tag">{{ tag }}</span>
                }
              </div>
              <div class="saved-card-actions">
                <button class="btn-view" (click)="viewJob(job)">View</button>
                <button class="btn-remove" (click)="savedJobsService.remove(job.slug)">Remove</button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .saved-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 16px;
    }
    .page-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin: 0 0 24px;
    }
    .page-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-text);
      margin: 0;
    }
    .btn-clear {
      padding: 6px 14px;
      border-radius: 6px;
      border: 1px solid var(--color-border);
      background: var(--color-surface);
      color: var(--color-muted);
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-clear:hover {
      color: #ef4444;
      border-color: #fecaca;
    }
    .empty-state {
      text-align: center;
      padding: 64px 16px;
      color: var(--color-muted);
    }
    .empty-hint {
      font-size: 0.9rem;
      margin-top: 4px;
    }
    .saved-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 16px;
    }
    .saved-card {
      background: var(--color-card);
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      border: 1px solid var(--color-border-soft);
    }
    .saved-card-top {
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }
    .avatar {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: var(--color-primary);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.9rem;
      flex-shrink: 0;
    }
    .saved-card-info {
      min-width: 0;
    }
    .saved-card-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-text);
      margin: 0;
    }
    .saved-card-company {
      font-size: 0.85rem;
      color: var(--color-muted);
      margin: 4px 0 0;
    }
    .saved-card-location {
      font-size: 0.8rem;
      color: var(--color-muted);
      margin: 2px 0 0;
    }
    .saved-card-tags {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-top: 12px;
    }
    .tag {
      padding: 3px 10px;
      border-radius: 12px;
      background: var(--color-subtle);
      font-size: 0.75rem;
      color: var(--color-muted);
    }
    .saved-card-actions {
      display: flex;
      gap: 8px;
      margin-top: 16px;
    }
    .btn-view, .btn-remove {
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: background 0.2s;
    }
    .btn-view {
      background: var(--color-primary);
      color: #fff;
    }
    .btn-view:hover {
      background: var(--color-primary-hover);
    }
    .btn-remove {
      background: #fef2f2;
      color: #ef4444;
    }
    .btn-remove:hover {
      background: #fee2e2;
    }
  `]
})
export class SavedJobsComponent {
  constructor(
    public savedJobsService: SavedJobsService,
    private router: Router
  ) {}

  clearAll(): void {
    if (confirm('Remove all saved jobs?')) {
      this.savedJobsService.clear();
    }
  }

  viewJob(job: Job): void {
    this.router.navigate(['/']);
  }

  getInitials(name: string): string {
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase();
  }
}
