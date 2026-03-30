# Zip It

A macOS menu bar app that watches your webcam and alerts you when you're mouth breathing.

Uses MediaPipe Face Mesh to detect mouth openness in real time. Runs fully offline — no data ever leaves your machine.

![Alert](screenshots/alert.jpg)
![Closed](screenshots/closed.jpg)

## Features

- **Menu bar app** — lives in your menu bar, click to see the live view
- **Calibration** — personalized open/closed mouth detection tuned to your face
- **Smart detection** — inner lip area tracking, resistant to head tilt
- **Sound alert** — triple-click sound when your mouth has been open too long
- **Privacy first** — all processing is local. No network connections, no data collection, no servers
- **Low power** — detection throttles when the window is hidden

## Install

```bash
git clone https://github.com/asuth/zip-it.git
cd zip-it
npm install
npm start
```

Requires Node.js and macOS (uses macOS-specific menu bar APIs).

## Usage

1. Click the mouth icon in your menu bar to open the live view
2. On first launch, calibrate: close your mouth, click Go, then open your mouth, click Go
3. The app monitors in the background — you'll hear a triple-click when your mouth has been open for 3+ seconds
4. Right-click the menu bar icon to quit
5. Click the gear icon to recalibrate anytime


## Security

- Webcam feed is processed locally and never transmitted
- Content Security Policy blocks all external network connections
- Electron sandbox enabled with context isolation
- No navigation or popup windows allowed
- Only 2 IPC channels, both one-way UI controls

## Built with

- [Electron](https://www.electronjs.org/)
- [MediaPipe Face Landmarker](https://developers.google.com/mediapipe/solutions/vision/face_landmarker)
- Web Audio API for sound synthesis

## License

MIT
