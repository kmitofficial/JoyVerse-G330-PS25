import { useNavigate } from 'react-router-dom';
import { Gamepad, Sparkles } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const handleStartGame = () => {
    const storedThemes = localStorage.getItem('assignedThemes');
    const allThemes = ['underwater', 'space', 'forest', 'turquoise', 'yellow'];
  
    let assignedThemes;
    if (!storedThemes) {
      assignedThemes = [...allThemes].sort(() => 0.5 - Math.random()).slice(0, 3);
      localStorage.setItem('assignedThemes', JSON.stringify(assignedThemes));
    } else {
      try {
        assignedThemes = JSON.parse(storedThemes);
        if (!Array.isArray(assignedThemes) || assignedThemes.length === 0) {
          throw new Error('Invalid assignedThemes');
        }
      } catch (err) {
        console.warn('Invalid themes, resetting...');
        assignedThemes = [...allThemes].sort(() => 0.5 - Math.random()).slice(0, 3);
        localStorage.setItem('assignedThemes', JSON.stringify(assignedThemes));
      }
    }
  
    const currentThemeIndex = parseInt(localStorage.getItem('currentThemeIndex') || '0');
    const nextTheme = assignedThemes[currentThemeIndex % assignedThemes.length];
  
    console.log('Next Theme:', nextTheme);
  
    if (nextTheme) {
      navigate(`/game/${nextTheme}/1`);
    } else {
      alert('Could not determine next theme.');
    }
  };
  

  return (
    <div className="bg-cover-full min-h-screen flex items-center justify-center" style={{ backgroundImage: "url('/images/cloud.jpg')" }}>

      <div className="container mx-auto px-4 py-16">

        {/* Fully Blended Transparent Panel */}
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-12 shadow-lg
          border border-white/10 transition-all duration-300"
        >
          <h1 className="text-6xl font-bold text-purple-900 mb-6 text-center flex items-center justify-center gap-4 drop-shadow-md">
            <Sparkles className="text-yellow-500" size={48} />
            Welcome to JoyVerse!
            <Sparkles className="text-yellow-500" size={48} />
          </h1>

          <p className="text-2xl text-purple-800 mb-8 text-center drop-shadow">
            Let's embark on an exciting word adventure together!
          </p>

          <div className="flex flex-col items-center gap-8">
            <button onClick={handleStartGame}
              className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold py-6 px-8 rounded-full
               transform hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg flex items-center gap-3"
            >
              <Gamepad size={32} />
              <span className="text-2xl">Let's Play!!</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
