
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Home, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationMenuProps {
  isDarkMode: boolean;
}

const NavigationMenu = ({ isDarkMode }: NavigationMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { to: "/", label: "Essays", icon: Home },
    { to: "/about", label: "About", icon: User },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMenu}
        className="md:hidden text-gray-400 hover:text-white"
      >
        {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </Button>

      {/* Desktop navigation */}
      <nav className="hidden md:flex items-center space-x-6">
        {menuItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="text-gray-400 hover:text-white transition-colors font-medium flex items-center space-x-2"
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Mobile navigation menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-black border-t border-gray-800 md:hidden z-50">
          <div className="px-6 py-4 space-y-4">
            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className="block text-gray-400 hover:text-white transition-colors font-medium flex items-center space-x-2"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default NavigationMenu;
