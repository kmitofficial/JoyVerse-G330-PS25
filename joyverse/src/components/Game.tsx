import { useRef,useState, useEffect } from 'react';
import { useParams, useNavigate,useLocation } from 'react-router-dom';
import Confetti from 'react-confetti';
import { ArrowRight, Home, AlertCircle, Trophy, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/facemesh';
import { debounce } from 'lodash';


// --- Types ---
type WordList = {
  word: string;
  image: string;
};

type ThemeLevel = {
  1: WordList[];
  2: WordList[];
  3: WordList[];
};

type WordLists = {
  underwater: ThemeLevel;
  space: ThemeLevel;
  forest: ThemeLevel;
  playground: ThemeLevel;
  kitchen: ThemeLevel;
};

type Params = Record<string, string | undefined>;

// --- Data ---
const wordLists: WordLists = {
  underwater: {
    1: [
      { word: 'SEA', image: '/images/sea.jpg' },
      { word: 'NET', image: '/images/net.jpg' },
      { word: 'ICE', image: '/images/ice.jpg' },
      { word: 'EEL', image: '/images/eel.jpg' }
    ],
    2: [
      { word: 'FISH', image: '/images/fish.jpg' },
      { word: 'SAND', image: '/images/sand.jpg' },
      { word: 'WAVE', image: '/images/wave.jpg' },
      { word: 'SHIP', image: '/images/ship.jpg' }
    ],
    3: [
      { word: 'WHALE', image: '/images/whale.jpg' },
      { word: 'SHARK', image: '/images/shark.jpg' },
      { word: 'SHELL', image: '/images/shell.jpg' },
      { word: 'OCEAN', image: '/images/ocean.jpg' }
    ],
  },
  space: {
    1: [
      { word: 'SUN', image: '/images/sun.jpg' },
      { word: 'UFO', image: '/images/ufo.jpg' },
      { word: 'SKY', image: '/images/sky.jpg' },
      { word: 'GAS', image: '/images/gas.jpg' }
    ],
    2: [
      { word: 'MOON', image: '/images/moon.jpg' },
      { word: 'MARS', image: '/images/mars.jpg' },
      { word: 'STAR', image: '/images/star.jpg' },
      { word: 'ROCK', image: '/images/rock.jpg' }
    ],
    3: [
      { word: 'VENUS', image: '/images/venus.jpg' },
      { word: 'EARTH', image: '/images/earth.jpg' },
      { word: 'SPACE', image: '/images/space1.jpg' },
      { word: 'COMET', image: '/images/comet.jpg' }
    ],
  },
  forest: {
    1: [
      { word: 'LOG', image: '/images/log.jpg' },
      { word: 'MUD', image: '/images/mud.jpg' },
      { word: 'BUG', image: '/images/bug.jpg' },
      { word: 'ANT', image: '/images/ant.jpg' }
    ],
    2: [
      { word: 'TREE', image: '/images/tree.jpg' },
      { word: 'LEAF', image: '/images/leaf.jpg' },
      { word: 'RAIN', image: '/images/rain.jpg' },
      { word: 'BIRD', image: '/images/bird.jpg' }
    ],
    3: [
      { word: 'PLANT', image: '/images/plant.jpg' },
      { word: 'BERRY', image: '/images/berry.jpg' },
      { word: 'GRASS', image: '/images/grass.jpg' },
      { word: 'FRUIT', image: '/images/fruit.jpg' }
    ],
  },
  playground: {
    1: [
      { word: 'RUN', image: '/images/run.jpg' },
      { word: 'HOP', image: '/images/hop.jpg' },
      { word: 'TOY', image: '/images/toy.jpg' },
      { word: 'TAG', image: '/images/tag.jpg' }
    ],
    2: [
      { word: 'BALL', image: '/images/ball.jpg' },
      { word: 'PLAY', image: '/images/play.jpg' },
      { word: 'RIDE', image: '/images/ride.jpg' },
      { word: 'SAND', image: '/images/sand.jpg' }
    ],
    3: [
      { word: 'CLIMB', image: '/images/climb.jpg' },
      { word: 'SLIDE', image: '/images/slide.jpg' },
      { word: 'SWING', image: '/images/swing.jpg' },
      { word: 'TRAIN', image: '/images/train.jpg' }
    ],
  },
  kitchen: {
    1: [
      { word: 'PAN', image: '/images/pan.jpg' },
      { word: 'CUP', image: '/images/cup.jpg' },
      { word: 'EGG', image: '/images/egg.jpg' },
      { word: 'POT', image: '/images/pot.jpg' }
    ],
    2: [
      { word: 'FORK', image: '/images/fork.jpg' },
      { word: 'MILK', image: '/images/milk.jpg' },
      { word: 'RICE', image: '/images/rice.jpg' },
      { word: 'BOWL', image: '/images/bowl.jpg' }
    ],
    3: [
      { word: 'PLATE', image: '/images/plate.jpg' },
      { word: 'KNIFE', image: '/images/knife.jpg' },
      { word: 'SPOON', image: '/images/spoon.jpg' },
      { word: 'MIXER', image: '/images/mixer.jpg' }
    ],
  },
};

const soothingChampionImage = "public\images\bg-7.jpg"; 

const totalPuzzles = 10;

const Game = () => {
  // --- Routing/params ---
  const { theme: initialTheme = 'underwater', level: initialLevel = '1' } = useParams<Params>();
  const navigate = useNavigate();
  const location = useLocation();

  // --- State ---
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
const [playedPuzzles, setPlayedPuzzles] = useState<Set<string>>(new Set());
const [playedCount, setPlayedCount] = useState<number>(() => {
  const stored = sessionStorage.getItem('playedCount');
  return stored ? Math.min(Number(stored), totalPuzzles) : 0;
});
const [sessionId, setSessionId] = useState('');
  const totalPuzzles = 10;
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  const [currentLevel, setCurrentLevel] = useState(initialLevel);
  const [themes, setThemes] = useState<string[]>([]);
  const [landmarks, setLandmarks] = useState<any[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<facemesh.FaceMesh | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState('happy');
// Handle window resize
const lastSentRef = useRef(Date.now());
const streamRef = useRef<MediaStream | null>(null);


useEffect(() => {
  // Request camera access when the component mounts
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error('Camera permission denied or not available', err);
    }
  };

  startCamera();
  return () => {
    // Stop the camera when component unmounts
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };
}, []);

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
useEffect(() => {
  if (landmarks.length > 0) {
    const now = Date.now();
    if (now - lastSentRef.current < 3000) return; // throttle: 1000ms

    lastSentRef.current = now;

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
        // console.log('Backend response:', data);
      } catch (error) {
        console.error('Error sending landmarks to backend:', error);
      }
    };

    sendLandmarksToBackend();
  }
}, [landmarks]);


  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Session init ---
  useEffect(() => {
    const storedData = sessionStorage.getItem('childData');
    if (!storedData) {
      navigate('/child-login');
      return;
    }
    try {
      const { username, therapistCode, assignedThemes, sessionId: storedSessionId } = JSON.parse(storedData);
      setThemes(assignedThemes || []);
      setSessionId(storedSessionId || '');
      setCurrentTheme(assignedThemes?.[0] || 'underwater');
      // Log session data for debugging
      console.log("Session initialized. Themes:", assignedThemes, "SessionId:", storedSessionId);
    } catch (e) {
      navigate('/child-login');
    }
  }, []);

  // --- Emotion fetch and tracking ---
  const trackEmotion = async (emotion: string) => {
    if (!sessionId) return;
    const childData = sessionStorage.getItem('childData');
    if (!childData) return;
    const { username, therapistCode } = JSON.parse(childData);
    try {
      await fetch('http://localhost:5000/api/track-emotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          therapistCode,
          sessionId,
          emotion
        })
      });
      console.log("Tracked emotion:", emotion);
    } catch (error) {
      console.error('Error tracking emotion:', error);
    }
  };

  // --- Theme tracking ---
  const trackThemeChange = async (theme: string) => {
    if (!sessionId) return;
    const childData = sessionStorage.getItem('childData');
    if (!childData) return;
    const { username, therapistCode } = JSON.parse(childData);
    try {
      await fetch('http://localhost:5000/api/track-theme-change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          therapistCode,
          sessionId,
          theme
        })
      });
      console.log("Tracked theme change:", theme);
    } catch (error) {
      console.error('Error tracking theme change:', error);
    }
  };

  // --- Puzzle played tracking ---
  const trackPuzzlePlayed = async (theme: string, level: number, puzzleId: string, emotion: string) => {
    if (!sessionId) return;
    const childData = sessionStorage.getItem('childData');
    if (!childData) return;
    const { username, therapistCode } = JSON.parse(childData);
    try {
      await fetch('http://localhost:5000/api/update-played-puzzles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          therapistCode,
          sessionId,
          theme,
          level,
          puzzleId,
          emotions: [emotion]
        })
      });
      console.log("Tracked puzzle played:", puzzleId, "Emotion:", emotion);
    } catch (error) {
      console.error('Error tracking puzzle played:', error);
    }
  };

  // --- Adjust Difficulty Logic ---
  const adjustDifficulty = async () => {
    let newLevel = parseInt(currentLevel);
    let newWordIndex = wordIndex + 1;
    let nextTheme = currentTheme;

    // Track last two answers for level adjustment
    const updatedAnswers = [...lastTwoAnswers, completed ? '✅' : '❌'].slice(-2);
    setLastTwoAnswers(updatedAnswers);
    console.log(updatedAnswers);
    
    if (updatedAnswers.length === 2) {
      const [prev, curr] = updatedAnswers;
      if (prev === '✅' && curr === '✅' && newLevel < 3) {
        newLevel++;
      } else if (prev === '❌' && curr === '❌' && newLevel > 1) {
        newLevel--;
      }
    }

    // "Bad" emotions trigger a theme change
    let emotion = 'happy'; // Default
    try {
      const res = await fetch('http://localhost:5000/api/emotion');
      const data = await res.json();
      emotion = data.emotion || 'happy';
      console.log('Detected Emotion:', emotion);
    } catch (error) {
      console.error('Failed to fetch emotion:', error);
    }
  
    const stayInSameTheme = ['Happiness', 'Surprise'];
    const switchThemeEmotions = ['Fear', 'Anger', 'Disgust','Sadness'];
    if (switchThemeEmotions.includes(emotion)) {
      const availableThemes = themes.filter(t => t !== nextTheme);
      if (availableThemes.length > 0) {
        nextTheme = availableThemes[Math.floor(Math.random() * availableThemes.length)];
      }
    }

    // Track theme transition no matter what
    await trackThemeChange(nextTheme);
    await trackEmotion(emotion);
    // If changed theme, start at word 0
    newWordIndex = nextTheme !== currentTheme ? 0 : newWordIndex;

    // Track puzzle played (after moving)
    await trackPuzzlePlayed(nextTheme, newLevel, `${nextTheme}-${newLevel}-${newWordIndex}`, emotion);

    // Update state for next puzzle
    setCurrentTheme(nextTheme);
    setCurrentLevel(newLevel.toString());

    // Add to playedPuzzles set
    setPlayedPuzzles(prev => {
      const newSet = new Set(prev);
      newSet.add(`${nextTheme}-${newLevel}-${newWordIndex}`);
      return newSet;
    });

    // If finished all puzzles, show champion
    if (playedCount + 1 >= totalPuzzles) {
      setShowThemeComplete(true);
      stopCamera();
      return;
    }

    // Move to next puzzle after short delay
    setTimeout(() => {
      setWordIndex(newWordIndex);
      navigate(`/game/${nextTheme}/${newLevel}`);
    }, 500);
  };

  // --- Get word for current state ---
  const levelNum = Number(currentLevel) as 1 | 2 | 3;
  const currentWord = wordLists[currentTheme as keyof WordLists]?.[levelNum]?.[wordIndex % wordLists[currentTheme as keyof WordLists][levelNum].length];
  const gridSize = parseInt(currentLevel) < 3 ? 4 : 5;

  // --- Generate grid whenever word changes ---
  useEffect(() => {
    if (!currentWord) return;
    setIsLoading(true);
    setGrid(generateGrid(gridSize, currentWord.word));
    setSelected([]);
    setCompleted(false);
    setShowConfetti(false);
    setShowWrongMessage(false);
    setIsLoading(false);
    // Log theme and level for debugging
    console.log("Theme:", currentTheme, "Level:", currentLevel, "Word:", currentWord.word);
  }, [currentTheme, currentLevel, currentWord]);

  // --- Grid generator ---
  function generateGrid(size: number, word: string) {
    const grid: string[][] = [];
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < size; i++) {
      grid[i] = [];
      for (let j = 0; j < size; j++) {
        grid[i][j] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
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
  }

  // --- Cell selection ---
  const handleCellClick = (row: number, col: number) => {
    if (completed || !currentWord) return;
    const alreadySelected = selected.some(([r, c]) => r === row && c === col);
    let newSelected = alreadySelected 
      ? selected.filter(([r, c]) => !(r === row && c === col))
      : [...selected, [row, col]];
    setSelected(newSelected);
    const selectedWord = newSelected.map(([r, c]) => grid[r][c]).join('');
    if (selectedWord.length === currentWord.word.length) {
      if (selectedWord === currentWord.word) {
        setCorrectStreak(cs => cs + 1);
        setIncorrectStreak(0);
        setCompleted(true);
        setShowConfetti(true);
      } else {
        setIncorrectStreak(is => is + 1);
        setCorrectStreak(0);
        setShowWrongMessage(true);
        setTimeout(() => {
          setSelected([]);
          setShowWrongMessage(false);
        }, 1000);
      }
    }
  };

  // --- Next Level ---
  const handleNextLevel = async () => {
    adjustDifficulty()
    setShowConfetti(false);

    // Only allow progress if not already finished
    if (playedCount >= totalPuzzles) {
      setShowThemeComplete(true);
      return;
    }


   

    setPlayedCount(prev => {
      const next = prev + 1;
      sessionStorage.setItem('playedCount', next.toString());
      if (next >= totalPuzzles) setShowThemeComplete(true);
      return next > totalPuzzles ? totalPuzzles : next;
    });
  };

  const stopCamera = () => {
    console.log('Trying to stop camera...');
  
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      if (tracks.length === 0) {
        console.log('No tracks found in stream.');
      } else {
        tracks.forEach((track) => {
          console.log(`Stopping track: ${track.kind}`);
          track.stop();
        });
      }
      streamRef.current = null;
    } else {
      console.log('No stream found in streamRef.');
    }
  
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      //videoRef.current.load(); 
      console.log('Video source cleared.');
    } else {
      console.log('videoRef is null.');
    }
  };
  
  

  // Handle quit game
  const handleQuit = () => {
    const confirmQuit = window.confirm('Are you sure you want to quit the game?');
    if (confirmQuit) {
      stopCamera();
      setShowConfetti(false);
      navigate('/');
    }
  };
  const handleHomeClick = () => {
    stopCamera();
    setShowConfetti(false);
    navigate('/');
  };

  // --- Render ---
  if (!currentWord || isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={
        showThemeComplete
          ? {
              backgroundImage: `url(${soothingChampionImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              width: '100vw',
              height: '100vh',
              minHeight: '100vh',
              minWidth: '100vw',
              position: 'fixed',
              left: 0,
              top: 0,
              zIndex: 0,
            }
          : {}
      }
    >
            <video ref={videoRef} style={{ display: 'none' }} playsInline muted/>
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {!showThemeComplete && (
        <div
          className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
          style={{
            backgroundImage: `url('/images/${currentTheme}.jpg')`,
            backgroundSize: 'auto 150vh',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: 'lightblue',
          }}
        ></div>
      )}
      <div
        className={`relative z-10 flex flex-col items-center justify-center min-h-screen p-8 ${
          showThemeComplete ? 'bg-transparent' : ''
        }`}
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
          className={`bg-white/90 p-8 rounded-2xl shadow-xl max-w-5xl w-full flex flex-col md:flex-row gap-8 ${
            showThemeComplete ? 'bg-white/80' : ''
          }`}
        >
          {!showThemeComplete && (
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
          )}

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
              <>
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
                  <div className="mt-4 text-purple-700 text-lg">
                    Puzzles played: <span className="font-bold">
                      {playedCount > totalPuzzles ? totalPuzzles : playedCount}
                    </span> / <span className="font-bold">{totalPuzzles}</span>
                  </div>
                </motion.div>
              </>
            )}

            {showThemeComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  borderRadius: "2rem",
                  boxShadow: "0 4px 32px 0 rgba(0,0,0,.18)"
                }}
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
                  <br />
                  <span className="text-lg text-gray-700">
                    Puzzles played: {playedCount > totalPuzzles ? totalPuzzles : playedCount} / {totalPuzzles}
                  </span>
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

export default Game; 