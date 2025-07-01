'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { CheckCircle, X, HelpCircle, Check, Eye, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Problem } from '@/types/math';
import { getProblemIdsByTopic } from '@/lib/problems';
import { ensureLatexDelimiters, formatLatexForGemini } from '@/utils/format-latex';
import { checkAnswerEquivalence } from '@/utils/math-compare';
import MathInput from './math-input';

interface PracticeProblemProps {
  problem: Problem;
  totalProblems: number;
}

const PracticeProblem: React.FC<PracticeProblemProps> = ({ problem, totalProblems }) => {
  const router = useRouter();
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [showAllSteps, setShowAllSteps] = useState(false);
  const [isFetchingNext, setIsFetchingNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [problemIds, setProblemIds] = useState<string[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(-1);

  const checkAnswer = useCallback(() => {
    const correctAnswer = problem.answer !== undefined ? String(problem.answer) : '';
    setIsCorrect(checkAnswerEquivalence(userAnswer, correctAnswer));
  }, [problem.answer, userAnswer]);

  const showNextHint = () => {
    setShowHint(true);
    if (problem.hints && currentHintIndex < problem.hints.length - 1) {
      setCurrentHintIndex(currentHintIndex + 1);
    }
  };

  useEffect(() => {
    const fetchProblemIds = async () => {
      if (problem.subject && problem.topic) {
        try {
          const ids = await getProblemIdsByTopic(problem.subject, problem.topic);
          setProblemIds(ids);
          const currentIndex = ids.findIndex(id => id === problem.id);
          setCurrentProblemIndex(currentIndex);
        } catch (error) {
          console.error("Failed to fetch problem IDs", error);
        }
      }
    };

    fetchProblemIds();
  }, [problem.id, problem.subject, problem.topic]);

  // State for celebration animation
  const [showCelebration, setShowCelebration] = useState(false);

  const handleNextProblem = useCallback(() => {
    const nextProblemIndex = currentProblemIndex + 1;
    if (nextProblemIndex < problemIds.length) {
      const nextProblemId = problemIds[nextProblemIndex];
      setIsLoading(true);
      setIsFetchingNext(true);
      
      // Create a smooth transition
      const transition = setTimeout(() => {
        router.push(`/practice/${nextProblemId}`);
      }, 300); // Short delay for smooth transition
      
      return () => clearTimeout(transition);
    } else {
      // Show celebration animation when all problems are completed
      setShowCelebration(true);
    }
  }, [currentProblemIndex, problemIds, router]);

  // Reset states when the problem changes
  useEffect(() => {
    setUserAnswer('');
    setIsCorrect(null);
    setShowHint(false);
    setCurrentHintIndex(0);
    setShowAllSteps(false);
    setIsLoading(false);
    setIsFetchingNext(false);
  }, [problem.id]);

  return (
    <>
      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div 
            key="celebration-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div 
              key="celebration-modal"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ 
                scale: 1,
                opacity: 1
              }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ 
                type: "spring",
                damping: 20,
                stiffness: 300
              }}
              className="bg-white rounded-2xl p-10 text-center shadow-2xl max-w-md"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h2 className="text-2xl font-bold text-indigo-700 mb-2">Congratulations!</h2>
              <p className="text-gray-700 mb-6">You've completed all problems in this topic!</p>
              <Button 
                onClick={() => router.push('/problem-lab')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl"
              >
                Return to Practice Hub
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
    <Card className="w-full max-w-3xl mx-auto bg-white/90 backdrop-blur-sm border border-indigo-100 shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight text-white">
              Practice Problem
            </CardTitle>
            <div className="flex mt-1 text-sm text-indigo-100">
              <span className="font-medium mr-2">{problem.subject}:</span>
              <span>{problem.topic}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold mb-1">
              Problem {currentProblemIndex + 1} of {totalProblems}
            </div>
            <div className="text-xs text-indigo-100">
              Topic Progress
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-8">
        <div className="prose prose-stone max-w-none mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
            {formatLatexForGemini(problem.question)}
          </ReactMarkdown>
        </div>

        <div className="mt-8">
          {/* Answer input wrapper */}
          <div className="flex flex-col w-full">
            {/* Math input and button row */}
            <div className="flex items-center gap-4">
              <div className="flex-grow relative">
                <MathInput 
                  value={userAnswer} 
                  onChange={setUserAnswer} 
                  placeholder="Enter your answer" 
                  onSubmit={isCorrect ? handleNextProblem : checkAnswer}
                  disabled={isCorrect === true}
                />
              </div>
              <div className="flex-shrink-0">
                <Button 
                  onClick={isCorrect ? handleNextProblem : checkAnswer} 
                  className={`flex items-center justify-center py-3 px-8 rounded-xl font-medium text-white transition-all ${isCorrect ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-green-500 hover:bg-green-600'}`}
                  disabled={isLoading}
                  style={{ height: '56px' }} /* Match height with input */
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : isCorrect ? (
                    <>
                      {currentProblemIndex < problemIds.length - 1 ? 'Next Problem' : 'Finish'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    'Check Answer'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {isCorrect !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isCorrect ? <CheckCircle className="h-5 w-5" /> : <X className="h-5 w-5" />}
            <span className="font-medium">{isCorrect ? 'Correct!' : 'Not quite, try again!'}</span>
          </motion.div>
        )}

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {problem.hints && problem.hints.length > 0 && (
            <Button 
              onClick={showNextHint} 
              variant="outline" 
              className="py-6 rounded-xl hover:bg-indigo-50 border-indigo-100 hover:border-indigo-200 transition-all duration-200"
              disabled={isLoading}
            >
              <HelpCircle className="mr-2 h-5 w-5 text-indigo-500" />
              <span className="font-medium">Get a Hint</span>
            </Button>
          )}
          <Button 
            onClick={() => setShowAllSteps(true)} 
            variant="outline" 
            className="py-6 rounded-xl hover:bg-purple-50 border-purple-100 hover:border-purple-200 transition-all duration-200"
            disabled={isLoading}
          >
            <Eye className="mr-2 h-5 w-5 text-purple-500" />
            <span className="font-medium">Show Solution</span>
          </Button>
        </div>

        {showHint && problem.hints && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800">Hint</h3>
            <p className="text-yellow-700 mt-2">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {formatLatexForGemini(problem.hints[currentHintIndex])}
              </ReactMarkdown>
            </p>
          </motion.div>
        )}

        {(isCorrect || showAllSteps) && problem.solutionSteps && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Check className="w-4 h-4" /> Solution Steps
            </h3>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <ol className="list-decimal pl-5 space-y-4">
                {problem.solutionSteps.map((step, index) => (
                  <li key={index} className="text-gray-700">
                    <div className="bg-white p-3 rounded-md shadow-xs">
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                        {formatLatexForGemini(step)}
                      </ReactMarkdown>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* Removed separate Next Problem button - now integrated with Check Answer button */}
      </CardContent>
    </Card>
    </motion.div>
    </>
  );
};

export default PracticeProblem;
