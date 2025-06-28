'use client';

import React, { useRef, useState, useEffect } from 'react';
import MathField, { MathFieldRef } from './math-field';
import MathNumpad from './math-numpad';
import { useMediaQuery } from '../hooks/use-media-query';
import { Button } from '@/components/ui/button';
import { Keyboard, X } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const mathFieldRef = useRef<MathFieldRef>(null);
  const [showNumpad, setShowNumpad] = useState(false);
  const [currentValue, setCurrentValue] = useState(value?.toString() || '');
  
  // Force show numpad for testing
  const isMobile = true; // Temporarily hardcode to true for testing
  
  // Show numpad by default for testing
  useEffect(() => {
    // Always show numpad for testing
    setShowNumpad(true);
    console.log('Numpad should be visible');
  }, []);
  
  // Handle changes to the math field
  const handleMathFieldChange = (value: string) => {
    setCurrentValue(value);
    if (onChange) {
      onChange(value);
    }
  };
  
  // Handle checking the answer
  const handleCheck = () => {
    if (onCheck && mathFieldRef.current) {
      onCheck(mathFieldRef.current.getValue());
    }
  };
  
  // Calculate bottom padding to ensure content isn't hidden by numpad
  const contentStyle = {
    paddingBottom: showNumpad && isMobile ? '280px' : '0px',
  };
  
  return (
    <div className={cn('relative', className)} style={contentStyle}>
      {/* Debug information */}
      <div className="bg-yellow-100 text-black p-2 mb-2 rounded border border-yellow-400">
        Debug: isMobile={isMobile.toString()}, showNumpad={showNumpad.toString()}
      </div>
      <div className="relative">
        <MathField
          ref={mathFieldRef}
          value={value?.toString()}
          onChange={handleMathFieldChange}
          placeholder={placeholder}
          disabled={disabled}
          className="rounded-md"
        />
        
        {/* Toggle numpad button (only visible on mobile) */}
        {isMobile && !showNumpad && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 bottom-2 bg-white shadow-sm"
            onClick={() => setShowNumpad(true)}
          >
            <Keyboard className="h-4 w-4" />
          </Button>
        )}
        
        {/* Close numpad button (only when numpad is shown) */}
        {showNumpad && isMobile && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 bottom-2 bg-white shadow-sm z-50"
            onClick={() => setShowNumpad(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Check answer button (only visible when numpad is not shown) */}
      {!showNumpad && (
        <Button 
          onClick={handleCheck}
          disabled={disabled || !currentValue.trim()}
          className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white"
        >
          Check Answer
        </Button>
      )}
      
      {/* Numpad (only visible on mobile and when toggled on) */}
      {showNumpad && isMobile && (
        <MathNumpad
          mathFieldRef={mathFieldRef}
          onCheck={handleCheck}
        />
      )}
    </div>
  );
};

export default BrainiacAnswerInput;
