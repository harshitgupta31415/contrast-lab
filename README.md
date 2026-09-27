# Contrast Lab

Contrast Lab is a private, local-first workspace for testing foreground and background colour pairs against WCAG contrast thresholds.

## Features

- Exact contrast ratio using the WCAG relative-luminance formula
- AA and AAA results for normal and large text
- Synchronized colour pickers and hexadecimal inputs
- One-click black-or-white text recommendation
- Shareable colour pairs stored in URL query parameters
- CSS copied without a build step or account
- Responsive interaction and reduced-motion support

## Run locally

Open `index.html` directly or start a static server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`. All calculations remain in the browser; there is no analytics service or backend.

## Verify the calculations

```bash
npm test
npm run check
```

The calculation module is independent of the document and tests known contrast ratios, threshold behaviour, short hexadecimal expansion, and readable-text recommendations.

## WCAG thresholds

| Level | Normal text | Large text |
| --- | ---: | ---: |
| AA | 4.5:1 | 3:1 |
| AAA | 7:1 | 4.5:1 |

Contrast is one part of accessible design. Meaning should not depend on colour alone, and real interfaces still need keyboard, screen-reader, zoom, and user testing.

## Licence

[MIT](LICENSE)
