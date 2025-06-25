'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MathfieldElement } from 'mathlive';
import { MathFieldRef } from './math-field';

interface MathVirtualKeyboardProps {
  targetRef: React.RefObject<MathFieldRef>;
}

const MathVirtualKeyboard: React.FC<MathVirtualKeyboardProps> = ({ targetRef }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [mathfieldReady, setMathfieldReady] = useState(false);
  
  useEffect(() => {
    // Check if mathfield is available
    if (targetRef.current) {
      setMathfieldReady(true);
    }
  }, [targetRef]);
  
  const insertSymbol = (symbol: string) => {
    if (!mathfieldReady || !targetRef.current) return;
    
    // Insert the symbol at the current cursor position
    targetRef.current.insert(symbol);
    
    // Focus the field after insertion
    targetRef.current.focus();
  };
  
  // Group symbols by category
  const basicSymbols = [
    { symbol: '+', label: '+' },
    { symbol: '-', label: '−' },
    { symbol: '\\times', label: '×' },
    { symbol: '\\div', label: '÷' },
    { symbol: '=', label: '=' },
    { symbol: '\\ne', label: '≠' },
    { symbol: '<', label: '<' },
    { symbol: '>', label: '>' },
    { symbol: '\\le', label: '≤' },
    { symbol: '\\ge', label: '≥' },
    { symbol: '\\frac{□}{□}', label: 'a/b' },
    { symbol: '\\sqrt{□}', label: '√' },
  ];
  
  const algebraSymbols = [
    { symbol: 'x', label: 'x' },
    { symbol: 'y', label: 'y' },
    { symbol: '^2', label: 'x²' },
    { symbol: '^3', label: 'x³' },
    { symbol: '^{□}', label: 'x^n' },
    { symbol: '\\sqrt[□]{□}', label: 'ⁿ√' },
    { symbol: '\\pi', label: 'π' },
    { symbol: '(', label: '(' },
    { symbol: ')', label: ')' },
    { symbol: '[', label: '[' },
    { symbol: ']', label: ']' },
    { symbol: '\\{', label: '{' },
    { symbol: '\\}', label: '}' },
  ];
  
  const calcSymbols = [
    { symbol: '\\int_{□}^{□}{□}', label: '∫' },
    { symbol: '\\sum_{□}^{□}{□}', label: 'Σ' },
    { symbol: '\\lim_{□\\to□}{□}', label: 'lim' },
    { symbol: '\\frac{d}{dx}', label: 'd/dx' },
    { symbol: '\\frac{\\partial}{\\partial x}', label: '∂/∂x' },
    { symbol: '\\infty', label: '∞' },
    { symbol: '\\rightarrow', label: '→' },
  ];

  const greekSymbols = [
    { symbol: '\\alpha', label: 'α' },
    { symbol: '\\beta', label: 'β' },
    { symbol: '\\gamma', label: 'γ' },
    { symbol: '\\delta', label: 'δ' },
    { symbol: '\\epsilon', label: 'ε' },
    { symbol: '\\theta', label: 'θ' },
    { symbol: '\\lambda', label: 'λ' },
    { symbol: '\\mu', label: 'μ' },
    { symbol: '\\rho', label: 'ρ' },
    { symbol: '\\sigma', label: 'σ' },
    { symbol: '\\omega', label: 'ω' },
    { symbol: '\\Sigma', label: 'Σ' },
    { symbol: '\\Delta', label: 'Δ' },
    { symbol: '\\Omega', label: 'Ω' },
  ];
  
  return (
    <div className="math-virtual-keyboard p-2 border border-indigo-100 rounded-lg bg-white shadow-sm">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="basic" className="text-xs">Basic</TabsTrigger>
          <TabsTrigger value="algebra" className="text-xs">Algebra</TabsTrigger>
          <TabsTrigger value="calculus" className="text-xs">Calculus</TabsTrigger>
          <TabsTrigger value="greek" className="text-xs">Greek</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="grid grid-cols-4 sm:grid-cols-6 gap-1">
          {basicSymbols.map((item, index) => (
            <Button 
              key={index} 
              onClick={() => insertSymbol(item.symbol)}
              variant="outline"
              size="sm" 
              className="h-9"
              disabled={!mathfieldReady}
            >
              {item.label}
            </Button>
          ))}
        </TabsContent>
        
        <TabsContent value="algebra" className="grid grid-cols-4 sm:grid-cols-6 gap-1">
          {algebraSymbols.map((item, index) => (
            <Button 
              key={index} 
              onClick={() => insertSymbol(item.symbol)}
              variant="outline" 
              size="sm"
              className="h-9"
              disabled={!mathfieldReady}
            >
              {item.label}
            </Button>
          ))}
        </TabsContent>
        
        <TabsContent value="calculus" className="grid grid-cols-4 sm:grid-cols-6 gap-1">
          {calcSymbols.map((item, index) => (
            <Button 
              key={index} 
              onClick={() => insertSymbol(item.symbol)}
              variant="outline" 
              size="sm"
              className="h-9"
              disabled={!mathfieldReady}
            >
              {item.label}
            </Button>
          ))}
        </TabsContent>
        
        <TabsContent value="greek" className="grid grid-cols-4 sm:grid-cols-6 gap-1">
          {greekSymbols.map((item, index) => (
            <Button 
              key={index} 
              onClick={() => insertSymbol(item.symbol)}
              variant="outline" 
              size="sm"
              className="h-9"
              disabled={!mathfieldReady}
            >
              {item.label}
            </Button>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MathVirtualKeyboard;
