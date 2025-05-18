import { exec } from 'node:child_process'; // Add exec for running shell commands
import fs from 'node:fs';
import { dirname } from 'node:path';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BrowserWindow, app, protocol } from 'electron';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.whenReady().then(() => {
  // Set up file protocol interception for static files
  protocol.interceptFileProtocol('file', (request, callback) => {
    const url = request.url.substr(7);

    if (url.includes('/static')) {
      const startIndex = url.indexOf('/static');
      let extractedString = url;
      if (startIndex !== -1) {
        extractedString = url.substring(startIndex);
      }
      const newPath = path.join(__dirname, 'build', 'app', extractedString);
      callback({ path: newPath });
    } else if (url.includes('/main.web.bundle')) {
      const newPath = path.join(__dirname, 'build', 'app', '/main.web.bundle');
      callback({ path: newPath });
    } else {
      callback({ path: path.normalize(url) });
    }
  });

  const win = new BrowserWindow({
    icon: path.join(__dirname, 'build', 'app', 'favicon.ico'),
    webPreferences: {
      nodeIntegration: false,
    },
  });
  win.maximize();

  win.loadFile(path.join(__dirname, 'build', 'app', 'index.html'));

  const filePath = path.join(__dirname, 'build', 'web', 'main.web.bundle');

  // Function to run the build command and reload after the process completes
  const runBuildAndReload = () => {
    // Run the build command
    exec(
      'rsbuild build -c ./config/lynx.app.ts',
      { cwd: __dirname },
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Build process failed: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`Build process stderr: ${stderr}`);
          return;
        }
        win.reload();
      },
    );
  };

  // Watch the file for changes
  fs.watch(filePath, (eventType, filename) => {
    if (filename && eventType === 'change') {
      runBuildAndReload();
    }
  });
});
