const express = require('express');
const youtubedl = require('yt-dlp-exec');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: "https://yt-music-converter.vercel.app"
}));
app.use(express.json());

app.post('/convert', async (req, res) => {
  const { url, filename } = req.body;
  if (!url) return res.status(400).send("No URL provided");
  if (!filename) return res.status(400).send("No filename provided");

  // Sanitize filename (basic)
  let safeFilename = filename.replace(/[^a-zA-Z0-9-_\.]/g, '');
  if (!safeFilename.endsWith('.mp3')) safeFilename += '.mp3';

  const outputPath = path.join(__dirname, safeFilename);

  try {
    await youtubedl(
      url,
      {
        extractAudio: true,
        audioFormat: 'mp3',
        audioQuality: 0,
        ffmpegLocation: ffmpegPath,
        output: outputPath,
      }
    );
    res.download(outputPath, safeFilename, (err) => {
      if (err) console.error(err);
      fs.unlinkSync(outputPath); // delete after sending
    });
  } catch (err) {
    console.error("yt-dlp error:", err);
    return res.status(500).send("Error converting video: " + err.stderr || err.message);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
