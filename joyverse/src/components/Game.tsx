// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import Confetti from 'react-confetti';
// import { ArrowRight, Home, AlertCircle, Trophy, X } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// // Word lists with themes and levels
// const wordLists = {
//   underwater: {
//     1: [
//       { word: 'SEA', image: '/images/sea.jpg' },
//       { word: 'NET', image: '/images/net.jpg' },
//       { word: 'ICE', image: '/images/ice.jpg' },
//       { word: 'EEL', image: '/images/eel.jpg' }
//     ],
//     2: [
//       { word: 'FISH', image: '/images/fish.jpg' },
//       { word: 'SAND', image: '/images/sand.jpg' },
//       { word: 'WAVE', image: '/images/wave.jpg' },
//       { word: 'SHIP', image: '/images/ship.jpg' }
//     ],
//     3: [
//       { word: 'WHALE', image: '/images/whale.jpg' },
//       { word: 'SHARK', image: '/images/shark.jpg' },
//       { word: 'SHELL', image: '/images/shell.jpg' },
//       { word: 'OCEAN', image: '/images/ocean.jpg' }
//     ],
//   },
//   space: {
//     1: [
//       { word: 'SUN', image: '/images/sun.jpg' },
//       { word: 'UFO', image: '/images/ufo.jpg' },
//       { word: 'SKY', image: '/images/sky.jpg' },
//       { word: 'GAS', image: '/images/gas.jpg' }
//     ],
//     2: [
//       { word: 'MOON', image: '/images/moon.jpg' },
//       { word: 'MARS', image: '/images/mars.jpg' },
//       { word: 'STAR', image: '/images/star.jpg' },
//       { word: 'ROCK', image: '/images/rock.jpg' }
//     ],
//     3: [
//       { word: 'VENUS', image: '/images/venus.jpg' },
//       { word: 'EARTH', image: '/images/earth.jpg' },
//       { word: 'SPACE', image: '/images/space1.jpg' },
//       { word: 'COMET', image: '/images/comet.jpg' }
//     ],
//   },
//   forest: {
//     1: [
//       { word: 'LOG', image: '/images/log.jpg' },
//       { word: 'MUD', image: '/images/mud.jpg' },
//       { word: 'BUG', image: '/images/bug.jpg' },
//       { word: 'ANT', image: '/images/ant.jpg' }
//     ],
//     2: [
//       { word: 'TREE', image: '/images/tree.jpg' },
//       { word: 'LEAF', image: '/images/leaf.jpg' },
//       { word: 'RAIN', image: '/images/rain.jpg' },
//       { word: 'BIRD', image: '/images/bird.jpg' }
//     ],
//     3: [
//       { word: 'PLANT', image: '/images/plant.jpg' },
//       { word: 'BERRY', image: '/images/berry.jpg' },
//       { word: 'GRASS', image: '/images/grass.jpg' },
//       { word: 'FRUIT', image: '/images/fruit.jpg' }
//     ],
//   },
//   playground: {
//     1: [
//       { word: 'RUN', image: '/images/run.jpg' },
//       { word: 'HOP', image: '/images/hop.jpg' },
//       { word: 'TOY', image: '/images/toy.jpg' },
//       { word: 'TAG', image: '/images/tag.jpg' }
//     ],
//     2: [
//       { word: 'BALL', image: '/images/ball.jpg' },
//       { word: 'PLAY', image: '/images/play.jpg' },
//       { word: 'RIDE', image: '/images/ride.jpg' },
//       { word: 'SAND', image: '/images/sand.jpg' }
//     ],
//     3: [
//       { word: 'CLIMB', image: '/images/climb.jpg' },
//       { word: 'SLIDE', image: '/images/slide.jpg' },
//       { word: 'SWING', image: '/images/swing.jpg' },
//       { word: 'TRAIN', image: '/images/train.jpg' }
//     ],
//   },
//   kitchen: {
//     1: [
//       { word: 'PAN', image: '/images/pan.jpg' },
//       { word: 'CUP', image: '/images/cup.jpg' },
//       { word: 'EGG', image: '/images/egg.jpg' },
//       { word: 'POT', image: '/images/pot.jpg' }
//     ],
//     2: [
//       { word: 'FORK', image: '/images/fork.jpg' },
//       { word: 'MILK', image: '/images/milk.jpg' },
//       { word: 'RICE', image: '/images/rice.jpg' },
//       { word: 'BOWL', image: '/images/bowl.jpg' }
//     ],
//     3: [
//       { word: 'PLATE', image: '/images/plate.jpg' },
//       { word: 'KNIFE', image: '/images/knife.jpg' },
//       { word: 'SPOON', image: '/images/spoon.jpg' },
//       { word: 'MIXER', image: '/images/mixer.jpg' }
//     ],
//   },
// };

// const Game = () => {
//   const { theme = 'underwater', level = '1' } = useParams();
//   const navigate = useNavigate();
//   const [grid, setGrid] = useState<string[][]>([]);
//   const [selected, setSelected] = useState<number[][]>([]);
//   const [completed, setCompleted] = useState(false);
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [showWrongMessage, setShowWrongMessage] = useState(false);
//   const [showThemeComplete, setShowThemeComplete] = useState(false);
//   const [windowSize, setWindowSize] = useState({
//     width: window.innerWidth,
//     height: window.innerHeight,
//   });
//   const [isLoading, setIsLoading] = useState(true);
//   const [correctStreak, setCorrectStreak] = useState(0);
//   const [incorrectStreak, setIncorrectStreak] = useState(0);
//   const [wordIndex, setWordIndex] = useState(0);
//   const [lastTwoAnswers, setLastTwoAnswers] = useState<string[]>([]);
//   const [playedPuzzles, setPlayedPuzzles] = useState(new Set<string>());
//   const totalPuzzles = 10;

