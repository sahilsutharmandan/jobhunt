import { Routes } from '@angular/router';
import { JobListComponent } from './pages/job-list/job-list.component';
import { SavedJobsComponent } from './pages/saved-jobs/saved-jobs.component';
import { ApplicationsComponent } from './pages/applications/applications.component';

export const routes: Routes = [
  { path: '', component: JobListComponent },
  { path: 'saved', component: SavedJobsComponent },
  { path: 'applications', component: ApplicationsComponent },
];
