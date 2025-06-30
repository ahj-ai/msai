'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Keyboard, X } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import MathNumpad from '@/components/math-numpad';

interface BrainiacAnswerInputProps {
  value?: string | number;
  onChange?: (value: string) => void;
  onCheck?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const BrainiacAnswerInput = ({
  value,
  onChange,
  onCheck,
  placeholder = 'Enter your answer...',
  disabled = false,
  className,
}: BrainiacAnswerInputProps) => {
  const [currentValue, setCurrentValue] = useState(value?.toString() || '');
  const inputRef = useRef<HTMLInputElement>(null);
  const [showNumpad, setShowNumpad] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Set numpad visibility based on device on mount
  useEffect(() => {
    if (isMobile) {
      setShowNumpad(true);
    }
  }, [isMobile]);
  
  // Handle changes to the input field
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setCurrentValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };
  
  // Handle checking the answer - only when submit button is explicitly clicked
  const handleCheck = () => {
    if (currentValue.trim()) {
      // First, update the parent component with the current value
      if (onChange) {
        onChange(currentValue);
      }
      // Then trigger the check with the current value
      if (onCheck) {
        onCheck(currentValue);
      }
    }
  };
  
  // Handle numpad input - only update the internal value, don't validate
  const handleNumpadInput = (value: string) => {
    const newValue = currentValue + value;
    setCurrentValue(newValue);
    // Only update the internal state, don't trigger external onChange
    // This prevents validation on each key press
    inputRef.current?.focus();
  };
  
  // Handle numpad backspace
  const handleNumpadBackspace = () => {
    if (currentValue.length > 0) {
      const newValue = currentValue.slice(0, -1);
      setCurrentValue(newValue);
      // Don't trigger onChange to prevent validation on backspace
    }
    inputRef.current?.focus();
  };
  
  // Update internal value when prop changes
  useEffect(() => {
    if (value !== undefined) {
      setCurrentValue(value.toString());
    }
  }, [value]);
  
  return (
    <div className={cn('w-full', className)}>
      <div className="w-full space-y-3">
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            value={currentValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={disabled}
            className="rounded-md pr-12 py-6 text-lg" 
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCheck();
              }
            }}
          />
          
          {/* Only the numpad toggle button remains in the input */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowNumpad(!showNumpad)}
            >
              {showNumpad ? <X className="h-4 w-4" /> : <Keyboard className="h-4 w-4" />}
            </Button>
          )}
        </div>
        
        {/* Only show the main submit button when numpad is hidden or on desktop */}
        {(!showNumpad || !isMobile) && (
          <Button 
            variant="default"
            className="w-full bg-gradient-to-r from-[#6C63FF] to-[#5E60CE] hover:opacity-90 text-white py-5 font-medium text-base"
            onClick={handleCheck}
            disabled={disabled}
          >
            Submit Answer
          </Button>
        )}
        
        {/* Numpad (only visible on mobile and when toggled on) */}
        {showNumpad && isMobile && (
          <MathNumpad
            onDigitPress={handleNumpadInput}
            onBackspace={handleNumpadBackspace}
            onCheck={handleCheck} // Keep this for the numpad's submit button
            className="mt-4"
          />
        )}
      </div>
    </div>
  );
};

export default BrainiacAnswerInput;
