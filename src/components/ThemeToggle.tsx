import { useTheme, type Theme } from '../context/ThemeContext';
import { cn } from '../utils';

interface ThemeToggleProps {
  className?: string;
  compact?: boolean;
}

export function ThemeToggle({ className, compact = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  const themes: { value: Theme; label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'Auto' },
  ];

  if (compact) {
    return (
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as Theme)}
        className={cn(
          'px-3 py-2 bg-navy-800/50 border border-navy-700 rounded-lg text-sm text-navy-200 focus:outline-none focus:border-accent-primary/50',
          className
        )}
      >
        {themes.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className={cn('flex items-center gap-1 p-1 bg-navy-800/50 rounded-lg', className)}>
      {themes.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={cn(
            'px-2 py-1 rounded text-xs font-medium transition-colors',
            theme === value
              ? 'bg-accent-primary text-white'
              : 'text-navy-400 hover:text-navy-200'
          )}
          aria-label={`Switch to ${label} theme`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
