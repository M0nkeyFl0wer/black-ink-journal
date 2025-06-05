
import { useState } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, Rss, ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavigationMenu from "@/components/NavigationMenu";

const About = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleRSSClick = () => {
    const cacheBust = Date.now();
    window.open(`https://jfsvlaaposslmeneovtp.supabase.co/functions/v1/rss-feed?cb=${cacheBust}`, '_blank');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <header className={`relative flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/82867a2d-c687-4042-992d-c0841d74606e.png" 
              alt="Ben West" 
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h1 className="text-xl font-bold">Ben West</h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Essays & Commentary</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <NavigationMenu isDarkMode={isDarkMode} />
          
          <div className={`flex items-center space-x-4 border-l pl-4 ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-700 hover:text-gray-900'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRSSClick}
              className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-700 hover:text-gray-900'}
            >
              <Rss className="w-4 h-4 mr-2" />
              RSS
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center mb-8">
          <Link
            to="/"
            className={`flex items-center transition-colors mr-4 ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8">About Me</h1>
        
        <div className="prose prose-invert max-w-none space-y-6">
          <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
            Some of my earliest memories are of taking minutes with crayons during housing co-op meetings. I didn't fully grasp what quorum meant, but I knew decisions mattered and that if you wanted something to change, you had to get involved.
          </p>

          <div className="my-8">
            <img 
              src="https://www.benwest.blog/wp-content/uploads/2019/05/8-MkzmeO_400x400-300x300.jpg" 
              alt="Ben West profile" 
              className="w-72 h-72 object-cover rounded-lg mx-auto"
            />
          </div>

          <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
            I've spent most of my life trying to fix things that feel too broken to ignore. From co-ops to climate justice, open-source tools to Indigenous sovereignty, I've worked across movements to shift culture, influence policy, and build systems that put people first.
          </p>

          <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
            I've been a party leader, a campaigner, a comms director, and a strategist for public interest tech. I've helped distribute millions in funding for climate action and digital infrastructure, and I still think the best ideas often start with someone asking: What if we just... tried something better?
          </p>

          <div className="my-8">
            <img 
              src="https://www.benwest.blog/wp-content/uploads/2019/05/1489115_10152490458492571_1128582089_n-300x169.jpg" 
              alt="Ben West speaking" 
              className="w-full max-w-md object-cover rounded-lg mx-auto"
            />
          </div>

          <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
            I care a lot about infosec, OSINT, decentralized governance, and the weird ways power hides in plain sight. I believe in memes as weapons of culture shift, in protocols over platforms, and in laughter as a survival skill.
          </p>

          <div className="my-8">
            <img 
              src="https://www.benwest.blog/wp-content/uploads/2019/05/urban-interventions-300x235.jpg" 
              alt="Urban interventions" 
              className="w-full max-w-md object-cover rounded-lg mx-auto"
            />
          </div>

          <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
            These days I'm writing a novel called The Monkey Flower Experiment. It's fiction, technically but also a blueprint, a warning, and a love letter to everyone still trying to build something beautiful in the ruins.
          </p>

          <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
            And yeah, I'm Canadian. So, sorry if this bio got too real.
          </p>

          <div className="my-8">
            <img 
              src="https://www.benwest.blog/wp-content/uploads/2019/05/benwestgcr-300x185.jpg" 
              alt="Ben West at event" 
              className="w-full max-w-md object-cover rounded-lg mx-auto"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`border-t p-6 text-center ${isDarkMode ? 'border-gray-800 text-gray-400' : 'border-gray-200 text-gray-700'}`}>
        <p>&copy; 2025 Ben West. This work is licensed under a <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className={isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}>Creative Commons Attribution 4.0 International License</a>.</p>
      </footer>
    </div>
  );
};

export default About;
