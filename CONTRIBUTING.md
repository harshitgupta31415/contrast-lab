# Contributing to Contrast Lab

Contributions should improve calculation correctness, accessibility, or focused colour exploration.

Run `npm test` and `npm run check` before opening a pull request. Calculation changes require a known reference pair and threshold-boundary test. UI changes must remain usable with a keyboard, at 200% zoom, with reduced motion, and at narrow viewport widths.

Keep the application build-free and local-first. Do not add analytics, remote font dependencies, or colour uploads.
