# CanineStride

CanineStride helps dog owners track changes in how their dogs move at home and share those observations with their veterinarian. The project pairs a proposed wearable motion sticker with a companion app for logging mobility changes, viewing activity trends, and preparing a veterinary summary.

## Try the prototype

- [CanineStride landing page](https://ropazimunya.github.io/caninestride/) explains the concept and collects feedback.
- [Interactive mobility journal](https://ropazimunya.github.io/caninestride/app/) lets you log a practice observation for Max, explore 14 days of simulated activity, and preview a printable veterinary summary.

No account is required to try the web demo. Practice observations are stored in the browser. Feedback and launch signups are sent through the site’s forms to a separate, private backend.

## Project status

The web prototype is live and uses simulated activity data. A separate SwiftUI prototype has been prepared for iPhone testing in Xcode. The wearable sensor and live data connection are still in development.

## Repository layout

| Path | Purpose |
| --- | --- |
| `index.html` | Public landing page and feedback form |
| `app/index.html` | Interactive mobility journal |
| `app/journal.css` | Journal layout and styling |
| `app/journal.js` | Sample trends, local observation storage, and report interactions |

The site is built with HTML, CSS, and JavaScript and published through GitHub Pages.
