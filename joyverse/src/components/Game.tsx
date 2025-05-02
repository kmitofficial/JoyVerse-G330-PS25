import { useRef,useState, useEffect } from 'react';
import { useParams, useNavigate,useLocation } from 'react-router-dom';
import Confetti from 'react-confetti';
import { ArrowRight, Home, AlertCircle, Trophy, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import wordLists from '../data/wordLists';
import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/facemesh';
import { debounce } from 'lodash';


const Game = () => {
  const { theme = 'underwater', level = '1' } = useParams();
  //console.log(theme,level)
  const navigate = useNavigate();
  const [grid, setGrid] = useState<string[][]>([]);
  const [selected, setSelected] = useState<number[][]>([]);
  const [completed, setCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showWrongMessage, setShowWrongMessage] = useState(false);
  const [showThemeComplete, setShowThemeComplete] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [incorrectStreak, setIncorrectStreak] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [lastTwoAnswers, setLastTwoAnswers] = useState<string[]>([]);
  const [playedPuzzles, setPlayedPuzzles] = useState(new Set<string>());
  const totalPuzzles = 10;
  const [themes, setThemes] = useState<string[]>([]); // Add this line
  const [landmarks, setLandmarks] = useState<any[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<facemesh.FaceMesh | null>(null);
// Handle window resize

useEffect(() => {
  const loadModel = async () => {
    await tf.ready();  // Ensure TensorFlow is ready
    const faceMeshModel = await facemesh.load();
    setModel(faceMeshModel);
  };

  loadModel();
}, []);

// Start video stream and detect facial landmarks
useEffect(() => {
  if (!model) return;

  const startVideo = async () => {
    if (videoRef.current) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoRef.current.srcObject = stream;

      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play();
        detectFaceMesh();
      };
    }
  };

  const detectFaceMesh = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set the canvas size to match the video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Detect the face and get the landmarks
    const predictions = await model.estimateFaces(video);
    if (predictions.length > 0) {
      setLandmarks(predictions[0].scaledMesh); // Save the landmarks

      // Clear the canvas and draw the landmarks
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      predictions.forEach((prediction) => {
        prediction.scaledMesh.forEach((point) => {
          ctx.beginPath();
          ctx.arc(point[0], point[1], 1, 0, 2 * Math.PI);
          ctx.fillStyle = 'red';
          ctx.fill();
        });
      });
    }

    // Continuously detect every 100ms
    requestAnimationFrame(detectFaceMesh);
  };

  startVideo();
}, [model]);

