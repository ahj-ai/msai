'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Problem, Difficulty } from '@/types/math'
import { FlaskConical, Sparkles, CheckCircle, Beaker, TestTube, HelpCircle, ArrowLeft, ArrowRight, Check, X, MessageSquare, Camera, Brain, ChevronRight, Send, Loader2, AlertCircle, PenTool, Eye, Save, Book } from 'lucide-react'
import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import { getFilteredProblems, getAllTopics, getAllSubjects } from '@/lib/problems'
import { saveUserProblems, getUserProblems } from '@/lib/supabase'
import LatexKeyboard from './latex-keyboard'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { generateProblem } from "@/lib/generate-problem"
import { ParticleBackground } from "@/components/particle-background"
import { ImageUpload } from "@/components/image-upload"
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'; 

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

// Define subjects and topics
const subjects = {
  "pre-algebra": {
    name: "Pre-Algebra",
    available: true,
    topicGroups: {
      "Foundational Number Skills 🧱": [
        "Decimal Place Value Mastery",
        "Rounding with Confidence"
      ],
      "Arithmetic Operations 🔢": [
        "Adding and Subtracting Integers",
        "Multiplying and Dividing Integers",
        "Adding and Subtracting Decimals",
        "Multiplying & Dividing Decimals",
        "Fractions Operations",
        "Mixed Number Operations",
        "Converting Fractions 🤝 Decimals",
        "Order of Operations"
      ],
      "Number Theory Unlocked 🔑": [
        "Fractions 🤝 Percents",
        "Decimals 🤝 Percents",
        "Divisibility Rules & Factors",
        "Prime Factorization Power",
        "Finding GCF (Greatest Common Factor)",
        "Nailing LCM (Least Common Multiple)"
      ],
      "Expressions & Variables 🚀": [
        "The Language of Algebra: Variables & Verbal Expressions (Words to Algebra)",
        "Evaluating Variable Expressions",
        "The Distributive Property in Action",
        "Simplifying by Combining Like Terms"
      ],
      "Equations & Inequalities 💡": [
        "One-Step Equations (Integers, Decimals, Fractions)",
        "Two-Step Equations (Integers, Decimals)",
        "Tackling Multi-Step Equations",
        "Real-World Equation Challenges: One-Step & Two-Step Word Problems"
      ],
      "Exponents, Sci-No & Roots ⚡": [
        "Exponent Expertise: Multiplication & Division Properties",
        "Powers of Products & Quotients",
        "Big & Small: Scientific Notation",
        "Root Camp: Understanding Square Root"
      ],
      "Real-World Ratios: Proportions & Percentages 🎯": [
        "Master Conversions: Percents ↔ Fractions ↔ Decimals",
        "Ratios & Proportions: Understanding & Solving Proportions",
        "Proportion Word Problems: Real-Life Applications",
        "Scaling Up: Similar Figures & Word Problems",
        "Straightforward Percent Problems",
        "Calculating Percent Change",
        "Markup, Discount, & Tax (Easy & Hard Scenarios)",
        "Simple & Compound Interest"
      ],
      "Lines & Systems 📈": [
        "Finding Slope (points, equations)",
        "Writing Linear Equations",
        "Systems of Equations: Solve by Substitution",
        "System of Equations: Solve by Elimination",
        "Systems Word Problems"
      ],
      "Polynomial Powerhouse 🧱": [
        "Factoring Monomials (Advanced)",
        "Adding & Subtracting Polynomials",
        "Multiplying Polynomials by Monomials",
        "Multiplying Binomials (FOIL & Beyond)"
      ]
    }
  },
  "algebra-1": {
    name: "Algebra I",
    available: true,
    topicGroups: {
      "🔢 Foundations & Arithmetic": [
        "Order of Operations",
        "Evaluating Expressions",
        "Simplifying Variable Expressions",
        "Distributive Property",
        "Absolute Value",
        "One-Step Equations",
        "One-Step Equation Word Problems",
        "Two-Step & Multi-Step Equations"
      ],
      "📏 Equations & More": [
        "Absolute Value Equations",
        "Literal Equations"
      ],
      "⚖️ Inequalities & Applications": [
        "One-Step, Two-Step, Multi-Step Inequalities",
        "Compound & Absolute Value Inequalities",
        "Word Problems with Inequalities",
        "Graphing Single-Variable Inequalities"
      ],
      "📈 Linear Equations & Inequalities": [
        "Finding Slope",
        "Graphing: Slope-Intercept, Standard Form, Absolute Value Equations",
        "Writing Linear Equations",
        "Graphing Linear Inequalities"
      ],
      "🔗 Systems of Equations & Inequalities": [
        "Solving by Graphing",
        "Solving Substitution",
        "Solving Elimination",
        "Systems Word Problems",
        "Graphing Systems of Inequalities"
      ],
      "🔢 Exponents & Radicals": [
        "Properties of Exponents",
        "Scientific Notation",
        "Square Roots",
        "Radical Expressions: Simplify, Add/Subtract, Multiply, Divide",
        "Solving Radical Equations",
        "Pythagorean Theorem",
      ],
      "🌐 Word Problems": [
        "Word Problems"
      ]
    }
  },
  "algebra-2": {
    name: "Algebra II",
    available: true,
    topicGroups: {
      "📊 Functions": [
        "Function notation and evaluation",
        "Domain and range",
        "Function composition",
        "Inverse functions",
        "Even and odd functions",
        "Function transformations (translations, reflections, stretches, compressions)"
      ],
      "🎪 Quadratic Functions": [
        "Quadratic Functions: Standard form",
        "Quadratic Functions: Vertex form",
        "Quadratic Functions: Factored form",
        "Quadratic formula and discriminant",
        "Applications and word problems"
      ],
      "📐 Linear Equations": [
        "Slope-intercept and point-slope forms",
        "Parallel and perpendicular lines"
      ],
      "📏 Absolute Value": [
        "Absolute value functions and equations"
      ],
      "🔢 Systems of Equations": [
        "Systems of linear equations: substitution",
        "Systems of linear equations: elimination"
      ],
      "🔄 Sequences and Series": [
        "Arithmetic sequences and series",
        "Geometric sequences and series",
        "Infinite geometric series",
        "Sigma notation"
      ]
    }
  }
};

