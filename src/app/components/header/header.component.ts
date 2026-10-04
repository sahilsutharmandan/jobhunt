import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SavedJobsService } from '../../services/saved-jobs.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="header-inner">
        <a routerLink="/" class="logo">JobHunt</a>
        <nav class="nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Jobs</a>
          <a routerLink="/saved" routerLinkActive="active">
            Saved
            @if (savedCount() > 0) {
              <span class="badge">{{ savedCount() }}</span>
            }
          </a>
          <a routerLink="/applications" routerLinkActive="active">Applications</a>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
    }
    .header-inner {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 16px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-primary);
      text-decoration: none;
    }
    .nav {
      display: flex;
      gap: 8px;
    }
    .nav a {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      color: var(--color-muted);
      transition: background 0.2s, color 0.2s;
    }
    .nav a:hover {
      background: var(--color-subtle);
      color: var(--color-text);
    }
    .nav a.active {
      background: var(--color-primary);
      color: #fff;
    }
    .badge {
      min-width: 20px;
      padding: 1px 6px;
      border-radius: 10px;
      background: var(--color-primary-soft);
      color: var(--color-primary);
      font-size: 0.72rem;
      font-weight: 700;
      text-align: center;
    }
    .nav a.active .badge {
      background: rgba(255, 255, 255, 0.25);
      color: #fff;
    }
  `]
})
export class HeaderComponent {
  private readonly savedJobs = inject(SavedJobsService);

  readonly savedCount = signal(this.savedJobs.savedJobs().length);
}
