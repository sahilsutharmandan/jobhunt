import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="filter-bar">
      <div class="search-wrapper">
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>
        <input
          type="text"
          class="search-input"
          placeholder="Search jobs by title, company, or tags..."
          [ngModel]="searchTerm()"
          (ngModelChange)="onSearchChange($event)"
        />
      </div>
      <div class="filters">
        <div class="chip-group">
          @for (type of jobTypes; track type) {
            <button
              class="chip"
              [class.chip-active]="activeTypes().has(type)"
              (click)="toggleType(type)"
            >{{ type }}</button>
          }
        </div>
        <button
          class="chip"
          [class.chip-active]="remoteOnly()"
          (click)="toggleRemote()"
        >Remote only</button>
      </div>
    </div>
  `,
  styles: [`
    .filter-bar {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .search-wrapper {
      position: relative;
    }
    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-muted);
    }
    .search-input {
      width: 100%;
      padding: 10px 12px 10px 38px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 0.9rem;
      outline: none;
      transition: border-color 0.2s;
      box-sizing: border-box;
      background: #fff;
      color: var(--color-text);
    }
    .search-input:focus {
      border-color: var(--color-primary);
    }
    .search-input::placeholder {
      color: var(--color-muted);
    }
    .filters {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .chip-group {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .chip {
      padding: 6px 14px;
      border-radius: 20px;
      border: 1px solid #e5e7eb;
      background: #fff;
      font-size: 0.8rem;
      cursor: pointer;
      color: var(--color-muted);
      transition: all 0.2s;
      white-space: nowrap;
    }
    .chip:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
    .chip-active {
      background: var(--color-primary);
      color: #fff;
      border-color: var(--color-primary);
    }
    .chip-active:hover {
      background: #4338ca;
      color: #fff;
    }
  `]
})
export class FilterBarComponent {
  readonly searchChange = output<string>();
  readonly filtersChange = output<{ types: Set<string>; remoteOnly: boolean }>();

  readonly searchTerm = signal('');
  readonly remoteOnly = signal(false);
  readonly activeTypes = signal<Set<string>>(new Set());

  readonly jobTypes = ['Full Time', 'Part Time', 'Contract', 'Internship'];

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.searchChange.emit(value);
  }

  toggleType(type: string): void {
    this.activeTypes.update(types => {
      const next = new Set(types);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
    this.emitFilters();
  }

  toggleRemote(): void {
    this.remoteOnly.update(v => !v);
    this.emitFilters();
  }

  private emitFilters(): void {
    this.filtersChange.emit({
      types: this.activeTypes(),
      remoteOnly: this.remoteOnly(),
    });
  }
}
