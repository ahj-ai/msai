'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MathInput from './math-input';
import { Loader2, Send, AlertCircle, Brain, MessageSquare } from 'lucide-react';
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
}

const AskTheLab: React.FC<AskTheLabProps> = ({
  question,
  setQuestion,
  handleAskQuestion,
  isAskingQuestion,
  answer,
}) => {
  return (
    <Card className="w-full max-w-3xl mx-auto bg-white/90 backdrop-blur-sm border border-indigo-100 shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 pb-6">
        <CardTitle className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <MessageSquare className="w-8 h-8" />
          Ask the Lab
        </CardTitle>
        <p className="text-indigo-200 mt-2 text-lg">
          Have a specific math question? Type it in using LaTeX for formulas.
        </p>
      </CardHeader>
      <CardContent className="p-8">
        <div className="relative">
          <MathInput
            value={question}
            onChange={setQuestion}
            placeholder="e.g., How do I find the derivative of f(x) = x^3 + 2x^2 - 4x + 7?"
            disabled={isAskingQuestion}
          />
          <Button
            onClick={handleAskQuestion}
            disabled={isAskingQuestion || !question.trim()}
            className="absolute bottom-3 right-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 flex items-center gap-2 transition-all duration-200 disabled:bg-indigo-300"
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
              <div>
                <h3 className="text-xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
                  <Brain className="w-6 h-6" />
                  Lab's Analysis
                </h3>
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {(answer as GeminiJsonResponse).problem.statement || 'No problem statement available'}
                  </ReactMarkdown>
                </div>
                {(answer as GeminiJsonResponse).problem.keyConcepts && (answer as GeminiJsonResponse).problem.keyConcepts.length > 0 && (
                  <div className="mt-3">
                    <h4 className="font-semibold text-indigo-700">Key Concepts:</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(answer as GeminiJsonResponse).problem.keyConcepts.map((concept, index) => (
                        <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-indigo-700 mb-3">Step-by-step Solution:</h4>
                  <div className="space-y-4">
                    {(answer as GeminiJsonResponse).solution.map((step, index) => (
                      <div key={index} className="p-4 bg-white rounded-lg border border-gray-200">
                        <p className="font-bold text-gray-800">Step {index + 1}: {step.step}</p>
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                        >
                          {ensureLatexDelimiters(step.explanation)}
                        </ReactMarkdown>
                        {step.work && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-md">
                            <ReactMarkdown
                              remarkPlugins={[remarkMath]}
                              rehypePlugins={[rehypeKatex]}
                            >
                              {ensureLatexDelimiters(step.work)}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="text-lg font-bold text-green-800">Final Answer:</h4>
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {ensureLatexDelimiters((answer as GeminiJsonResponse).answer.finalResult)}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default AskTheLab;