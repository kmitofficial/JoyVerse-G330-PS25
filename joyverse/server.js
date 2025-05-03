// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import { customAlphabet } from 'nanoid';

// const generateNumericCode = customAlphabet('0123456789', 6);
// const app = express();
// const port = 5000;

// // Enable CORS for all routes
// app.use(cors());
// app.use(bodyParser.json());

// // Test endpoint
// app.get('/api/test', (req, res) => {
//   res.json({ 
//     message: 'Server is running!',
    
//   });
// });

// // MongoDB connection
// mongoose.connect('mongodb://127.0.0.1:27017/joyverse', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   console.log('Connected to MongoDB');
// }).catch(err => {
//   console.error('MongoDB connection error:', err);
// });

// // Therapist Schema
// const therapistSchema = new mongoose.Schema({
//   username: String,
//   password: String,
//   code: { type: String, unique: true },
//   children: [
//     {
//       username: String,
//       joinedAt: { type: Date, default: Date.now },
//       assignedThemes: { type: [String], default: [] },
//       playedPuzzles: { type: [String], default: [] }
//     },
//   ],
// });
// const Therapist = mongoose.model('Therapist', therapistSchema);

// // Child Schema
// const childSchema = new mongoose.Schema({
//   username: String,
//   assignedThemes: { type: [String], default: [] },
//   playedPuzzles: { type: [String], default: [] },
//   joinedAt: { type: Date, default: Date.now }
// });
// const Child = mongoose.model('Child', childSchema);

// // Updated Feedback Schema
// const feedbackSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   question: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now }
// });
// const Feedback = mongoose.model('Feedback', feedbackSchema);

// // FAQ Schema
// const faqSchema = new mongoose.Schema({
//   question: { type: String, required: true },
//   answer: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now }
// });
// const FAQ = mongoose.model('FAQ', faqSchema);

// // Generate unique 6-digit therapist code
// const generateUniqueCode = async () => {
//   let code;
//   let exists = true;
//   while (exists) {
//     code = generateNumericCode();
//     exists = await Therapist.findOne({ code });
//   }
//   return code;
// };

// // Therapist Signup
// app.post('/api/signup', async (req, res) => {
//   const { username, password } = req.body;

//   const existing = await Therapist.findOne({ username });
//   if (existing) return res.status(400).json({ message: 'User already exists' });

//   const code = await generateUniqueCode();
//   const newTherapist = new Therapist({ username, password, code });
//   await newTherapist.save();

//   res.status(201).json({ message: 'Signup successful', username, code });
// });

// // Therapist Login
// app.post('/api/login', async (req, res) => {
//   const { username, password } = req.body;

//   const user = await Therapist.findOne({ username, password });
//   if (!user) return res.status(401).json({ message: 'Invalid credentials' });

//   res.status(200).json({ message: 'Login successful', username: user.username, code: user.code });
// });

// // Add Child
// app.post('/api/add-child', async (req, res) => {
//   const { therapistCode, childName } = req.body;

//   if (!therapistCode || !childName) {
//     return res.status(400).json({ message: 'Missing required fields' });
//   }

//   try {
//     const therapist = await Therapist.findOne({ code: therapistCode });
//     if (!therapist) return res.status(404).json({ message: 'Therapist not found' });

//     const exists = therapist.children.find(child => child.username === childName);
//     if (exists) return res.status(400).json({ message: 'Child already exists' });

//     therapist.children.push({ 
//       username: childName, 
//       assignedThemes: [] 
//     });
//     await therapist.save();

//     res.status(200).json({ message: 'Child added successfully' });
//   } catch (error) {
//     console.error('Error adding child:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Get Therapist Details
// app.post('/api/get-therapist', async (req, res) => {
//   const { username } = req.body;

//   try {
//     const therapist = await Therapist.findOne({ username });
//     if (!therapist) return res.status(404).json({ message: 'Therapist not found' });

