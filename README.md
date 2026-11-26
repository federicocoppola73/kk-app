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
- Expo Go on your phone for a quick preview, if compatible with this SDK; otherwise use an Expo development build.

## Run locally

1. Install Node.js 22.13+ and npm on your computer.
2. Clone this repository:
   `git clone https://github.com/federicocoppola73/kk-app.git`
3. Enter the project folder:
   `cd kk-app`
4. Install dependencies:
   `npm install`
5. Start Expo:
   `npx expo start`
6. Follow the terminal instructions to open the app on a simulator or scan the QR code with the compatible Expo client on your phone. The phone and computer should be on the same network; if the network blocks local discovery, try `npx expo start --tunnel`.

Useful commands:
- `npm run typecheck` — run the TypeScript check.
- `npm run android` — start for Android.
- `npm run ios` — start for iOS (requires macOS for the iOS simulator).
- `npm run web` — start the web preview.

## Project structure
- `App.tsx` — application entry point.
- `src/screens/` — application screens.
- `src/theme/` — shared design tokens.
- `src/i18n/` — supported language configuration.
- Game content lives in [kk-data](https://github.com/federicocoppola73/kk-data).

## Project rules
- Do not hardcode question catalogs in screen components.
- Keep UI strings translatable. Supported launch locales: `it`, `en`, `es`, `fr`, `de`.
- Resolve content assets through asset references; do not couple screens to GitHub raw URLs.
- Never put Firebase Admin credentials, private keys or secrets in the app.
- Scores and XP that affect leaderboards must be validated by a trusted backend.

## Current status
The first Home screen is in place as a visual UI preview. Quiz interactions, navigation, localization wiring, backend integration and device testing are not implemented yet. The project has not been installed, typechecked or launched in this environment.
