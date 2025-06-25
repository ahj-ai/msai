'use client'

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/image-upload';
import { GeminiJsonResponse } from '@/types/math';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Camera, Send, Loader2, AlertCircle, Coins, Book, PenTool, CheckCircle, Brain, X } from 'lucide-react';

interface SnapAndSolveProps {
  selectedImage: File | null;
  handleImageSelect: (file: File | null) => void;
  solution: GeminiJsonResponse | string | null;
  isLoadingSnap: boolean;
  snapError: string | null;
  handleSnapSolve: () => void;
  handleGenerateSimilar: (source: GeminiJsonResponse) => void;
  isGeneratingSimilar: boolean;
  similarProblem: GeminiJsonResponse | null;
  showSimilarProblem: boolean;
  setShowSimilarProblem: (show: boolean) => void;
  setSolution: (solution: GeminiJsonResponse | string | null) => void;
  setSimilarProblem: (problem: GeminiJsonResponse | null) => void;
  similarProblemError: string | null;
}

const SnapAndSolve: React.FC<SnapAndSolveProps> = ({
  selectedImage,
  handleImageSelect,
  solution,
  isLoadingSnap,
  snapError,
  handleSnapSolve,
  handleGenerateSimilar,
  isGeneratingSimilar,
  similarProblem,
  showSimilarProblem,
  setShowSimilarProblem,
  setSolution,
  setSimilarProblem,
  similarProblemError,
}) => {
  return (
    <Card className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-sm border border-indigo-100 shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-3">
          <Camera className="w-7 h-7" />
          Screenshot & Solve
        </CardTitle>
        <p className="text-indigo-100 mt-1 text-sm">Upload a screenshot of your math problem for an AI-powered solution!</p>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        <div className="space-y-6">
          <div className="w-full">
            <ImageUpload onImageSelect={handleImageSelect} currentImage={selectedImage} />
          </div>

          {snapError && (
            <div className="flex items-center p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm">{snapError}</span>
            </div>
          )}

          <div className="relative w-full">
            <div className="absolute -top-6 right-2 flex items-center gap-1 bg-indigo-100 px-1.5 py-0.5 rounded-md">
              <Coins className="w-3 h-3 text-indigo-600" />
              <span className="text-xs font-medium text-indigo-600">5</span>
            </div>
            <Button
              onClick={handleSnapSolve}
              disabled={!selectedImage || isLoadingSnap}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-base tracking-wide rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
              title="Costs 5 credits"
            >
              {isLoadingSnap ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Getting solution...
                </>
              ) : (
                <>
                  Get Solution <Send className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>

          {solution && !isLoadingSnap && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 space-y-6"
            >
              {typeof solution === 'object' && solution.problem ? (
                <div className="prose prose-indigo max-w-none">
                  <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-100">
                    <h3 className="text-lg font-bold text-indigo-800 flex items-center">
                      <Book className="w-5 h-5 mr-2" /> Problem: {solution.problem.title}
                    </h3>
                    <div className="mt-2 text-gray-700">
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                        {solution.problem.statement}
                      </ReactMarkdown>
                    </div>
                    {solution.problem.keyConcepts && solution.problem.keyConcepts.length > 0 && (
                      <div className="mt-3">
                        <h4 className="font-semibold text-sm text-indigo-700">Key Concepts:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                          {solution.problem.keyConcepts.map((concept: string, index: number) => (
                            <li key={index}>{concept}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-100">
                    <h3 className="text-lg font-bold text-blue-800 flex items-center">
                      <PenTool className="w-5 h-5 mr-2" /> Solution Steps
                    </h3>
                    <ol className="list-decimal list-inside mt-2 space-y-4">
                      {solution.solution.map((step: { step: string; work: string; explanation: string }, index: number) => (
                        <li key={index} className="pl-2">
                          <strong className="font-semibold text-gray-800">{step.step}</strong>
                          <div className="pl-4 border-l-2 border-blue-200 mt-1">
                            <div className="text-gray-700">
                              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                {step.explanation}
                              </ReactMarkdown>
                            </div>
                            {step.work && (
                              <div className="mt-2 p-2 bg-white rounded-md border border-gray-200">
                                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                  {step.work}
                                </ReactMarkdown>
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-100">
                    <h3 className="text-lg font-bold text-green-800 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" /> Final Answer
                    </h3>
                    <div className="mt-2 text-gray-800 font-semibold">
                       <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                        {solution.answer.finalResult}
                      </ReactMarkdown>
                    </div>
                    {solution.answer.verification && (
                      <div className="mt-2 text-sm text-gray-600">
                        <strong className="font-semibold">Verification:</strong>
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                          {solution.answer.verification}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>

                   <div className="mt-6 flex flex-col items-center">
                       <Button
                       onClick={() => handleGenerateSimilar(solution as GeminiJsonResponse)}
                       disabled={isGeneratingSimilar}
                       className="bg-gradient-to-r from-[#6C63FF] to-[#5E60CE] hover:from-[#5E60CE] hover:to-[#4F46E5] text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-70"
                       title="Costs 3 credits"
                       >
                       {isGeneratingSimilar ? (
                           <>
                           <Loader2 className="w-5 h-5 animate-spin" />
                           Generating similar problem...
                           </>
                       ) : (
                           <>
                           <Brain className="w-5 h-5" />
                           Generate a problem just like this one
                           </>
                       )}
                       </Button>
                       <div className="flex items-center gap-1 mt-2 text-indigo-600">
                           <Coins className="w-3 h-3" />
                           <span className="text-xs font-medium">3 credits</span>
                       </div>
                   </div>

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

                   {showSimilarProblem && similarProblem && (
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
                               {similarProblem.problem.title || 'New Problem'}
                             </h4>
                             <div className="text-gray-700 prose prose-sm max-w-none">
                               <ReactMarkdown
                                 remarkPlugins={[remarkMath]}
                                 rehypePlugins={[rehypeKatex]}
                               >
                                 {similarProblem.problem.statement || 'No problem statement available'}
                               </ReactMarkdown>
                             </div>
                           </div>
                         )}

                         <div className="flex gap-3 justify-center">
                           <Button
                             onClick={() => handleGenerateSimilar(solution as GeminiJsonResponse)}
                             disabled={isGeneratingSimilar}
                             variant="outline"
                             className="border-purple-300 text-purple-700 hover:bg-purple-50"
                           >
                             Generate Another
                           </Button>
                           <Button
                             onClick={() => {
                               setSolution(similarProblem);
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
              ) : (
                <div className="prose prose-indigo">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {typeof solution === 'string' ? solution : ''}
                  </ReactMarkdown>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SnapAndSolve;