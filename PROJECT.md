# Project: Video Face Swap Implementation Fix

## Architecture
- **Backend API**: Netlify functions `generate.js` and `status.js` interface with a reliable AI service (e.g., Fal.ai or Replicate) for video face swap.
- **Frontend UI**: `media-detail.html` triggers the face swap generation and saves the task ID. `queue.html` polls the status of the generation, displays progress, and renders the finished result inside a `<video>` tag.
- **Verification Script**: Standalone script calling the selected endpoint with test assets and verifying that a valid video URL is returned.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|---|---|---|---|
| 1 | Investigation & Model Discovery | Explore Fal.ai/Replicate APIs for video face swap models returning mp4 video | none | DONE |
| 2 | Netlify Functions Overhaul | Rewrite `netlify/functions/generate.js` and `status.js` | M1 | DONE |
| 3 | Frontend Integration | Update `queue.html` and `media-detail.html` to handle video output and render it in `<video>` tags | M2 | DONE |
| 4 | Programmatic Validation | Standalone verification script (`tests/verify_video_output.js`) validating the API and E2E flow | M3 | DONE |
| 5 | Forensic Integrity Audit | Run Forensic Auditor to confirm clean, non-facade implementation | M4 | DONE |

## Interface Contracts
### Netlify Function: `generate.js` (POST)
- Input body: `{ video_url: string, image_url: string }`
- Output: `{ id: string, status: "queued" }`

### Netlify Function: `status.js` (GET)
- Query parameters: `?id=<request_id>`
- Output: `{ id: string, status: "queued" | "processing" | "succeeded" | "failed", output: string | null }`
- The `output` field on "succeeded" must be a valid URL pointing to a video file.

## Code Layout
- Netlify Functions: `netlify/functions/generate.js`, `netlify/functions/status.js`
- Frontend HTML: `queue.html`, `media-detail.html`
- Test Script: `tests/verify_video_output.js`
