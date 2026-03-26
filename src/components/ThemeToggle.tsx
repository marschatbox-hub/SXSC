import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial state
    setIsDark(document.documentElement.classList.contains('dark'));

    // Optional: listen for changes if other things toggle it, but for now this is fine
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div 
      className="relative text-gray-800 hover:text-cyan transition-colors cursor-pointer w-6 h-6 flex items-center justify-center" 
      onClick={toggleTheme}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </div>
  );
}