//     res.status(200).json({
//       username: therapist.username,
//       code: therapist.code,
//       children: therapist.children,
//     });
//   } catch (error) {
//     console.error('Error fetching therapist:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Child Login
// app.post('/api/child-login', async (req, res) => {
//   const { code, childName } = req.body;

//   if (!code || !childName) {
//     return res.status(400).json({ message: 'Both therapist code and child name are required' });
//   }

//   try {
//     const therapist = await Therapist.findOne({ code });
//     if (!therapist) return res.status(404).json({ message: 'Therapist not found' });

//     const child = therapist.children.find(child => child.username === childName);
//     if (!child) return res.status(401).json({ message: 'Child not found under this therapist' });

//     res.status(200).json({
//       message: 'Child login successful',
//       username: child.username,
//       assignedThemes: child.assignedThemes || []
//     });
//   } catch (error) {
//     console.error('Error with child login:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Updated Feedback endpoint
// app.post('/api/feedback', async (req, res) => {
//   try {
//     const { name, email, question } = req.body;

//     if (!name || !email || !question) {
//       return res.status(400).json({
//         message: 'Please provide all required fields: name, email, and feedback'
//       });
//     }

//     const feedback = new Feedback({
//       name,
//       email,
//       question
//     });

//     await feedback.save();

//     res.status(201).json({
//       success: true,
//       message: 'Feedback submitted successfully',
//       feedback: {
//         id: feedback._id,
//         name: feedback.name,
//         email: feedback.email,
//         question: feedback.question,
//         createdAt: feedback.createdAt
//       }
//     });
//   } catch (error) {
//     console.error('Error saving feedback:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to submit feedback',
//       error: error.message
//     });
//   }
// });

// // Get all feedbacks
// app.get('/api/feedback', async (req, res) => {
//   try {
//     const feedbacks = await Feedback.find().sort({ createdAt: -1 });
//     res.status(200).json({
//       success: true,
//       data: feedbacks
//     });
//   } catch (error) {
//     console.error('Error fetching feedbacks:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch feedbacks',
//       error: error.message
//     });
//   }
// });

// // FAQ endpoints
// app.post('/api/faq', async (req, res) => {
//   try {
//     const { question, answer } = req.body;
//     const faq = new FAQ({ question, answer });
//     await faq.save();
//     res.status(201).json({ message: 'FAQ saved successfully' });
//   } catch (error) {
//     console.error('Error saving FAQ:', error);
//     res.status(500).json({ error: 'Failed to save FAQ' });
//   }
// });

// app.get('/api/faq', async (req, res) => {
//   try {
//     const faqs = await FAQ.find();
//     res.status(200).json(faqs);
//   } catch (error) {
//     console.error('Error fetching FAQs:', error);
//     res.status(500).json({ error: 'Failed to fetch FAQs' });
//   }
// });

// // Get Child Themes
// app.get('/api/get-child-themes', async (req, res) => {
//   const therapist = await Therapist.findOne({
//     code: req.query.therapistCode,
//     "children.username": req.query.username
//   });
  
//   const child = therapist?.children.find(c => c.username === req.query.username);
  
//   res.json({ 
//     themes: child?.assignedThemes || ['underwater'] 
//   });
// });

// // Update Child Themes
// app.post('/api/update-child-themes', async (req, res) => {
//   const { username, therapistCode, themes } = req.body;

//   try {
//     await Therapist.updateOne(
//       { code: therapistCode, "children.username": username },
//       { $set: { "children.$.assignedThemes": themes } }
//     );
//     res.json({ success: true });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to update themes" });
//   }
// });

// // Get played puzzles
// app.get('/api/get-played-puzzles', async (req, res) => {
//   const { username, therapistCode } = req.query;

//   try {
//     const therapist = await Therapist.findOne({ code: therapistCode });
//     const child = therapist?.children.find(c => c.username === username);
//     res.json({ playedPuzzles: child?.playedPuzzles || [] });
//   } catch (error) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // Update played puzzles
// app.post('/api/update-played-puzzles', async (req, res) => {
//   const { username, therapistCode, puzzleKey } = req.body;