//   // Handle window resize
//   useEffect(() => {
//     const handleResize = () => {
//       setWindowSize({
//         width: window.innerWidth,
//         height: window.innerHeight,
//       });
//     };
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Fetch assigned themes and played puzzles on load
//   useEffect(() => {
//     const fetchData = async () => {
//       const username = localStorage.getItem('childUsername');
//       const therapistCode = localStorage.getItem('therapistCode');
//       if (username && therapistCode) {
//         try {
//           // Fetch themes
//           const themeRes = await fetch(
//             `http://localhost:5000/api/get-child-themes?username=${username}&therapistCode=${therapistCode}`
//           );
//           const themeData = await themeRes.json();
//           if (themeData.themes) {
//             localStorage.setItem('assignedThemes', JSON.stringify(themeData.themes));
//           }

//           // Fetch played puzzles
//           const puzzleRes = await fetch(
//             `http://localhost:5000/api/get-played-puzzles?username=${username}&therapistCode=${therapistCode}`
//           );
//           const puzzleData = await puzzleRes.json();
//           if (puzzleData.playedPuzzles) {
//             setPlayedPuzzles(new Set(puzzleData.playedPuzzles));
//           }
//         } catch (error) {
//           console.error('Failed to fetch data:', error);
//         }
//       }
//     };
//     fetchData();
//   }, []);

//   // Validate theme and level
//   useEffect(() => {
//     const assignedThemes = JSON.parse(localStorage.getItem('assignedThemes') || '[]');
//     if (!assignedThemes.includes(theme)) {
//       navigate('/');
//       return;
//     }

//     const themeExists = theme in wordLists;
//     const levelNum = parseInt(level);
//     const levelExists = themeExists && levelNum >= 1 && levelNum <= 3;

//     if (!themeExists || !levelExists) {
//       navigate(`/game/${assignedThemes[0] || 'underwater'}/1`);
//       return;
//     }
//   }, [theme, level, navigate]);

//   const levelNum = Number(level) as 1 | 2 | 3;
//   const currentWord = wordLists[theme]?.[levelNum]?.[wordIndex % wordLists[theme][levelNum].length];

//   const gridSize = parseInt(level) < 3 ? 4 : 5;

//   // Generate grid and reset states
//   useEffect(() => {
//     if (!currentWord) return;

//     setIsLoading(true);
//     setGrid(generateGrid(gridSize, currentWord.word));
//     setSelected([]);
//     setCompleted(false);
//     setShowConfetti(false);
//     setShowWrongMessage(false);
//     setShowThemeComplete(false);
//     setIsLoading(false);
//   }, [theme, level, currentWord]);

//   // Handle cell click
//   const handleCellClick = (row: number, col: number) => {
//     if (completed || !currentWord) return;

//     const alreadySelected = selected.some(([r, c]) => r === row && c === col);

//     let newSelected;

//     if (alreadySelected) {
//       newSelected = selected.filter(([r, c]) => !(r === row && c === col));
//     } else {
//       newSelected = [...selected, [row, col]];
//     }
//     setSelected(newSelected);

//     const selectedWord = newSelected.map(([r, c]) => grid[r][c]).join('');

//     if (selectedWord.length === currentWord.word.length) {
//       if (selectedWord === currentWord.word) {
//         setCorrectStreak((prev) => prev + 1);
//         setIncorrectStreak(0);
//         setCompleted(true);
//         setShowConfetti(true);
//       } else {
//         setIncorrectStreak((prev) => prev + 1);
//         setCorrectStreak(0);
//         setShowWrongMessage(true);
//         setTimeout(() => {
//           setSelected([]);
//           setShowWrongMessage(false);
//         }, 1000);
//       }
//     }
//   };

//   const adjustDifficulty = async () => {
//     let newLevel = parseInt(level);
//     let newWordIndex = wordIndex + 1;
//     let currentTheme = theme;
//     let assignedThemes = JSON.parse(localStorage.getItem('assignedThemes') || '[]');

//     // Track last two answers
//     const updatedAnswers = [...lastTwoAnswers, completed ? '✅' : '❌'].slice(-2);
//     setLastTwoAnswers(updatedAnswers);

//     // Adjust level based on performance
//     if (updatedAnswers.length === 2) {
//       const [prev, curr] = updatedAnswers;
//       if (prev === '✅' && curr === '✅' && newLevel < 3) {
//         newLevel++;
//       } else if (prev === '❌' && curr === '❌' && newLevel > 1) {
//         newLevel--;
//       }
//     }

//     // Emotion-based theme handling
//     let emotion = 'happy'; // Default
//     try {
//       const res = await fetch('http://localhost:5000/api/emotion');
//       const data = await res.json();
//       emotion = data.emotion || 'happy';
//       console.log('Detected Emotion:', emotion);
//     } catch (error) {
//       console.error('Failed to fetch emotion:', error);
//     }

//     const stayInSameTheme = ['happy', 'calm', 'surprised', 'excited'];
//     const switchThemeEmotions = ['sad', 'angry', 'bored'];

//     if (switchThemeEmotions.includes(emotion)) {
//       const availableThemes = Object.keys(wordLists).filter((t) => t !== currentTheme && !assignedThemes.includes(t));
//       if (availableThemes.length > 0) {
//         const newTheme = availableThemes[Math.floor(Math.random() * availableThemes.length)];
//         currentTheme = newTheme;
//         newWordIndex = 0;
//         assignedThemes.push(newTheme);
//         localStorage.setItem('assignedThemes', JSON.stringify(assignedThemes));

//         // Update backend themes
//         await fetch('http://localhost:5000/api/update-child-themes', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             username: localStorage.getItem('childUsername'),
//             therapistCode: localStorage.getItem('therapistCode'),
//             themes: assignedThemes,
//           }),
//         });
//       } else {
//         console.log('No new themes available. Staying in current theme.');
//       }
//     } else {
//       console.log('Emotion is positive or neutral. Staying in same theme.');
//     }

