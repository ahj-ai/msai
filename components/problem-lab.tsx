'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Problem, Difficulty } from '@/types/math'
import { GeminiJsonResponse } from '@/types/math';
import { FlaskConical, Sparkles, CheckCircle, Beaker, TestTube, HelpCircle, ArrowLeft, ArrowRight, Check, X, MessageSquare, Camera, Brain, ChevronRight, Send, Loader2, AlertCircle, PenTool, Eye, Save, Book, Coins } from 'lucide-react'

import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import { getFilteredProblems, getAllTopics, getAllSubjects } from '@/lib/problems'
import { saveUserProblems, getUserProblems } from '@/lib/supabase'
import LatexKeyboard from './latex-keyboard'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import MathInput from './math-input';
import { generateProblem } from "@/lib/generate-problem"
import { ParticleBackground } from "@/components/particle-background"
import { ImageUpload } from "@/components/image-upload"

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { ensureLatexDelimiters } from "@/utils/format-latex";
import AskTheLab from './AskTheLab';
import PracticeProblemGenerator from './PracticeProblemGenerator';
import SnapAndSolve from './SnapAndSolve';
import { subjects, difficulties, wordProblemTopics } from '@/lib/problem-constants';
import { useSimilarProblem } from '@/hooks/useSimilarProblem';

// A simple loading component to avoid import issues
function SimpleLoadingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <div className="relative h-16 w-16">
        <div className="absolute animate-ping h-full w-full rounded-full bg-indigo-400 opacity-75"></div>
        <div className="relative flex justify-center items-center h-16 w-16 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600">
          <FlaskConical className="h-8 w-8 text-white" />
        </div>
      </div>
      <p className="text-lg font-medium text-indigo-700 animate-pulse">
        Generating Problem...
      </p>
    </div>
  )
}

// Tab type definition
type ProblemLabTab = 'main' | 'ask' | 'snap';



