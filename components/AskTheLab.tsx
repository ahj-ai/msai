'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MathField, { MathFieldRef } from './math-field';
import { MessageSquare, Send, Loader2, AlertCircle, Brain, Coins, CheckCircle, X, TextIcon, FunctionSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { GeminiJsonResponse } from '@/types/math';
import { ensureLatexDelimiters } from "@/utils/format-latex";

interface AskTheLabProps {
  question: string;
  setQuestion: (value: string) => void;
  handleAskQuestion: () => void;
  isAskingQuestion: boolean;
  answer: string | GeminiJsonResponse | null;
  handleGenerateSimilar?: (solution: GeminiJsonResponse) => void;
  isGeneratingSimilar?: boolean;
  similarProblem?: GeminiJsonResponse | null;
  showSimilarProblem?: boolean;
  setShowSimilarProblem?: (show: boolean) => void;
  setSimilarProblem?: (problem: GeminiJsonResponse | null) => void;
  similarProblemError?: string | null;
  setSolution?: (solution: GeminiJsonResponse) => void;
}

type InputMode = 'equation-solver' | 'custom-problem';

const AskTheLab: React.FC<AskTheLabProps> = ({
  question,
  setQuestion,
  handleAskQuestion,
  isAskingQuestion,
  answer,
  handleGenerateSimilar,
  isGeneratingSimilar,
  similarProblem,
  showSimilarProblem,
  setShowSimilarProblem,
  setSimilarProblem,
  similarProblemError,
  setSolution,
}) => {
  // State to toggle between equation input and word problem input
  const [inputMode, setInputMode] = useState<InputMode>('equation-solver');
  
  // Create a ref for the MathField component following the uncontrolled component pattern
  const mathFieldRef = React.useRef<MathFieldRef>(null);
  
  // Create a ref for the textarea
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  return (
    <Card className="w-full max-w-3xl mx-auto bg-white/90 backdrop-blur-sm border border-indigo-100 shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 md:p-8 pb-4 md:pb-6">
        <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2 md:gap-3">
          <MessageSquare className="w-6 h-6 md:w-8 md:h-8" />
          Ask the Lab
        </CardTitle>
        <p className="text-indigo-200 mt-2 text-base md:text-lg">
          Type Any Math Question. Get Instant, Step-by-Step Help.
        </p>
      </CardHeader>
      <CardContent className="p-4 md:p-8">
        <div className="relative mb-4 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-200 focus-within:border-indigo-500 overflow-hidden transition-all duration-200">
          <div className="flex border-b border-gray-200 bg-gray-50/50">
            <button
              onClick={() => setInputMode('equation-solver')}
              className={`flex-1 p-3 text-center font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-2 ${
                inputMode === 'equation-solver'
                  ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <FunctionSquare className="w-5 h-5" />
              Equation Solver
            </button>
            <div className="w-px bg-gray-200"></div>
            <button
              onClick={() => setInputMode('custom-problem')}
              className={`flex-1 p-3 text-center font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-2 ${
                inputMode === 'custom-problem'
                  ? 'bg-white text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <TextIcon className="w-5 h-5" />
              Enter a Custom Problem
            </button>
          </div>

          <div className="relative">
            {inputMode === 'equation-solver' ? (
              <MathField
                value={question}
                onChange={setQuestion}
                placeholder="f(x) = x^3 + 2x^2 - 4x + 7"
                disabled={isAskingQuestion}
                ref={mathFieldRef}
                className="w-full border-0 focus:ring-0 !min-h-[130px] md:!min-h-[150px] bg-white"
              />
            ) : (
              <textarea
                ref={textareaRef}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., A train travels at 60 mph..."
                disabled={isAskingQuestion}
                className="w-full p-4 border-none focus:ring-0 focus:outline-none transition-all duration-200 text-gray-800 bg-transparent min-h-[120px] resize-y"
              />
            )}
            
            <Button
              onClick={() => {
                if (inputMode === 'equation-solver' && mathFieldRef.current) {
                  const currentValue = mathFieldRef.current.getValue();
                  setQuestion(currentValue);
                } else if (inputMode === 'custom-problem' && textareaRef.current) {
                  setQuestion(textareaRef.current.value);
                }
                handleAskQuestion();
              }}
              disabled={isAskingQuestion || !question.trim()}
              className="absolute bottom-3 right-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-3 py-2 md:px-4 md:py-2 flex items-center gap-1 md:gap-2 text-sm md:text-base transition-all duration-200 disabled:bg-indigo-300"
            >
              {isAskingQuestion ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Asking...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Ask
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* No virtual keyboard needed - using built-in MathField keyboard */}

        {isAskingQuestion && (
          <div className="mt-8 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
            <p className="text-lg font-semibold text-gray-700">The lab is analyzing your question...</p>
            <p className="text-gray-500">Please wait a moment.</p>
          </div>
        )}

        {answer && !isAskingQuestion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 p-6 bg-indigo-50 border border-indigo-200 rounded-xl prose max-w-none"
          >
            {typeof answer === 'string' ? (
              <div className="flex items-center gap-3 text-red-600">
                <AlertCircle className="w-6 h-6" />
                <p>{answer}</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Main Title */}
                <h3 className="text-2xl font-bold text-indigo-800 flex items-center gap-3 border-b-2 border-indigo-200 pb-3">
                  <Brain className="w-7 h-7" />
                  Lab's Analysis
                </h3>

                {/* Problem Section */}
                {(answer as GeminiJsonResponse).problem && (
                  <div className="p-6 bg-indigo-50/80 rounded-xl border border-indigo-200">
                    <h4 className="text-xl font-bold text-indigo-800 mb-3">
                      {ensureLatexDelimiters((answer as GeminiJsonResponse).problem.title || 'Problem')}
                    </h4>
                    <div className="prose prose-sm max-w-none text-gray-800">
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                        {ensureLatexDelimiters((answer as GeminiJsonResponse).problem.statement || 'No problem statement available')}
                      </ReactMarkdown>
                    </div>
                    {(answer as GeminiJsonResponse).problem.keyConcepts && (answer as GeminiJsonResponse).problem.keyConcepts.length > 0 && (
                      <div className="mt-4">
                        <h5 className="font-semibold text-indigo-700">Key Concepts:</h5>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {(answer as GeminiJsonResponse).problem.keyConcepts.map((concept: string, index: number) => (
                            <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                              {ensureLatexDelimiters(concept)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Solution Section */}
                {(answer as GeminiJsonResponse).solution && (
                  <div>
                    <h4 className="text-xl font-bold text-blue-800 mb-3">Step-by-step Solution</h4>
                    <div className="space-y-4">
                      {(answer as GeminiJsonResponse).solution.map((step: { step: string; explanation: string; work: string }, index: number) => (
                        <div key={index} className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                          <p className="font-bold text-gray-800">
                            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                {`**Step ${index + 1}:** ${ensureLatexDelimiters(step.step)}`}
                            </ReactMarkdown>
                          </p>
                          <div className="prose prose-sm max-w-none text-gray-600 mt-1">
                            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                              {ensureLatexDelimiters(step.explanation)}
                            </ReactMarkdown>
                          </div>
                          {step.work && (
                            <div className="mt-2 p-3 bg-gray-50 rounded-md">
                              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                {ensureLatexDelimiters(step.work)}
                              </ReactMarkdown>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Final Answer Section */}
                {(answer as GeminiJsonResponse).answer && (
                  <div className="p-6 bg-green-50/80 rounded-xl border border-green-200">
                    <h4 className="text-xl font-bold text-green-800 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-6 h-6" />
                      Final Answer
                    </h4>
                    <div className="prose prose-sm max-w-none text-gray-800">
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                        {ensureLatexDelimiters((answer as GeminiJsonResponse).answer.finalResult)}
                      </ReactMarkdown>
                    </div>
                    {(answer as GeminiJsonResponse).answer.verification && (
                      <div className="mt-4 pt-3 border-t border-green-200">
                        <p className="text-sm text-green-700">
                            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                {`**Verification:** ${ensureLatexDelimiters((answer as GeminiJsonResponse).answer.verification)}`}
                            </ReactMarkdown>
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Generate Similar Problem Section */}
                {handleGenerateSimilar && (
                  <div className="mt-8 pt-6 border-t border-indigo-200 flex flex-col items-center">
                    <Button
                      onClick={() => handleGenerateSimilar(answer as GeminiJsonResponse)}
                      disabled={isGeneratingSimilar}
                      className="bg-gradient-to-r from-[#6C63FF] to-[#5E60CE] hover:from-[#5E60CE] hover:to-[#4F46E5] text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-70"
                    >
                      {isGeneratingSimilar ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Brain className="w-5 h-5" />
                          Generate a Similar Problem
                        </>
                      )}
                    </Button>
                    <div className="flex items-center gap-1 mt-2 text-indigo-600">
                      <Coins className="w-3 h-3" />
                      <span className="text-xs font-medium">Costs 3 credits</span>
                    </div>
                  </div>
                )}

                {/* Similar Problem Error */}
                {similarProblemError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{similarProblemError}</span>
                  </motion.div>
                )}

                {/* Similar Problem Display */}
                {showSimilarProblem && similarProblem && setShowSimilarProblem && setSimilarProblem && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl shadow-sm"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-bold text-purple-800 flex items-center gap-2">
                        <Brain className="w-6 h-6" />
                        Similar Problem Generated
                      </h3>
                      <Button
                        onClick={() => setShowSimilarProblem(false)}
                        variant="ghost"
                        size="sm"
                        className="text-purple-600 hover:text-purple-800"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {similarProblem.problem && (
                        <div className="bg-white/70 p-4 rounded-lg border border-purple-100">
                          <h4 className="text-md font-semibold text-purple-800 mb-2">
                            {ensureLatexDelimiters(similarProblem.problem.title || 'New Problem')}
                          </h4>
                          <div className="text-gray-700 prose prose-sm max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                              {ensureLatexDelimiters(similarProblem.problem.statement || 'No problem statement available')}
                            </ReactMarkdown>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3 justify-center">
                        {handleGenerateSimilar && (
                          <Button
                            onClick={() => handleGenerateSimilar(answer as GeminiJsonResponse)}
                            disabled={isGeneratingSimilar}
                            variant="outline"
                            className="border-purple-300 text-purple-700 hover:bg-purple-50"
                          >
                            Generate Another
                          </Button>
                        )}
                        <Button
                          onClick={() => {
                            if (setSolution && typeof setSolution === 'function') {
                              setSolution(similarProblem);
                            }
                            setShowSimilarProblem(false);
                            setSimilarProblem(null);
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          Show Solution
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default AskTheLab;