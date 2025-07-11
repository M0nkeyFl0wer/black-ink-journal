
import { Link } from "react-router-dom";
import { Moon, Sun, Rss } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { NavigationMenu, NavigationMenuList, SubscribeMenu } from "@/components/NavigationMenu";

interface SharedHeaderProps {
  showBackLink?: boolean;
  backLinkText?: string;
}

const SharedHeader = ({ showBackLink = false, backLinkText = "Back to Home" }: SharedHeaderProps) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className={`relative flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
      <div className="flex items-center space-x-4">
        <Link to="/" className="flex items-center space-x-4">
          <img 
            src="/images/82867a2d-c687-4042-992d-c0841d74606e.png" 
            alt="Ben West" 
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h1 className="text-xl font-bold">Ben West</h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Essays & Commentary</p>
          </div>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <nav className="flex items-center space-x-6">
          <Link 
            to="/about" 
            className={`text-sm font-medium transition-colors ${
              isDarkMode 
                ? 'text-gray-400 hover:text-white' 
                : 'text-gray-600 hover:text-black'
            }`}
          >
            About
          </Link>
        </nav>

        <NavigationMenu>
          <NavigationMenuList>
            <SubscribeMenu />
          </NavigationMenuList>
        </NavigationMenu>
        
        <div className={`flex items-center space-x-4 border-l pl-4 ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default SharedHeader;
