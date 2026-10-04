import { Component, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

export type JobSort = 'recent' | 'company' | 'title';

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
          (keydown.escape)="clearSearch()"
        />
        @if (searchTerm()) {
          <button class="search-clear" type="button" aria-label="Clear search" (click)="clearSearch()">&times;</button>
        }
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
        <label class="sort">
          <span>Sort</span>
          <select [ngModel]="sort()" (ngModelChange)="onSortChange($event)">
            <option value="recent">Most recent</option>
            <option value="company">Company A–Z</option>
            <option value="title">Title A–Z</option>
          </select>
        </label>
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
      border: 1px solid var(--color-border);
      border-radius: 8px;
      font-size: 0.9rem;
      outline: none;
      transition: border-color 0.2s;
      box-sizing: border-box;
      background: var(--color-surface);
      color: var(--color-text);
    }
    .search-clear {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      width: 24px;
      height: 24px;
      border: none;
      border-radius: 50%;
      background: var(--color-subtle);
      color: var(--color-muted);
      font-size: 1rem;
      line-height: 1;
      cursor: pointer;
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
    .sort {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.8rem;
      color: var(--color-muted);
    }
    .sort select {
      padding: 5px 8px;
      border-radius: 8px;
      border: 1px solid var(--color-border);
      background: var(--color-surface);
      color: var(--color-text);
      font-size: 0.8rem;
    }
    .chip-group {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .chip {
      padding: 6px 14px;
      border-radius: 20px;
      border: 1px solid var(--color-border);
      background: var(--color-surface);
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
      background: var(--color-primary-hover);
      color: #fff;
    }
  `]
})
export class FilterBarComponent {
  readonly searchChange = output<string>();
  readonly sortChange = output<JobSort>();
  readonly filtersChange = output<{ types: Set<string>; remoteOnly: boolean }>();

  readonly searchTerm = signal('');
  readonly remoteOnly = signal(false);
  readonly activeTypes = signal<Set<string>>(new Set());
  readonly sort = signal<JobSort>('recent');

  private readonly search$ = new Subject<string>();

  readonly jobTypes = ['Full Time', 'Part Time', 'Contract', 'Internship'];

  constructor() {
    this.search$
      .pipe(debounceTime(250), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(term => this.searchChange.emit(term));
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.search$.next(value.trim());
  }

  clearSearch(): void {
    this.searchTerm.set('');
    this.searchChange.emit('');
  }

  onSortChange(value: JobSort): void {
    this.sort.set(value);
    this.sortChange.emit(value);
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
