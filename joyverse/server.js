import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import { customAlphabet } from 'nanoid';

const generateNumericCode = customAlphabet('0123456789', 6);
const app = express();
const port = 5000;

// Enable CORS for all routes
app.use(cors());
app.use(bodyParser.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/joyverse', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Therapist Schema
const therapistSchema = new mongoose.Schema({
  username: String,
  password: String,
  code: { type: String, unique: true },
  children: [
    {
      username: String,
      joinedAt: { type: Date, default: Date.now },
      assignedThemes: { type: [String], default: [] },
      playedPuzzles: { type: [String], default: [] }
    },
  ],
});
const Therapist = mongoose.model('Therapist', therapistSchema);

// Generate unique 6-digit therapist code
const generateUniqueCode = async () => {
  let code;
  let exists = true;
  while (exists) {
    code = generateNumericCode();
    exists = await Therapist.findOne({ code });
  }
  return code;
};

// Therapist Signup
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;

  const existing = await Therapist.findOne({ username });
  if (existing) return res.status(400).json({ message: 'User already exists' });

  const code = await generateUniqueCode();
  const newTherapist = new Therapist({ username, password, code });
  await newTherapist.save();

  res.status(201).json({ message: 'Signup successful', username, code });
});

// Therapist Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await Therapist.findOne({ username, password });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  res.status(200).json({ message: 'Login successful', username: user.username, code: user.code });
});

// Add Child (with theme assignment)
app.post('/api/add-child', async (req, res) => {
  const { therapistCode, childName } = req.body;

  if (!therapistCode || !childName) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const therapist = await Therapist.findOne({ code: therapistCode });
    if (!therapist) return res.status(404).json({ message: 'Therapist not found' });

    const exists = therapist.children.find(child => child.username === childName);
    if (exists) return res.status(400).json({ message: 'Child already exists' });

    therapist.children.push({ 
      username: childName, 
      assignedThemes: [] 
    });
    await therapist.save();

    res.status(200).json({ message: 'Child added successfully' });
  } catch (error) {
    console.error('Error adding child:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get Therapist Details (including children)
app.post('/api/get-therapist', async (req, res) => {
  const { username } = req.body;

  try {
    const therapist = await Therapist.findOne({ username });
    if (!therapist) return res.status(404).json({ message: 'Therapist not found' });

    res.status(200).json({
      username: therapist.username,
      code: therapist.code,
      children: therapist.children,
    });
  } catch (error) {
    console.error('Error fetching therapist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Child Login (for game)
app.post('/api/child-login', async (req, res) => {
  const { code, childName } = req.body;

  if (!code || !childName) {
    return res.status(400).json({ message: 'Both therapist code and child name are required' });
  }

  try {
    const therapist = await Therapist.findOne({ code });
    if (!therapist) return res.status(404).json({ message: 'Therapist not found' });

    const child = therapist.children.find(child => child.username === childName);
    if (!child) return res.status(401).json({ message: 'Child not found under this therapist' });

    res.status(200).json({
      message: 'Child login successful',
      username: child.username,
      assignedThemes: child.assignedThemes || []
    });
  } catch (error) {
    console.error('Error with child login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/api/get-child-themes', async (req, res) => {
  const { username, therapistCode } = req.query;

  try {
    const therapist = await Therapist.findOne({ code: therapistCode });
    if (!therapist) return res.status(404).json({ error: "Therapist not found" });

    const child = therapist.children.find(c => c.username === username);
    if (!child) return res.status(404).json({ error: "Child not found" });

    res.json({ themes: child.assignedThemes || ['underwater'] }); // Default theme
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});
app.post('/api/update-child-themes', async (req, res) => {
  const { username, therapistCode, themes } = req.body;

  try {
    await Therapist.updateOne(
      { code: therapistCode, "children.username": username },
      { $set: { "children.$.assignedThemes": themes } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update themes" });
  }
});
// Get played puzzles
app.get('/api/get-played-puzzles', async (req, res) => {
  const { username, therapistCode } = req.query;

  try {
    const therapist = await Therapist.findOne({ code: therapistCode });
    const child = therapist?.children.find(c => c.username === username);
    res.json({ playedPuzzles: child?.playedPuzzles || [] });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update played puzzles
app.post('/api/update-played-puzzles', async (req, res) => {
  const { username, therapistCode, puzzleKey } = req.body;

  try {
    await Therapist.updateOne(
      { code: therapistCode, "children.username": username },
      { $addToSet: { "children.$.playedPuzzles": puzzleKey } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update puzzles" });
  }
});
// Mock emotion detection (replace with real AI/model later)
app.get('/api/emotion', (req, res) => {
  const emotions = ['happy', 'sad', 'angry', 'bored', 'calm'];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  res.json({ emotion: randomEmotion });
});
// // Update Child Themes
// app.post('/api/update-child-themes', async (req, res) => {
//   const { username, therapistCode, themes } = req.body;
//   console.log('Received update themes request:', { username, therapistCode, themes });

//   if (!username || !therapistCode || !themes) {
//     return res.status(400).json({ message: 'Missing required fields' });
//   }

//   try {
//     const therapist = await Therapist.findOne({ code: therapistCode });
//     if (!therapist) {
//       console.log('Therapist not found for code:', therapistCode);
//       return res.status(404).json({ message: 'Therapist not found' });
//     }

//     const child = therapist.children.find(child => child.username === username);
//     if (!child) {
//       console.log('Child not found:', username);
//       return res.status(404).json({ message: 'Child not found' });
//     }

//     child.assignedThemes = themes;
//     await therapist.save();
//     console.log('Themes updated successfully for child:', username);

//     res.status(200).json({ success: true, message: 'Themes updated successfully' });
//   } catch (error) {
//     console.error('Error updating themes:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// });

// // Get Child Themes
// app.get('/api/get-child-themes', async (req, res) => {
//   const { username, therapistCode } = req.query;
//   console.log('Received get themes request:', { username, therapistCode });

//   if (!username || !therapistCode) {
//     return res.status(400).json({ message: 'Missing required fields' });
//   }

//   try {
//     const therapist = await Therapist.findOne({ code: therapistCode });
//     if (!therapist) {
//       console.log('Therapist not found for code:', therapistCode);
//       return res.status(404).json({ message: 'Therapist not found' });
//     }

//     const child = therapist.children.find(child => child.username === username);
//     if (!child) {
//       console.log('Child not found:', username);
//       return res.status(404).json({ message: 'Child not found' });
//     }

//     console.log('Returning themes for child:', username, child.assignedThemes);
//     res.status(200).json({ themes: child.assignedThemes });
//   } catch (error) {
//     console.error('Error fetching themes:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });
// app.post('/api/update-played-puzzles', async (req, res) => {
//   const { username, puzzleId } = req.body;
//   console.log(`User ${username} played puzzle ${puzzleId}`);
  
//   // If you're saving this in MongoDB:
//   await PlayedPuzzleModel.create({ username, puzzleId, playedAt: new Date() });

//   res.status(200).json({ message: 'Puzzle updated' });
// });

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
