import { useMemo, useRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface AutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function Autocomplete({
  value,
  onChange,
  suggestions,
  placeholder,
  className,
  icon
}: AutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = useMemo(() => {
    if (!isOpen) return [];
    const q = value.trim().toLowerCase();
    const base = q.length
      ? suggestions.filter((suggestion) => suggestion.toLowerCase().includes(q))
      : suggestions;
    return base.slice(0, 8);
  }, [isOpen, suggestions, value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (suggestion: string) => {
    onChange(suggestion);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${icon ? "pl-10" : ""} pr-10 ${className}`}
          onFocus={() => {
            setIsOpen(true);
          }}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-auto"
          onClick={() => {
            setIsOpen((v) => !v);
            // Keep focus so the user can immediately type after opening.
            requestAnimationFrame(() => inputRef.current?.focus());
          }}
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </Button>
      </div>

      {isOpen && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              className="w-full px-4 py-2 text-left hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg"
              onClick={() => handleSelect(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}