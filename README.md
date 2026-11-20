# Tilawatif

A responsive Quran listening experience built with Next.js App Router, React, PostgreSQL/Drizzle for the included demo, and optional Firebase Authentication + Firestore for real user accounts. Designed in midnight blue, electric blue and silver.

## What is working

- Responsive desktop sidebar, mobile five-tab navigation, sticky bottom mini-player, Home, Search, Reciters, Library, Profile, Settings, membership comparison, full player/queue, auth and loading screens.
- Search all **114 Surahs** by name or number; search reciters; query Juz 1–30 by `Juz 30` or the Juz filter. Note that a Surah may span multiple Juz; displayed Juz is where the Surah begins, and Juz search includes the Surah containing the start of the Juz.
- Two reciter profiles: Mishary Rashid Alafasy and Abdul Rahman Al-Sudais, each with biography, follow, 114 metadata entries and availability notice.
- Playlists can be created, renamed, deleted, and populated with or emptied of catalog entries. Favourites, saved recitations, followed reciters, preferences and queue controls are interactive. The demo account starts with two editable playlists and a listening-history entry.
- Firebase-enabled signup, email/password login, Google popup sign-in, reset-email, persistent auth state, logout; local demo profile flow when Firebase is not configured.
- Real loading screen during successful Continue, followed automatically by Home. Validation errors stay on the form and are actionable. Failed saves return to the form with an error; there is no hanging transition.
- Firestore-backed per-user profile, playlists, saved items, history and preferences when authenticated with Firebase. PostgreSQL-backed persistent demo account and guest profiles when not authenticated.

## Important availability and asset notes

**The exact Tilawatif logo file in the request was not mounted in the project filesystem.** The app is ready to display it at `public/images/tilawatif-logo.png`: place the *original unmodified square image* there. Header, sidebar and dedicated loading screen automatically use that file, with `object-fit: contain` to avoid cropping. Until it exists, a temporary typographic brand mark is shown. The landscape mosque image in `public/images/night-mosque.jpg` is decorative cover art, not a substitute for the logo.

**No licensed recording URLs were supplied.** All 228 reciter/Surah combinations are metadata-only with `audioUrl: null`, `duration: null`, `licensed: false`. Play, seek, ±10 seconds, background playback, repeat-audio, sleep-stop and downloads cannot actually stream audio yet; the UI visibly explains this instead of faking a stream, duration, payment, download or listening time. Queue selection, navigation, favourites, speed/repeat/sleep preferences and other non-audio controls work. To activate playback, secure distribution permission, publish real URLs through trusted backend/catalog tooling, and connect an HTMLAudioElement/Media Session handler with progress persistence. Do not upload copyrighted recordings without authorization.

**Pro is a product preview, not a purchase.** No payment gateway or entitlement backend is connected; no charges occur. Offline downloads require licensed audio, authenticated entitlements and authorized storage delivery. Basic listening should remain free when available.

## Getting started

1. Install: `npm install`
2. Provide `DATABASE_URL` in `.env` (PostgreSQL).
3. Apply schema: `npx drizzle-kit push`
4. Run: `npm run dev`
5. Open `/`. The shared demo account is populated automatically on first API read. To create an isolated guest profile, go to Profile → Create demo profile → Continue as demo guest. Guest profiles are persistent in PostgreSQL and identified in this browser's localStorage, but they are **not authenticated accounts**.

### Firebase configuration

Create a Firebase project and web app, enable **Authentication → Email/Password** and **Google**, add your domain to Authorized domains, create **Cloud Firestore**, and create **Cloud Storage** only when there is a licensed media workflow. Put the following values in `.env.local`:

