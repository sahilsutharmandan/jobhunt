# Saved Jobs fixes — screenshot evidence

The before images are the three original user-provided screenshots. After images were captured in Chrome at 1280×900, with additional mobile captures at 393×852.

After captures use deterministic test data matching the three visible titles/companies. The clipped title's unknown suffix and job descriptions are representative fixture text, not recovered live listing content. The test feed intentionally includes only Software Engineer, proving saved-job details open even when that job is absent from the loaded feed.

| Issue | Before | After |
| --- | --- | --- |
| Long title clipped | [Original saved page](before/1-saved-jobs-page.png) | [Full title wraps](after/1-saved-jobs-page.png) |
| Remove retains the wrong job | [Original removal result](before/2-after-clicking-remove-on-software-engineer.png) | [Only the two other jobs remain, after reload](after/2-after-removing-software-engineer.png) |
| View opens an unselected list | [Original View result](before/3-after-clicking-view.png) | [Chosen IT job details are open](after/3-after-clicking-view.png) |

Additional evidence: [Mobile saved cards](after/4-mobile-saved-jobs.png), [Mobile selected details](after/5-mobile-job-details.png).

## Verification

- Saved cards fit at 1280, 393 and 320 pixels; long titles wrap.
- Removing Software Engineer preserves both other jobs across reload.
- View opens the selected saved job even when absent from the current feed; refreshing preserves the selection.
- Browser Back returns to Saved; mobile Back to jobs clears selection, and browser Back restores it.
- Detail save/unsave and Saved page share state; unsaving keeps the open detail visible.
- Removing all jobs shows the empty state, including after reload.
- Production build and `git diff --check` passed.

Existing unrelated header overflow at narrow widths and incorrect posted-age formatting remain unchanged. The mobile checks establish card bounds, not absence of whole-page overflow. API delivery was stubbed for repeatability; live API availability was not part of these UI checks.
