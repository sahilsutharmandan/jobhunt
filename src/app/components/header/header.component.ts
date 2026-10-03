import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

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
          <a routerLink="/saved" routerLinkActive="active">Saved</a>
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
      background: #fff;
      border-bottom: 1px solid #e5e7eb;
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
      padding: 8px 16px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      color: var(--color-muted);
      transition: background 0.2s, color 0.2s;
    }
    .nav a:hover {
      background: #f1f5f9;
      color: var(--color-text);
    }
    @media (max-width: 480px) {
      .header-inner { padding: 0 12px; gap: 12px; }
      .logo { font-size: 1.2rem; }
      .nav { gap: 2px; }
      .nav a { padding: 8px 7px; font-size: 0.8rem; }
    }
    .nav a.active {
      background: var(--color-primary);
      color: #fff;
    }
  `]
})
export class HeaderComponent {}
