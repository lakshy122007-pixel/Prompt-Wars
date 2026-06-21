import React, { useState, useRef, useEffect } from 'react';

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
}

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'മലയാളം' },
  { code: 'mr', name: 'मराठी' },
  { code: 'gu', name: 'ગુજરાતી' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'অসমীয়া' },
  { code: 'ks', name: 'کٲشُر' },
  { code: 'sd', name: 'سنڌي' },
  { code: 'ur', name: 'اردو' },
  { code: 'sa', name: 'संस्कृतम्' },
  { code: 'kok', name: 'कोंकणी' },
  { code: 'mni', name: 'মণিপুরী' },
  { code: 'ne', name: 'नेपाली' },
  { code: 'bho', name: 'भोजपुरी' },
  { code: 'mai', name: 'मैथिली' },
  { code: 'doi', name: 'डोगरी' },
  { code: 'sat', name: 'संताली' }
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLangObj = LANGUAGES.find(l => l.code === currentLanguage) || LANGUAGES[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const selectLanguage = (code: string) => {
    onLanguageChange(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        data-testid="language-selector"
        aria-label="Language selection"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-between items-center w-full px-4 py-2 border border-border bg-card rounded-xl text-sm font-semibold hover:bg-muted focus-ring text-foreground"
      >
        <span>{currentLangObj.name}</span>
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-56 max-h-60 overflow-y-auto rounded-xl border border-border bg-card shadow-2xl z-50 focus:outline-none py-1"
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              role="option"
              aria-selected={currentLanguage === lang.code}
              onClick={() => selectLanguage(lang.code)}
              className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-muted ${
                currentLanguage === lang.code ? 'text-primary font-bold bg-primary/5' : 'text-foreground'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
