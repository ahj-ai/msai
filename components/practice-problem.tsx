'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
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
import { ensureLatexDelimiters } from '@/utils/format-latex';
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
      // TODO: Show a toast notification that they've completed the topic
      console.log("You've completed all problems in this topic!");
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
          {currentProblemIndex !== -1 && problemIds.length > 0 && (
            <div className="text-right">
              <div className="text-lg font-bold text-white">
                Problem {currentProblemIndex + 1} of {problemIds.length}
              </div>
              <div className="text-xs text-indigo-200">
                Topic Progress
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 md:p-8">
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
            {ensureLatexDelimiters(problem.question)}
          </ReactMarkdown>
        </div>

        <div className="mt-8">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <MathInput 
              value={userAnswer} 
              onChange={setUserAnswer} 
              placeholder="Enter your answer" 
              onSubmit={checkAnswer}  /* Add Enter key shortcut */
            />
            <Button 
              onClick={checkAnswer} 
              className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl touch-manipulation"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : "Check Answer"}
            </Button>
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

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          {problem.hints && problem.hints.length > 0 && (
            <Button 
              onClick={showNextHint} 
              variant="outline" 
              className="flex-1 py-6 rounded-xl touch-manipulation"
              disabled={isLoading}
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Get a Hint
            </Button>
          )}
          <Button 
            onClick={() => setShowAllSteps(true)} 
            variant="outline" 
            className="flex-1 py-6 rounded-xl touch-manipulation"
            disabled={isLoading}
          >
            <Eye className="mr-2 h-4 w-4" />
            Show Solution
          </Button>
        </div>

        {showHint && problem.hints && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800">Hint</h3>
            <p className="text-yellow-700 mt-2">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {ensureLatexDelimiters(problem.hints[currentHintIndex])}
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
                        {ensureLatexDelimiters(step)}
                      </ReactMarkdown>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {isCorrect && currentProblemIndex < problemIds.length - 1 && (
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
            <Button
              onClick={handleNextProblem}
              disabled={isFetchingNext || currentProblemIndex >= problemIds.length - 1 || isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-2 transition-all duration-200 py-6 px-8 rounded-xl touch-manipulation"
            >
              {isFetchingNext ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Next Problem
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
    </motion.div>
  );
};

export default PracticeProblem;
