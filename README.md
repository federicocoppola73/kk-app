# Kit & Kick — App

Mobile football quiz game built with React Native, Expo and TypeScript.

## Stack
- Expo SDK 58
- React Native 0.88
- React 19.3
- TypeScript

## Requirements
- Node.js 22.13 or newer
- npm
- Expo CLI (used through `npx`)

## Run locally
```bash
npm install
npx expo start
```

Then scan the QR code with a compatible development client, or use the iOS/Android simulator.

## Project rules
- App code lives in this repository. Editorial game content lives in [kk-data](https://github.com/federicocoppola73/kk-data).
- Do not hardcode question catalogs in screen components.
- Keep UI strings translatable. Supported launch locales: `it`, `en`, `es`, `fr`, `de`.
- Resolve content assets through asset references; do not couple screens to GitHub raw URLs.
- Never put Firebase Admin credentials, private keys or secrets in the app.
- Scores and XP that affect leaderboards must be validated by a trusted backend.

## Current status
Initial project scaffold only. The app has not yet been connected to a backend or the content repository.