// Send landmarks to the backend
useEffect(() => {
  if (landmarks.length > 0) {
    const sendLandmarksToBackend = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/facemesh-landmarks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ landmarks }),
        });
        const data = await response.json();
        //console.log('Backend response:', data);
      } catch (error) {
        console.error('Error sending landmarks to backend:', error);
      }
    };

    sendLandmarksToBackend();
  }
}, [landmarks]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
const location=useLocation();

  useEffect(() => {
    const fetchPlayedPuzzles = async (username: string, therapistCode: string) => {
      try {
        const puzzleRes = await fetch(
          `http://localhost:5000/api/get-played-puzzles?username=${username}&therapistCode=${therapistCode}`
        );
        const puzzleData = await puzzleRes.json();
        if (puzzleData.playedPuzzles) {
          setPlayedPuzzles(new Set(puzzleData.playedPuzzles));
        }
      } catch (error) {
        console.error('Failed to fetch played puzzles:', error);
      }
    };
  
    // Check route state first
    if (location.state?.assignedThemes) {
      setThemes(location.state.assignedThemes);
      if (location.state.username && location.state.therapistCode) {
        fetchPlayedPuzzles(location.state.username, location.state.therapistCode);
      }
      return;
    }
  
    // Fallback to sessionStorage
    const storedData = sessionStorage.getItem('childData');
    if (storedData) {
      const { assignedThemes, username, therapistCode } = JSON.parse(storedData);
      setThemes(assignedThemes || []);
      if (username && therapistCode) {
        fetchPlayedPuzzles(username, therapistCode);
      }
    } else {
      navigate('/child-login');
    }
  }, [location.state, navigate]); // Add all dependencies

  // Validate theme and level
  useEffect(() => {
    // const assignedThemes = JSON.parse(localStorage.getItem('assignedThemes') || '[]');
    // if (!assignedThemes.includes(theme)) {
    //   navigate('/');
    //   return;
    // }

    const themeExists = theme in wordLists;
    const levelNum = parseInt(level);
    //console.log(levelNum)
    const levelExists = themeExists && levelNum >= 1 && levelNum <= 3;

    if (!themeExists || !levelExists) {
      navigate(`/game/${assignedThemes[0] || 'underwater'}/1`);
      return;
    }
  }, [theme, level, navigate]);

  const levelNum = Number(level) as 1 | 2 | 3;
  const currentWord = wordLists[theme]?.[levelNum]?.[wordIndex % wordLists[theme][levelNum].length];

  const gridSize = parseInt(level) < 3 ? 4 : 5;

  // Generate grid and reset states
  useEffect(() => {
    if (!currentWord) return;

    setIsLoading(true);
    setGrid(generateGrid(gridSize, currentWord.word));
    setSelected([]);
    setCompleted(false);
    setShowConfetti(false);
    setShowWrongMessage(false);
    setShowThemeComplete(false);
    setIsLoading(false);
  }, [theme, level, currentWord]);

  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    if (completed || !currentWord) return;

    const alreadySelected = selected.some(([r, c]) => r === row && c === col);

    let newSelected;

    if (alreadySelected) {
      newSelected = selected.filter(([r, c]) => !(r === row && c === col));
    } else {
      newSelected = [...selected, [row, col]];
    }
    setSelected(newSelected);

    const selectedWord = newSelected.map(([r, c]) => grid[r][c]).join('');

    if (selectedWord.length === currentWord.word.length) {
      if (selectedWord === currentWord.word) {
        setCorrectStreak((prev) => prev + 1);
        setIncorrectStreak(0);
        setCompleted(true);
        setShowConfetti(true);
      } else {
        setIncorrectStreak((prev) => prev + 1);
        setCorrectStreak(0);
        setShowWrongMessage(true);
        setTimeout(() => {
          setSelected([]);
          setShowWrongMessage(false);
        }, 1000);
      }
    }
  };

  const adjustDifficulty = async () => {
    let newLevel = parseInt(level);
    let newWordIndex = wordIndex + 1;
    let currentTheme = theme;
  
    // Track last two answers
    const updatedAnswers = [...lastTwoAnswers, completed ? '✅' : '❌'].slice(-2);
    setLastTwoAnswers(updatedAnswers);
    console.log(updatedAnswers);
  
    // Adjust level based on performance
    if (updatedAnswers.length === 2) {
      const [prev, curr] = updatedAnswers;
      if (prev === '✅' && curr === '✅' && newLevel < 3) {
        newLevel++;
      } else if (prev === '❌' && curr === '❌' && newLevel > 1) {
        newLevel--;
      }
    }
  
    // Emotion-based theme handling
    let emotion = 'happy'; // Default
    try {
      const res = await fetch('http://localhost:5000/api/emotion');
      const data = await res.json();
      emotion = data.emotion || 'happy';
      console.log('Detected Emotion:', emotion);
    } catch (error) {
      console.error('Failed to fetch emotion:', error);
    }
  
    const stayInSameTheme = ['happy', 'calm', 'surprised', 'excited'];
    const switchThemeEmotions = ['sad', 'angry', 'bored'];
    if (switchThemeEmotions.includes(emotion)) {
      const sessionData = sessionStorage.getItem('childData');
      if (!sessionData) {
        console.error('No session data available');
        return;
      }
  
      const childData = JSON.parse(sessionData);
      const assignedThemes = childData.assignedThemes || [];
  
      const availableThemes = assignedThemes.filter(t => t !== currentTheme);
      console.log("Available assigned themes:", availableThemes);
  
      if (availableThemes.length > 0) {
        const newTheme = availableThemes[Math.floor(Math.random() * availableThemes.length)];
        console.log("Switching to assigned theme:", newTheme);
        currentTheme = newTheme;
        newWordIndex = 0;
      } else {
        console.log('No other assigned themes available. Staying in current theme.');
      }
    }
  
    // Ensure unique puzzles
    const updatedPlayedPuzzles = new Set(playedPuzzles);
    let newPuzzleKey = `${currentTheme}-${newLevel}-${newWordIndex}`;
    while (updatedPlayedPuzzles.has(newPuzzleKey)) {
      newWordIndex = (newWordIndex + 1) % wordLists[currentTheme][newLevel].length;
      newPuzzleKey = `${currentTheme}-${newLevel}-${newWordIndex}`;
    }
  
    updatedPlayedPuzzles.add(newPuzzleKey);
  
    // ⛔ Removed backend puzzle update ⛔
  
    // End game if 10 unique puzzles played
    if (updatedPlayedPuzzles.size >= totalPuzzles) {
      setShowThemeComplete(true);
      return;
    }
  
    // Save progress locally
    setPlayedPuzzles(updatedPlayedPuzzles);
  
    // Go to next puzzle
    setTimeout(() => {
      setWordIndex(newWordIndex);
      navigate(`/game/${currentTheme}/${newLevel}`);
    }, 500);
  };
  

  const handleNextLevel = () => {
    setShowConfetti(false);
    setTimeout(() => {
      adjustDifficulty();
    }, 500);
  };

  // Handle quit game
  const handleQuit = () => {
    const confirmQuit = window.confirm('Are you sure you want to quit the game?');
    if (confirmQuit) {
      setShowConfetti(false);
      navigate('/');
    }
  };

  // Handle home click
  const handleHomeClick = () => {
    setShowConfetti(false);
    navigate('/');
  };

  if (!currentWord || isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Animated Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden"></div>
      <video ref={videoRef} style={{ width: '100%' }} />
      <canvas ref={canvasRef} style={{ position: 'absolute' }} />

      {/* Game Content */}
      <div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat p-8"
        style={{
          backgroundImage: `url('/images/${theme}.jpg')`,
          backgroundSize: 'auto 150vh',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: 'lightblue',
        }}
      >
        {showConfetti && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            numberOfPieces={200}
            recycle={false}
            colors={['#FFD700', '#FF69B4', '#00FFFF']}
            onConfettiComplete={() => setShowConfetti(false)}
          />
        )}

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleHomeClick}
          className="absolute top-4 left-4 bg-white/80 p-3 rounded-full hover:bg-white"
        >
          <Home />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleQuit}
          className="absolute top-4 right-4 bg-red-500/80 p-3 rounded-full hover:bg-red-500 text-white"
        >
          <X />
        </motion.button>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 p-8 rounded-2xl shadow-xl max-w-5xl w-full flex flex-col md:flex-row gap-8"
        >
          {/* Image Container */}
          <div className="flex-1 flex items-center justify-center">
            <motion.img
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5 }}
              src={currentWord.image}
              alt={currentWord.word}
              className="w-full h-64 md:h-96 object-contain rounded-xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/default.jpg';
              }}
            />
          </div>

          {/* Grid Container */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <AnimatePresence>
              {showWrongMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="flex items-center justify-center gap-2 text-red-500 mb-4"
                >
                  <AlertCircle />
                  <span>Oops! Try again!</span>
                </motion.div>
              )}
            </AnimatePresence>

            {!showThemeComplete && (
              <div
                className="word-grid w-full"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${gridSize}, minmax(60px, 1fr))`,
                  gap: '12px',
                }}
              >
                {grid.map((row, i) =>
                  row.map((cell, j) => (
                    <motion.button
                      key={`${i}-${j}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      animate={{
                        scale: selected.some(([r, c]) => r === i && c === j) ? 1.2 : 1,
                        backgroundColor: selected.some(([r, c]) => r === i && c === j)
                          ? '#30253E'
                          : '#EDE9FE',
                      }}
                      className="text-2xl font-bold w-16 h-16 rounded-lg flex items-center justify-center"
                      style={{
                        color: selected.some(([r, c]) => r === i && c === j) ? 'white' : '#4C1D95',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                      onClick={() => handleCellClick(i, j)}
                      disabled={completed}
                    >
                      {cell}
                    </motion.button>
                  ))
                )}
              </div>
            )}

            {!showThemeComplete && (
              <motion.div className="mt-8 text-center">
                {showWrongMessage && (
                  <h2 className="text-2xl font-bold text-red-500 mb-4">Try Again! ❌</h2>
                )}
                {completed && (
                  <h2 className="text-2xl font-bold text-green-600 mb-4">Great job! 🎉</h2>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleNextLevel}
                  className={`px-6 py-3 rounded-full transition-colors flex items-center gap-2 mx-auto ${
                    completed ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                  } text-white`}
                >
                  Next <ArrowRight size={20} />
                </motion.button>
              </motion.div>
            )}

            {showThemeComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="text-6xl mb-6 flex justify-center"
                >
                  <Trophy className="text-yellow-500" size={80} />
                </motion.div>
                <h2 className="text-3xl font-bold text-purple-600 mb-4">
                  Amazing! You've completed all levels! 🎉
                </h2>
                <p className="text-xl text-purple-500 mb-6">
                  You're a word search champion!
                </p>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleHomeClick}
                  className="bg-purple-500 text-white px-8 py-4 rounded-full hover:bg-purple-600 transition-colors flex items-center gap-3 mx-auto"
                >
                  <Home size={24} />
                  Back to Home
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Generate grid with random letters and the target word
const generateGrid = (size: number, word: string) => {
  const grid: string[][] = [];
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // Fill grid with random letters
  for (let i = 0; i < size; i++) {
    grid[i] = [];
    for (let j = 0; j < size; j++) {
      grid[i][j] = letters[Math.floor(Math.random() * letters.length)];
    }
  }

  // Place the word randomly
  const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
  const row = Math.floor(Math.random() * (size - (direction === 'vertical' ? word.length : 0)));
  const col = Math.floor(Math.random() * (size - (direction === 'horizontal' ? word.length : 0)));

  for (let i = 0; i < word.length; i++) {
    if (direction === 'horizontal') {
      grid[row][col + i] = word[i];
    } else {
      grid[row + i][col] = word[i];
    }
  }

  return grid;
};

export default Game;