```text
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

Restart Next.js after setting env vars. Deploy `firestore.rules` as the Firestore rules and `storage.rules` as the Storage rules. Firestore rules permit only the owner to access their user documents; catalog writes are denied to browser clients. Storage is deny-all until a licensed publishing pipeline exists. Never put service account secrets in `NEXT_PUBLIC_` variables. The SDK is initialized in `src/lib/firebase.ts`; auth is in `src/app/page.tsx`; Firestore persistence is in `src/lib/cloud-data.ts`.

**Production security note:** `/api/data` is an intentionally unauthenticated PostgreSQL **demo/guest-only** endpoint keyed by a browser-held ID. Do not use it for privileged user data or payments. Firebase-authenticated users go directly to Firestore with UID-scoped security rules. To productionize shared server APIs, verify Firebase ID tokens server-side before any user-scoped reads or writes, add request rate limits, and migrate anonymous guest records with a verified ownership flow.

### Firestore structure

```text
users/{uid}                         name, email, updatedAt
users/{uid}/playlists/{playlistId}  name, description, trackIds[], createdAt
users/{uid}/saved/{kind_trackId}    kind ('favorite'|'saved'|'follow'), trackId, createdAt
users/{uid}/history/{trackId}       trackId, progress(seconds), plays, lastPlayed
users/{uid}/settings/preferences    language, theme, speed, repeat, sleepMinutes
reciters/{reciterId}                name, bio, artworkPath, published (read-only curated future catalog)
surahs/{surahNumber}                number, name, verses, juz (read-only curated future catalog)
recordings/{recordingId}            reciterId, surahNumber, licensed, storagePath, duration (future authorized catalog)
subscriptions/{uid}                 plan, status, providerId, currentPeriodEnd (future trusted billing only)
```

The initial catalog is shipped locally in `src/lib/catalog.ts` rather than misleadingly claiming live Firestore media records exist. `src/lib/firebase.ts` also initializes Cloud Storage for future licensed assets. The storage rules currently deny all client access. The `recordings` and `subscriptions` collections above are planned structures, not populated or billed.

### PostgreSQL schema

Defined in `src/db/schema.ts` and applied by Drizzle: `profiles` (demo/guest identity), `playlists`, `playlist_items` (many-to-many tracks), `saved_tracks` (favourite/saved/follow), `listening_history` (progress/plays/lastPlayed), `preferences` (language/theme/speed/repeat/sleep). Demo actions are exposed through `GET/POST /api/data`. `src/app/api/health/route.ts` is the runtime health endpoint.

## Screen and state guide

- **Home:** greeting, image-backed welcome banner, continue listening, popular Surahs, featured reciters, daily reflection, recommended recitations, user playlists, recent items. The top-right avatar opens Profile. The bottom mini-player persists on every tab.
- **Search:** input, All/Surahs/Reciters/Juz filters, recent searches in localStorage (reuse/clear), popular query chips, result counts and empty state. Surah results open the player; reciter results open profiles.
- **Reciters:** discovery cards, follow buttons and profiles with 114 entries per reciter. Collection action queues their metadata and opens the player; an honest status warns that actual audio is unavailable.
- **Full player:** track artwork, metadata, queue view and removal, previous/next, favourite, save, add to playlist, speed, repeat and sleep preference. Playback-dependent controls report the licensing blocker. A real future audio engine should own play/pause, seeking, Media Session background handling, timer expiration and history progress writes.
- **Library:** All/Playlists/Favourites/Saved/Downloads filters, create/rename/delete playlist, add/remove tracks, recently explored. Downloads explains the Pro/license requirement.
- **Profile:** name/email, saved statistics, history, subscription status, Settings, account entry and logout. Advanced statistics are a future Pro feature; displayed counts are based on real saved demo/user records, not invented plays.
- **Settings:** dark/light theme, language preference, default speed, sleep preference, repeat, account/privacy/about. Non-English UI translations are not yet bundled; selecting a language stores preference only.
- **Membership:** transparent Free/Pro feature comparison. Pro payment button only explains that payment integration is pending.
- **Entry flow:** on Firebase-enabled signup/login, validate inputs → start submitting indicator → Firebase Auth → write Firestore profile → render dedicated loading screen with brand and animated status → load user's Firestore data → pause briefly for a smooth transition → close entry and navigate Home. Local demo entry uses the same path but creates a persistent PostgreSQL guest profile, never a pretend password account. Errors restore the form with a message.

## Key code locations

- `src/app/page.tsx` — client-side screen composition, navigation and state machines
- `src/app/globals.css` — visual design, desktop/mobile responsive styles and transitions
- `src/lib/catalog.ts` — 114 Surah records, reciter biographies, nullable audio metadata
- `src/lib/firebase.ts` — optional Firebase app/auth/Firestore/Storage init
- `src/lib/cloud-data.ts` — signed-in Firestore user collection operations
- `src/app/api/data/route.ts` — persistent PostgreSQL demo CRUD API and initial demo seeding
- `src/db/schema.ts` — relational demo schema

## Next production integrations

1. Provide the exact original logo PNG in the prepared asset path.
2. Obtain redistribution rights and ingest licensed audio; add URLs/durations only after verification.
3. Build the actual browser audio/Media Session engine, periodic progress updates and licensed-download delivery.
4. Add trusted payment provider webhooks and entitlement checks before enabling Pro or downloads.
5. Finish localization and a published legal privacy policy; harden demo endpoint or remove it for a fully authenticated deployment.
