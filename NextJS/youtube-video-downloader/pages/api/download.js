// pages/api/download.js
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { url } = req.body;

    if (!url) {
      return res.status(400).send({ message: 'URL is required' });
    }

    const downloadPath = path.join(process.cwd(), 'public', 'downloads');

    if (!fs.existsSync(downloadPath)) {
      fs.mkdirSync(downloadPath, { recursive: true });
    }

    const ytdlp = spawn('yt-dlp', ['-o', `${downloadPath}/%(title)s.%(ext)s`, url]);

    ytdlp.stdout.on('data', data => {
      const message = data.toString();
      console.log(`stdout: ${message}`);
      if (res.socket.server.io) {
        res.socket.server.io.emit('progress', message);
      }
    });

    ytdlp.stderr.on('data', data => {
      const message = data.toString();
      console.error(`stderr: ${message}`);
      if (res.socket.server.io) {
        res.socket.server.io.emit('progress', message);
      }
    });

    ytdlp.on('close', code => {
      if (code === 0) {
        fs.readdir(downloadPath, (err, files) => {
          if (err) {
            return res.status(500).send({ message: 'Error reading download directory' });
          }
          const latestFile = files
            .map(file => ({
              name: file,
              time: fs.statSync(path.join(downloadPath, file)).mtime.getTime(),
            }))
            .sort((a, b) => b.time - a.time)[0].name;
          res.status(200).send({ message: 'Download complete!', file: `/downloads/${latestFile}` });
        });
      } else {
        res.status(500).send({ message: 'Download failed!' });
      }
    });
  } else {
    res.status(405).send({ message: 'Only POST requests allowed' });
  }
}
