'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Delete, Divide, X, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MathNumpadProps {
  onDigitPress: (value: string) => void;
  onBackspace: () => void;
  onCheck?: () => void;
  className?: string;
}

const MathNumpad = ({
  onDigitPress,
  onBackspace,
  onCheck,
  className,
}: MathNumpadProps) => {
  const handleButtonClick = (value: string) => {
    onDigitPress(value);
  };

  const handleBackspace = () => {
    onBackspace();
  };

  const handleCheck = () => {
    if (onCheck) {
      onCheck();
    }
  };

  const buttonClass = "p-2 h-14 text-xl font-medium rounded-lg";

  return (
    <div className={cn('grid grid-cols-4 gap-2', className)}>
      {/* Row 1 */}
      <Button variant="outline" onClick={() => handleButtonClick('7')} className={buttonClass}>7</Button>
      <Button variant="outline" onClick={() => handleButtonClick('8')} className={buttonClass}>8</Button>
      <Button variant="outline" onClick={() => handleButtonClick('9')} className={buttonClass}>9</Button>
      <Button variant="outline" onClick={() => handleButtonClick('÷')} className={cn(buttonClass, 'text-lg')}><Divide className="h-5 w-5" /></Button>

      {/* Row 2 */}
      <Button variant="outline" onClick={() => handleButtonClick('4')} className={buttonClass}>4</Button>
      <Button variant="outline" onClick={() => handleButtonClick('5')} className={buttonClass}>5</Button>
      <Button variant="outline" onClick={() => handleButtonClick('6')} className={buttonClass}>6</Button>
      <Button variant="outline" onClick={() => handleButtonClick('×')} className={cn(buttonClass, 'text-lg')}><X className="h-5 w-5" /></Button>

      {/* Row 3 */}
      <Button variant="outline" onClick={() => handleButtonClick('1')} className={buttonClass}>1</Button>
      <Button variant="outline" onClick={() => handleButtonClick('2')} className={buttonClass}>2</Button>
      <Button variant="outline" onClick={() => handleButtonClick('3')} className={buttonClass}>3</Button>
      <Button variant="outline" onClick={() => handleButtonClick('-')} className={cn(buttonClass, 'text-lg')}><Minus className="h-5 w-5" /></Button>

      {/* Row 4 */}
      <Button variant="outline" onClick={() => handleButtonClick('0')} className={buttonClass}>0</Button>
      <Button variant="outline" onClick={() => handleButtonClick('.')} className={buttonClass}>.</Button>
      <Button variant="outline" onClick={handleBackspace} className={cn(buttonClass, 'bg-gray-100')}><Delete className="h-5 w-5" /></Button>
      <Button variant="outline" onClick={() => handleButtonClick('+')} className={cn(buttonClass, 'text-lg')}><Plus className="h-5 w-5" /></Button>

      {/* No Submit Button - we're using the main submit button instead */}
    </div>
  );
};

export default MathNumpad;