//     // Ensure unique puzzles
//     const updatedPlayedPuzzles = new Set(playedPuzzles);
//     let newPuzzleKey = `${currentTheme}-${newLevel}-${newWordIndex}`;
//     while (updatedPlayedPuzzles.has(newPuzzleKey)) {
//       newWordIndex = (newWordIndex + 1) % wordLists[currentTheme][newLevel].length;
//       newPuzzleKey = `${currentTheme}-${newLevel}-${newWordIndex}`;
//     }

//     updatedPlayedPuzzles.add(newPuzzleKey);

//     // Update played puzzles in backend
//     await fetch('http://localhost:5000/api/update-played-puzzles', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         username: localStorage.getItem('childUsername'),
//         therapistCode: localStorage.getItem('therapistCode'),
//         puzzleKey: newPuzzleKey,
//       }),
//     });

//     // End game if 10 unique puzzles played
//     if (updatedPlayedPuzzles.size >= totalPuzzles) {
//       setShowThemeComplete(true);
//       return;
//     }

//     // Save progress
//     setPlayedPuzzles(updatedPlayedPuzzles);

//     // Go to next puzzle
//     setTimeout(() => {
//       setWordIndex(newWordIndex);
//       navigate(`/game/${currentTheme}/${newLevel}`);
//     }, 500);
//   };

//   const handleNextLevel = () => {
//     setShowConfetti(false);
//     setTimeout(() => {
//       adjustDifficulty();
//     }, 500);
//   };

//   // Handle quit game
//   const handleQuit = () => {
//     const confirmQuit = window.confirm('Are you sure you want to quit the game?');
//     if (confirmQuit) {
//       setShowConfetti(false);
//       navigate('/');
//     }
//   };

//   // Handle home click
//   const handleHomeClick = () => {
//     setShowConfetti(false);
//     navigate('/');
//   };

//   if (!currentWord || isLoading) {
//     return <div className="text-center">Loading...</div>;
//   }

//   return (
//     <div className="relative min-h-screen w-full overflow-hidden">
//       {/* Animated Background Layer */}
//       <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden"></div>
//       {/* Game Content */}
//       <div
//         className="relative z-10 flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat p-8"
//         style={{
//           backgroundImage: `url('/images/${theme}.jpg')`,
//           backgroundSize: 'auto 150vh',
//           backgroundPosition: 'center',
//           backgroundRepeat: 'no-repeat',
//           backgroundColor: 'lightblue',
//         }}
//       >
//         {showConfetti && (
//           <Confetti
//             width={windowSize.width}
//             height={windowSize.height}
//             numberOfPieces={200}
//             recycle={false}
//             colors={['#FFD700', '#FF69B4', '#00FFFF']}
//             onConfettiComplete={() => setShowConfetti(false)}
//           />
//         )}

//         <motion.button
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={handleHomeClick}
//           className="absolute top-4 left-4 bg-white/80 p-3 rounded-full hover:bg-white"
//         >
//           <Home />
//         </motion.button>

//         <motion.button
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={handleQuit}
//           className="absolute top-4 right-4 bg-red-500/80 p-3 rounded-full hover:bg-red-500 text-white"
//         >
//           <X />
//         </motion.button>

//         <motion.div
//           initial={{ scale: 0.9, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ duration: 0.5 }}
//           className="bg-white/90 p-8 rounded-2xl shadow-xl max-w-5xl w-full flex flex-col md:flex-row gap-8"
//         >
//           {/* Image Container */}
//           <div className="flex-1 flex items-center justify-center">
//             <motion.img
//               initial={{ y: -20 }}
//               animate={{ y: 0 }}
//               transition={{ duration: 0.5 }}
//               src={currentWord.image}
//               alt={currentWord.word}
//               className="w-full h-64 md:h-96 object-contain rounded-xl"
//               onError={(e) => {
//                 (e.target as HTMLImageElement).src = '/images/default.jpg';
//               }}
//             />
//           </div>

