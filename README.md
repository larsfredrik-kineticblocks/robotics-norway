# Robotics Norway

Public website for Robotics Norway, the Norwegian network for companies that build robots and physical AI. The network was founded on 5 November 2026 at Startuplab in Oslo.

The site is English. It publishes the founding charter, a document index, founding participants, projects, and a membership application. Search runs in the browser over a corpus built from those sources.

## Run locally

```bash
npm install
npm run dev
```

The dev server uses port 4317 in the hosted preview. For a local default:

```bash
npx next dev --port 4317
```

Open [http://127.0.0.1:4317](http://127.0.0.1:4317).

`npm test` regenerates the search corpus and runs the unit tests. `npm run build` (`next build`) succeeds with no environment variables set. Without a database, pages render from the files in `data/` and `content/`.

## Pages

- `/` — short description, the public charter (introduction and six points), search, and the document index
- `/documents` — shared documents, plus a link to the members-only folder
- `/members` — founding organisations, then individual members, and a link to the join form
- `/join` — application for a company, organisation or individual, stored as pending when `DATABASE_URL` is set
- `/projects` — project list. Add another object to `content/projects.ts` to publish a new project
- `/contact` — Lars-Fredrik Forberg, administrator
- `/search` — grouped results, plus a clearly labelled web-search fallback
- `/admin` — Google sign-in, limited to the administrator allowlist

## Environment variables

Copy `.env.example` to `.env.local`. Do not commit `.env.local` or any real secret.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | No | Postgres connection string (Neon or Vercel Postgres). When unset, the site uses the bundled founding list and will not store applications. |
| `AUTH_SECRET` | For admin sign-in | Auth.js session secret. Generate with `npx auth secret`. |
| `AUTH_GOOGLE_ID` | For admin sign-in | Google OAuth client id. |
| `AUTH_GOOGLE_SECRET` | For admin sign-in | Google OAuth client secret. |
| `ADMIN_EMAILS` | No | Extra administrator emails, comma-separated. `lars.fredrik@kineticblocks.com` is always allowed. |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical URL. Defaults to `https://roboticsnorway.org`. |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Only for Drive sync | Service account JSON string, or a path to the JSON file. |
| `DRIVE_FOLDER_ID` | Only for Drive sync | Shared Drive id. The known folder is `0AOC8ZRNR_c8xUk9PVA`. |

## Database

The member table is Postgres, accessed with Drizzle and the `pg` driver. Use a pooled Neon or Vercel Postgres URL in production.

```bash
DATABASE_URL="postgres://..." npm run db:setup
```

`db:setup` applies the SQL files in `drizzle/` in order, including `0000_members.sql` and `0001_membership_type.sql`, and seeds the public founding list as approved members, with joined date 5 November 2026. `npm run db:seed` repeats the seed. Re-running the seed refreshes those founding profiles. Membership type is `organisation` or `individual`.

Applications from `/join` are inserted with status `pending`. They appear on `/members` only after an administrator approves them. If the database is down or unset, public pages fall back to `data/members.source.json` filtered by `lib/members.ts`.

Export from `/admin` (CSV and XLSX) requires a signed-in administrator and `DATABASE_URL`. Columns: membership type, company, affiliation, website, contact person, email, description, status, joined date. Individual applications store the person's name in the company column. Email addresses of individual members are kept for administrators and are not shown on the public directory.

## Admin and Google OAuth

1. In Google Cloud, create an OAuth client of type Web application.
2. Authorised redirect URI: `https://roboticsnorway.org/api/auth/callback/google`. Add the same path on each Vercel preview origin you use, and `http://localhost:4317/api/auth/callback/google` for local sign-in.
3. Set `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` and `AUTH_SECRET`.
4. Sign in at `/admin`. Accounts that are not on the allowlist are rejected.
5. To add an administrator, put their Google account email in `ADMIN_EMAILS`. The default address stays on the list.

`/admin` and `/api/admin/*` redirect or return 401 when there is no session cookie. The sign-in callback checks the email allowlist again.

## Documents and search

`data/documents.json` is the bundled index of the four files in the shared Drive. The folder itself is members-only: [https://drive.google.com/drive/folders/0AOC8ZRNR_c8xUk9PVA](https://drive.google.com/drive/folders/0AOC8ZRNR_c8xUk9PVA). Each file link is shared as anyone-with-the-link can view.

`npm run content` rebuilds `data/search-corpus.json` from the charter, the documents in `content/legal/`, and the public member list. The site searches that corpus in the browser with MiniSearch. Groups are Charter, News, Documents and Members.

`npm run drive:sync` refreshes the index when both Drive environment variables are set. It lists the folder with the Google Drive API, exports Google Docs and Slides to text, and regenerates the corpus. Without credentials it exits successfully and leaves the bundled index unchanged.

## Deploy on Vercel

The app is Next.js App Router and deploys with zero framework configuration. Target team: `kinetic-blocks`.

1. From the Vercel dashboard, or with the Vercel CLI logged in as a member of that team:

   ```bash
   npx vercel link --scope kinetic-blocks
   npx vercel --scope kinetic-blocks
   ```

2. In the project settings for team `kinetic-blocks`, set the environment variables from the table above for Production and Preview. Do not put secrets in the repository.
3. Create a Neon or Vercel Postgres database and set `DATABASE_URL` to its pooled connection string. After the first deploy, run `npm run db:setup` from a machine that can reach the database, or run the SQL in `drizzle/0000_members.sql` and then `npm run db:seed`.
4. Add the domain `roboticsnorway.org` in the Vercel project (Domains). Point the DNS records at Vercel as the dashboard instructs, then set `NEXT_PUBLIC_SITE_URL=https://roboticsnorway.org`.
5. Add the production OAuth redirect URI in Google Cloud, matching the domain above.
6. Production builds do not need Drive credentials. Run `npm run drive:sync` locally when the shared folder changes, commit the updated `data/documents.json`, `content/legal/extracted/` and `data/search-corpus.json`, and redeploy.

## Member list

The public directory is seeded from `data/members.source.json`. Organisations and individual members who were present at or part of the founding meeting are included. Unknown organisations, companies that declined membership, and entries flagged uncertain are left out. Approved individuals are listed under Individual members, with name and an optional affiliation, and without a public email. Websites and logos marked uncertain in the source are not shown as if they were confirmed. Sonair’s image URL is an Open Graph picture, not a confirmed logo, so the card uses initials.
