import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApplicationsService } from '../../services/applications.service';
import { ApplicationStatus } from '../../models/application.model';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="applications-page">
      <h1 class="page-title">My Applications</h1>

      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-count">{{ applicationsService.stats().total }}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-card stat-applied">
          <span class="stat-count">{{ applicationsService.stats().applied }}</span>
          <span class="stat-label">Applied</span>
        </div>
        <div class="stat-card stat-interview">
          <span class="stat-count">{{ applicationsService.stats().interview }}</span>
          <span class="stat-label">Interview</span>
        </div>
        <div class="stat-card stat-offer">
          <span class="stat-count">{{ applicationsService.stats().offer }}</span>
          <span class="stat-label">Offer</span>
        </div>
        <div class="stat-card stat-rejected">
          <span class="stat-count">{{ applicationsService.stats().rejected }}</span>
          <span class="stat-label">Rejected</span>
        </div>
      </div>

      @if (applicationsService.applications().length === 0) {
        <div class="empty-state">
          <p>No applications yet</p>
          <p class="empty-hint">Apply to jobs using the Easy Apply button</p>
        </div>
      } @else {
        <div class="applications-list">
          @for (app of applicationsService.applications(); track app.id) {
            <div class="app-card">
              <div class="app-info">
                <h3 class="app-title">{{ app.jobTitle }}</h3>
                <p class="app-company">{{ app.companyName }}</p>
                <p class="app-date">Applied {{ getTimeAgo(app.appliedAt) }}</p>
              </div>
              <div class="app-status-section">
                <select
                  class="status-select"
                  [ngModel]="app.status"
                  (ngModelChange)="updateStatus(app.id, $event)"
                  [class]="'status-select status-' + app.status"
                >
                  <option value="applied">Applied</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .applications-page {
      max-width: 900px;
      margin: 0 auto;
      padding: 32px 16px;
    }
    .page-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-text);
      margin: 0 0 24px;
    }
    .stats-row {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 32px;
    }
    .stat-card {
      flex: 1;
      min-width: 100px;
      background: var(--color-card);
      border-radius: 12px;
      padding: 16px;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      border: 1px solid #f1f5f9;
    }
    .stat-count {
      display: block;
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--color-text);
    }
    .stat-label {
      display: block;
      font-size: 0.8rem;
      color: var(--color-muted);
      margin-top: 2px;
    }
    .stat-applied .stat-count { color: var(--color-primary); }
    .stat-interview .stat-count { color: #f59e0b; }
    .stat-offer .stat-count { color: #059669; }
    .stat-rejected .stat-count { color: #ef4444; }
    .empty-state {
      text-align: center;
      padding: 64px 16px;
      color: var(--color-muted);
    }
    .empty-hint {
      font-size: 0.9rem;
      margin-top: 4px;
    }
    .applications-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .app-card {
      background: var(--color-card);
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      border: 1px solid #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .app-info {
      min-width: 0;
    }
    .app-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-text);
      margin: 0;
    }
    .app-company {
      font-size: 0.85rem;
      color: var(--color-muted);
      margin: 4px 0 0;
    }
    .app-date {
      font-size: 0.8rem;
      color: #9ca3af;
      margin: 4px 0 0;
    }
    .status-select {
      padding: 8px 12px;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      outline: none;
      background: #fff;
    }
    .status-applied {
      color: var(--color-primary);
      border-color: #c7d2fe;
      background: #eef2ff;
    }
    .status-interview {
      color: #f59e0b;
      border-color: #fde68a;
      background: #fffbeb;
    }
    .status-offer {
      color: #059669;
      border-color: #a7f3d0;
      background: #ecfdf5;
    }
    .status-rejected {
      color: #ef4444;
      border-color: #fecaca;
      background: #fef2f2;
    }

    @media (max-width: 768px) {
      .app-card {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class ApplicationsComponent {
  constructor(public applicationsService: ApplicationsService) {}

  updateStatus(id: string, status: ApplicationStatus): void {
    this.applicationsService.updateStatus(id, status);
  }

  getTimeAgo(timestamp: number): string {
    const unixSeconds = timestamp > 1e11 ? Math.floor(timestamp / 1000) : timestamp;
    const now = Math.floor(Date.now() / 1000);
    const diff = Math.max(0, now - unixSeconds);
    const days = Math.floor(diff / 86400);
    if (days === 0) return 'today';
    if (days === 1) return '1 day ago';
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    if (months === 1) return '1 month ago';
    return `${months} months ago`;
  }
}
