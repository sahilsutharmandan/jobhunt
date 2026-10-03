import { Component, input, output } from '@angular/core';
import { Job } from '../../models/job.model';
import { SavedJobsService } from '../../services/saved-jobs.service';
import { ApplicationsService } from '../../services/applications.service';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  template: `
    <div class="detail-panel">
      @if (job(); as j) {
        <div class="detail-header">
          <div class="detail-avatar">{{ getInitials(j.company_name) }}</div>
          <div>
            <h2 class="detail-title">{{ j.title }}</h2>
            <p class="detail-company">{{ j.company_name }}</p>
            <p class="detail-location">{{ j.location || 'Remote' }}</p>
          </div>
        </div>

        <div class="detail-meta">
          @for (type of j.job_types; track type) {
            <span class="meta-chip type-chip">{{ type }}</span>
          }
          @if (j.remote) {
            <span class="meta-chip remote-chip">Remote</span>
          }
          <span class="detail-time">{{ getTimeAgo(j.created_at) }}</span>
        </div>

        <div class="detail-tags">
          @for (tag of j.tags; track tag) {
            <span class="tag">{{ tag }}</span>
          }
        </div>

        <div class="detail-actions">
          <button
            class="btn btn-save"
            [class.btn-saved]="savedJobsService.isJobSaved(j.slug)"
            (click)="savedJobsService.toggleSave(j)"
          >
            {{ savedJobsService.isJobSaved(j.slug) ? 'Saved' : 'Save Job' }}
          </button>
          <button
            class="btn btn-apply"
            [disabled]="applicationsService.hasApplied(j.slug)"
            (click)="applyClicked.emit(j)"
          >
            {{ applicationsService.hasApplied(j.slug) ? 'Applied' : 'Easy Apply' }}
          </button>
        </div>

        <div class="detail-description" [innerHTML]="j.description"></div>
      } @else {
        <div class="detail-empty">
          <p>Select a job to view details</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .detail-panel {
      padding: 24px;
      overflow-y: auto;
      height: 100%;
      overflow-x: visible;
      box-sizing: border-box;
    }
    .detail-header {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }
    .detail-avatar {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      background: var(--color-primary);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.1rem;
      flex-shrink: 0;
    }
    .detail-title {
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--color-text);
      margin: 0;
    }
    .detail-company {
      font-size: 1rem;
      color: var(--color-muted);
      margin: 4px 0 0;
    }
    .detail-location {
      font-size: 0.9rem;
      color: var(--color-muted);
      margin: 2px 0 0;
    }
    .detail-meta {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      align-items: center;
      margin-top: 16px;
    }
    .meta-chip {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 0.8rem;
      font-weight: 500;
    }
    .type-chip {
      background: #eef2ff;
      color: var(--color-primary);
    }
    .remote-chip {
      background: #ecfdf5;
      color: #059669;
    }
    .detail-time {
      font-size: 0.8rem;
      color: #9ca3af;
    }
    .detail-tags {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-top: 12px;
    }
    .tag {
      padding: 3px 10px;
      border-radius: 12px;
      background: #f1f5f9;
      font-size: 0.78rem;
      color: var(--color-muted);
    }
    .detail-actions {
      display: flex;
      gap: 12px;
      margin-top: 20px;
    }
    .btn {
      padding: 10px 24px;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: background 0.2s;
    }
    .btn-save {
      background: #f1f5f9;
      color: var(--color-text);
    }
    .btn-save:hover {
      background: #e2e8f0;
    }
    .btn-saved {
      background: #fef3c7;
      color: #92400e;
    }
    .btn-apply {
      background: var(--color-primary);
      color: #fff;
    }
    .btn-apply:hover {
      background: #4338ca;
    }
    .btn-apply:disabled {
      background: #a5b4fc;
      cursor: default;
    }
    .detail-description {
      margin-top: 24px;
      line-height: 1.7;
      color: var(--color-text);
      font-size: 0.95rem;

      :host ::ng-deep {
        h1, h2, h3, h4 {
          margin-top: 20px;
          margin-bottom: 8px;
        }
        ul, ol {
          padding-left: 20px;
        }
        li {
          margin-bottom: 4px;
        }
        a {
          color: var(--color-primary);
        }
        p {
          margin: 8px 0;
        }
      }
    }
    .detail-empty {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--color-muted);
      font-size: 1.1rem;
    }
  `]
})
export class JobDetailComponent {
  readonly job = input<Job | null>(null);
  readonly applyClicked = output<Job>();

  constructor(
    public savedJobsService: SavedJobsService,
    public applicationsService: ApplicationsService
  ) {}

  getInitials(name: string): string {
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase();
  }

  getTimeAgo(unixSeconds: number): string {
    const diff = Date.now() - unixSeconds;
    const days = Math.floor(diff / 86400);
    if (days === 0) return 'Posted today';
    if (days === 1) return 'Posted 1 day ago';
    if (days < 30) return `Posted ${days} days ago`;
    const months = Math.floor(days / 30);
    if (months === 1) return 'Posted 1 month ago';
    return `Posted ${months} months ago`;
  }
}
