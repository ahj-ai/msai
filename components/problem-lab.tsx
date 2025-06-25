'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Problem, Difficulty } from '@/types/math'
import { FlaskConical, Sparkles, CheckCircle, Beaker, TestTube, HelpCircle, ArrowLeft, ArrowRight, Check, X, MessageSquare, Camera, Brain, ChevronRight, Send, Loader2, AlertCircle, PenTool, Eye, Save, Book, Coins } from 'lucide-react'

// Interface for the structured JSON response from Gemini API
interface GeminiJsonResponse {
  problem: {
    title: string;
    statement: string;
    keyConcepts: string[];
  };
  solution: Array<{
    step: string;
    explanation: string;
    work: string;
  }>;
  answer: {
    finalResult: string;
    verification: string;
  };
}
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
import { GeminiJsonResponse } from '@/lib/gemini/parse-json-response';
import MathInput from './math-input';
import { generateProblem } from "@/lib/generate-problem"
import { ParticleBackground } from "@/components/particle-background"
import { ImageUpload } from "@/components/image-upload"

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { ensureLatexDelimiters } from "@/utils/format-latex";

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
        "Decimal Place Value Mastery"
      ],
      "Number Theory Unlocked 🔑": [
        "Decimals 🤝 Percents",
        "Divisibility Rules & Factors",
        "Finding GCF (Greatest Common Factor)"
      ],
      "Expressions & Variables 🚀": [
        "Evaluating Variable Expressions"
      ],
      "Equations & Inequalities 💡": [
        "One-Step Equations (Integers, Decimals, Fractions)",
        "Two-Step Equations (Integers, Decimals)",
        "Tackling Multi-Step Equations"
      ],
      "Exponents, Sci-No & Roots ⚡": [
        "Exponent Expertise: Multiplication & Division Properties",
        "Powers of Products & Quotients",
        "Big & Small: Scientific Notation"
      ],
      "🔜 Coming Soon": [
        "Rounding with Confidence",
        "Adding and Subtracting Integers",
        "Multiplying and Dividing Integers",
        "Adding and Subtracting Decimals",
        "Multiplying & Dividing Decimals",
        "Fractions Operations",
        "Mixed Number Operations",
        "Converting Fractions 🤝 Decimals",
        "Order of Operations",
        "Fractions 🤝 Percents",
        "Prime Factorization Power",
        "Nailing LCM (Least Common Multiple)",
        "The Language of Algebra: Variables & Verbal Expressions (Words to Algebra)",
        "The Distributive Property in Action",
        "Simplifying by Combining Like Terms",
        "Real-World Equation Challenges: One-Step & Two-Step Word Problems",
        "Root Camp: Understanding Square Root",
        "Ratio & Rate Fundamentals",
        "Proportional Relationships",
        "Unit Rate & Unit Price",
        "Percent Increase & Decrease",
        "Simple Interest",
        "Angle Relationships",
        "Perimeter & Area: Rectangles, Triangles, Circles",
        "Volume & Surface Area: Prisms & Cylinders",
        "The Coordinate Plane",
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
        "Distributive Property",
        "Absolute Value",
        "Decimals: Add, Subtract",
        "Decimals: Multiply, Divide"
      ],
      "📐 Equations": [
        "Two-Step & Multi-Step Equations",
        "Absolute Value Equations"
      ],
      "⚖️ Inequalities": [
        "One-Step, Two-Step, Multi-Step Inequalities",
        "Compound & Absolute Value Inequalities",
        "Word Problems with Inequalities"
      ],
      "📈 Linear Equations": [
        "Writing Linear Equations"
      ],
      "🔗 Systems of Equations": [
        "Solving by Graphing",
        "Solving Substitution",
        "Solving Elimination"
      ],
      "🔢 Exponents & Radicals": [
        "Properties of Exponents",
        "Scientific Notation",
        "Square Roots",
        "Radical Expressions: Simplify, Add/Subtract, Multiply, Divide",
        "Solving Radical Equations",
        "Pythagorean Theorem"
      ],
      "🔜 Coming Soon": [
        "Order of Operations",
        "Evaluating Expressions",
        "Simplifying Variable Expressions",
        "Integers: Add and Subtract",
        "Integers: Multiply, Divide",
        "Fractions & Mixed Numbers: Add, Subtract",
        "One-Step Equations",
        "One-Step Equation Word Problems",
        "Literal Equations",
        "Finding Slope",
        "Systems of Equations Word Problems",
        "Word Problems",
        "Graphing: Slope-Intercept, Standard Form, Absolute Value Equations",
        "Graphing Linear Inequalities",
        "Graphing Single-Variable Inequalities",
        "Graphing Systems of Inequalities"
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
        "Even and odd functions"
      ],
      "🎪 Quadratic Functions": [
        "Solving quadratic equations by factoring",
        "Completing the square",
        "Quadratic formula and discriminant",
        "Quadratic Functions: Standard form",
        "Quadratic Functions: Factored form",
        "Applications and word problems",
        "Absolute value functions and equations"
      ],
      "📐 Linear Equations": [
        "Slope-intercept and point-slope forms",
        "Parallel and perpendicular lines",
        "Systems of linear equations: substitution",
        "Systems of linear equations: elimination"
      ],
      "🔄 Sequences and Series": [
        "Arithmetic sequences and series",
        "Geometric sequences and series",
        "Infinite geometric series",
        "Sigma notation"
      ],
      "🔜 Coming Soon": [
        "Quadratic Functions: Vertex form",
        "Function transformations (translations, reflections, stretches, compressions)",
        "Factoring: Difference of Squares",
        "Factoring: GCF",
        "Factoring: Grouping",
        "Factoring: Sum/Difference of Cubes",
        "Factoring: Trinomials (a=1)",
        "Factoring: Trinomials (a>1)",
        "Graphing linear inequalities",
        "Logarithmic Functions",
        "Properties of Logarithms",
        "Solving Exponential Equations",
        "Solving Logarithmic Equations"
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

// Props for the AskLabTab component
interface AskLabTabProps {
  question: string;
  setQuestion: (value: string) => void;
  handleAskQuestion: () => void;
  isAskingQuestion: boolean;
  answer: string | GeminiJsonResponse | null;
}

// Component for the Ask Lab tab, now extracted as a standalone component
const AskLabTab: React.FC<AskLabTabProps> = ({
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
  
  // New state for similar problem generation
  const [isGeneratingSimilar, setIsGeneratingSimilar] = useState(false);
  const [similarProblem, setSimilarProblem] = useState<GeminiJsonResponse | null>(null);
  const [showSimilarProblem, setShowSimilarProblem] = useState(false);
  const [similarProblemError, setSimilarProblemError] = useState<string | null>(null);

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

  // Handle generating a similar problem
  const handleGenerateSimilar = async (originalProblem: GeminiJsonResponse) => {
    setIsGeneratingSimilar(true);
    setSimilarProblemError(null);
    setSimilarProblem(null);

    try {
      const token = await getToken();
      if (!token) {
        throw new Error('You must be signed in to use this feature.');
      }

      const response = await fetch('/api/generate-similar-problem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ originalProblem }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        let errorMsg = 'Failed to generate similar problem.';
        try {
          const errorData = JSON.parse(responseText);
          if (errorData.code === 'INSUFFICIENT_STACKS') {
            errorMsg = `You don't have enough credits to use this feature. Each similar problem generation costs 3 credits. ${errorData.available ? `You currently have ${errorData.available} credits.` : ''} Visit the pricing page to get more credits.`;
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
        setSimilarProblem(data.answer);
        setShowSimilarProblem(true);
      } else {
        throw new Error('Invalid response format from server.');
      }

    } catch (error: any) {
      console.error("Similar problem generation error:", error);
      const message = error.message || 'An unexpected error occurred.';
      setSimilarProblemError(message);
    } finally {
      setIsGeneratingSimilar(false);
    }
  };

// Component for the Ask Lab tab
const AskLabTab: React.FC = () => {
  return (
    <Card className="w-full max-w-3xl mx-auto bg-white/90 backdrop-blur-sm border border-indigo-100 shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-3">
          <MessageSquare className="w-7 h-7" />
          Ask the Lab
        </CardTitle>
        <p className="text-indigo-100 mt-1 text-sm">Get instant help with any math question</p>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        <div className="space-y-6">
          <div className="pb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">What math problem do you need help with?</h3>
            <div className="space-y-2">
              <div className="relative">
                <textarea 
                  ref={questionTextareaRef}
                  value={question}
                  onChange={(e) => {
                    setQuestion(e.target.value);
                    // Maintain focus position after state update
                    const cursorPosition = e.target.selectionStart;
                    setTimeout(() => {
                      if (questionTextareaRef.current) {
                        questionTextareaRef.current.focus();
                        questionTextareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
                      }
                    }, 0);
                  }}
                  className="w-full h-32 p-4 pr-12 border border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 text-gray-700"
                  placeholder="Type your math question here. For example: How do I solve the quadratic equation x² + 5x + 6 = 0?"
                />
                <div className="absolute bottom-3 right-3 flex items-center">
                  <div className="mr-2 flex items-center gap-1 bg-indigo-100 px-1.5 py-0.5 rounded-md">
                    <Coins className="w-3 h-3 text-indigo-600" />
                    <span className="text-xs font-medium text-indigo-600">3</span>
                  </div>
                  <Button 
                    className="w-8 h-8 p-0 flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700"
                    onClick={handleAskQuestion}
                    disabled={isAskingQuestion || !question.trim()}
                    title="Costs 3 credits"
                  >
                    {isAskingQuestion ? (
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-white" />
                    )}
                  </Button>
                </div>
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
                  className="w-full justify-between text-left font-normal border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 transition-all h-auto py-3"
                  onClick={() => setQuestion(example)}
                >
                  <span className="whitespace-normal pr-2">{example}</span>
                  <ChevronRight className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                </Button>
              ))}
            </div>
          </div>
          
          {/* Display answer with sections */}
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
                  onClick={() => handleGenerateSimilar(answer as GeminiJsonResponse)}
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
                        onClick={() => handleGenerateSimilar(answer as GeminiJsonResponse)}
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

        </div>
      </CardContent>
    </Card>
  );
  }
  
  // Render the appropriate tab content
  const renderTabContent = () => {
    if (activeTab === 'snap') {
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
                      {/* Problem Section */}
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

                      {/* Solution Section */}
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

                      {/* Answer Section */}
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

                       {/* Generate Similar Problem Button */}
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
    }
    
    // Return content for other tabs (main, ask) in similar format...
    // For now just return null for unimplemented tabs
    return null;
  }

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
      
      {/* Render content based on selected tab */}
      {activeTab === 'ask' ? (
        <AskLabTab
          question={question}
          setQuestion={setQuestion}
          handleAskQuestion={handleAskQuestion}
          isAskingQuestion={isAskingQuestion}
          answer={answer}
        />
      ) : activeTab === 'snap' ? (
        renderTabContent()
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Select value={topic} onValueChange={(value) => { setTopic(value); setIsTopicDropdownOpen(false); }} open={isTopicDropdownOpen} onOpenChange={setIsTopicDropdownOpen}>
                    <SelectTrigger className="mt-2 bg-white border border-gray-200 text-gray-800 h-10 hover:bg-gray-50 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors">
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-md max-h-80">
                      {Object.entries(subjects[subject].topicGroups).map(([groupName, topics]) => {
                        // Special handling for Coming Soon section
                        if (groupName === "🔜 Coming Soon") {
                          return (
                            <div key={groupName}>
                              <div className="px-2 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50/70 sticky top-0 z-10 flex justify-between items-center">
                                <span>{groupName}</span>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 text-xs text-indigo-700 hover:text-indigo-900 hover:bg-indigo-100 px-2 py-0"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsTopicDropdownOpen(false);
                                    setComingSoonTopics({subject: subjects[subject].name, topics: topics as string[]});
                                    setComingSoonOpen(true);
                                  }}
                                >
                                  See what's coming
                                </Button>
                              </div>
                            </div>
                          );
                        }
                        
                        // Normal topic groups
                        return (
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
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {[1, 2, 3, 4].map((count) => (
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
                <div className="flex-1 flex flex-col lg:flex-row gap-8">
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
                        <span className="inline-block w-5 h-5 rounded-full border-2 border-white/50 flex-shrink-0">
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
                  
                  {/* Hints & Stumped Section */}
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
                  {/* Solution Steps (shown when correct or stumped) */}
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
                                    components={{
                                    // @ts-ignore - inline is actually available in the props but TypeScript doesn't recognize it
                                    code: ({ node, inline, className, children, ...props }: any) => (
                                      <code className={`${className || ''} ${inline ? 'font-mono text-sm' : 'font-mono text-sm'}`} {...props}>
                                        {children}
                                      </code>
                                    ),
                                    // @ts-ignore - node is actually available in the props but TypeScript doesn't recognize it
                                    strong: ({ node, children }: any) => (
                                      <strong className="font-bold">{children}</strong>
                                    )
                                  }}
                                >
                                  {ensureLatexDelimiters(step)}
                                </ReactMarkdown>
                                </div>
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
                      
                      {/* Success message after saving */}
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
      )}

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
        </>
      )}
    </div>
  );
}
