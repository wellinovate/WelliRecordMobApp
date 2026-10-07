# WelliRecord mobile app

Expo / React Native patient app for WelliRecord. Expo Router for navigation, NativeWind v4 (Tailwind v3) for styling, pnpm for packages. This was converted from a Figma Make web prototype (React + Vite + Tailwind v4); none of that web stack remains.

## Before touching Expo or React Native APIs

Expo ships breaking changes every SDK release. Read the `expo` major version in `package.json`, then check the matching docs (`https://docs.expo.dev/versions/v<major>.0.0/`) instead of relying on memory.

## Commands

```bash
npx expo install <package>   # use instead of pnpm add; resolves SDK-compatible versions
npx expo start               # dev server
npx tsc --noEmit             # typecheck
npx expo export --platform web   # strongest build check available without a device
```

Run typecheck before declaring a task done.

## Structure

- `src/app/` — Expo Router routes. One file per screen; `(tabs)/` holds the five tab screens. Keep non-route code out of this folder.
- `src/components/common/` — shared UI (`Card`, `Row`, `Badge`, `PrimaryButton`, ...). Use `onPress`, never `onClick`.
- `src/components/navigation/` — `Header` (every screen renders its own) and the custom `BottomTabBar`.
- `src/state/WelliContext.tsx` — app state and flow actions. Navigation goes through `router` from `expo-router`.
- `src/services/`, `src/utils/` — storage, haptics, biometrics, media picker, offline sync. Each branches on `Platform.OS` for native vs web.
- `src/constants/icons.ts` — SVG icons imported as components via `react-native-svg-transformer`.

## Rules

- Use React Native primitives (`View`, `Text`, `Pressable`, `TextInput`, `ScrollView`). No `div`, `span`, `button`, or `input`.
- Style with NativeWind `className`. Web-only utilities (`inline-flex`, `grid-cols-*`, `hover:`, `space-y-*`) do not work.
- No `window`, `document`, `localStorage` or `navigator` outside a `Platform.OS === "web"` branch.
- Tailwind stays on v3 until NativeWind v5 is stable.
- If `ios/` and `android/` do not exist they are generated. Do not edit them by hand; configure native behavior in `app.json` and config plugins.
- Expo Go only bundles its own native modules. After adding a library with native code, use a development build.
