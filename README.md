# The Alpago — Version 3 Standalone

Self-contained Next.js project prepared for deployment as a single-page presentation.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production

```bash
npm run build
npm start
```

The project exposes only the Version 3 page at `/`. Unknown routes return the standard Next.js 404 response.

Interactive controls are intentionally limited to:

- Awards & Achievements cards and their detail drawers
- Make an enquiry and its enquiry drawer

Menu, Explore, Explore All, Learn More, Meet the Team, the language label, and the logo are deliberately non-navigational while retaining their visual presentation and hover treatment where applicable.