export function ProblemLab() {
  // Active tab state
  const [activeTab, setActiveTab] = useState<ProblemLabTab>('main');
  
  // Setup states
  const [subject, setSubject] = useState<keyof typeof subjects>("pre-algebra");
  const [topic, setTopic] = useState("");
  const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('Regular');
  const [wordProblems, setWordProblems] = useState(false);
  const [problemCount, setProblemCount] = useState(1);
  
  // User authentication and saved problems states
  const { isSignedIn, userId, getToken } = useAuth();
  const [savedProblems, setSavedProblems] = useState<Problem[]>([]);
  const [showSavedProblems, setShowSavedProblems] = useState(false);
  const [isSavingProblems, setIsSavingProblems] = useState(false);
  const [problemsSaved, setProblemsSaved] = useState(false);
  // States for dynamic topics and subjects
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  
  // Ask Lab states
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | GeminiJsonResponse | null>(null);
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);
  const questionTextareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Screenshot & Solve states
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [solution, setSolution] = useState<string | GeminiJsonResponse | null>(null);
  const [isLoadingSnap, setIsLoadingSnap] = useState(false);
  const [snapError, setSnapError] = useState<string | null>(null);
  
  // Problem states
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [showProblemSolving, setShowProblemSolving] = useState(false);
  
  // Load topics and subjects from database
  useEffect(() => {
    async function loadTopicsAndSubjects() {
      try {
        const topics = await getAllTopics();
        setAvailableTopics(topics);
        
        const subjects = await getAllSubjects();
        setAvailableSubjects(subjects);
      } catch (error) {
        console.error('Error loading topics and subjects:', error);
      }
    }
    
    loadTopicsAndSubjects();
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [comingSoonTopics, setComingSoonTopics] = useState<{subject: string, topics: string[]}>({subject: '', topics: []});
  const [showAllSteps, setShowAllSteps] = useState(false);
  const [noProblemsFound, setNoProblemsFound] = useState(false);
  
  // Answer states
  const [userAnswer, setUserAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // Track experiment setup progress
  const [setupProgress, setSetupProgress] = useState(0);
  
  // Use the similar problem generation hook
  const {
    generateSimilarProblem,
    isGeneratingSimilar,
    similarProblem,
    similarProblemError,
    showSimilarProblem,
    setShowSimilarProblem,
    setSimilarProblem
  } = useSimilarProblem(getToken);

  // Handle image selection for Snap & Solve
  const handleImageSelect = (file: File | null) => {
    setSelectedImage(file);
    setSolution(null); // Clear previous solution
    setSnapError(null); // Clear previous error
  };

  // Handle Snap & Solve submission
  const handleSnapSolve = async () => {
    if (!selectedImage) return;

    setIsLoadingSnap(true);
    setSnapError('');
    setSolution(null);
    setCurrentProblemIndex(0);

    try {
      const token = await getToken();
      if (!token) {
        throw new Error('You must be signed in to use this feature.');
      }

      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await fetch('/api/solve-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const responseText = await response.text();
      console.log("Raw response from /api/solve-image:", responseText);

      if (!response.ok) {
        let errorMsg = `Server error: ${response.status}`;
        try {
          const errorData = JSON.parse(responseText);
          if (response.status === 402) {
            errorMsg = 'Insufficient stacks to perform this action.';
          } else {
            errorMsg = errorData.error || errorMsg;
          }
        } catch (e) {
          console.error("Could not parse error response as JSON.", responseText);
        }
        throw new Error(errorMsg);
      }

      const data = JSON.parse(responseText);
      if (data.answer) {
        setSolution(data.answer);
      } else {
        throw new Error('Invalid response format from server.');
      }

    } catch (error: any) {
      console.error("Snap & Solve error:", error);
      const message = error.message || 'An unexpected error occurred.';
      setSnapError(message);
    } finally {
      setIsLoadingSnap(false);
    }
  };

  // Handle Ask the Lab submission

  
  // Calculate setup progress as selections are made
  useEffect(() => {
    let progress = 0;
    const totalFields = 4; // subject, topic, difficulty, problemCount
    let filledFields = 0;
    
    if (subject) filledFields++;
    if (topic) filledFields++;
    if (difficulty) filledFields++;
    if (problemCount > 0) filledFields++;
    
    // Calculate progress as a percentage of filled fields
    progress = Math.round((filledFields / totalFields) * 100);
    
    setSetupProgress(progress);
  }, [subject, topic, difficulty, problemCount]);
  
  const currentProblem = problems[currentProblemIndex];
  
  // Handle difficulty change
  const handleDifficultyChange = (value: Difficulty) => {
    setDifficulty(value);
  };

  // Generate problems using Supabase database
  const generateProblems = useCallback(async () => {
    // Log the problem count being requested
    console.log(`Problem count selected: ${problemCount}`);
    if (!topic) return;
    setIsLoading(true);
    setProblems([]);
    setCurrentProblemIndex(0);
    setUserAnswer("");
    setShowHint(false);
    setCurrentHintIndex(0);
    setIsCorrect(null);
    setShowAllSteps(false);
    setProblemsSaved(false);
    
    try {
      let generatedProblems: Problem[] = [];
      
      // Get the subject name from the subject key
      const subjectName = subjects[subject]?.name;
      
      // Query Supabase with all filters
      console.log(`Querying Supabase for: Subject=${subjectName}, Topic=${topic}, Difficulty=${difficulty}, Count=${problemCount}`);
      const fetchedProblems = await getFilteredProblems({
        subject,
        topic,
        difficulty,
        limit: problemCount
      });
      
      // Log the number of problems fetched
      console.log(`Fetched ${fetchedProblems?.length || 0} problems from database, requested ${problemCount}`);
      
      if (fetchedProblems && fetchedProblems.length > 0) {
        console.log(`Found ${fetchedProblems.length} problems in database`);
        
        // Use the fetched problems, but respect the problemCount limit
        // This ensures we only take the number of problems the user requested
        generatedProblems = fetchedProblems.slice(0, problemCount).map(problem => ({
          ...problem,
          subject: subjectName, // Ensure subject is always set
          topic: topic, // Ensure topic is always set
          difficulty: difficulty, // Ensure difficulty is always set
          userAnswer: "",
          isCorrect: undefined as boolean | undefined,
          showHint: false,
          currentHintIndex: 0
        }));
        
        console.log(`Using ${generatedProblems.length} problems after applying limit of ${problemCount}`);
        
        // Reset the no problems found flag
        setNoProblemsFound(false);
      } else {
        // No problems found in database
        console.log(`No problems found in database for the selected criteria`);
        
        // Clear any existing problems
        generatedProblems = [];
        
        // Set a flag to show the no problems message
        setNoProblemsFound(true);
      }
      
      // Set the problems and update the UI
      setProblems(generatedProblems);
      setShowProblemSolving(generatedProblems.length > 0);
      
      // Log the final number of problems being displayed
      console.log(`Final problem count: ${generatedProblems.length}`);
    } catch (error) {
      console.error("Error generating problems:", error);
    } finally {
      setIsLoading(false);
    }
  }, [subject, topic, difficulty, problemCount, wordProblems]);
  
  // Function to save generated problems to Supabase
  const saveProblemsToSupabase = async () => {
    if (!isSignedIn || !userId || problems.length === 0) return;
    
    setIsSavingProblems(true);
    setProblemsSaved(false);
    
    try {
      const result = await saveUserProblems(userId, problems);
      
      if (result.success) {
        console.log('Problems saved successfully:', result.data);
        setProblemsSaved(true);
        
        // Update saved problems list if it's open
        if (showSavedProblems) {
          loadSavedProblems();
        }
      } else {
        console.error('Error saving problems:', result.error);
      }
    } catch (error) {
      console.error('Failed to save problems:', error);
    } finally {
      setIsSavingProblems(false);
    }
  };
  
  // Function to load saved problems from Supabase
  const loadSavedProblems = async () => {
    if (!isSignedIn || !userId) return;
    
    try {
      const result = await getUserProblems(userId, 20, 'problem-lab');
      
      if (result.success && result.data) {
        // Convert from Supabase format to Problem type
        const problems = result.data.map(item => ({
          id: item.id,
          subject: item.subject,
          topic: item.topic,
          difficulty: item.difficulty as Difficulty,
          question: item.question,
          solution: item.solution,
          answer: item.answer,
          hints: item.hints || [],
          solutionSteps: item.solution_steps || [],
          userAnswer: item.metadata?.userAnswer || '',
          isCorrect: item.metadata?.isCorrect,
          showHint: false,
          currentHintIndex: 0
        }));
        
        setSavedProblems(problems);
      } else {
        console.error('Error loading saved problems:', result.error);
        setSavedProblems([]);
      }
    } catch (error) {
      console.error('Failed to load saved problems:', error);
      setSavedProblems([]);
    }
  };
  
  // Load saved problems when the component mounts and user is signed in
  useEffect(() => {
    if (isSignedIn && userId && showSavedProblems) {
      loadSavedProblems();
    }
  }, [isSignedIn, userId, showSavedProblems]);
  
  // Handle user answer submission
  const checkAnswer = () => {
    if (!currentProblem || userAnswer.trim() === "") return;
    
    // Simple answer checking - normalize answers to avoid formatting issues
    const correctAnswer = (currentProblem.answer?.toString() || 
                         currentProblem.solution.split('=').pop()?.trim() || "").replace(/\$/g, '').trim();
    const userAnswerNormalized = userAnswer.trim().replace(/\$/g, '');
    
    const isAnswerCorrect = userAnswerNormalized === correctAnswer;
    
    setIsCorrect(isAnswerCorrect);
    
    // Update the problem with the user's answer and correctness
    const updatedProblems = [...problems];
    updatedProblems[currentProblemIndex] = {
      ...currentProblem,
      userAnswer,
      isCorrect: isAnswerCorrect
    };
    
    setProblems(updatedProblems);
  };
  
  // Show next hint
  const showNextHint = () => {
    if (!currentProblem?.hints || currentHintIndex >= currentProblem.hints.length - 1) return;
    setCurrentHintIndex(prev => prev + 1);
    setShowHint(true);
  };
  
  // Navigate between problems
  const goToNextProblem = () => {
    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(prev => prev + 1);
      setUserAnswer(problems[currentProblemIndex + 1]?.userAnswer || "");
      setShowHint(problems[currentProblemIndex + 1]?.showHint || false);
      setCurrentHintIndex(problems[currentProblemIndex + 1]?.currentHintIndex || 0);
      setIsCorrect(problems[currentProblemIndex + 1]?.isCorrect || null);
      setShowAllSteps(false);
    } else {
      // All problems completed
      setShowCompletion(true);
    }
  };
  
  const goToPreviousProblem = () => {
    if (currentProblemIndex > 0) {
      setCurrentProblemIndex(prev => prev - 1);
      setUserAnswer(problems[currentProblemIndex - 1]?.userAnswer || "");
      setShowHint(problems[currentProblemIndex - 1]?.showHint || false);
      setCurrentHintIndex(problems[currentProblemIndex - 1]?.currentHintIndex || 0);
      setIsCorrect(problems[currentProblemIndex - 1]?.isCorrect || null);
      setShowAllSteps(false);
    }
  };

  // Premium indicator component
  const PremiumIndicator = () => (
    <Sparkles className="w-3 h-3 text-yellow-400 inline ml-1" />
  );
  
  // Handle inserting LaTeX symbols into the textarea
  const handleInsertLaTeX = (latex: string) => {
    if (!questionTextareaRef.current) return;
    
    const textarea = questionTextareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    // Insert the LaTeX symbol at the cursor position
    const newText = text.substring(0, start) + latex + text.substring(end);
    setQuestion(newText);
    
    // Focus back on the textarea and set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + latex.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };
  
  // Handle question submission to the Ask Lab
  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    
    setIsAskingQuestion(true);
    setAnswer(null);
    
    try {
      // Get the authentication token from Clerk
      const token = await getToken();
      
      if (!token) {
        setAnswer('You need to be signed in to use this feature.');
        return;
      }
      
      const response = await fetch('/api/ask-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ question })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Handle the structured response
        setAnswer(data.answer);
      } else {
        if (data.code === 'INSUFFICIENT_STACKS') {
          setAnswer(`You don't have enough credits to use this feature. Each question costs 3 credits. ${data.available ? `You currently have ${data.available} credits.` : ''} Visit the pricing page to get more credits.`);
        } else {
          setAnswer(data.error || 'Failed to process your question');
        }
        console.error('Ask Lab error:', data.error);
      }
    } catch (error) {
      console.error("Ask Lab error:", error);
      setAnswer('An error occurred while processing your question. Please try again.');
    } finally {
      setIsAskingQuestion(false);
    }
  };

  // The duplicate AskLabTab component has been removed.
  // The properly typed component defined around line 301 is used in the file instead.
          {answer && typeof answer === 'object' && !Array.isArray(answer) ? (
            // Render GeminiJsonResponse
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 space-y-6"
            >
              {/* Problem Section */}
              {(answer as GeminiJsonResponse).problem && (
                <div className="bg-gradient-to-r from-[#6C63FF]/10 to-[#5E60CE]/10 p-4 rounded-lg border border-indigo-100">
                  <h3 className="text-lg font-semibold text-indigo-800 mb-2 flex items-center">
                    <span className="bg-gradient-to-r from-[#6C63FF] to-[#5E60CE] bg-clip-text text-transparent">
                      Problem
                    </span>
                  </h3>
                  <h4 className="font-medium text-gray-900 mb-2">{(answer as GeminiJsonResponse).problem.title || 'No title available'}</h4>
                  <div className="text-gray-700 prose prose-sm lg:prose-base max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                    >
                      {(answer as GeminiJsonResponse).problem.statement || 'No problem statement available'}
                    </ReactMarkdown>
                  </div>
                  {(answer as GeminiJsonResponse).problem.keyConcepts && (answer as GeminiJsonResponse).problem.keyConcepts.length > 0 && (
                    <div className="mt-3">
                      <h5 className="text-sm font-semibold text-indigo-700 mb-1">Key Concepts:</h5>
                      <ul className="list-disc list-outside text-sm text-gray-600 space-y-1 ml-5">
                        {(answer as GeminiJsonResponse).problem.keyConcepts.map((concept: string, idx: number) => (
                          <li key={idx} className="pl-1">
                            <ReactMarkdown
                              remarkPlugins={[remarkMath]}
                              rehypePlugins={[rehypeKatex]}
                            >
                              {concept}
                            </ReactMarkdown>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              {/* Solution Section */}
              {(answer as GeminiJsonResponse).solution && (answer as GeminiJsonResponse).solution.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                    <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                      Step-By-Step Solution
                    </span>
                  </h3>
                  <div className="space-y-6">
                    {(answer as GeminiJsonResponse).solution.map((step: GeminiJsonResponse['solution'][0], index: number) => (
                      <div key={index} className="border-l-2 border-blue-200 pl-4 py-1">
                        <div className="font-medium text-blue-800">
                          Step {index + 1}: {step.step || 'No step description'}
                        </div>
                        {step.explanation && (
                          <div className="text-gray-700 mt-1 mb-2 prose prose-sm lg:prose-base max-w-none">
                            <ReactMarkdown
                              remarkPlugins={[remarkMath]}
                              rehypePlugins={[rehypeKatex]}
                            >
                              {step.explanation || 'No explanation provided'}
                            </ReactMarkdown>
                          </div>
                        )}
                        {step.work && (
                          <div className="bg-white p-2 rounded border border-gray-200 mt-1 prose prose-sm lg:prose-base max-w-none">
                            <ReactMarkdown
                              remarkPlugins={[remarkMath]}
                              rehypePlugins={[rehypeKatex]}
                            >
                              {step.work}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Answer Section */}
              {(answer as GeminiJsonResponse).answer && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center">
                    <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                      Answer
                    </span>
                  </h3>
                  {(answer as GeminiJsonResponse).answer.finalResult && (
                    <div className="font-medium text-gray-900 mb-1 prose prose-sm lg:prose-base max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {(answer as GeminiJsonResponse).answer.finalResult}
                      </ReactMarkdown>
                    </div>
                  )}
                  {(answer as GeminiJsonResponse).answer.verification && (
                    <div className="text-gray-700 mt-2 prose prose-sm lg:prose-base max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {(answer as GeminiJsonResponse).answer.verification}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              )}

              {/* Generate Similar Problem Button */}
              <div className="mt-6 flex flex-col items-center">
                <Button
                  onClick={() => generateSimilarProblem(answer as GeminiJsonResponse)}
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

              {/* Error display for similar problem generation */}
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

              {/* Display similar problem */}
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

                  {/* Similar Problem Content */}
                  <div className="space-y-4">
                    {/* Problem Section */}
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

                    {/* Generate another or try solving it buttons */}
                    <div className="flex gap-3 justify-center">
                      <Button
                        onClick={() => generateSimilarProblem(answer as GeminiJsonResponse)}
                        disabled={isGeneratingSimilar}
                        variant="outline"
                        className="border-purple-300 text-purple-700 hover:bg-purple-50"
                      >
                        Generate Another
                      </Button>
                      <Button
                        onClick={() => {
                          setAnswer(similarProblem);
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
            </motion.div>
          ) : answer && typeof answer === 'string' ? (
            // Fallback for plain string answers (e.g., error messages not in JSON format)
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-5 bg-red-50 border border-red-100 rounded-lg shadow-sm"
            >
              <h3 className="text-sm font-semibold text-red-700 uppercase tracking-wider mb-3">Information</h3>
              <div className="prose prose-sm lg:prose-base max-w-none text-gray-800">
                <ReactMarkdown>{answer}</ReactMarkdown>
              </div>
            </motion.div>
          ) : null}

  


  return (
    <div className="relative min-h-screen w-full flex flex-col items-center py-12 px-4 overflow-hidden">
      <ParticleBackground lightMode={true} />
      
      {/* Tab Navigation */}
      <div className="w-full max-w-3xl mx-auto mb-6 bg-white shadow-sm border border-gray-200 rounded-md overflow-hidden">
        <div className="flex">
          <button 
            onClick={() => setActiveTab('main')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium transition-colors ${activeTab === 'main' ? 
              'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            <Beaker className="w-5 h-5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">The Algebratory</span>
          </button>
          <button 
            onClick={() => setActiveTab('ask')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium transition-colors ${activeTab === 'ask' ? 
              'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            <MessageSquare className="w-5 h-5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Ask the Lab</span>
          </button>
          <button 
            onClick={() => setActiveTab('snap')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium transition-colors ${activeTab === 'snap' ? 
              'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            <Camera className="w-5 h-5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Screenshot & Solve</span>
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="mt-6 w-full max-w-3xl">
        {activeTab === 'main' && (
          <PracticeProblemGenerator
            noProblemsFound={noProblemsFound}
            setNoProblemsFound={setNoProblemsFound}
            showCompletion={showCompletion}
            problemCount={problemCount}
            showProblemSolving={showProblemSolving}
            setShowProblemSolving={setShowProblemSolving}
            subject={subject}
            setSubject={setSubject}
            topic={topic}
            setTopic={setTopic}
            isTopicDropdownOpen={isTopicDropdownOpen}
            setIsTopicDropdownOpen={setIsTopicDropdownOpen}
            comingSoonOpen={comingSoonOpen}
            setComingSoonOpen={setComingSoonOpen}
            comingSoonTopics={comingSoonTopics}
            setComingSoonTopics={setComingSoonTopics}
            difficulty={difficulty}
            handleDifficultyChange={handleDifficultyChange}
            setProblemCount={setProblemCount}
            wordProblems={wordProblems}
            setWordProblems={setWordProblems}
            setupProgress={setupProgress}
            generateProblems={generateProblems}
            isLoading={isLoading}
            isSignedIn={isSignedIn ?? false}
            currentProblem={problems[currentProblemIndex]}
            currentProblemIndex={currentProblemIndex}
            problems={problems}
            userAnswer={userAnswer}
            setUserAnswer={setUserAnswer}
            isCorrect={isCorrect}
            checkAnswer={checkAnswer}
            goToNextProblem={goToNextProblem}
            showHint={showHint}
            showNextHint={showNextHint}
            currentHintIndex={currentHintIndex}
            setShowAllSteps={setShowAllSteps}
            showAllSteps={showAllSteps}
            problemsSaved={problemsSaved}
            isSavingProblems={isSavingProblems}
            saveProblemsToSupabase={saveProblemsToSupabase}
          />
        )}
        {activeTab === 'ask' && (
          <AskTheLab
            question={question}
            setQuestion={setQuestion}
            answer={answer}
            isAskingQuestion={isAskingQuestion}
            handleAskQuestion={handleAskQuestion}
            handleGenerateSimilar={generateSimilarProblem}
            isGeneratingSimilar={isGeneratingSimilar}
            similarProblem={similarProblem}
            showSimilarProblem={showSimilarProblem}
            setShowSimilarProblem={setShowSimilarProblem}
            setSimilarProblem={setSimilarProblem}
            similarProblemError={similarProblemError}
            setSolution={setAnswer}
          />
        )}
        {activeTab === 'snap' && (
          <SnapAndSolve
            selectedImage={selectedImage}
            handleImageSelect={handleImageSelect}
            solution={solution}
            isLoadingSnap={isLoadingSnap}
            snapError={snapError}
            handleSnapSolve={handleSnapSolve}
            handleGenerateSimilar={generateSimilarProblem}
            isGeneratingSimilar={isGeneratingSimilar}
            similarProblem={similarProblem}
            showSimilarProblem={showSimilarProblem}
            setShowSimilarProblem={setShowSimilarProblem}
            setSolution={setSolution}
            setSimilarProblem={setSimilarProblem}
            similarProblemError={similarProblemError}
          />
        )}
      </div>

      {/* Coming Soon Topics Modal - Glassy, Light & Airy */}
      {comingSoonOpen && (
        <div className="fixed inset-0 bg-indigo-900/30 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-auto max-h-[80vh] overflow-hidden flex flex-col shadow-lg border border-white/20 bg-white/80 backdrop-blur-md rounded-xl">
            <CardHeader className="bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white backdrop-blur-sm border-b border-white/10">
              <CardTitle className="flex items-center gap-2 text-white">
                <span>Coming Soon to {comingSoonTopics.subject}</span>
              </CardTitle>
              <p className="text-white/90 text-sm mt-1">We're working on adding these exciting topics!</p>
            </CardHeader>
            <CardContent className="overflow-y-auto flex-grow bg-transparent">
              <div className="space-y-4 py-2">
                {comingSoonTopics.topics.length > 0 ? (
                  <ul className="space-y-1">
                    {comingSoonTopics.topics.map((topic, index) => (
                      <li key={index} className="flex items-start gap-2 p-2 rounded-lg hover:bg-white/70 transition-all duration-200">
                        <div className="mt-0.5 text-indigo-500">
                          <ChevronRight className="h-4 w-4" />
                        </div>
                        <span className="text-indigo-900/80 font-medium">{topic}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-indigo-600/70 italic">No upcoming topics to display.</p>
                )}
              </div>
            </CardContent>
            <div className="p-4 border-t border-indigo-100/30 flex justify-end bg-transparent">
              <Button 
                onClick={() => setComingSoonOpen(false)}
                className="bg-gradient-to-r from-[#6C63FF]/90 to-[#5E60CE]/90 text-white hover:opacity-100 hover:shadow-md font-medium px-6 backdrop-blur-sm transition-all duration-300 border border-white/20"
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
          <SimpleLoadingIndicator />
        </div>
      )}
    </div>
  );
}
