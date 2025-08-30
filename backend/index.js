const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/convert', (req, res) => {
  const { url, filename } = req.body;
  if (!url) return res.status(400).send("No URL provided");
  if (!filename) return res.status(400).send("No filename provided");

  // Sanitize filename (basic)
  let safeFilename = filename.replace(/[^a-zA-Z0-9-_\.]/g, '');
  if (!safeFilename.endsWith('.mp3')) safeFilename += '.mp3';

  const outputPath = path.join(__dirname, safeFilename);

  const command = `yt-dlp -x --audio-format mp3 --audio-quality 0 --ffmpeg-location /opt/homebrew/bin -o "${outputPath}" ${url}`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error("Error:", err);
      console.error("stderr:", stderr);
      return res.status(500).send("Error converting video: " + stderr);
    }

    res.download(outputPath, safeFilename, (err) => {
      if (err) console.error(err);
      fs.unlinkSync(outputPath); // delete after sending
    });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
