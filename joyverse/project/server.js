
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// 🎲 List of mock emotions
const emotions = ['happy', 'sad', 'angry', 'surprised', 'calm', 'excited', 'bored'];

// ✅ Random emotion route
app.get('/emotion', (req, res) => {
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  res.json({ emotion: randomEmotion });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
