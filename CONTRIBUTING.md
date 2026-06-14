# 🤝 Contributing

Thanks for helping Sanyam become less goofy and more useful.

## Tiny Rules

- Keep changes small.
- Explain what you changed.
- Test Android stuff on Android, not Expo Go.
- Do not remove the emergency unlock. That button is the parachute.

## Good PR Ideas

- Cleaner UI
- Better blocklist presets
- More helpful setup screens
- Safer break-mode behavior
- Less “oops my phone is trapped” energy

## Before PR

```powershell
npx tsc --noEmit
cd android
$env:NODE_ENV='development'
.\gradlew.bat :app:assembleDebug --no-parallel
```

If it builds, you get one imaginary cookie. 🍪
