# JobHunt jobs page evidence

Before images are the supplied screenshots. After images use the live Arbeitnow feed on October 3, 2026, so listing content differs. Desktop captures are 1280 × 900; phone captures are 390 × 844 (viewport emulation).

| Issue | Before | After |
| --- | --- | --- |
| Incorrect posting ages; truncated titles | [Jobs page](before/1-jobs-page.png) | [Correct dates and readable titles](after/1-jobs-page.png) |
| Full Time variants excluded and stale detail selection | [Full Time selected](before/2-after-clicking-full-time.png) | [Matching selection and details](after/2-after-clicking-full-time.png) |
| Crowded phone header and truncated job titles | [Phone list](before/3-jobs-page-on-phone.png) | [Phone list](after/3-jobs-page-on-phone.png) |
| Phone detail navigation | Original phone list above | [Details with Back to jobs](after/4-phone-job-details.png) |

Verified with live data: initial list, Full Time filtering, selected card/detail agreement, empty search clearing details, clearing filters, keyboard job selection, phone initial list, opening details and returning, and no page overflow at 320/390/768/1280 pixels. No browser page errors occurred.

Date checks cover today, yesterday, 29/30/60 days, future dates, and invalid dates. Type checks cover Full Time, Full-time, full time, and Full-Time. Production build and git diff --check passed.
