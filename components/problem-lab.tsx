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
import { availableTopics, availableTopicsBySubject } from '@/lib/available-topics';
import { useSimilarProblem } from '@/hooks/useSimilarProblem';
import { useRouter } from 'next/navigation';

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

  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [comingSoonTopics, setComingSoonTopics] = useState<{subject: string, topics: string[]}>({subject: '', topics: []});
  
  const [noProblemsFound, setNoProblemsFound] = useState(false);
  
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

  // Handle difficulty change
  const handleDifficultyChange = (value: Difficulty) => {
    setDifficulty(value);
  };
  
  const router = useRouter();

  // Function to generate problems from the backend
  const handleGenerateProblems = async () => {
    if (!topic) {
      alert('Please select a topic first.');
      return;
    }

    setIsLoading(true);

    try {
      const fetchedProblems = await getFilteredProblems({
        subject: subjects[subject].name, // Pass the display name, e.g., 'Pre-Algebra'
        topic: topic,
        difficulty: difficulty,
        limit: 1, // Always fetch one problem for practice
      });

      if (fetchedProblems.length > 0) {
        const problemId = fetchedProblems[0].id;
        router.push(`/practice/${problemId}`);
      } else {
        setNoProblemsFound(true);
      }
    } catch (error) {
      console.error('Error generating problems:', error);
      alert('Failed to generate problems. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  

  
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

  // Premium indicator component
  const PremiumIndicator = () => (
    <Sparkles className="w-3 h-3 text-yellow-400 inline ml-1" />
  );
  
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
            <span className="hidden sm:inline">The Practice Hub</span>
          </button>
          <button 
            onClick={() => setActiveTab('ask')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium transition-colors ${activeTab === 'ask' ? 
              'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            <MessageSquare className="w-5 h-5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Ask the Lab AI</span><Sparkles className="w-3 h-3 text-yellow-400 ml-1" />
          </button>
          <button 
            onClick={() => setActiveTab('snap')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium transition-colors ${activeTab === 'snap' ? 
              'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            <Camera className="w-5 h-5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Snap and Solve AI</span><Sparkles className="w-3 h-3 text-yellow-400 ml-1" />
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="mt-6 w-full max-w-3xl">
        {activeTab === 'main' && (
          <PracticeProblemGenerator
            noProblemsFound={noProblemsFound}
            setNoProblemsFound={setNoProblemsFound}
            problemCount={problemCount}
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
            generateProblems={handleGenerateProblems}
            isLoading={isLoading}
            isSignedIn={isSignedIn ?? false}
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
