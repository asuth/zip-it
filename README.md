# Zip It

Zip It tells you when you're mouth breathing. It sits in your macOS menu bar, uses your webcam to track your lips, and plays a sound when your mouth has been open for a few seconds.

Most of the time there's no window — it just runs quietly and clicks at you when you slip up. Click the menu bar icon if you want to see what it's seeing.

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

## Privacy

Everything runs locally. The webcam feed is processed in-process by bundled WASM — no network requests are made, ever. You can verify this: the app is ~500 lines across 3 files, and a Content Security Policy blocks all outbound connections.

Full details:
- All MediaPipe assets (WASM runtime + model) are bundled in `vendor/`
- CSP: `connect-src 'self'` — no outbound fetch/XHR/WebSocket possible
- Electron sandbox enabled, context isolation on, node integration off
- Navigation and popup windows blocked at the process level
- No analytics, no telemetry, no accounts

## Built with

- [Electron](https://www.electronjs.org/)
- [MediaPipe Face Landmarker](https://developers.google.com/mediapipe/solutions/vision/face_landmarker) (Apache 2.0)
- Web Audio API

## License

MIT. See [LICENSE](LICENSE) and [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).
