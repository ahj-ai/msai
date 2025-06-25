'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle, X, HelpCircle, Check, Save, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Problem, GeminiJsonResponse } from '@/types/math';
import { ensureLatexDelimiters } from '@/utils/format-latex';

interface ProblemSolverProps {
  currentProblem: Problem;
  currentProblemIndex: number;
  problems: Problem[];
  userAnswer: string;
  setUserAnswer: (value: string) => void;
  isCorrect: boolean | null;
  checkAnswer: () => void;
  goToNextProblem: () => void;
  setShowProblemSolving: (value: boolean) => void;
  showHint: boolean;
  showNextHint: () => void;
  currentHintIndex: number;
  setShowAllSteps: (value: boolean) => void;
  showAllSteps: boolean;
  isSignedIn: boolean;
  problemsSaved: boolean;
  isSavingProblems: boolean;
  saveProblemsToSupabase: () => void;
}

const ProblemSolver: React.FC<ProblemSolverProps> = ({
  currentProblem,
  currentProblemIndex,
  problems,
  userAnswer,
  setUserAnswer,
  isCorrect,
  checkAnswer,
  goToNextProblem,
  setShowProblemSolving,
  showHint,
  showNextHint,
  currentHintIndex,
  setShowAllSteps,
  showAllSteps,
  isSignedIn,
  problemsSaved,
  isSavingProblems,
  saveProblemsToSupabase,
}) => {
  return (
    <Card className="w-full max-w-3xl mx-auto mt-12 bg-white/90 backdrop-blur-sm border border-indigo-100 shadow-xl rounded-2xl overflow-hidden">
      {currentProblem && (
        <div>
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight text-white">
                  Problem {currentProblemIndex + 1} of {problems.length}
                </CardTitle>
                <div className="flex mt-1 text-sm text-indigo-100">
                  <span className="font-medium mr-2">{currentProblem.subject}:</span>
                  <span>{currentProblem.topic}</span>
                </div>
              </div>
              <Button variant="ghost" className="text-white hover:bg-indigo-700" onClick={() => setShowProblemSolving(false)}>
                <ArrowLeft className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Back to Lab</span>
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-4 sm:p-6 md:p-8 pt-6 bg-white">
            <div className="mb-8 rounded-lg bg-gray-50 border border-gray-100 p-4 sm:p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-3">Problem</h3>
              <div className="whitespace-pre-wrap text-lg font-medium text-gray-800">
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {ensureLatexDelimiters(currentProblem.question)}
                </ReactMarkdown>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">Your Answer:</label>
                <div className="flex">
                  <input
                    id="answer"
                    type="text"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    disabled={isCorrect === true}
                    placeholder="Enter your answer here..."
                    onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                  />
                  <Button 
                    className="rounded-l-none"
                    onClick={checkAnswer}
                    disabled={isCorrect === true}
                  >
                    Check
                  </Button>
                </div>
              </div>
              
              {isCorrect !== null && (
                <div className="flex items-center gap-2 mt-3">
                  {isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <X className="w-6 h-6 text-red-500" />
                  )}
                  <p className={`font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect. Try again.'}
                  </p>
                </div>
              )}
              
              {isCorrect && (
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={goToNextProblem}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {currentProblemIndex < problems.length - 1 ? 'Next Problem' : 'Finish'}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              )}
              
              <div className="mt-6 border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Need a hint?</span>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={showNextHint}
                      disabled={!currentProblem?.hints || currentHintIndex >= currentProblem.hints.length}
                      className="text-xs px-3 py-1"
                    >
                      {showHint ? 'Next Hint' : 'Show Hint'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAllSteps(true)}
                      className="text-xs px-3 py-1 flex items-center gap-1 text-indigo-600 hover:bg-indigo-50"
                      disabled={showAllSteps}
                    >
                      <HelpCircle className="w-4 h-4" />
                      I'm stumped
                    </Button>
                  </div>
                </div>
                {showHint && currentProblem.hints && currentHintIndex < currentProblem.hints.length && (
                  <div className="bg-amber-50 border border-amber-100 rounded-md p-3 text-amber-900 text-sm">
                    <ReactMarkdown
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                    >
                      {ensureLatexDelimiters(currentProblem.hints[currentHintIndex])}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
              {(isCorrect || showAllSteps) && currentProblem.solutionSteps && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-display font-semibold text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Check className="w-4 h-4" /> Solution Steps
                  </h3>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <ol className="list-decimal pl-5 space-y-4">
                      {currentProblem.solutionSteps.map((step, index) => (
                        <li key={index} className="text-gray-700 text-base font-body">
                          <div className="bg-white p-3 rounded-md shadow-xs">
                            <div className="font-body leading-relaxed">
                              <ReactMarkdown
                                remarkPlugins={[remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                              >
                                {ensureLatexDelimiters(step)}
                              </ReactMarkdown>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                  
                  {isSignedIn && !problemsSaved && (
                    <div className="mt-4 flex justify-end">
                      <Button
                        onClick={saveProblemsToSupabase}
                        disabled={isSavingProblems}
                        variant="outline"
                        className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 flex items-center gap-2 font-display font-medium tracking-tight transition-all duration-300 hover:-translate-y-0.5"
                      >
                        {isSavingProblems ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save Problem
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                  
                  {problemsSaved && (
                    <div className="mt-4 p-2 bg-green-50 border border-green-100 rounded text-green-700 text-sm flex items-center gap-2 font-body">
                      <CheckCircle className="w-4 h-4" />
                      Problem saved successfully!
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </div>
      )}
    </Card>
  );
};

export default ProblemSolver;
