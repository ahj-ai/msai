'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDown, ChevronUp, Calculator, PenTool, Hash } from 'lucide-react'

// Categories with LaTeX symbols
const latexSymbols = {
  "Basic": [
    { symbol: "+", latex: "+" },
    { symbol: "-", latex: "-" },
    { symbol: "×", latex: "\\times " },
    { symbol: "÷", latex: "\\div " },
    { symbol: "=", latex: "=" },
    { symbol: "≠", latex: "\\neq " },
    { symbol: "<", latex: "<" },
    { symbol: ">", latex: ">" },
    { symbol: "≤", latex: "\\leq " },
    { symbol: "≥", latex: "\\geq " },
    { symbol: "±", latex: "\\pm " },
    { symbol: "∞", latex: "\\infty " },
  ],
  "Exponents & Roots": [
    { symbol: "x²", latex: "^2" },
    { symbol: "x³", latex: "^3" },
    { symbol: "x^n", latex: "^{}" },
    { symbol: "√", latex: "\\sqrt{}" },
    { symbol: "∛", latex: "\\sqrt[3]{}" },
    { symbol: "ⁿ√", latex: "\\sqrt[n]{}" },
    { symbol: "log", latex: "\\log_{}" },
    { symbol: "ln", latex: "\\ln " },
  ],
  "Fractions": [
    { symbol: "a/b", latex: "\\frac{}{}" },
    { symbol: "⅟", latex: "\\frac{1}{}" },
    { symbol: "%", latex: "\\%" },
    { symbol: "(a/b)", latex: "\\left(\\frac{}{}\\right)" },
  ],
  "Greek Letters": [
    { symbol: "α", latex: "\\alpha " },
    { symbol: "β", latex: "\\beta " },
    { symbol: "γ", latex: "\\gamma " },
    { symbol: "Δ", latex: "\\Delta " },
    { symbol: "θ", latex: "\\theta " },
    { symbol: "π", latex: "\\pi " },
    { symbol: "Σ", latex: "\\Sigma " },
    { symbol: "λ", latex: "\\lambda " },
    { symbol: "μ", latex: "\\mu " },
    { symbol: "φ", latex: "\\phi " },
  ],
  "Advanced": [
    { symbol: "∫", latex: "\\int " },
    { symbol: "∑", latex: "\\sum " },
    { symbol: "∏", latex: "\\prod " },
    { symbol: "lim", latex: "\\lim_{}" },
    { symbol: "∂", latex: "\\partial " },
    { symbol: "→", latex: "\\rightarrow " },
    { symbol: "∈", latex: "\\in " },
    { symbol: "matrix", latex: "\\begin{pmatrix}  \\\\  \\end{pmatrix}" },
  ],
};

// Type for keyboard props
interface LatexKeyboardProps {
  onInsert: (latex: string) => void;
}

export default function LatexKeyboard({ onInsert }: LatexKeyboardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Basic");

  const handleInsert = (latex: string) => {
    onInsert(latex);
  };

  // More minimal mathematical icon component
  const MathIcon = () => (
    <div className="flex items-center justify-center gap-1.5 text-sm">
      <span className="text-purple-100">f(x)</span>
      <Calculator className="h-3.5 w-3.5 text-purple-200" />
    </div>
  );

  return (
    <div className="relative w-full mt-2">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 bg-gray-800/50 text-purple-200 hover:bg-gray-700/50 hover:text-purple-100 border-purple-500/20 px-2.5 py-1 h-8"
          onClick={() => setIsOpen(!isOpen)}
          title="Math Symbols"
        >
          <Calculator className="h-4 w-4 text-purple-200" />
          <span className="text-xs font-medium">Math Symbols</span>
          {isOpen ? <ChevronDown className="h-3.5 w-3.5 ml-0.5" /> : <ChevronUp className="h-3.5 w-3.5 ml-0.5" />}
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 bg-gray-800/70 backdrop-blur-sm border border-purple-500/20 rounded-lg shadow-lg overflow-hidden"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="p-2 border-b border-gray-700/50">
                <TabsList className="w-full bg-gray-700/30 grid grid-cols-5">
                  {Object.keys(latexSymbols).map((category) => (
                    <TabsTrigger 
                      key={category} 
                      value={category}
                      className="text-xs text-purple-200 data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-medium"
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {Object.entries(latexSymbols).map(([category, symbols]) => (
                <TabsContent key={category} value={category} className="p-2 m-0">
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5">
                    {symbols.map((item) => (
                      <Button
                        key={item.latex}
                        variant="outline"
                        size="sm"
                        onClick={() => handleInsert(item.latex)}
                        className="h-10 font-medium bg-gray-700/40 text-purple-200 hover:bg-indigo-500/40 border-gray-600/50 hover:border-indigo-500/50 transition-colors"
                      >
                        {item.symbol}
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="p-2 border-t border-gray-700/50">
              <div className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
                <Calculator className="h-3 w-3" />
                <span>Click any symbol to insert its LaTeX code</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