// List of difficulty levels
const difficulties: Difficulty[] = ['Regular', 'Challenging', 'Advanced'];

// Topics that can have word problems
const wordProblemTopics = [
  "Word Problems",
  "Word Problems with Inequalities",
  "One-Step Equation Word Problems",
  "Related Rates (word problems)",
];

// Button component for selecting the number of problems
const ProblemCountButton = ({ count, selected, onClick }: { count: number; selected: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-9 h-9 rounded-md flex items-center justify-center transition-colors duration-200 ${
      selected
        ? 'bg-indigo-600 text-white shadow-sm'
        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
    }`}
  >
    {count}
  </button>
);

// Test tube component that shows experiment progress
const TestTubeMeter = ({ progress }: { progress: number }) => {
  const isFull = progress >= 100;
  return (
    <div className="relative w-10 h-28 bg-gray-50 rounded-b-md border border-gray-200 overflow-hidden shadow-sm">
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-1000" 
           style={{ height: `${progress}%` }} />
      
      {/* Enhanced bubbles animation when test tube is full */}
      {isFull && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Larger, more visible bubbles */}
          <div className="absolute bottom-2 left-1/4 w-2 h-2 rounded-full bg-white/90 animate-bubble-1"></div>
          <div className="absolute bottom-4 left-2/3 w-3 h-3 rounded-full bg-white/80 animate-bubble-2"></div>
          <div className="absolute bottom-6 left-1/3 w-2 h-2 rounded-full bg-white/90 animate-bubble-3"></div>
          {/* Add more bubbles for better effect */}
          <div className="absolute bottom-3 right-1/4 w-1.5 h-1.5 rounded-full bg-white/85 animate-bubble-1" style={{ animationDelay: '0.3s' }}></div>
          <div className="absolute bottom-8 left-1/5 w-2 h-2 rounded-full bg-white/75 animate-bubble-2" style={{ animationDelay: '0.7s' }}></div>
        </div>
      )}
      
      <div className="absolute inset-0 flex items-center justify-center">
        <TestTube className="w-6 h-24 text-gray-300 opacity-30" />
      </div>
      <div className="absolute bottom-1 left-0 right-0 text-center text-xs font-medium text-white">
        {Math.round(progress)}%
      </div>
    </div>
  );
};

// Tab type definition
type ProblemLabTab = 'main' | 'ask' | 'snap';

export function ProblemLab() {
  // Active tab state
  const [activeTab, setActiveTab] = useState<ProblemLabTab>('main');
  
  // Setup states
  const [subject, setSubject] = useState<keyof typeof subjects>("pre-algebra");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>('Regular');
  const [wordProblems, setWordProblems] = useState(false);
  const [problemCount, setProblemCount] = useState(1);
  
  // User authentication and saved problems states
  const { isSignedIn, userId } = useAuth();
  const [savedProblems, setSavedProblems] = useState<Problem[]>([]);
  const [showSavedProblems, setShowSavedProblems] = useState(false);
  const [isSavingProblems, setIsSavingProblems] = useState(false);
  const [problemsSaved, setProblemsSaved] = useState(false);
  
  // States for dynamic topics and subjects
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  
  // Ask the Lab states
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);
  const questionTextareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Snap & Solve states
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [solution, setSolution] = useState<string | null>(null);
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
  
  // Problem states
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [showProblemSolving, setShowProblemSolving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [showAllSteps, setShowAllSteps] = useState(false);
  const [noProblemsFound, setNoProblemsFound] = useState(false);
  
  // Answer states
  const [userAnswer, setUserAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // Track experiment setup progress
  const [setupProgress, setSetupProgress] = useState(0);
  
  // Handle image selection for Snap & Solve
  const handleImageSelect = (file: File | null) => {
    setSelectedImage(file);
    setSolution(null); // Clear previous solution
    setSnapError(null); // Clear previous error
  };

  // Handle Snap & Solve submission
  const handleSnapSolve = async () => {
    if (!selectedImage) {
      setSnapError("Please select an image first.");
      return;
    }

    setIsLoadingSnap(true);
    setSnapError(null);
    setSolution(null);

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await fetch('/api/solve-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      setSolution(result.solution);
    } catch (error) {
      console.error("Snap & Solve error:", error);
      if (error instanceof Error) {
        setSnapError(error.message);
      } else {
        setSnapError("An unknown error occurred while solving the problem.");
      }
    } finally {
      setIsLoadingSnap(false);
    }
  };
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
  const handleDifficultyChange = (value: string) => {
    setDifficulty(value as Difficulty);
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
        subject: subjectName,
        topic: topic,
        difficulty: difficulty,
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

  // Handle asking a question
  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    
    setIsAskingQuestion(true);
    setAnswer(null);
    
    try {
      // Call the Gemini API endpoint
      const response = await fetch('/api/ask-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setAnswer(data.answer);
      } else {
        console.error('Error from API:', data.error);
        setAnswer(`Sorry, there was an error processing your question: ${data.error}`);
      }
    } catch (error) {
      console.error('Error asking question:', error);
      setAnswer('Sorry, there was an error processing your question. Please try again.');
    } finally {
      setIsAskingQuestion(false);
    }
  };
  
  // Component for the Ask Lab tab
  const AskLabTab = () => (
    <Card className="w-full max-w-3xl mx-auto bg-white/90 backdrop-blur-sm border border-indigo-100 shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 pb-6">
        <CardTitle className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <MessageSquare className="w-8 h-8" />
          Ask the Lab
        </CardTitle>
        <p className="text-indigo-100 mt-2">Get instant help with any math question</p>
      </CardHeader>
      <CardContent className="p-8 pt-6 bg-white">
        <div className="space-y-6">
          <div className="pb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">What math problem can I help you with?</h3>
            <div className="space-y-2">
              <div className="relative">
                <textarea 
                  ref={questionTextareaRef}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full h-32 p-4 pr-12 border border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 text-gray-700"
                  placeholder="Type your math question here. For example: How do I solve the quadratic equation x² + 5x + 6 = 0?"
                />
                <Button 
                  className="absolute bottom-3 right-3 w-8 h-8 p-0 flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleAskQuestion}
                  disabled={isAskingQuestion || !question.trim()}
                >
                  {isAskingQuestion ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-white" />
                  )}
                </Button>
              </div>
              
              {/* Label and hint for LaTeX keyboard */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-indigo-500 font-medium flex items-center gap-1">
                  <span>Need to write math expressions?</span>
                  <span className="inline-block animate-bounce">👇</span>
                </div>
              </div>
              
              {/* LaTeX Keyboard */}
              <LatexKeyboard onInsert={handleInsertLaTeX} />
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-base font-medium text-gray-700 mb-4">Examples you can ask:</h3>
            <div className="space-y-3">
              {[
                "How do I find the derivative of f(x) = x³ + 2x² - 4x + 7?",
                "Explain the concept of standard deviation with an example.",
                "What's the difference between permutation and combination?"
              ].map((example, index) => (
                <Button 
                  key={index}
                  variant="outline" 
                  className="w-full justify-between text-left font-normal border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                  onClick={() => {
                    setQuestion(example);
                    if (questionTextareaRef.current) {
                      questionTextareaRef.current.focus();
                    }
                  }}
                >
                  <span>{example}</span>
                  <ChevronRight className="w-4 h-4 text-indigo-400" />
                </Button>
              ))}
            </div>
          </div>
          
          {/* Display answer with sections */}
          {answer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 space-y-6"
            >
              {/* Problem Section */}
              <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-lg shadow-sm">
                <h3 className="text-sm font-semibold text-indigo-700 uppercase tracking-wider mb-3">Problem</h3>
                <div className="prose prose-sm lg:prose-base max-w-none text-gray-800 bg-white rounded-md p-4 shadow-xs">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      h3: ({node, ...props}) => {
                        // Hide the original '### Problem' heading
                        const content = Array.isArray(props.children) && props.children.length > 0 ? 
                          String(props.children[0]) : '';
                        return content === 'Problem' ? null : <h3 {...props} />
                      },
                      // Only show content until the next '### Step-By-Step Solution' heading
                      p: ({node, ...props}) => {
                        const content = props.children ? String(props.children) : '';
                        if (content.includes('### Step-By-Step Solution')) {
                          return null;
                        }
                        return <p {...props} />;
                      }
                    }}
                  >
                    {typeof answer === 'string' ? answer.split('### Step-By-Step Solution')[0] : ''}
                  </ReactMarkdown>
                </div>
              </div>
              
              {/* Solution Section */}
              <div className="p-5 bg-blue-50 border border-blue-100 rounded-lg shadow-sm">
                <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-3">Step-By-Step Solution</h3>
                <div className="prose prose-sm lg:prose-base max-w-none text-gray-800 bg-white rounded-md p-4 shadow-xs">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      h3: ({node, ...props}) => {
                        // Hide the original '### Step-By-Step Solution' heading
                        const content = Array.isArray(props.children) && props.children.length > 0 ? 
                          String(props.children[0]) : '';
                        return content === 'Step-By-Step Solution' ? null : <h3 {...props} />
                      }
                    }}
                  >
                    {typeof answer === 'string' ? 
                      answer.includes('### Step-By-Step Solution') ? 
                        answer.split('### Step-By-Step Solution')[1]?.split('### Answer')[0] || '' : 
                        '' : 
                      ''}
                  </ReactMarkdown>
                </div>
              </div>
              
              {/* Answer Section */}
              <div className="p-5 bg-green-50 border border-green-100 rounded-lg shadow-sm">
                <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wider mb-3">Answer</h3>
                <div className="prose prose-sm lg:prose-base max-w-none text-gray-800 bg-white rounded-md p-4 shadow-xs">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      h3: ({node, ...props}) => {
                        // Hide the original '### Answer' heading
                        const content = Array.isArray(props.children) && props.children.length > 0 ? 
                          String(props.children[0]) : '';
                        return content === 'Answer' ? null : <h3 {...props} />
                      }
                    }}
                  >
                    {typeof answer === 'string' ? 
                      answer.includes('### Answer') ? 
                        answer.split('### Answer')[1] || '' : 
                        '' : 
                      ''}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
  
  // Component for the Screenshot & Solve tab
  const ScreenshotSolveTab = () => (
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
          {/* Image upload component */}
          <div className="w-full">
            <ImageUpload onImageSelect={handleImageSelect} currentImage={selectedImage} />
          </div>

          {snapError && (
            <div className="flex items-center p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm">{snapError}</span>
            </div>
          )}

          <Button
            onClick={handleSnapSolve}
            disabled={!selectedImage || isLoadingSnap}
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-base tracking-wide rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoadingSnap ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Solving...
              </>
            ) : (
              <>
                Solve with Gemini <Send className="w-4 h-4" />
              </>
            )}
          </Button>

          {solution && !isLoadingSnap && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 space-y-6"
            >
              {/* Problem Section */}
              <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-lg shadow-sm">
                <h3 className="text-sm font-semibold text-indigo-700 uppercase tracking-wider mb-3">Problem</h3>
                <div className="prose prose-sm lg:prose-base max-w-none text-gray-800 bg-white rounded-md p-4 shadow-xs">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      h3: ({node, ...props}) => {
                        // Hide the original '### Problem' heading
                        const content = Array.isArray(props.children) && props.children.length > 0 ? 
                          String(props.children[0]) : '';
                        return content === 'Problem' ? null : <h3 {...props} />
                      },
                      // Only show content until the next '### Step-By-Step Solution' heading
                      p: ({node, ...props}) => {
                        const content = props.children ? String(props.children) : '';
                        if (content.includes('### Step-By-Step Solution')) {
                          return null;
                        }
                        return <p {...props} />;
                      }
                    }}
                  >
                    {typeof solution === 'string' ? solution.split('### Step-By-Step Solution')[0] : ''}
                  </ReactMarkdown>
                </div>
              </div>
              
              {/* Solution Section */}
              <div className="p-5 bg-blue-50 border border-blue-100 rounded-lg shadow-sm">
                <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-3">Step-By-Step Solution</h3>
                <div className="prose prose-sm lg:prose-base max-w-none text-gray-800 bg-white rounded-md p-4 shadow-xs">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      h3: ({node, ...props}) => {
                        // Hide the original '### Step-By-Step Solution' heading
                        const content = Array.isArray(props.children) && props.children.length > 0 ? 
                          String(props.children[0]) : '';
                        return content === 'Step-By-Step Solution' ? null : <h3 {...props} />
                      }
                    }}
                  >
                    {typeof solution === 'string' ? 
                      solution.includes('### Step-By-Step Solution') ? 
                        solution.split('### Step-By-Step Solution')[1]?.split('### Answer')[0] || '' : 
                        '' : 
                      ''}
                  </ReactMarkdown>
                </div>
              </div>
              
              {/* Answer Section */}
              <div className="p-5 bg-green-50 border border-green-100 rounded-lg shadow-sm">
                <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wider mb-3">Answer</h3>
                <div className="prose prose-sm lg:prose-base max-w-none text-gray-800 bg-white rounded-md p-4 shadow-xs">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      h3: ({node, ...props}) => {
                        // Hide the original '### Answer' heading
                        const content = Array.isArray(props.children) && props.children.length > 0 ? 
                          String(props.children[0]) : '';
                        return content === 'Answer' ? null : <h3 {...props} />
                      }
                    }}
                  >
                    {typeof solution === 'string' ? 
                      solution.includes('### Answer') ? 
                        solution.split('### Answer')[1] || '' : 
                        '' : 
                      ''}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
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
            <Beaker className="w-4 h-4" />
            The Algebratory
          </button>
          <button 
            onClick={() => setActiveTab('ask')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium transition-colors ${activeTab === 'ask' ? 
              'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            <MessageSquare className="w-4 h-4" />
            Ask the Lab
          </button>
          <button 
            onClick={() => setActiveTab('snap')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium transition-colors ${activeTab === 'snap' ? 
              'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            <Camera className="w-4 h-4" />
            Screenshot & Solve
          </button>
        </div>
      </div>
      
      {/* Render content based on selected tab */}
      {activeTab === 'ask' ? (
        <AskLabTab />
      ) : activeTab === 'snap' ? (
        <ScreenshotSolveTab />
      ) : (
        /* Main Problem Lab Content - Original content */
        <>
          {noProblemsFound && (
        <motion.div
          key="no-problems"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center bg-white/95 backdrop-blur-sm"
        >
          <div className="mb-6">
            <FlaskConical className="w-16 h-16 text-indigo-300 mx-auto mb-3" />
          </div>
          <h2 className="text-xl font-bold text-indigo-600 mb-3">No Problems Available Yet</h2>
          <p className="text-gray-700 max-w-md mb-4 text-sm">
            We don't have any problems for this specific combination of subject, topic, and difficulty level in our database yet.
          </p>
          <p className="text-gray-500 max-w-md mb-6 text-sm">
            Try selecting a different topic or difficulty level, or check back later as we continue to add more problems.
          </p>
          <Button
            onClick={() => {
              setNoProblemsFound(false);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-sm h-9 px-4"
          >
            Back to Setup
          </Button>
        </motion.div>
      )}
      
      {/* Completion Message */}
      <AnimatePresence>
        {showCompletion && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-green-50 border border-green-200 text-green-700 px-5 py-2.5 rounded-md shadow-sm z-50 flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="font-medium text-sm">Experiment complete! All {problemCount} problems solved!</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!showProblemSolving ? (
        <Card className="w-full max-w-3xl mx-auto bg-white shadow-md border border-gray-100 rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 pb-5">
            <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-3">
              <FlaskConical className="w-7 h-7" />
              The Algebratory
            </CardTitle>
            <p className="text-indigo-100 mt-1">Hypothesis: You'll get better with practice. Let's test it.</p>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Subject</Label>
                  <Select 
                    value={subject} 
                    onValueChange={(value: keyof typeof subjects) => setSubject(value as keyof typeof subjects)}
                  >
                    <SelectTrigger className="mt-2 bg-white border border-gray-200 text-gray-800 h-10 hover:bg-gray-50 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-150">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-md">
                      {Object.entries(subjects).map(([key, { name, available }]) => (
                        <SelectItem 
                          key={key} 
                          value={key} 
                          disabled={!available}
                          className={`${available ? 'text-gray-800 hover:bg-indigo-50 hover:text-indigo-700' : 'text-gray-400 cursor-not-allowed'} transition-colors duration-150`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{name}</span>
                            {!available && (
                              <span className="ml-2 text-xs text-amber-600">Coming Soon</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Topic</Label>
                  <Select value={topic} onValueChange={setTopic}>
                    <SelectTrigger className="mt-2 bg-white border border-gray-200 text-gray-800 h-10 hover:bg-gray-50 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors">
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-md max-h-80">
                      {Object.entries(subjects[subject].topicGroups).map(([groupName, topics]) => (
                        <div key={groupName}>
                          <div className="px-2 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50/70 sticky top-0 z-10">
                            {groupName}
                          </div>
                              {(topics as string[]).map((t) => (
                                <SelectItem 
                                  key={t} 
                                  value={t} 
                                  className="text-gray-700 pl-4 hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-150"
                                >
                                  {t}
                                </SelectItem>
                              ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Difficulty</Label>
                  <Select value={difficulty} onValueChange={handleDifficultyChange}>
                    <SelectTrigger className="mt-2 bg-white border border-gray-200 text-gray-800 h-10 hover:bg-gray-50 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-150">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-md">
                      {difficulties.map((diff) => (
                        <SelectItem 
                          key={diff} 
                          value={diff} 
                          className="text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-150"
                        >
                          {diff}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700">Number of Problems</Label>
                  <div className="mt-2 flex items-center justify-between px-1">
                    {[1, 2, 3, 4, 5].map((count) => (
                      <ProblemCountButton
                        key={count}
                        count={count}
                        selected={problemCount === count}
                        onClick={() => setProblemCount(count)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {wordProblemTopics.includes(topic) && (
                <div className="mt-2">
                  <Checkbox
                    id="word-problems"
                    checked={wordProblems}
                    onCheckedChange={(checked: boolean) => setWordProblems(checked)}
                    className="mr-2"
                  />
                  <Label 
                    htmlFor="word-problems" 
                    className="text-sm font-medium text-gray-700"
                  >
                    Include word problems
                  </Label>
                </div>
              )}

              <div className="pt-2">
                <div className="mb-4 flex items-center gap-4">
                  <TestTubeMeter progress={setupProgress} />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span className="font-medium">Experiment Setup</span>
                      <span className="font-semibold text-indigo-600">{setupProgress}% complete</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <motion.div 
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${setupProgress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={generateProblems}
                    disabled={!topic || isLoading || setupProgress < 100}
                    className="h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm tracking-wide rounded-md transition-all duration-200 shadow-sm w-full flex items-center justify-center gap-2 group relative overflow-hidden"
                  >
                    {isLoading ? (
                      <motion.div
                        className="absolute inset-0 bg-indigo-500"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    ) : setupProgress < 100 ? (
                      <>
                        Complete setup first
                        <span className="inline-block w-5 h-5 rounded-full border-2 border-white/50 flex items-center justify-center">
                          <HelpCircle className="w-3 h-3" />
                        </span>
                      </>
                    ) : (
                      <>
                        Generate Problem
                        <span className="inline-block w-5 h-5 rounded-full border-2 border-white/50 flex items-center justify-center group-hover:border-white group-hover:scale-110 transition-all duration-300">
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </>
                    )}
                  </Button>
                </div>
                {isSignedIn && (
                  <div className="mt-4">
                    <Link href="/dashboard">
                      <Button
                        variant="outline"
                        className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 flex items-center justify-center gap-2"
                      >
                        <Book className="w-4 h-4" />
                        View Saved Problems
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
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
                      <span className="font-medium mr-2">{currentProblem.subject || subject}:</span>
                      <span>{currentProblem.topic || topic}</span>
                    </div>
                  </div>
                  <Button variant="ghost" className="text-white hover:bg-indigo-700" onClick={() => setShowProblemSolving(false)}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Lab
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-8 pt-6 bg-white">
                <div className="mb-8 rounded-lg bg-gray-50 border border-gray-100 p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-3">Problem</h3>
                  <div className="whitespace-pre-wrap text-lg font-medium text-gray-800">
                    <ReactMarkdown
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                    >
                      {currentProblem.question}
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
                  
                  {/* Hints & Stumped Section */}
                  <div className="mt-6 border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Need a hint?</span>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={showNextHint}
                          disabled={!currentProblem?.hints || currentHintIndex >= (currentProblem.hints.length - 1)}
                          className="text-xs px-3 py-1"
                        >
                          {showHint ? 'Next Hint' : 'Show Hint'}
                        </Button>
                      </div>
                    </div>
                    {showHint && currentProblem.hints && currentProblem.hints.length > 0 && (
                      <div className="bg-amber-50 border border-amber-100 rounded-md p-2 text-amber-800 text-sm">
                        <p>{currentProblem.hints[currentHintIndex]}</p>
                        <div className="mt-2 flex justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowAllSteps(true)}
                            className="text-xs px-3 py-1 flex items-center gap-1"
                            disabled={showAllSteps}
                          >
                            <span className="inline-block"><HelpCircle className="w-4 h-4 text-indigo-600" /></span>
                            I'm stumped
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Solution Steps (shown when correct or stumped) */}
                  {(isCorrect || showAllSteps) && currentProblem.solutionSteps && (
                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Check className="w-4 h-4" /> Solution Steps
                      </h3>
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <ol className="list-decimal pl-5 space-y-4">
                          {currentProblem.solutionSteps.map((step, index) => (
                            <li key={index} className="text-gray-700 text-base">
                              <div className="bg-white p-3 rounded-md shadow-xs">
                                <ReactMarkdown
                                  remarkPlugins={[remarkMath]}
                                  rehypePlugins={[rehypeKatex]}
                                >
                                  {step}
                                </ReactMarkdown>
                              </div>
                            </li>
                          ))}
                        </ol>
                      </div>
                      
                      {/* Save button for signed-in users */}
                      {isSignedIn && !problemsSaved && (
                        <div className="mt-4 flex justify-end">
                          <Button
                            onClick={saveProblemsToSupabase}
                            disabled={isSavingProblems}
                            variant="outline"
                            className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 flex items-center gap-2"
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
                      
                      {/* Success message after saving */}
                      {problemsSaved && (
                        <div className="mt-4 p-2 bg-green-50 border border-green-100 rounded text-green-700 text-sm flex items-center gap-2">
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
      )}

      {/* Coming Soon Modal */}
      {comingSoonOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This feature is currently under development and will be available soon!</p>
            </CardContent>
            <div className="p-4 flex justify-end">
              <Button onClick={() => setComingSoonOpen(false)}>Close</Button>
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
        </>
      )}
    </div>
  );
}
