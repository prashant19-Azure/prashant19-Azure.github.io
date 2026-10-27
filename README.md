# Prashant AI Automation website starter

A responsive static website for GitHub Pages with:
- Responsive landing page and mobile navigation
- Services, process, use cases, about, contact sections
- Contact form UI with consent checkbox and basic validation
- Floating chat widget UI
- Privacy notice starter
- Optional n8n webhook connection points

## Important: not live-connected yet
The form and chat are intentionally in demo mode. They do not store or send visitor data until you configure and test your own n8n production webhooks.

## Files
- `index.html` — website
- `styles.css` — design and responsive layout
- `script.js` — form/chat behavior
- `config.js` — public configuration placeholders
- `privacy.html` — privacy notice starter; customize before enabling data collection

## Setup
1. Upload all files into the folder served by your existing GitHub Pages project site. Preserve any existing files until you have a backup.
2. Open `config.js`.
3. Add your n8n **production** webhook URL for enquiries as `leadWebhookUrl`.
4. Add a separate production webhook URL for website chat as `chatWebhookUrl`.
5. Add your public Instagram profile URL as `instagramUrl`.
6. After testing the workflows, set `enableLiveLeadForm` and/or `enableLiveChat` to `true`.
7. Test on desktop and mobile, and confirm each lead arrives in the intended destination.

## n8n notes
Use production webhook URLs from published workflows, not temporary test URLs. See the official docs:
https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/workflow-development/

Recommended separate workflows:
- `Website Lead Capture`: Webhook (POST) → validate fields → Google Sheets Append Row → optional email notification → Respond to Webhook.
- `Website AI Chat`: Webhook (POST) → validate input → AI Agent with approved business instructions → Respond to Webhook.

Configure CORS to allow only your website origin once you know the exact deployed origin. Do not put Google OAuth secrets, model API keys, or other private credentials in `config.js` or any public website file. Protect webhook endpoints against spam and misuse. The website chat expects a JSON response with one of these string properties: `reply`, `output`, `response`, or `text`.

## Before launch
- Customize the privacy notice to match actual data handling.
- Add your verified Instagram profile URL and a real contact method.
- Test invalid form input, successful submissions, webhook errors, and mobile layout.
- Only advertise services you can actually deliver.
