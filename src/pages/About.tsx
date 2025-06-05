
import { Link } from "react-router-dom";
import { Moon, Sun, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const About = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Essays</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="text-gray-400 hover:text-white"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">About Me</h1>
        
        <div className="prose prose-invert max-w-none space-y-6">
          <p className="text-lg leading-relaxed text-gray-300">
            Some of my earliest memories are of taking minutes with crayons during housing co-op meetings. I didn't fully grasp what quorum meant, but I knew decisions mattered—and that if you wanted something to change, you had to get involved.
          </p>

          <div className="my-8">
            <img 
              src="https://www.benwest.blog/wp-content/uploads/2019/05/8-MkzmeO_400x400-300x300.jpg" 
              alt="Ben West profile" 
              className="w-72 h-72 object-cover rounded-lg mx-auto"
            />
          </div>

          <p className="text-lg leading-relaxed text-gray-300">
            I've spent most of my life trying to fix things that feel too broken to ignore. From co-ops to climate justice, open-source tools to Indigenous sovereignty, I've worked across movements to shift culture, influence policy, and build systems that put people first.
          </p>

          <p className="text-lg leading-relaxed text-gray-300">
            I've been a party leader, a campaigner, a comms director, and a strategist for public interest tech. I've helped distribute millions in funding for climate action and digital infrastructure, and I still think the best ideas often start with someone asking: What if we just... tried something better?
          </p>

          <div className="my-8">
            <img 
              src="https://www.benwest.blog/wp-content/uploads/2019/05/1489115_10152490458492571_1128582089_n-300x169.jpg" 
              alt="Ben West speaking" 
              className="w-full max-w-md object-cover rounded-lg mx-auto"
            />
          </div>

          <p className="text-lg leading-relaxed text-gray-300">
            I care a lot about infosec, OSINT, decentralized governance, and the weird ways power hides in plain sight. I believe in memes as weapons of culture shift, in protocols over platforms, and in laughter as a survival skill.
          </p>

          <div className="my-8">
            <img 
              src="https://www.benwest.blog/wp-content/uploads/2019/05/urban-interventions-300x235.jpg" 
              alt="Urban interventions" 
              className="w-full max-w-md object-cover rounded-lg mx-auto"
            />
          </div>

          <p className="text-lg leading-relaxed text-gray-300">
            These days I'm writing a novel called The Monkey Flower Experiment. It's fiction, technically—but also a blueprint, a warning, and a love letter to everyone still trying to build something beautiful in the ruins.
          </p>

          <p className="text-lg leading-relaxed text-gray-300">
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
      <footer className="border-t border-gray-800 p-6 text-center text-gray-400">
        <p>&copy; 2025 Ben West. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default About;
