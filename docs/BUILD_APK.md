# 📦 Build The APK

Sanyam has custom Android code. That means:

> Expo Go = nope  
> Real APK = yes yes yes

![builder gif](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGRtODlrdnAxbWNyd2JnN2gxYmlpeXZwZW1nYXRiaGx4dHY0bmM5YyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/13HgwGsXF0aiGY/giphy.gif)

## Debug APK

```powershell
cd android
$env:NODE_ENV='development'
.\gradlew.bat :app:assembleDebug --no-parallel
```

APK:

```txt
android/app/build/outputs/apk/debug/app-debug.apk
```

Install:

```powershell
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

## If Stuff Gets Weird

Uninstall the old app:

```powershell
adb uninstall com.anonymous.Sanyam
```

Then install again. Classic “turn it off and on again,” but wearing Android shoes.