//           {/* Grid Container */}
//           <div className="flex-1 flex flex-col items-center justify-center">
//             <AnimatePresence>
//               {showWrongMessage && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: 20 }}
//                   className="flex items-center justify-center gap-2 text-red-500 mb-4"
//                 >
//                   <AlertCircle />
//                   <span>Oops! Try again!</span>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {!showThemeComplete && (
//               <div
//                 className="word-grid w-full"
//                 style={{
//                   display: 'grid',
//                   gridTemplateColumns: `repeat(${gridSize}, minmax(60px, 1fr))`,
//                   gap: '12px',
//                 }}
//               >
//                 {grid.map((row, i) =>
//                   row.map((cell, j) => (
//                     <motion.button
//                       key={`${i}-${j}`}
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                       animate={{
//                         scale: selected.some(([r, c]) => r === i && c === j) ? 1.2 : 1,
//                         backgroundColor: selected.some(([r, c]) => r === i && c === j)
//                           ? '#30253E'
//                           : '#EDE9FE',
//                       }}
//                       className="text-2xl font-bold w-16 h-16 rounded-lg flex items-center justify-center"
//                       style={{
//                         color: selected.some(([r, c]) => r === i && c === j) ? 'white' : '#4C1D95',
//                         boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
//                       }}
//                       onClick={() => handleCellClick(i, j)}
//                       disabled={completed}
//                     >
//                       {cell}
//                     </motion.button>
//                   ))
//                 )}
//               </div>
//             )}

//             {!showThemeComplete && (
//               <motion.div className="mt-8 text-center">
//                 {showWrongMessage && (
//                   <h2 className="text-2xl font-bold text-red-500 mb-4">Try Again! ❌</h2>
//                 )}
//                 {completed && (
//                   <h2 className="text-2xl font-bold text-green-600 mb-4">Great job! 🎉</h2>
//                 )}
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={handleNextLevel}
//                   className={`px-6 py-3 rounded-full transition-colors flex items-center gap-2 mx-auto ${
//                     completed ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
//                   } text-white`}
//                 >
//                   Next <ArrowRight size={20} />
//                 </motion.button>
//               </motion.div>
//             )}

//             {showThemeComplete && (
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 className="text-center py-8"
//               >
//                 <motion.div
//                   animate={{ rotate: [0, 10, -10, 0] }}
//                   transition={{ repeat: Infinity, duration: 1 }}
//                   className="text-6xl mb-6 flex justify-center"
//                 >
//                   <Trophy className="text-yellow-500" size={80} />
//                 </motion.div>
//                 <h2 className="text-3xl font-bold text-purple-600 mb-4">
//                   Amazing! You've completed all levels! 🎉
//                 </h2>
//                 <p className="text-xl text-purple-500 mb-6">
//                   You're a word search champion!
//                 </p>
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={handleHomeClick}
//                   className="bg-purple-500 text-white px-8 py-4 rounded-full hover:bg-purple-600 transition-colors flex items-center gap-3 mx-auto"
//                 >
//                   <Home size={24} />
//                   Back to Home
//                 </motion.button>
//               </motion.div>
//             )}
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// // Generate grid with random letters and the target word
// const generateGrid = (size: number, word: string) => {
//   const grid: string[][] = [];
//   const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

//   // Fill grid with random letters
//   for (let i = 0; i < size; i++) {
//     grid[i] = [];
//     for (let j = 0; j < size; j++) {
//       grid[i][j] = letters[Math.floor(Math.random() * letters.length)];
//     }
//   }

//   // Place the word randomly
//   const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
//   const row = Math.floor(Math.random() * (size - (direction === 'vertical' ? word.length : 0)));
//   const col = Math.floor(Math.random() * (size - (direction === 'horizontal' ? word.length : 0)));

//   for (let i = 0; i < word.length; i++) {
//     if (direction === 'horizontal') {
//       grid[row][col + i] = word[i];
//     } else {
//       grid[row + i][col] = word[i];
//     }
//   }

//   return grid;
// };

// export default Game;
// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import Confetti from 'react-confetti';
// import { ArrowRight, Home, AlertCircle, Trophy, X } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// // Word lists with themes and levels
// const wordLists = {
//   underwater: {
//     1: [
//       { word: 'SEA', image: '/images/sea.jpg' },
//       { word: 'NET', image: '/images/net.jpg' },
//       { word: 'ICE', image: '/images/ice.jpg' },
//       { word: 'EEL', image: '/images/eel.jpg' }
//     ],
//     2: [
//       { word: 'FISH', image: '/images/fish.jpg' },
//       { word: 'SAND', image: '/images/sand.jpg' },
//       { word: 'WAVE', image: '/images/wave.jpg' },
//       { word: 'SHIP', image: '/images/ship.jpg' }
//     ],
//     3: [
//       { word: 'WHALE', image: '/images/whale.jpg' },
//       { word: 'SHARK', image: '/images/shark.jpg' },
//       { word: 'SHELL', image: '/images/shell.jpg' },
//       { word: 'OCEAN', image: '/images/ocean.jpg' }
//     ],
//   },
//   space: {
//     1: [
//       { word: 'SUN', image: '/images/sun.jpg' },
//       { word: 'UFO', image: '/images/ufo.jpg' },
//       { word: 'SKY', image: '/images/sky.jpg' },
//       { word: 'GAS', image: '/images/gas.jpg' }
//     ],
//     2: [
//       { word: 'MOON', image: '/images/moon.jpg' },
//       { word: 'MARS', image: '/images/mars.jpg' },
//       { word: 'STAR', image: '/images/star.jpg' },
//       { word: 'ROCK', image: '/images/rock.jpg' }
//     ],
//     3: [
//       { word: 'VENUS', image: '/images/venus.jpg' },
//       { word: 'EARTH', image: '/images/earth.jpg' },
//       { word: 'SPACE', image: '/images/space1.jpg' },
//       { word: 'COMET', image: '/images/comet.jpg' }
//     ],
//   },
//   forest: {
//     1: [
//       { word: 'LOG', image: '/images/log.jpg' },
//       { word: 'MUD', image: '/images/mud.jpg' },
//       { word: 'BUG', image: '/images/bug.jpg' },
//       { word: 'ANT', image: '/images/ant.jpg' }
//     ],
//     2: [
//       { word: 'TREE', image: '/images/tree.jpg' },
//       { word: 'LEAF', image: '/images/leaf.jpg' },
//       { word: 'RAIN', image: '/images/rain.jpg' },
//       { word: 'BIRD', image: '/images/bird.jpg' }
//     ],
//     3: [
//       { word: 'PLANT', image: '/images/plant.jpg' },
//       { word: 'BERRY', image: '/images/berry.jpg' },
//       { word: 'GRASS', image: '/images/grass.jpg' },
//       { word: 'FRUIT', image: '/images/fruit.jpg' }
//     ],
//   },
//   playground: {
//     1: [
//       { word: 'RUN', image: '/images/run.jpg' },
//       { word: 'HOP', image: '/images/hop.jpg' },
//       { word: 'TOY', image: '/images/toy.jpg' },
//       { word: 'TAG', image: '/images/tag.jpg' }
//     ],
//     2: [
//       { word: 'BALL', image: '/images/ball.jpg' },
//       { word: 'PLAY', image: '/images/play.jpg' },
//       { word: 'RIDE', image: '/images/ride.jpg' },
//       { word: 'SAND', image: '/images/sand.jpg' }
//     ],
//     3: [
//       { word: 'CLIMB', image: '/images/climb.jpg' },
//       { word: 'SLIDE', image: '/images/slide.jpg' },
//       { word: 'SWING', image: '/images/swing.jpg' },
//       { word: 'TRAIN', image: '/images/train.jpg' }
//     ],
//   },
//   kitchen: {
//     1: [
//       { word: 'PAN', image: '/images/pan.jpg' },
//       { word: 'CUP', image: '/images/cup.jpg' },
//       { word: 'EGG', image: '/images/egg.jpg' },
//       { word: 'POT', image: '/images/pot.jpg' }
//     ],
//     2: [
//       { word: 'FORK', image: '/images/fork.jpg' },
//       { word: 'MILK', image: '/images/milk.jpg' },
//       { word: 'RICE', image: '/images/rice.jpg' },
//       { word: 'BOWL', image: '/images/bowl.jpg' }
//     ],
//     3: [
//       { word: 'PLATE', image: '/images/plate.jpg' },
//       { word: 'KNIFE', image: '/images/knife.jpg' },
//       { word: 'SPOON', image: '/images/spoon.jpg' },
//       { word: 'MIXER', image: '/images/mixer.jpg' }
//     ],
//   },
// };
// const Game = () => {
//   const { theme = 'underwater', level = '1' } = useParams();
//   const navigate = useNavigate();
//   const [grid, setGrid] = useState<string[][]>([]);
//   const [selected, setSelected] = useState<number[][]>([]);
//   const [completed, setCompleted] = useState(false);
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [showWrongMessage, setShowWrongMessage] = useState(false);
//   const [showThemeComplete, setShowThemeComplete] = useState(false);
//   const [windowSize, setWindowSize] = useState({
//     width: window.innerWidth,
//     height: window.innerHeight,
//   });
//   const [isLoading, setIsLoading] = useState(true);
//   const [correctStreak, setCorrectStreak] = useState(0);
// const [incorrectStreak, setIncorrectStreak] = useState(0);
// const [wordIndex, setWordIndex] = useState(0);


//   // Handle window resize
//   useEffect(() => {
//     const handleResize = () => {
//       setWindowSize({
//         width: window.innerWidth,
//         height: window.innerHeight,
//       });
//     };
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Validate theme and level
//   useEffect(() => {
//     const assignedThemes = JSON.parse(localStorage.getItem('assignedThemes') || '[]');
//     if (!assignedThemes.includes(theme)) {
//       navigate('/');
//       return;
//     }

//     const themeExists = theme in wordLists;
//     const levelNum = parseInt(level);
//     const levelExists = themeExists && levelNum >= 1 && levelNum <= 3;

//     if (!themeExists || !levelExists) {
//       navigate(`/game/${assignedThemes[0]}/1`);
//       return;
//     }
//   }, [theme, level, navigate]);

//   const levelNum = Number(level) as 1 | 2 | 3;
//   const currentWord = wordLists[theme]?.[levelNum]?.[wordIndex % wordLists[theme][levelNum].length];

//   const gridSize = parseInt(level) < 3 ? 4 : 5;

//   // Generate grid and reset states
//   useEffect(() => {
//     if (!currentWord) return;

//     setIsLoading(true);
//     setGrid(generateGrid(gridSize, currentWord.word));
//     setSelected([]);
//     setCompleted(false);
//     setShowConfetti(false);
//     setShowWrongMessage(false);
//     setShowThemeComplete(false);
//     setIsLoading(false);
//   }, [theme, level, currentWord]);

//   // Handle cell click
//   const handleCellClick = (row: number, col: number) => {
//     if (completed || !currentWord) return;
  
// const alreadySelected = selected.some(([r, c]) => r === row && c === col);
  
//     let newSelected;
  
//     if (alreadySelected) {
//       newSelected = selected.filter(([r, c]) => !(r === row && c === col));
//     } else {
//       newSelected = [...selected, [row, col]];
//     }
//        setSelected(newSelected);

//     const selectedWord = newSelected.map(([r, c]) => grid[r][c]).join('');

//     if (selectedWord.length === currentWord.word.length) {
//       if (selectedWord === currentWord.word) {
//         setCorrectStreak((prev) => prev + 1);
//   setIncorrectStreak(0); 
//         setCompleted(true);
//         setShowConfetti(true);
//       } else {
//         setIncorrectStreak((prev) => prev + 1);
//         setCorrectStreak(0);
//         setShowWrongMessage(true);
//         setTimeout(() => {
//           setSelected([]);
//           setShowWrongMessage(false);
//         }, 1000);
//       }
//     }
//   };
//   const [lastTwoAnswers, setLastTwoAnswers] = useState<string[]>([]);
// const [playedPuzzles, setPlayedPuzzles] = useState(new Set());
// const totalPuzzles = 10;
// const [lastTwoEmotions, setLastTwoEmotions] = useState(() => {
//   const stored = localStorage.getItem('lastTwoEmotions');
//   return stored ? JSON.parse(stored) : [];
// });


// const adjustDifficulty = async () => {
//   let newLevel = parseInt(level);
//   let newWordIndex = wordIndex + 1;
//   let currentTheme = theme;
//   let assignedThemes = JSON.parse(localStorage.getItem('assignedThemes') || '[]');
//  // console.log("Assigned themes:", assignedThemes);

//   // Track last two answers
//   const updatedAnswers = [...lastTwoAnswers, completed ? '✅' : '❌'].slice(-2);
//   setLastTwoAnswers(updatedAnswers);

//   // 🎯 Adjust level (difficulty) based on performance
//   if (updatedAnswers.length === 2) {
//     const [prev, curr] = updatedAnswers;
//     if (prev === '✅' && curr === '✅' && newLevel < 3) {
//       newLevel++;
//     } else if (prev === '❌' && curr === '❌' && newLevel > 1) {
//       newLevel--;
//     }
//   }

//   // 😄 Emotion-based Theme Handling
//   try {
//     const res = await fetch('http://localhost:5000/emotion');
//     const data = await res.json();
//     const emotion = data.emotion;
//     console.log('Detected Emotion:', emotion);

//     // Emotion mapping
//     const stayInSameTheme = ['happy', 'calm', 'surprised', 'excited'];
//     const switchThemeEmotions = ['sad', 'angry', 'bored'];

//     // 💡 Only switch theme if emotion is in switchThemeEmotions
//     if (switchThemeEmotions.includes(emotion)) {
//       const availableThemes = Object.keys(wordLists).filter((t) => t !== currentTheme && !assignedThemes.includes(t));
//       if (availableThemes.length > 0) {
//         const newTheme = availableThemes[Math.floor(Math.random() * availableThemes.length)];
//         currentTheme = newTheme;
//         console.log("switching to: ", currentTheme);
        
//         // Keep newLevel as is (don’t reset it)
//         newWordIndex = 0;
    
//         assignedThemes.push(newTheme);
//         localStorage.setItem('assignedThemes', JSON.stringify(assignedThemes));
//       }
    
//        else {
//         console.log('No new themes available. Staying in current theme.');
//       }
//       if (availableThemes.length === 0) {
//         console.log('No new themes available. Resetting assignedThemes.');
//         assignedThemes = [currentTheme]; // Reset and keep only the current one
//         localStorage.setItem('assignedThemes', JSON.stringify(assignedThemes));
//       }
      
//     } else {
//       console.log('Emotion is positive or neutral. Staying in same theme.');
//     }
    
//   } catch (error) {
//     console.error('Failed to fetch emotion:', error);
//   }
 
  
//   // ✅ Ensure unique puzzles
//   const updatedPlayedPuzzles = new Set(playedPuzzles);
//   let newPuzzleKey = `${currentTheme}-${newLevel}-${newWordIndex}`;
//   while (updatedPlayedPuzzles.has(newPuzzleKey)) {
//     newWordIndex = (newWordIndex + 1) % wordLists[currentTheme][newLevel].length;
//     newPuzzleKey = `${currentTheme}-${newLevel}-${newWordIndex}`;
//   }

//   updatedPlayedPuzzles.add(newPuzzleKey);

//   // 🛑 End game if 10 unique puzzles played
//   if (updatedPlayedPuzzles.size >= totalPuzzles) {
//     setShowThemeComplete(true);
//     return;
//   }

//   // Save progress
//   setPlayedPuzzles(updatedPlayedPuzzles);

//   // ✅ Go to next puzzle
//   setTimeout(() => {
//     setWordIndex(newWordIndex);
    
//     navigate(`/game/${currentTheme}/${newLevel}`);
//   }, 500);
// };


// const handleNextLevel = () => {
//   setShowConfetti(false);
//   setTimeout(() => {
//     adjustDifficulty();
//   }, 500);
// };



//   // Handle quit game
//   const handleQuit = () => {
//     const confirmQuit = window.confirm('Are you sure you want to quit the game?');
//     if (confirmQuit) {
//       setShowConfetti(false);
//       navigate('/');
//     }
//   };

//   // Handle home click
//   const handleHomeClick = () => {
//     setShowConfetti(false);
//     navigate('/');
//   };

//   if (!currentWord || isLoading) {
//     return <div className="text-center">Loading...</div>;
//   }

//     return (
//     <div className="relative min-h-screen w-full overflow-hidden">
//     {/* 🌌 Animated Background Layer */}
//       <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
//       </div>
//         {/* 🎮 Game Content */}
//         <div
//           className="relative z-10 flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat p-8"
//           style={{
//             backgroundImage: `url('/images/${theme}.jpg')`,
//             backgroundSize: 'auto 150vh', // Adjust zoom
//             backgroundPosition: 'center',
//             backgroundRepeat: 'no-repeat',
//             backgroundColor: 'lightblue',
//           }}
//         >
    
//         {showConfetti && (
//           <Confetti
//             width={windowSize.width}
//             height={windowSize.height}
//             numberOfPieces={200}
//             recycle={false}
//             colors={['#FFD700', '#FF69B4', '#00FFFF']}
//             onConfettiComplete={() => setShowConfetti(false)}
//           />
//         )}
    
//         <motion.button
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={handleHomeClick}
//           className="absolute top-4 left-4 bg-white/80 p-3 rounded-full hover:bg-white"
//         >
//           <Home />
//         </motion.button>
    
//         <motion.button
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={handleQuit}
//           className="absolute top-4 right-4 bg-red-500/80 p-3 rounded-full hover:bg-red-500 text-white"
//         >
//           <X />
//         </motion.button>
    
//         <motion.div
//           initial={{ scale: 0.9, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ duration: 0.5 }}
//           className="bg-white/90 p-8 rounded-2xl shadow-xl max-w-5xl w-full flex flex-col md:flex-row gap-8"
//         >
//           {/* Image Container */}
//           <div className="flex-1 flex items-center justify-center">
//             <motion.img
//               initial={{ y: -20 }}
//               animate={{ y: 0 }}
//               transition={{ duration: 0.5 }}
//               src={currentWord.image}
//               alt={currentWord.word}
//               className="w-full h-64 md:h-96 object-contain rounded-xl"
//               onError={(e) => {
//                 (e.target as HTMLImageElement).src = '/images/default.jpg';
//               }}
//             />
//           </div>
  
//         {/* Grid Container */}
//           <div className="flex-1 flex flex-col items-center justify-center">
//             <AnimatePresence>
//               {showWrongMessage && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: 20 }}
//                   className="flex items-center justify-center gap-2 text-red-500 mb-4"
//                 >
//                   <AlertCircle />
//                   <span>Oops! Try again!</span>
//                 </motion.div>
//               )}
//             </AnimatePresence>
    
//             {!showThemeComplete && (
//               <div
//                 className="word-grid w-full"
//                 style={{
//                   display: 'grid',
//                   gridTemplateColumns: `repeat(${gridSize}, minmax(60px, 1fr))`,
//                   gap: '12px',
//                 }}
//               >
//                 {grid.map((row, i) =>
//                   row.map((cell, j) => (
//                     <motion.button
//                       key={`${i}-${j}`}
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                       animate={{
//                         scale: selected.some(([r, c]) => r === i && c === j) ? 1.2 : 1,
//                         backgroundColor: selected.some(([r, c]) => r === i && c === j) 
//                           ? '#30253E'
//                           : '#EDE9FE',
//                       }}
//                       className="text-2xl font-bold w-16 h-16 rounded-lg flex items-center justify-center"
//                       style={{
//                         color: selected.some(([r, c]) => r === i && c === j) ? 'white' : '#4C1D95',
//                         boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
//                       }}
//                       onClick={() => handleCellClick(i, j)}
//                       disabled={completed}
//                     >
//                       {cell}
//                     </motion.button>
//                   ))
//                 )}
//               </div>
//             )}
    
//             {!showThemeComplete && (
//               <motion.div className="mt-8 text-center">
//                 {showWrongMessage && (
//                   <h2 className="text-2xl font-bold text-red-500 mb-4">Try Again! ❌</h2>
//                 )}
//                 {completed && (
//                   <h2 className="text-2xl font-bold text-green-600 mb-4">Great job! 🎉</h2>
//                 )}
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={handleNextLevel}
//                   className={`px-6 py-3 rounded-full transition-colors flex items-center gap-2 mx-auto ${
//                     completed ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
//                   } text-white`}
//                 >
//                   Next <ArrowRight size={20} />
//                 </motion.button>
//               </motion.div>
//             )}
    
//             {showThemeComplete && (
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 className="text-center py-8"
//               >
//                 <motion.div
//                   animate={{ rotate: [0, 10, -10, 0] }}
//                   transition={{ repeat: Infinity, duration: 1 }}
//                   className="text-6xl mb-6 flex justify-center"
//                 >
//                   <Trophy className="text-yellow-500" size={80} />
//                 </motion.div>
//                 <h2 className="text-3xl font-bold text-purple-600 mb-4">
//                   Amazing! You've completed all levels! 🎉
//                 </h2>
//                 <p className="text-xl text-purple-500 mb-6">
//                   You're a word search champion!
//                 </p>
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={handleHomeClick}
//                   className="bg-purple-500 text-white px-8 py-4 rounded-full hover:bg-purple-600 transition-colors flex items-center gap-3 mx-auto"
//                 >
//                   <Home size={24} />
//                   Back to Home
//                 </motion.button>
//               </motion.div>
//             )}
//         </div>
//       </motion.div>
//     </div>
//   </div>
//  );
// };
// // Generate grid with random letters and the target word
// const generateGrid = (size: number, word: string) => {
//   const grid: string[][] = [];
//   const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

//   // Fill grid with random letters
//   for (let i = 0; i < size; i++) {
//     grid[i] = [];
//     for (let j = 0; j < size; j++) {
//       grid[i][j] = letters[Math.floor(Math.random() * letters.length)];
//     }
//   }

//   // Place the word randomly
//   const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
//   const row = Math.floor(Math.random() * (size - (direction === 'vertical' ? word.length : 0)));
//   const col = Math.floor(Math.random() * (size - (direction === 'horizontal' ? word.length : 0)));

//   for (let i = 0; i < word.length; i++) {
//     if (direction === 'horizontal') {
//       grid[row][col + i] = word[i];
//     } else {
//       grid[row + i][col] = word[i];
//     }
//   }

//   return grid;
// };

// export default Game;






import { useState, useEffect } from 'react';
import { useParams, useNavigate,useLocation } from 'react-router-dom';
import Confetti from 'react-confetti';
import { ArrowRight, Home, AlertCircle, Trophy, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Word lists with themes and levels
const wordLists = {
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
  const [correctStreak, setCorrectStreak] = useState(0);
  const [incorrectStreak, setIncorrectStreak] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [lastTwoAnswers, setLastTwoAnswers] = useState<string[]>([]);
  const [playedPuzzles, setPlayedPuzzles] = useState(new Set<string>());
  const totalPuzzles = 10;
  const [themes, setThemes] = useState<string[]>([]); // Add this line

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
const location=useLocation();
  // Fetch assigned themes and played puzzles on load
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const username = localStorage.getItem('childUsername');
  //     const therapistCode = localStorage.getItem('therapistCode');
  //     if (username && therapistCode) {
  //       try {
  //         // Fetch themes
  //         const themeRes = await fetch(
  //           `http://localhost:5000/api/get-child-themes?username=${username}&therapistCode=${therapistCode}`
  //         );
  //         const themeData = await themeRes.json();
  //         if (themeData.themes) {
  //           localStorage.setItem('assignedThemes', JSON.stringify(themeData.themes));
  //         }

  //         // Fetch played puzzles
  //         const puzzleRes = await fetch(
  //           `http://localhost:5000/api/get-played-puzzles?username=${username}&therapistCode=${therapistCode}`
  //         );
  //         const puzzleData = await puzzleRes.json();
  //         if (puzzleData.playedPuzzles) {
  //           setPlayedPuzzles(new Set(puzzleData.playedPuzzles));
  //         }
  //       } catch (error) {
  //         console.error('Failed to fetch data:', error);
  //       }
  //     }
  //   };
  //   fetchData();
  // }, []);
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
//   useEffect(() => {
//     const fetchData = async () => {
//       // Get data from sessionStorage instead of localStorage
//       const storedData = sessionStorage.getItem('childData');
      
//       if (storedData) {
//         const {assignedThemes,username,therapistCode } = JSON.parse(storedData);
//         console.log(assignedThemes[0])
//         console.log(assignedThemes[1])
//         console.log(assignedThemes[2])
//         try {
//           // Use the assignedThemes from sessionStorage first
//           if (assignedThemes && assignedThemes.length) {
//             setThemes(assignedThemes);
//           }
  
//           // Only fetch played puzzles from API
//           const puzzleRes = await fetch(
//             `http://localhost:5000/api/get-played-puzzles?username=${username}&therapistCode=${therapistCode}`
//           );
//           const puzzleData = await puzzleRes.json();
          
//           if (puzzleData.playedPuzzles) {
//             setPlayedPuzzles(new Set(puzzleData.playedPuzzles));
//           }
//         } catch (error) {
//           console.error('Failed to fetch played puzzles:', error);
//         }
//       } else {
//         navigate('/child-login'); // Redirect if no session data
//       }
//     };
    
//     fetchData();
//   }, [navigate]);
//   const location = useLocation();
// useEffect(() => {
//   // First check route state
//   if (location.state) {
//     setThemes(location.state.assignedThemes || []);
//     return;
//   }
  
//   // Fallback to sessionStorage
//   const storedData = sessionStorage.getItem('childData');
//   if (storedData) {
//     const data = JSON.parse(storedData);
//     setThemes(data.assignedThemes || []);
//   }
// }, [location.state]);
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
    let assignedThemes = JSON.parse(localStorage.getItem('assignedThemes') || '[]');

    // Track last two answers
    const updatedAnswers = [...lastTwoAnswers, completed ? '✅' : '❌'].slice(-2);
    setLastTwoAnswers(updatedAnswers);

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
  
  // Only consider currently assigned themes (excluding current theme)
  const availableThemes = assignedThemes.filter(t => t !== currentTheme);
  
  console.log("Available assigned themes:", availableThemes);

  if (availableThemes.length > 0) {
    const newTheme = availableThemes[Math.floor(Math.random() * availableThemes.length)];
    
    console.log("Switching to assigned theme:", newTheme);
    currentTheme = newTheme;
    newWordIndex = 0;

    // No need to update storage since we're not adding new themes
  } else {
    console.log('No other assigned themes available. Staying in current theme.');
  }
}
// if (switchThemeEmotions.includes(emotion)) {
//   const sessionData = sessionStorage.getItem('childData');
//   if (!sessionData) {
//     console.error('No session data available');
//     return;
//   }

//   const childData = JSON.parse(sessionData);
//   const assignedThemes = childData.assignedThemes || [];
//   console.log("hi"+assignedThemes[0])
//   console.log(assignedThemes[1])
//   console.log(assignedThemes[2])
//   const availableThemes = Object.keys(wordLists).filter(
//     (t) => t !== currentTheme && !assignedThemes.includes(t)
//   );
//   console.log("bye"+availableThemes[0])
//   console.log(availableThemes[1])
//   console.log(availableThemes[2])
//   if (availableThemes.length > 0) {
//     const newTheme = availableThemes[Math.floor(Math.random() * availableThemes.length)];
    
//     // Update sessionStorage
//     const updatedData = {
//       ...childData,
//       assignedThemes: [...assignedThemes, newTheme]
//     };
//     sessionStorage.setItem('childData', JSON.stringify(updatedData));

//     // Update backend
//     await fetch('http://localhost:5000/api/update-child-themes', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         username: updatedData.username,
//         therapistCode: updatedData.therapistCode,
//         themes: updatedData.assignedThemes,
//       }),
//     });
    
//     currentTheme = newTheme;
//     newWordIndex = 0;
//   } else {
//     console.log('No new themes available. Staying in current theme.');
//   }
// }
    // // Emotion-based theme handling
    // let emotion = 'happy'; // Default
    // try {
    //   const res = await fetch('http://localhost:5000/api/emotion');
    //   const data = await res.json();
    //   emotion = data.emotion || 'happy';
    //   console.log('Detected Emotion:', emotion);
    // } catch (error) {
    //   console.error('Failed to fetch emotion:', error);
    // }

    // const stayInSameTheme = ['happy', 'calm', 'surprised', 'excited'];
    // const switchThemeEmotions = ['sad', 'angry', 'bored'];

    // if (switchThemeEmotions.includes(emotion)) {
    //   const availableThemes = Object.keys(wordLists).filter((t) => t !== currentTheme && !assignedThemes.includes(t));
    //   if (availableThemes.length > 0) {
    //     const newTheme = availableThemes[Math.floor(Math.random() * availableThemes.length)];
    //     currentTheme = newTheme;
    //     newWordIndex = 0;
    //     assignedThemes.push(newTheme);
    //     localStorage.setItem('assignedThemes', JSON.stringify(assignedThemes));

    //     // Update backend themes
    //     await fetch('http://localhost:5000/api/update-child-themes', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({
    //         username: localStorage.getItem('childUsername'),
    //         therapistCode: localStorage.getItem('therapistCode'),
    //         themes: assignedThemes,
    //       }),
    //     });
    //   } else {
    //     console.log('No new themes available. Staying in current theme.');
    //   }
    // } else {
    //   console.log('Emotion is positive or neutral. Staying in same theme.');
    // }

    // Ensure unique puzzles
    const updatedPlayedPuzzles = new Set(playedPuzzles);
    let newPuzzleKey = `${currentTheme}-${newLevel}-${newWordIndex}`;
    while (updatedPlayedPuzzles.has(newPuzzleKey)) {
      newWordIndex = (newWordIndex + 1) % wordLists[currentTheme][newLevel].length;
      newPuzzleKey = `${currentTheme}-${newLevel}-${newWordIndex}`;
    }

    updatedPlayedPuzzles.add(newPuzzleKey);

    // Update played puzzles in backend
    await fetch('http://localhost:5000/api/update-played-puzzles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: localStorage.getItem('childUsername'),
        therapistCode: localStorage.getItem('therapistCode'),
        puzzleKey: newPuzzleKey,
      }),
    });

    // End game if 10 unique puzzles played
    if (updatedPlayedPuzzles.size >= totalPuzzles) {
      setShowThemeComplete(true);
      return;
    }

    // Save progress
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