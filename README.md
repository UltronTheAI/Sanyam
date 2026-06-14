# 🧘 Sanyam

> Your phone: “one more reel?”  
> Sanyam: “nice try, tiny rectangle goblin.”

![phone bonk gif](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3RmbXlnaW9vM2cyNjh6dWg1ZWw0MWs5ZDNnYnB4M2EwdG82ajJraCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3o7aD2saalBwwftBIY/giphy.gif)

Sanyam is a **personal Android discipline app** built with **Expo + React Native + native Android**.

It helps you:

- ⏰ take breaks after screen-time marathons
- 💧 remember water like a responsible houseplant
- 😴 block distracting apps during sleep time
- 🧱 manage blocked apps and adult domains
- 🚪 keep an emergency unlock code, because traps are for cartoons

## 🚀 Run It

This app uses native Android modules, so **do not use Expo Go**. Expo Go will cry in the corner.

```powershell
npm install
npm run android
```

## 📦 Build APK

```powershell
cd android
$env:NODE_ENV='development'
.\gradlew.bat :app:assembleDebug --no-parallel
```

Your APK appears here:

```txt
android/app/build/outputs/apk/debug/app-debug.apk
```

Install it:

```powershell
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

## 🔐 Phone Setup

After installing, open Sanyam and tap the setup buttons:

- Usage Access → lets Sanyam read screen time
- Accessibility → lets Sanyam yeet blocked apps home
- VPN setup → enables family DNS blocking
- Notifications → lets Sanyam say “drink water bro”

## 🧠 Tech Stack

- Expo SDK 56
- React Native 0.85
- Expo Router
- Kotlin native modules
- Android AccessibilityService
- Android UsageStatsManager
- Android VpnService

## 🛟 Emergency Rule

Default unlock code:

```txt
1441
```

Keep it. Future-you may be sleepy and confused.

## 🤝 Contributing

Tiny PRs welcome. Giant PRs must bring snacks.

Read `CONTRIBUTING.md` before poking the goblin.

![typing cat gif](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdXdpNWxyNzVjOWV4ZnhmbGtibDhlNGJkaXNwYzRlcDhqbTh1bXI4dCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/JIX9t2j0ZTN9S/giphy.gif)
