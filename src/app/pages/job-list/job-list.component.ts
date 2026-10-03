import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { JobCardComponent } from '../../components/job-card/job-card.component';
import { JobDetailComponent } from '../../components/job-detail/job-detail.component';
import { FilterBarComponent } from '../../components/filter-bar/filter-bar.component';
import { ApplyModalComponent } from '../../components/apply-modal/apply-modal.component';
import { JobService } from '../../services/job.service';
import { Job } from '../../models/job.model';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [JobCardComponent, JobDetailComponent, FilterBarComponent, ApplyModalComponent],
  template: `
    <div class="job-list-page" [class.detail-open]="!!selectedJob()">
      <div class="list-panel">
        <app-filter-bar
          (searchChange)="onSearchChange($event)"
          (filtersChange)="onFiltersChange($event)"
        />
        <div class="job-list-scroll">
          @for (job of filteredJobs(); track job.slug) {
            <app-job-card
              [job]="job"
              [active]="selectedJob()?.slug === job.slug"
              (selected)="selectJob($event)"
            />
          } @empty {
            <div class="empty-state">
              @if (jobService.loading()) {
                <p>Loading jobs...</p>
              } @else {
                <p>No jobs match your filters</p>
              }
            </div>
          }
          @if (jobService.currentPage() < jobService.lastPage()) {
            <div class="load-more-wrapper">
              <button
                class="btn-load-more"
                [disabled]="jobService.loading()"
                (click)="jobService.loadMore()"
              >
                {{ jobService.loading() ? 'Loading...' : 'Load More' }}
              </button>
            </div>
          }
        </div>
      </div>

      <div class="detail-panel-wrapper">
        @if (selectedJob()) {
          <button class="back-btn" (click)="selectedJob.set(null)">
            &larr; Back to jobs
          </button>
        }
        <app-job-detail
          [job]="selectedJob()"
          (applyClicked)="openApplyModal($event)"
        />
      </div>
    </div>

    @if (applyJob()) {
      <app-apply-modal
        [job]="applyJob()"
        (close)="applyJob.set(null)"
      />
    }
  `,
  styles: [`
    .job-list-page {
      display: grid;
      grid-template-columns: 380px 1fr;
      height: calc(100vh - 60px);
    }
    .list-panel {
      border-right: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .job-list-scroll {
      flex: 1;
      overflow-y: auto;
    }
    .detail-panel-wrapper {
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .back-btn {
      display: none;
    }
    .empty-state {
      padding: 48px 16px;
      text-align: center;
      color: var(--color-muted);
    }
    .load-more-wrapper {
      padding: 16px;
      text-align: center;
    }
    .btn-load-more {
      padding: 10px 32px;
      border-radius: 8px;
      background: var(--color-primary);
      color: #fff;
      border: none;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-load-more:hover {
      background: #4338ca;
    }
    .btn-load-more:disabled {
      background: #a5b4fc;
      cursor: default;
    }

    @media (max-width: 768px) {
      .job-list-page {
        grid-template-columns: 1fr;
      }
      .detail-panel-wrapper {
        display: none;
      }
      .job-list-page.detail-open .list-panel {
        display: none;
      }
      .job-list-page.detail-open .detail-panel-wrapper {
        display: flex;
      }
      .job-list-page.detail-open .back-btn {
        display: block;
        padding: 12px 16px;
        background: none;
        border: none;
        border-bottom: 1px solid #e5e7eb;
        font-size: 0.9rem;
        color: var(--color-primary);
        cursor: pointer;
        text-align: left;
        font-weight: 500;
      }
    }
  `]
})
export class JobListComponent implements OnInit {
  public readonly jobService = inject(JobService);
  readonly selectedJob = this.jobService.selectedJob;
  readonly applyJob = signal<Job | null>(null);
  readonly searchTerm = signal('');
  readonly activeFilters = signal<{ types: Set<string>; remoteOnly: boolean }>({
    types: new Set(),
    remoteOnly: false,
  });

  readonly filteredJobs = computed(() => {
    let jobs = this.jobService.jobs();
    const term = this.searchTerm().toLowerCase();
    const filters = this.activeFilters();

    if (term) {
      jobs = jobs.filter(j =>
        j.title.toLowerCase().includes(term) ||
        j.company_name.toLowerCase().includes(term) ||
        j.tags.some(t => t.toLowerCase().includes(term))
      );
    }

    if (filters.types.size > 0) {
      jobs = jobs.filter(j =>
        j.job_types.some(t => filters.types.has(t))
      );
    }

    if (filters.remoteOnly) {
      jobs = jobs.filter(j => j.remote);
    }

    return jobs;
  });

  ngOnInit(): void {
    this.jobService.fetchJobs(1).subscribe();
  }

  selectJob(job: Job | null): void {
    this.jobService.selectJob(job);
  }

  openApplyModal(job: Job): void {
    this.applyJob.set(job);
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
  }

  onFiltersChange(filters: { types: Set<string>; remoteOnly: boolean }): void {
    this.activeFilters.set(filters);
  }
}
