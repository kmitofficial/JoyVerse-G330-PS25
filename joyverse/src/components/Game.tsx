import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { ArrowRight, Home, AlertCircle, Trophy, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Word lists with themes and levels
const wordLists = {
  underwater: {
    1: [{ word: 'FIN', image: '/images/fin.jpg' }],
    2: [{ word: 'FISH', image: '/images/fish.jpg' }],
    3: [{ word: 'WHALE', image: '/images/whale.jpg' }],
  },
  space: {
    1: [{ word: 'SUN', image: '/images/sun.jpg' }],
    2: [{ word: 'MOON', image: '/images/moon.jpg' }],
    3: [{ word: 'STARS', image: '/images/star.jpg' }],
  },
  forest: {
    1: [{ word: 'LOG', image: '/images/log.jpg' }],
    2: [{ word: 'TREE', image: '/images/tree.jpg' }],
    3: [{ word: 'PLANT', image: '/images/plant.jpg' }],
  },
  turquoise: {
    1: [{ word: 'SKY', image: '/images/sky.jpg' }],
    2: [{ word: 'WAVE', image: '/images/waves.jpg' }],
    3: [{ word: 'OCEAN', image: '/images/ocean.jpg' }],
  },
  yellow: {
    1: [{ word: 'SUN', image: '/images/sun.jpg' }],
    2: [{ word: 'GOLD', image: '/images/gold.jpg' }],
    3: [{ word: 'LIGHT', image: '/images/light.jpg' }],
  },
};

const Game = () => {
  const { theme = 'underwater', level = '1' } = useParams();
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

  // Handle window resize
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

  // Validate theme and level
  useEffect(() => {
    const assignedThemes = JSON.parse(localStorage.getItem('assignedThemes') || '[]');
    if (!assignedThemes.includes(theme)) {
      navigate('/');
      return;
    }

    const themeExists = theme in wordLists;
    const levelNum = parseInt(level);
    const levelExists = themeExists && levelNum >= 1 && levelNum <= 3;

    if (!themeExists || !levelExists) {
      navigate(`/game/${assignedThemes[0]}/1`);
      return;
    }
  }, [theme, level, navigate]);

  const levelNum = Number(level) as 1 | 2 | 3;
  const currentWord = wordLists[theme as keyof typeof wordLists]?.[levelNum]?.[0];
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

    const newSelected = [...selected, [row, col]];
    setSelected(newSelected);

    const selectedWord = newSelected.map(([r, c]) => grid[r][c]).join('');

    if (selectedWord.length === currentWord.word.length) {
      if (selectedWord === currentWord.word) {
        setCompleted(true);
        setShowConfetti(true);
      } else {
        setShowWrongMessage(true);
        setTimeout(() => {
          setSelected([]);
          setShowWrongMessage(false);
        }, 1000);
      }
    }
  };

  // Handle next level or theme completion
  const handleNextLevel = () => {
    setShowConfetti(false);
    const nextLevel = parseInt(level) + 1;
    if (nextLevel <= 3) {
      navigate(`/game/${theme}/${nextLevel}`);
    } else {
      const assignedThemes = JSON.parse(localStorage.getItem('assignedThemes') || []);
      if (theme === assignedThemes[assignedThemes.length - 1]) {
        const allThemes = ['underwater', 'space', 'forest', 'turquoise', 'yellow'];
        const newThemes = [...allThemes].sort(() => 0.5 - Math.random()).slice(0, 3);
        localStorage.setItem('assignedThemes', JSON.stringify(newThemes));
        localStorage.setItem('currentThemeIndex', '0');
        setShowThemeComplete(true);
        setShowConfetti(true);
      } else {
        const nextThemeIndex = assignedThemes.indexOf(theme) + 1;
        navigate(`/game/${assignedThemes[nextThemeIndex]}/1`);
      }
    }
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
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center p-8"
      style={{
        backgroundImage: `url('/images/${theme}.jpg')`,
        backgroundColor: 'lightblue', // Fallback color
      }}
    >
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={200}
          recycle={false}
          colors={['#FFD700', '#FF69B4', '#00FFFF']} // Custom colors
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
        className="bg-white/90 p-8 rounded-2xl shadow-xl max-w-2xl w-full"
      >
        <motion.img
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          src={currentWord.image}
          alt={`Illustration of ${currentWord.word}`}
          onError={(e) => {
            e.currentTarget.src = '/images/placeholder.jpg'; // Fallback image
          }}
          className="w-48 h-48 object-cover rounded-xl mx-auto mb-8"
        />

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
            className="word-grid"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, minmax(50px, 1fr))`,
              gap: '8px',
            }}
          >
            {grid.map((row, i) =>
              row.map((cell, j) => (
                <motion.button
                  key={`${i}-${j}`}
                  tabIndex={0}
                  aria-label={`Select cell at row ${i + 1}, column ${j + 1}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    scale: selected.some(([r, c]) => r === i && c === j) ? 1.2 : 1,
                    backgroundColor: selected.some(([r, c]) => r === i && c === j) ? '#C084FC' : '#EDE9FE',
                  }}
                  className="word-cell"
                  onClick={() => handleCellClick(i, j)}
                  disabled={completed}
                >
                  {cell}
                </motion.button>
              ))
            )}
          </div>
        )}

        {completed && !showThemeComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center"
          >
            <h2 className="text-2xl font-bold text-green-600 mb-4">Great job! 🎉</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNextLevel}
              className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors flex items-center gap-2 mx-auto"
            >
              Next Level <ArrowRight size={20} />
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
      </motion.div>
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