# Zip It

A macOS menu bar app that watches your posture, catches you touching your face, and tells you when you're mouth breathing.

It sits in your menu bar, monitors your webcam, and nudges you when you slip. Three things, three alerts:

- **Mouth open too long** — "ZIP IT" (buzzy triple-click)
- **Slouching** — "SIT UP" (sharp ascending fifth)
- **Hand on face** — "HANDS OFF" (glass tink)

Most of the time there's no window. It just watches in the background. Click the menu bar icon if you want to see what it's seeing.

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

Launch the app and sit up straight. The posture detector calibrates from absolute geometry — no setup needed. If you want to fine-tune the mouth detection threshold, click the gear icon to recalibrate.

Right-click (or two-finger click) the menu bar icon to quit.

## How it works

On startup, Zip It probes each connected webcam with MediaPipe to find the one most facing you (filtering out iPhone and Continuity cameras). It scores each camera by face symmetry and apparent face width — front-facing views score highest.

Three MediaPipe models run simultaneously on your webcam feed:

**Mouth detection** — [Face Landmarker](https://developers.google.com/mediapipe/solutions/vision/face_landmarker) tracks 478 facial landmarks. Zip It measures the vertical gap between inner lip pairs, normalized by outer lip height. This is immune to smiling (smiles don't open the gap) and head angle (both measurements scale together). When the ratio exceeds the threshold for 3 seconds, it alerts.

**Posture detection** — [Pose Landmarker](https://developers.google.com/mediapipe/solutions/vision/pose_landmarker) tracks your nose relative to your shoulders. The nose-to-shoulder-midpoint distance, normalized by shoulder width, gives a camera-distance-invariant slouch measurement. When it drops below the threshold for 4 seconds, it alerts.

**Hand-on-face detection** — [Hand Landmarker](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker) detects up to two hands. If any hand landmark overlaps the face bounding box for more than 1 second, it alerts.

Detection runs at 4Hz in the background, full framerate when the window is open. All three models use GPU acceleration.

### The HUD

The bottom bar shows three columns — posture (bone icon), hands (hand icon), and mouth (lips icon). Each has a percentage and a timer bar that fills up as the countdown to alert progresses. When an alert fires, the column turns red with pulsing text.

## Privacy and security

An app that points a camera at your face all day should earn your trust, so here's exactly what Zip It does and doesn't do.

**Your webcam feed never touches a network.** All detection runs locally through MediaPipe WASM binaries bundled in the app. There are no API calls, no cloud services, no servers. The app ships with everything it needs in the `vendor/` directory and makes zero network requests at runtime.

**The app enforces this at multiple layers:**

- **Content Security Policy** — `connect-src 'self'` means no outbound network requests, period.
- **Electron sandbox** (`sandbox: true`) — the renderer can't touch the filesystem or spawn processes.
- **Context isolation** and disabled Node integration — no access to Node.js APIs from the renderer.
- **Locked-down IPC** — only 2 one-way message channels exist, both just toggle UI state.
- **No navigation, no popups** — all attempts to navigate away or open windows are blocked.

**No analytics, no telemetry, no accounts, no data persistence** beyond your calibration threshold in local storage.

The entire app is ~700 lines across 3 files (`main.js`, `preload.js`, `index.html`). You can read the whole thing in a few minutes.

## Built with

- [Electron](https://www.electronjs.org/)
- [MediaPipe Face Landmarker](https://developers.google.com/mediapipe/solutions/vision/face_landmarker) (Apache 2.0)
- [MediaPipe Pose Landmarker](https://developers.google.com/mediapipe/solutions/vision/pose_landmarker) (Apache 2.0)
- [MediaPipe Hand Landmarker](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker) (Apache 2.0)
- Web Audio API

## License

MIT. See [LICENSE](LICENSE) and [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).