//   try {
//     await Therapist.updateOne(
//       { code: therapistCode, "children.username": username },
//       { $addToSet: { "children.$.playedPuzzles": puzzleKey } }
//     );
//     res.json({ success: true });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to update puzzles" });
//   }
// });

// // Mock emotion detection
// app.get('/api/emotion', (req, res) => {
//   const emotions = ['happy', 'sad', 'angry', 'bored', 'calm'];
//   const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
//   res.json({ emotion: randomEmotion });
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
  
// });

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
  res.json({
    message: 'Server is running!',
  });
});

// MongoDB connection (use 127.0.0.1 for compatibility)
mongoose.connect('mongodb://127.0.0.1:27017/joyverse', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Invitation Code Schema (New)
const invitationSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  isUsed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  usedBy: { type: String, default: null },
  usedAt: { type: Date, default: null }
});
const Invitation = mongoose.model('Invitation', invitationSchema);

// Therapist Schema
const therapistSchema = new mongoose.Schema({
  username: String,
  password: String,
  code: { type: String, unique: true },
  invitationCodeUsed: { type: String, default: null }, // Track which invitation code was used
  children: [
    {
      username: String,
      joinedAt: { type: Date, default: Date.now },
      sessions: [
        {
          sessionId: String,
          date: { type: Date, default: Date.now },
          assignedThemes: [String],
          themesChanged: [String],
          emotionsOfChild: [String],
          playedPuzzles: [
            {
              theme: String,
              level: Number,
              puzzleId: String,
              completedAt: { type: Date, default: Date.now },
              emotionsDuring: [String]
            }
          ]
        }
      ],
      currentAssignedThemes: { type: [String], default: [] }, // Track current active themes
      assignedThemes: { type: [String], default: [] }, // For backward compatibility
      playedPuzzles: { type: [String], default: [] } // For backward compatibility
    }
  ]
});
const Therapist = mongoose.model('Therapist', therapistSchema);

// Child Schema (not directly used, but kept for completeness)
const childSchema = new mongoose.Schema({
  username: String,
  assignedThemes: { type: [String], default: [] },
  playedPuzzles: { type: [String], default: [] },
  joinedAt: { type: Date, default: Date.now }
});
const Child = mongoose.model('Child', childSchema);

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  question: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Feedback = mongoose.model('Feedback', feedbackSchema);

// FAQ Schema
const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const FAQ = mongoose.model('FAQ', faqSchema);

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

// Generate a unique session ID
const generateSessionId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

