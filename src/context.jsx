import { createContext, useState, useEffect } from 'react';

// Create Contexts
export const ThemeContext = createContext();
export const AuthContext = createContext();

export function AppProviders({ children }) {
  // --- Theme State (Persists to localStorage) ---
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  
  useEffect(() => {
    localStorage.setItem('theme', theme);
    // Apply basic dark mode to the whole page body
    document.body.style.backgroundColor = theme === 'dark' ? '#121212' : '#ffffff';
    document.body.style.color = theme === 'dark' ? '#f4f4f4' : '#121212';
    document.body.style.transition = 'all 0.3s ease';
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // --- Auth State (Simulated User) ---
  const [user] = useState({ id: 'user1', name: 'John Doe', email: 'john@example.com' });

  return (
    <AuthContext.Provider value={{ user }}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}