'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Problem, Difficulty } from '@/types/math'
import { FlaskConical, Sparkles, CheckCircle, Beaker, TestTube, HelpCircle, ArrowLeft, ArrowRight, Check, X, MessageSquare, Camera, Brain, ChevronRight } from 'lucide-react'
import { getFilteredProblems, getAllTopics, getAllSubjects } from '@/lib/problems'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { generateProblem } from "@/lib/generate-problem"
import { ParticleBackground } from "@/components/particle-background"

// A simple loading component to avoid import issues
function SimpleLoadingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <div className="relative h-16 w-16">
        <div className="absolute animate-ping h-full w-full rounded-full bg-blue-400 opacity-75"></div>
        <div className="relative flex justify-center items-center h-16 w-16 rounded-full bg-blue-500">
          <FlaskConical className="h-8 w-8 text-white" />
        </div>
      </div>
      <p className="text-lg font-medium text-blue-700 animate-pulse">
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
      "Basic Operations": [
        "Order of Operations",
        "Fractions",
        "Decimals",
        "Decimal Place Value Mastery",
        "Adding and Subtracting Integers"
      ],
      "Algebra Foundations": [
        "Variables & Expressions",
        "One-Step Equations",
        "Multi-Step Equations"
      ]
    }
  },
  "algebra-1": {
    name: "Algebra I",
    available: false,
    topicGroups: {}
  },
  "algebra-2": {
    name: "Algebra II",
    available: false,
    topicGroups: {}
  }
};

// List of difficulty levels
const difficulties: Difficulty[] = ['Regular', 'Challenging', 'Advanced'];

// Topics that can have word problems
const wordProblemTopics = [
  "Word Problems",
  "Related Rates (word problems)",
];

