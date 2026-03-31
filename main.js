const { app, BrowserWindow, Tray, Menu, systemPreferences, screen, ipcMain, nativeImage } = require('electron');
const path = require('path');

app.setName('Zip It');

let tray = null;
let win = null;

function createWindow() {
  win = new BrowserWindow({
    width: 250,
    height: 250,
    show: false,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    hasShadow: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    roundedCorners: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('index.html');
  win.webContents.setBackgroundThrottling(false);

  // Block all navigation away from the app
  win.webContents.on('will-navigate', (e) => e.preventDefault());

  // Block new window creation
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  // Hide instead of close
  win.on('close', (e) => {
    e.preventDefault();
    win.hide();
  });

  // Hide when clicking outside (only if not user-opened)
  win.on('blur', () => {
    if (!userOpened) win.hide();
  });
}

let userOpened = false; // true when user clicked tray to open

function toggleWindow() {
  if (win.isVisible()) {
    win.hide();
    userOpened = false;
    return;
  }

  const trayBounds = tray.getBounds();
  const winBounds = win.getBounds();
  const x = Math.round(trayBounds.x + trayBounds.width / 2 - winBounds.width / 2);
  const y = Math.round(trayBounds.y + trayBounds.height + 4);
  win.setPosition(x, y, false);
  win.show();
  userOpened = true;
}

app.whenReady().then(async () => {
  // Request camera permission on macOS
  if (process.platform === 'darwin') {
    const status = systemPreferences.getMediaAccessStatus('camera');
    if (status !== 'granted') {
      await systemPreferences.askForMediaAccess('camera');
    }
  }

  // Hide dock icon — menu bar app only
  app.dock.hide();

  const normalIcon = nativeImage.createFromPath(path.join(__dirname, 'mouthTemplate.png'));
  const alertIcon = nativeImage.createFromPath(path.join(__dirname, 'mouthAlert.png'));

  tray = new Tray(normalIcon);
  tray.setToolTip('Zip It');
  const quitMenu = Menu.buildFromTemplate([
    { label: 'Quit Zip It', click: () => { win.destroy(); app.quit(); } },
  ]);
  tray.on('click', () => toggleWindow());
  tray.on('right-click', () => tray.popUpContextMenu(quitMenu));

  let alertShowing = false;
  ipcMain.on('alert', (_e, isAlert) => {
    if (isAlert) {
      tray.setImage(alertIcon);

      // Show window below tray icon
      if (!alertShowing) {
        const trayBounds = tray.getBounds();
        const winBounds = win.getBounds();
        const x = Math.round(trayBounds.x + trayBounds.width / 2 - winBounds.width / 2);
        const y = Math.round(trayBounds.y + trayBounds.height + 4);
        win.setPosition(x, y, false);
        win.showInactive();
        alertShowing = true;
      }
    } else {
      // Mouth closed — dismiss only if alert opened it, not the user
      if (alertShowing) {
        tray.setImage(normalIcon);
        if (!userOpened) win.hide();
        alertShowing = false;
      }
    }
  });

  ipcMain.on('show-window', () => {
    if (!win.isVisible()) {
      const trayBounds = tray.getBounds();
      const winBounds = win.getBounds();
      const x = Math.round(trayBounds.x + trayBounds.width / 2 - winBounds.width / 2);
      const y = Math.round(trayBounds.y + trayBounds.height + 4);
      win.setPosition(x, y, false);
      win.showInactive();
    }
  });

  createWindow();
});

app.on('window-all-closed', (e) => {
  // Don't quit — menu bar app stays alive
});
