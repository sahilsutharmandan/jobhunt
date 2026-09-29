# JobHunt

A remote job board built with Angular 18 that fetches jobs from the [Arbeitnow API](https://www.arbeitnow.com/api/job-board-api). Users can search, filter, save jobs, and simulate applying. All state is stored in localStorage with no backend required.

## Features

- **Job listing** with split-view layout (list + detail panel)
- **Search** by job title, company name, or tags
- **Filter** by job type and remote-only toggle
- **Save jobs** to a persistent saved list
- **Easy Apply** modal with 3-step form (personal details, resume upload simulation, review)
- **Applications tracker** with status management (applied, interview, offer, rejected)
- **Responsive design** with mobile-friendly layout
- **API caching** via sessionStorage to avoid rate limits

## Prerequisites

- Node.js 18+
- npm 9+

## Setup

```bash
npm install
```

## Development

```bash
npm start
```

Navigate to `http://localhost:4200/`.

## Build

```bash
npm run build
```

Build output is in the `dist/jobhunt` directory.

## Project Structure

```
src/app/
  models/           - TypeScript interfaces
  services/         - API, saved jobs, and applications services
  components/       - Reusable UI components (header, job-card, job-detail, apply-modal, filter-bar)
  pages/            - Route-level page components (job-list, saved-jobs, applications)
```
