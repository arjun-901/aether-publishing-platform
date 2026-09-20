import React from 'react';
import {
  Sparkles,
  TrendingUp,
  Newspaper,
  Sun,
  BookOpen,
  Cloud,
  Code2,
  Compass,
  SlidersHorizontal
} from 'lucide-react';
import { CategoryType } from '../types';

interface CategoryPillsProps {
  selectedCategory: string; // 'all' or CategoryType
  onSelectCategory: (cat: string) => void;
  categoryCounts: Record<string, number>;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  const categories: { label: string; value: string; icon: React.ReactNode }[] = [
    { label: 'All Topics', value: 'all', icon: <SlidersHorizontal className="w-3.5 h-3.5" /> },
    { label: 'AI', value: 'AI', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { label: 'Business', value: 'Business', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { label: 'News', value: 'News', icon: <Newspaper className="w-3.5 h-3.5" /> },
    { label: 'Daily News', value: 'Daily News', icon: <Sun className="w-3.5 h-3.5" /> },
    { label: 'Articles', value: 'Articles', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { label: 'AWS', value: 'AWS', icon: <Cloud className="w-3.5 h-3.5" /> },
    { label: 'Full Stack Development', value: 'Full Stack Development', icon: <Code2 className="w-3.5 h-3.5" /> },
    { label: 'Other', value: 'Other', icon: <Compass className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="w-full py-3.5 border-y border-[#e2e6de] dark:border-[#333a44] bg-[#fafbf8] dark:bg-[#1e2228]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Horizontal scroll container with smooth styling */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-xs uppercase tracking-wider font-mono text-[#4b585b] dark:text-[#95a5a8] mr-2 shrink-0 hidden sm:inline">
            Filters:
          </span>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            const count = categoryCounts[cat.value] || 0;

            return (
              <button
                key={cat.value}
                id={`category-pill-${cat.value.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => onSelectCategory(cat.value)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#1e2228] text-white dark:bg-[#f3f5f0] dark:text-[#1e2228] shadow-sm font-semibold scale-[1.02]'
                    : 'bg-white dark:bg-[#262b32] text-[#4b585b] dark:text-[#c4cec9] border border-[#e2e6de] dark:border-[#333a44] hover:border-[#7d998a] hover:bg-[#f3f5f0] dark:hover:bg-[#1e2228]'
                }`}
              >
                <span className={isSelected ? 'text-[#de7c68]' : 'text-[#7d998a]'}>
                  {cat.icon}
                </span>
                <span>{cat.label}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                      isSelected
                        ? 'bg-white/20 text-white dark:bg-black/10 dark:text-[#1e2228]'
                        : 'bg-[#eaf0ec] text-[#637e6f] dark:bg-[#333a44] dark:text-[#95a5a8]'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
