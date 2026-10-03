import { getTimeAgo } from '../../utils/job-format';
import { Component, input, output } from '@angular/core';
import { Job } from '../../models/job.model';

@Component({
  selector: 'app-job-card',
  standalone: true,
  template: `
    <div role="button" tabindex="0" (keydown.enter)="selected.emit(job())" (keydown.space)="$event.preventDefault(); selected.emit(job())" class="job-card" [class.job-card-active]="active()" (click)="selected.emit(job())">
      <div class="card-top">
        <div class="avatar">{{ getInitials(job().company_name) }}</div>
        <div class="card-info">
          <h3 class="card-title">{{ job().title }}</h3>
          <p class="card-company">{{ job().company_name }}</p>
          <p class="card-location">{{ job().location || 'Remote' }}</p>
        </div>
      </div>
      <div class="card-tags">
        @for (tag of job().tags.slice(0, 4); track tag) {
          <span class="tag">{{ tag }}</span>
        }
      </div>
      <p class="card-time">{{ getTimeAgo(job().created_at) }}</p>
    </div>
  `,
  styles: [`
    .job-card {
      padding: 16px;
      border-bottom: 1px solid #f1f5f9;
      cursor: pointer;
      transition: background 0.15s;
    }
    .job-card:focus-visible { outline: 2px solid var(--color-primary); outline-offset: -2px; }
    .job-card:hover {
      background: #f8fafc;
    }
    .job-card-active {
      background: #eef2ff;
      border-left: 3px solid var(--color-primary);
    }
    .card-top {
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: var(--color-primary);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.85rem;
      flex-shrink: 0;
    }
    .card-info {
      min-width: 0;
    }
    .card-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--color-text);
      margin: 0;
      white-space: normal;
      overflow-wrap: anywhere;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .card-company {
      font-size: 0.85rem;
      color: var(--color-muted);
      margin: 2px 0 0;
    }
    .card-location {
      font-size: 0.8rem;
      color: var(--color-muted);
      margin: 2px 0 0;
    }
    .card-tags {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
      overflow: hidden;
      margin-top: 10px;
    }
    .tag {
      padding: 2px 8px;
      border-radius: 12px;
      background: #f1f5f9;
      font-size: 0.72rem;
      color: var(--color-muted);
    }
    .card-time {
      font-size: 0.75rem;
      color: #9ca3af;
      margin: 8px 0 0;
    }
  `]
})
export class JobCardComponent {
  readonly job = input.required<Job>();
  readonly active = input(false);
  readonly selected = output<Job>();

  getInitials(name: string): string {
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase();
  }

  readonly getTimeAgo = getTimeAgo;
}