// Button component for selecting the number of problems
const ProblemCountButton = ({ count, selected, onClick }: { count: number; selected: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
      selected
        ? 'bg-indigo-600 text-white'
        : 'bg-white border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300'
    }`}
  >
    {count}
  </button>
);

// Test tube component that shows experiment progress
const TestTubeMeter = ({ progress }: { progress: number }) => {
  const isFull = progress >= 100;
  return (
    <div className="relative w-12 h-32 bg-gray-100 rounded-b-lg border-2 border-gray-200 overflow-hidden">
      <div className="absolute bottom-0 left-0 right-0 bg-indigo-500 transition-all duration-1000" 
           style={{ height: `${progress}%` }} />
      
      {/* Enhanced bubbles animation when test tube is full */}
      {isFull && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Larger, more visible bubbles */}
          <div className="absolute bottom-2 left-1/4 w-3 h-3 rounded-full bg-white/90 animate-bubble-1"></div>
          <div className="absolute bottom-4 left-2/3 w-4 h-4 rounded-full bg-white/80 animate-bubble-2"></div>
          <div className="absolute bottom-6 left-1/3 w-2.5 h-2.5 rounded-full bg-white/90 animate-bubble-3"></div>
          {/* Add more bubbles for better effect */}
          <div className="absolute bottom-3 right-1/4 w-2 h-2 rounded-full bg-white/85 animate-bubble-1" style={{ animationDelay: '0.3s' }}></div>
          <div className="absolute bottom-8 left-1/5 w-3 h-3 rounded-full bg-white/75 animate-bubble-2" style={{ animationDelay: '0.7s' }}></div>
        </div>
      )}
      
      <div className="absolute inset-0 flex items-center justify-center">
        <TestTube className="w-8 h-28 text-gray-300 opacity-30" />
      </div>
      <div className="absolute bottom-1 left-0 right-0 text-center text-xs font-bold text-white">
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
  
  // States for dynamic topics and subjects
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  
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
            <div className="relative">
              <textarea 
                className="w-full h-32 p-4 pr-12 border border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 text-gray-700"
                placeholder="Type your math question here. For example: How do I solve the quadratic equation x² + 5x + 6 = 0?"
              />
              <Button className="absolute bottom-3 right-3 w-8 h-8 p-0 flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700">
                <ArrowRight className="w-4 h-4 text-white" />
              </Button>
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
                >
                  <span>{example}</span>
                  <ChevronRight className="w-4 h-4 text-indigo-400" />
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
  
  // Component for the Snap + Solve tab
  const SnapSolveTab = () => (
    <Card className="w-full max-w-3xl mx-auto bg-white/90 backdrop-blur-sm border border-indigo-100 shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 pb-6">
        <CardTitle className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Camera className="w-8 h-8" />
          Snap + Solve
        </CardTitle>
        <p className="text-indigo-100 mt-2">Upload a photo of your math problem for instant solutions</p>
      </CardHeader>
      <CardContent className="p-8 pt-6 bg-white">
        <div className="space-y-8">
          <div className="border-2 border-dashed border-indigo-200 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer bg-indigo-50/50">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                <Camera className="w-8 h-8 text-indigo-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Upload a Photo</h3>
                <p className="text-gray-600 mt-1">Take a picture or upload an image of your math problem</p>
              </div>
              <Button className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                Choose Image
              </Button>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-base font-medium text-gray-700 mb-4">Tips for best results:</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                  <span className="text-indigo-600 text-xs font-bold">1</span>
                </div>
                <span>Make sure the problem is clearly visible and well-lit</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                  <span className="text-indigo-600 text-xs font-bold">2</span>
                </div>
                <span>Avoid shadows and glare on the paper</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                  <span className="text-indigo-600 text-xs font-bold">3</span>
                </div>
                <span>Include the full problem with all relevant parts</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center py-12 px-4 overflow-hidden">
      <ParticleBackground />
      
      {/* Tab Navigation */}
      <div className="w-full max-w-3xl mx-auto mb-6 bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-100 shadow-md overflow-hidden">
        <div className="flex">
          <button 
            onClick={() => setActiveTab('main')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${activeTab === 'main' ? 
              'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-indigo-50'}`}
          >
            <Beaker className="w-4 h-4" />
            Problem Lab
          </button>
          <button 
            onClick={() => setActiveTab('ask')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${activeTab === 'ask' ? 
              'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-indigo-50'}`}
          >
            <MessageSquare className="w-4 h-4" />
            Ask the Lab
          </button>
          <button 
            onClick={() => setActiveTab('snap')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${activeTab === 'snap' ? 
              'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-indigo-50'}`}
          >
            <Camera className="w-4 h-4" />
            Snap + Solve
          </button>
        </div>
      </div>
      
      {/* Render content based on selected tab */}
      {activeTab === 'ask' ? (
        <AskLabTab />
      ) : activeTab === 'snap' ? (
        <SnapSolveTab />
      ) : (
        /* Main Problem Lab Content - Original content */
        <>
          {noProblemsFound && (
        <motion.div
          key="no-problems"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-8 text-center bg-white/90 backdrop-blur-sm"
        >
          <div className="mb-8">
            <FlaskConical className="w-20 h-20 text-indigo-300 mx-auto mb-4" />
          </div>
          <h2 className="text-2xl font-bold text-indigo-600 mb-4">No Problems Available Yet</h2>
          <p className="text-gray-600 max-w-md mb-6">
            We don't have any problems for this specific combination of subject, topic, and difficulty level in our database yet.
          </p>
          <p className="text-gray-500 max-w-md mb-8">
            Try selecting a different topic or difficulty level, or check back later as we continue to add more problems.
          </p>
          <Button
            onClick={() => {
              setNoProblemsFound(false);
            }}
            className="bg-indigo-600 hover:bg-indigo-700"
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
            className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-indigo-100 border border-indigo-200 text-indigo-800 px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="font-medium">Experiment complete! All {problemCount} problems solved!</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!showProblemSolving ? (
        <Card className="w-full max-w-3xl mx-auto bg-white/90 backdrop-blur-sm border border-indigo-100 shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 pb-6">
            <CardTitle className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <FlaskConical className="w-8 h-8" />
              Problem Lab
            </CardTitle>
            <p className="text-indigo-100 mt-2">Generate custom math problems with step-by-step solutions</p>
          </CardHeader>
          <CardContent className="p-8 pt-6 bg-white">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Subject</Label>
                  <Select 
                    value={subject} 
                    onValueChange={(value: keyof typeof subjects) => setSubject(value as keyof typeof subjects)}
                  >
                    <SelectTrigger className="mt-2 bg-white border-indigo-100 text-gray-800 h-11 hover:bg-indigo-50 hover:border-indigo-200 transition-colors duration-150">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-indigo-100">
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
                    <SelectTrigger className="mt-2 bg-white border-indigo-100 text-gray-800 h-11 hover:bg-gray-50 transition-colors">
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-indigo-100 max-h-80">
                      {Object.entries(subjects[subject].topicGroups).map(([groupName, topics]) => (
                        <div key={groupName}>
                          <div className="px-2 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 sticky top-0 z-10">
                            {groupName}
                          </div>
                              {(topics as string[]).map((t) => (
                                <SelectItem 
                                  key={t} 
                                  value={t} 
                                  className="text-gray-800 pl-4 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-150"
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
                    <SelectTrigger className="mt-2 bg-white border-indigo-100 text-gray-800 h-11 hover:bg-indigo-50 hover:border-indigo-200 transition-colors duration-150">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-indigo-100">
                      {difficulties.map((diff) => (
                        <SelectItem 
                          key={diff} 
                          value={diff} 
                          className="text-gray-800 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-150"
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
                      <span className="font-semibold text-indigo-700">{setupProgress}% complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <motion.div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full"
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
                    className="h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium text-base tracking-wide rounded-xl transition-all duration-300 hover:shadow-md w-full flex items-center justify-center gap-2 group relative overflow-hidden"
                  >
                    {isLoading ? (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500"
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
                <div className="mb-6 rounded-lg bg-gray-50 border border-gray-100 p-5 shadow-sm">
                  {/* Use dangerouslySetInnerHTML to render LaTeX, but in a real app use a proper LaTeX renderer */}
                  <div 
                    className="whitespace-pre-wrap text-lg font-medium text-gray-800" 
                    dangerouslySetInnerHTML={{ 
                      __html: currentProblem.question
                        .replace(/\$/g, '')
                        .replace(/\\times/g, '\u00d7')
                        .replace(/\\frac{([^}]*)}{([^}]*)}/g, '$1/$2')
                    }}
                  />
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
                    <div className="mt-6 border-t pt-4">
                      <h3 className="font-medium text-gray-700 mb-2 text-sm flex items-center gap-2">
                        <Check className="w-4 h-4 text-indigo-600" /> Solution Steps:
                      </h3>
                      <ol className="list-decimal pl-5 space-y-2">
                        {currentProblem.solutionSteps.map((step, index) => (
                          <li key={index} className="text-gray-700 text-sm">
                            <div dangerouslySetInnerHTML={{ 
                              __html: step
                                .replace(/\$/g, '')
                                .replace(/\\times/g, '\u00d7')
                                .replace(/\\frac{([^}]*)}{([^}]*)}/g, '$1/$2')
                            }} />
                          </li>
                        ))}
                      </ol>
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
