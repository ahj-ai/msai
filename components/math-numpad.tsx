'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Delete, Divide, X, Minus, Plus, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MathFieldRef } from './math-field';

interface MathNumpadProps {
  mathFieldRef: React.RefObject<MathFieldRef>;
  onCheck?: () => void;
  className?: string;
}

const MathNumpad = ({
  mathFieldRef,
  onCheck,
  className,
}: MathNumpadProps) => {
  // Insert the digit or operator at cursor position
  const handleButtonClick = (value: string) => {
    if (!mathFieldRef.current) return;
    
    mathFieldRef.current.insert(value);
    // Focus the math field after insertion
    setTimeout(() => mathFieldRef.current?.focus(), 10);
  };
  
  // Delete the character behind the cursor
  const handleBackspace = () => {
    if (!mathFieldRef.current) return;
    
    // Get current value
    const currentValue = mathFieldRef.current.getValue();
    
    // If there's content to delete, temporarily set value to empty
    // This is a workaround since MathLive doesn't have a direct "delete" method
    if (currentValue.length > 0) {
      // Insert a backspace character (this is interpreted by MathLive)
      mathFieldRef.current.insert('\\backspace');
    }
    
    // Focus the math field after deletion
    setTimeout(() => mathFieldRef.current?.focus(), 10);
  };
  
  // Check the answer
  const handleCheck = () => {
    if (onCheck) {
      onCheck();
    }
  };
  
  return (
    <div className={cn('fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 z-50 shadow-lg', className)}>
      {/* Quick Actions Row */}
      <div className="grid grid-cols-5 gap-1 mb-1">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleButtonClick('+')}
          className="p-2 h-12 text-lg font-medium"
        >
          <Plus className="h-5 w-5" />
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleButtonClick('-')}
          className="p-2 h-12 text-lg font-medium"
        >
          <Minus className="h-5 w-5" />
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleButtonClick('\\times')}
          className="p-2 h-12 text-lg font-medium"
        >
          <X className="h-5 w-5" />
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleButtonClick('\\div')}
          className="p-2 h-12 text-lg font-medium"
        >
          <Divide className="h-5 w-5" />
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleBackspace}
          className="p-2 h-12 bg-gray-100"
        >
          <Delete className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Extended Action Row */}
      <div className="grid grid-cols-5 gap-1 mb-1">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleButtonClick('\\sqrt{#?}')}
          className="p-2 h-12 text-lg font-medium"
        >
          √
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleButtonClick('^{#?}')}
          className="p-2 h-12 text-lg font-medium"
        >
          x²
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleButtonClick('\\frac{#?}{#?}')}
          className="p-2 h-12 text-lg font-medium"
        >
          a/b
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleButtonClick('\\pi')}
          className="p-2 h-12 text-lg font-medium"
        >
          π
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleButtonClick('=')}
          className="p-2 h-12 text-lg font-medium"
        >
          =
        </Button>
      </div>
      
      {/* Numpad Grid */}
      <div className="grid grid-cols-3 gap-1 mb-1">
        {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
          <Button
            key={num}
            variant="outline"
            onClick={() => handleButtonClick(num.toString())}
            className="p-2 h-14 text-xl font-medium"
          >
            {num}
          </Button>
        ))}
      </div>
      
      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-1">
        <Button
          variant="outline"
          onClick={() => handleButtonClick('0')}
          className="p-2 h-14 text-xl font-medium"
        >
          0
        </Button>
        <Button
          variant="outline"
          onClick={() => handleButtonClick('.')}
          className="p-2 h-14 text-xl font-medium"
        >
          .
        </Button>
        <Button
          variant="default"
          onClick={handleCheck}
          className="p-2 h-14 bg-green-600 hover:bg-green-700 text-white"
        >
          <Check className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default MathNumpad;
