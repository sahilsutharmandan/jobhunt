# JobHunt application fixes — evidence

Before images are the three screenshots supplied by the user. After images were captured in Chromium at the same 1280 × 900 viewport, using a current live job listing because the feed has changed. Applicant details and the resume are test data; submission writes to this app's local browser storage.

| Issue | Before | After | Result |
| --- | --- | --- | --- |
| Errors displayed immediately on Easy Apply | [Before](before/1-clicked-easy-apply.png) | [After](after/1-clicked-easy-apply.png) | Clean initial form; clicking Next with empty fields still shows all three required errors. |
| Incorrect application age | [Before](before/2-applications-after-submitting.png) | [After](after/2-applications-after-submitting.png) | New submission displays Applied today. Existing millisecond timestamps use the same corrected calculation. |
| Interview also counted as Offer | [Before](before/3-after-changing-status-to-interview.png) | [After](after/3-after-changing-status-to-interview.png) | Total 1, Applied 0, Interview 1, Offer 0, Rejected 0. |

## Additional verification

- [Mobile Interview](after/4-mobile-interview.png) and [mobile Easy Apply](after/5-mobile-easy-apply.png), viewport 393 × 852.
- Browser checks passed for initial/reopened form state, required personal details, required resume, review, submission, all four status counts, and Interview persistence after refresh.
- Application age checks passed for today, 1 day, 7 days, 1 month, 2 months, and a future timestamp (clamped to today).
- Application card and modal fit the narrow viewport. The existing mobile header has horizontal overflow; that separate layout issue was not changed.
- No browser page errors. Production build and `git diff --check` passed.
- Existing job-posted age labels and job-description rendering are separate from the application date and were not changed.

Browser verification is retained in `scripts/verify-apply.cjs`. Start the development server on port 4200, then run the script with Playwright available (or set `PLAYWRIGHT_MODULE` to its installed module path). The script uses an isolated browser session and the live job feed.