// API endpoint to create invitation codes (Admin only)
app.post('/api/create-invitation', async (req, res) => {
  try {
    const { adminKey } = req.body;
    
    // A secure admin key should be used in production
    if (adminKey !== 'admin-secret-key') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Use fixed invitation code 'joyversetherapist'
    const code = 'joyversetherapist';
    
    // Check if this code already exists
    const existingCode = await Invitation.findOne({ code });
    if (existingCode) {
      return res.status(400).json({ 
        message: 'Fixed invitation code already exists',
        code: code
      });
    }
    
    const newInvitation = new Invitation({ code });
    await newInvitation.save();
    
    res.status(201).json({ 
      message: 'Invitation code created successfully',
      code: newInvitation.code
    });
  } catch (error) {
    console.error('Error creating invitation code:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// API endpoint to list all invitation codes (Admin only)
app.get('/api/invitations', async (req, res) => {
  try {
    const { adminKey } = req.query;
    
    if (adminKey !== 'admin-secret-key') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const invitations = await Invitation.find();
    res.status(200).json(invitations);
  } catch (error) {
    console.error('Error fetching invitations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Therapist Signup
app.post('/api/signup', async (req, res) => {
  console.log("Request body:", req.body);
  try {
    const { username, password, invitationCode } = req.body;

    // Check if the username already exists
    const existing = await Therapist.findOne({ username });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    // Validate the invitation code - accept both the fixed code and any existing valid codes
    const fixedCode = 'joyversetherapist';
    let invitation;

    if (invitationCode === fixedCode) {
      // Check if fixed code exists in database, if not create it
      invitation = await Invitation.findOne({ code: fixedCode });
      if (!invitation) {
        invitation = new Invitation({ code: fixedCode });
        await invitation.save();
      }
    } else {
      // Check for other valid invitation codes
      invitation = await Invitation.findOne({ code: invitationCode });
      if (!invitation) {
        return res.status(403).json({ message: 'Invalid invitation code' });
      }
      
      // Check if non-fixed invitation code has already been used
      if (invitation.code !== fixedCode && invitation.isUsed) {
        return res.status(403).json({ message: 'Invitation code has already been used' });
      }
    }

    // Generate therapist code
    const code = await generateUniqueCode();

    // Create therapist
    const newTherapist = new Therapist({ 
      username, 
      password, 
      code,
      invitationCodeUsed: invitationCode 
    });
    await newTherapist.save();

    // Mark invitation as used (note: fixed code can be used multiple times)
    if (invitation.code !== fixedCode) {
      invitation.isUsed = true;
    }
    invitation.usedBy = invitationCode === fixedCode ? `${invitation.usedBy || ''}${username}, ` : username;
    invitation.usedAt = new Date();
    await invitation.save();

    res.status(201).json({ message: 'Signup successful', username, code });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Therapist Login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Therapist.findOne({ username, password });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    res.status(200).json({ message: 'Login successful', username: user.username, code: user.code });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add Child
app.post('/api/add-child', async (req, res) => {
  try {
    const { therapistCode, childName } = req.body;

    if (!therapistCode || !childName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const therapist = await Therapist.findOne({ code: therapistCode });
    if (!therapist) return res.status(404).json({ message: 'Therapist not found' });

    const exists = therapist.children.find(child => child.username === childName);
    if (exists) return res.status(400).json({ message: 'Child already exists' });

    therapist.children.push({
      username: childName,
      currentAssignedThemes: [],
      assignedThemes: [], // For backward compatibility
      playedPuzzles: []   // For backward compatibility
    });
    await therapist.save();

    res.status(200).json({ message: 'Child added successfully' });
  } catch (error) {
    console.error('Error adding child:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get Therapist Details
app.post('/api/get-therapist', async (req, res) => {
  try {
    const { username } = req.body;
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

// Child Login (starts a new session)
app.post('/api/child-login', async (req, res) => {
  try {
    const { code, childName } = req.body;
    if (!code || !childName) {
      return res.status(400).json({ message: 'Both therapist code and child name are required' });
    }

    const therapist = await Therapist.findOne({ code });
    console.log("found therapist", therapist);
    if (!therapist) return res.status(404).json({ message: 'Therapist not found' });

    const childIndex = therapist.children.findIndex(child => child.username === childName);
    console.log(childIndex);
    if (childIndex === -1) return res.status(401).json({ message: 'Child not found under this therapist' });

    // Create a new session
    const sessionId = generateSessionId();
    therapist.children[childIndex].sessions.push({
      sessionId,
      assignedThemes: [...(therapist.children[childIndex].currentAssignedThemes || therapist.children[childIndex].assignedThemes || [])],
      themesChanged: [],
      emotionsOfChild: [],
      playedPuzzles: []
    });

    await therapist.save();

    res.status(200).json({
      message: 'Child login successful',
      username: childName,
      sessionId,
      assignedThemes: therapist.children[childIndex].currentAssignedThemes || therapist.children[childIndex].assignedThemes || []
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get child themes
app.get('/api/get-child-themes', async (req, res) => {
  try {
    const therapist = await Therapist.findOne({
      code: req.query.therapistCode,
      "children.username": req.query.username
    });

    const child = therapist?.children.find(c => c.username === req.query.username);
    res.json({
      themes: child?.currentAssignedThemes || child?.assignedThemes || ['underwater']
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update child themes (for therapist assignment)
app.post('/api/update-child-themes', async (req, res) => {
  try {
    const { username, therapistCode, themes } = req.body;
    await Therapist.updateOne(
      { code: therapistCode, "children.username": username },
      { $set: { "children.$.currentAssignedThemes": themes, "children.$.assignedThemes": themes } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update themes" });
  }
});

// Track theme changes during session
app.post('/api/track-theme-change', async (req, res) => {
  try {
    const { username, therapistCode, sessionId, theme } = req.body;

    // Validate required fields
    if (!username || !therapistCode || !sessionId || !theme) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const therapist = await Therapist.findOne({
      code: therapistCode,
      "children.username": username,
      "children.sessions.sessionId": sessionId
    });

    if (!therapist) {
      return res.status(404).json({ error: "Therapist or session not found" });
    }

    const childIndex = therapist.children.findIndex(c => c.username === username);
    if (childIndex === -1) {
      return res.status(404).json({ error: "Child not found" });
    }

    const sessionIndex = therapist.children[childIndex].sessions.findIndex(s => s.sessionId === sessionId);
    if (sessionIndex === -1) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Initialize themesChanged array if it doesn't exist
    if (!therapist.children[childIndex].sessions[sessionIndex].themesChanged) {
      therapist.children[childIndex].sessions[sessionIndex].themesChanged = [];
    }

    // Always push the theme to themesChanged array
    // This ensures we track all theme transitions, even if the theme remains the same
    therapist.children[childIndex].sessions[sessionIndex].themesChanged.push(theme);

    // Save the changes
    await therapist.save();

    res.json({
      success: true,
      message: "Theme change tracked successfully",
      currentTheme: theme
    });
  } catch (error) {
    console.error('Error tracking theme change:', error);
    res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
});

// Track emotions during session
app.post('/api/track-emotion', async (req, res) => {
  try {
    const { username, therapistCode, sessionId, emotion } = req.body;

    const therapist = await Therapist.findOne({
      code: therapistCode,
      "children.username": username,
      "children.sessions.sessionId": sessionId
    });

    if (!therapist) return res.status(404).json({ error: "Not found" });

    const child = therapist.children.find(c => c.username === username);
    const session = child.sessions.find(s => s.sessionId === sessionId);

    session.emotionsOfChild.push(emotion);
    await therapist.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Track played puzzles for session-based tracking
app.post('/api/update-played-puzzles', async (req, res) => {
  try {
    const { username, therapistCode, sessionId, theme, level, puzzleId, emotionsDuring } = req.body;

    // Validate required fields
    if (!username || !therapistCode || !sessionId || !theme || !level || !puzzleId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const therapist = await Therapist.findOne({
      code: therapistCode,
      "children.username": username,
      "children.sessions.sessionId": sessionId
    });

    if (!therapist) {
      return res.status(404).json({ error: "Therapist, child, or session not found" });
    }

    const childIndex = therapist.children.findIndex(c => c.username === username);
    const sessionIndex = therapist.children[childIndex].sessions.findIndex(s => s.sessionId === sessionId);

    // Add puzzle to session tracking
    therapist.children[childIndex].sessions[sessionIndex].playedPuzzles.push({
      theme,
      level: Number(level),
      puzzleId,
      completedAt: new Date(),
      emotionsDuring: emotionsDuring || []
    });

    // Also update the backward-compatible playedPuzzles array
    if (!therapist.children[childIndex].playedPuzzles.includes(puzzleId)) {
      therapist.children[childIndex].playedPuzzles.push(puzzleId);
    }

    await therapist.save();

    res.json({ 
      success: true,
      message: "Puzzle completion recorded successfully"
    });
  } catch (error) {
    console.error('Error tracking puzzle completion:', error);
    res.status(500).json({ 
      error: "Server error",
      details: error.message
    });
  }
});

// Get session data
app.get('/api/get-session-data', async (req, res) => {
  try {
    const { therapistCode, childName, sessionId } = req.query;

    if (!therapistCode || !childName || !sessionId) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const therapist = await Therapist.findOne({ 
      code: therapistCode,
      "children.username": childName
    });

    if (!therapist) {
      return res.status(404).json({ error: "Therapist or child not found" });
    }

    const child = therapist.children.find(c => c.username === childName);
    if (!child) {
      return res.status(404).json({ error: "Child not found" });
    }

    const session = child.sessions.find(s => s.sessionId === sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json({
      sessionData: session,
      success: true
    });
  } catch (error) {
    console.error('Error fetching session data:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all sessions for a child
app.get('/api/get-child-sessions', async (req, res) => {
  try {
    const { therapistCode, childName } = req.query;

    if (!therapistCode || !childName) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const therapist = await Therapist.findOne({ 
      code: therapistCode,
      "children.username": childName
    });

    if (!therapist) {
      return res.status(404).json({ error: "Therapist or child not found" });
    }

    const child = therapist.children.find(c => c.username === childName);
    if (!child) {
      return res.status(404).json({ error: "Child not found" });
    }

    res.json({
      sessions: child.sessions || [],
      success: true
    });
  } catch (error) {
    console.error('Error fetching child sessions:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Submit feedback
app.post('/api/submit-feedback', async (req, res) => {
  try {
    const { name, email, question } = req.body;
    
    if (!name || !email || !question) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    const feedback = new Feedback({
      name,
      email,
      question
    });
    
    await feedback.save();
    
    res.status(201).json({ 
      success: true,
      message: "Feedback submitted successfully"
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all feedback (admin only)
app.get('/api/get-feedback', async (req, res) => {
  try {
    const { adminKey } = req.query;
    
    if (adminKey !== 'admin-secret-key') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json({ feedback });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Add FAQ
app.post('/api/add-faq', async (req, res) => {
  try {
    const { adminKey, question, answer } = req.body;
    
    if (adminKey !== 'admin-secret-key') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    if (!question || !answer) {
      return res.status(400).json({ error: "Question and answer are required" });
    }
    
    const faq = new FAQ({
      question,
      answer
    });
    
    await faq.save();
    
    res.status(201).json({ 
      success: true,
      message: "FAQ added successfully"
    });
  } catch (error) {
    console.error('Error adding FAQ:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all FAQs
app.get('/api/get-faqs', async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ createdAt: -1 });
    res.json({ faqs });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete Child
app.post('/api/delete-child', async (req, res) => {
  try {
    const { therapistCode, childName } = req.body;
    
    if (!therapistCode || !childName) {
      return res.status(400).json({ error: "Therapist code and child name are required" });
    }
    
    const therapist = await Therapist.findOne({ code: therapistCode });
    if (!therapist) {
      return res.status(404).json({ error: "Therapist not found" });
    }
    
    const childIndex = therapist.children.findIndex(child => child.username === childName);
    if (childIndex === -1) {
      return res.status(404).json({ error: "Child not found" });
    }
    
    // Remove the child from the therapist's children array
    therapist.children.splice(childIndex, 1);
    await therapist.save();
    
    res.json({ 
      success: true, 
      message: "Child deleted successfully" 
    });
  } catch (error) {
    console.error('Error deleting child:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Change Therapist Password
app.post('/api/change-password', async (req, res) => {
  try {
    const { username, currentPassword, newPassword } = req.body;
    
    if (!username || !currentPassword || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    const therapist = await Therapist.findOne({ username, password: currentPassword });
    if (!therapist) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    therapist.password = newPassword;
    await therapist.save();
    
    res.json({ 
      success: true, 
      message: "Password changed successfully" 
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: "Server error" });
  }
});


app.get('/api/emotion', (req, res) => {
  // You can randomize the emotion for now
  const emotions = ['happy', 'neutral', 'sad', 'angry', 'bored', 'frustrated'];
  const emotion = emotions[Math.floor(Math.random() * emotions.length)];
  res.json({ emotion });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
