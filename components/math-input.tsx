import React, { useRef, useEffect, KeyboardEvent } from 'react';

// Define the props for the component
interface MathInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  onSubmit?: () => void;
}

const MathInput: React.FC<MathInputProps> = ({ value, onChange, disabled, placeholder, onSubmit }) => {
  // Create a ref for the textarea to maintain focus
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // This keeps track of cursor position
  const cursorPositionRef = useRef<number | null>(null);
  
  // Handle change with cursor position preservation
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Store current cursor position before React updates
    cursorPositionRef.current = e.target.selectionStart;
    onChange(e.target.value);
  };
  
  // Handle keyboard shortcuts
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter key, unless Shift is pressed (for multiline input)
    if (e.key === 'Enter' && !e.shiftKey && onSubmit) {
      e.preventDefault();
      onSubmit();
    }
  };
  
  // Restore cursor position after value change
  useEffect(() => {
    // Only restore if we have a position and the element is focused
    if (
      textareaRef.current && 
      cursorPositionRef.current !== null && 
      document.activeElement === textareaRef.current
    ) {
      textareaRef.current.selectionStart = cursorPositionRef.current;
      textareaRef.current.selectionEnd = cursorPositionRef.current;
    }
  }, [value]);
  
  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      placeholder={placeholder}
      className="w-full min-h-[8rem] p-4 pr-12 border border-[#e0e7ff] rounded-xl outline-none text-gray-700 placeholder:text-gray-400 focus:border-indigo-300 focus:ring-1 focus:ring-indigo-300 transition-colors resize-none touch-manipulation"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: '1rem',
        lineHeight: '1.5',
      }}
    />
  );
};

export default MathInput;
