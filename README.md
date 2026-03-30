# Zip It

Zip It tells you when you're mouth breathing.

Chronic mouth breathing messes you up more than you'd think — it dries out your mouth, wrecks your sleep quality, contributes to brain fog during the day, and over time can actually change your facial structure. The problem is you don't notice you're doing it, especially when you're focused on a screen.

Zip It sits in your macOS menu bar and watches your lips through your webcam. When your mouth has been open for a few seconds, it clicks at you. You close your mouth, it shuts up. That's the whole thing.

Most of the time there's no window. It just monitors in the background. Click the menu bar icon if you want to see what it's seeing.

<p align="center">
  <img src="screenshots/closed.jpg" width="280" alt="Monitoring — mouth closed">
  &nbsp;&nbsp;
  <img src="screenshots/alert.jpg" width="280" alt="Alert — mouth open">
</p>

## Install

```bash
git clone https://github.com/asuth/zip-it.git
cd zip-it
npm install
npm start
```

Requires Node.js and macOS.

## Usage

First launch asks you to calibrate — close your mouth, click Go, open your mouth, click Go. After that it runs in the background. Right-click the icon to quit. Click the gear to recalibrate.

## How it works

[MediaPipe Face Landmarker](https://developers.google.com/mediapipe/solutions/vision/face_landmarker) tracks 478 facial landmarks through your webcam. Zip It computes the ratio of inner lip area to outer lip area (using the [shoelace formula](https://en.wikipedia.org/wiki/Shoelace_formula)) — this stays stable across head angles and distances because both polygons deform the same way. When the ratio exceeds your calibrated threshold for 3 seconds, it plays a triple-click sound synthesized with the Web Audio API.

Detection runs at 4Hz in the background, full framerate when the window is open.

## Privacy and security

An app that points a camera at your face all day should earn your trust, so here's exactly what Zip It does and doesn't do.

**Your webcam feed never touches a network.** All face detection runs locally through MediaPipe WASM binaries bundled in the app. There are no API calls, no cloud services, no servers involved at any point. The app ships with everything it needs in the `vendor/` directory and makes zero network requests at runtime.

**The app enforces this at multiple layers:**

- **Content Security Policy** locks down what the app can do at the browser level. `connect-src 'self'` means fetch, XHR, and WebSocket can only reach local files. Even if someone injected code into the renderer, it couldn't phone home.
- **Electron sandbox** (`sandbox: true`) runs the renderer in a restricted OS-level process that can't touch the filesystem or spawn other processes.
- **Context isolation** (`contextIsolation: true`) and disabled Node integration (`nodeIntegration: false`) mean the renderer has no access to Node.js APIs — it can't read files, run commands, or access anything outside the browser sandbox.
- **Locked-down IPC** — only 2 message channels exist between the renderer and main process, both one-way, both only toggle UI state (swap the tray icon, show/hide the window). There's no channel that could exfiltrate data even in theory.
- **No navigation, no popups** — the app blocks all attempts to navigate to a different page or open new windows.

**No analytics, no telemetry, no accounts, no data persistence** beyond your calibration threshold stored in local storage.

The entire app is ~500 lines across 3 files (`main.js`, `preload.js`, `index.html`). You can read the whole thing in a few minutes.

## Built with

- [Electron](https://www.electronjs.org/)
- [MediaPipe Face Landmarker](https://developers.google.com/mediapipe/solutions/vision/face_landmarker) (Apache 2.0)
- Web Audio API

## License

MIT. See [LICENSE](LICENSE) and [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).
