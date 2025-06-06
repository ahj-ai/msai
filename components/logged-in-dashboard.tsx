"use client";

import { useState, ReactNode, useEffect } from "react";
import Link from "next/link";
import { Brain, FlaskConical, Home, Menu, X, Trophy, Zap, Lock, LucideIcon, AlertCircle, Book, Eye } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase, getUserProblems } from "@/lib/supabase";
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  linkText: string;
  linkHref: string;
}

interface GameModeCardProps extends Omit<FeatureCardProps, 'icon'> {
  icon: LucideIcon;
}

interface StatCardProps {
  title: string;
  value: number | string;
}

interface UserStats {
  highScore: number;
  gamesPlayed: number;
  problemsSolved: number;
  lastPlayed?: string;
  averageResponseTime?: number;
  totalTimePlayed?: number;
  bestStreak?: number;
  accuracy?: number;
}

interface SavedProblem {
  id?: string;
  user_id?: string;
  subject: string;
  topic: string;
  difficulty: string;
  question: string;
  solution: string;
  answer?: string;
  hints?: string[];
  solution_steps?: string[];
  source?: string;
  created_at?: string;
  metadata?: Record<string, any>;
}

const LoggedInDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats>({
    highScore: 0,
    gamesPlayed: 0,
    problemsSolved: 0,
  });
  const [error, setError] = useState<string | null>(null);
  
  // Get actual user data from auth context
  const { user } = useAuth();

  // Fetch user progress data from Supabase
  useEffect(() => {
    if (user) {
      setIsLoading(true);
      setError(null);
      
      const fetchUserProgress = async () => {
        try {
          const { data, error } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          if (error) {
            if (error.code === 'PGRST116') { // Record not found
              console.log('No progress data found for user');
              // Keep the default values for userStats
            } else {
              console.error('Error fetching user progress:', error);
              setError('Failed to load your progress data');
            }
          } else if (data) {
            // Calculate accuracy if data available
            const totalAttempts = data.additional_stats?.total_questions_attempted || 0;
            const accuracy = totalAttempts > 0 
              ? Math.round((data.additional_stats?.total_correct_answers || 0) / totalAttempts * 100) 
              : 0;
              
            setUserStats({
              highScore: data.high_score || 0,
              gamesPlayed: data.games_played || 0,
              problemsSolved: data.problems_solved || 0,
              lastPlayed: data.last_played_at,
              averageResponseTime: data.additional_stats?.last_game?.averageResponseTime,
              totalTimePlayed: data.additional_stats?.total_time_played,
              bestStreak: data.additional_stats?.best_streak,
              accuracy
            });
          }
        } catch (err) {
          console.error('Failed to fetch user progress:', err);
          setError('An unexpected error occurred');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchUserProgress();
    }
  }, [user]);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const renderContent = () => {
    switch (activeTab) {
      case "brainiac":
        return <BrainiacDashboard stats={userStats} />;
      case "problem-lab":
        return <ProblemLabDashboard />;
      default:
        return <MainDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
        onClick={toggleSidebar}
      >
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          <div className="flex items-center">
            <Zap className="h-6 w-6 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">MathStack AI</span>
          </div>
          <button
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 md:hidden"
            onClick={toggleSidebar}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-4">
          <NavItem
            icon={Home}
            label="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <NavItem
            icon={Brain}
            label="Brainiac"
            active={activeTab === "brainiac"}
            onClick={() => setActiveTab("brainiac")}
          />
          <NavItem
            icon={FlaskConical}
            label="Problem Lab"
            active={activeTab === "problem-lab"}
            onClick={() => setActiveTab("problem-lab")}
          />
        </nav>
        <div className="absolute bottom-0 w-full border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-sm font-medium text-indigo-700">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500">View profile</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
          <button
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 md:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 md:flex md:justify-end">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Zap className="mr-2 h-4 w-4" />
                Upgrade to Premium
              </Button>
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center md:hidden">
                <span className="text-sm font-medium text-indigo-700">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center px-4 py-3 text-sm font-medium ${
      active
        ? 'border-r-2 border-indigo-600 bg-indigo-50 text-indigo-700'
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <Icon className="h-5 w-5" />
    <span className="ml-3">{label}</span>
  </button>
);

const MainDashboard = () => (
  <div>
    <h1 className="mb-6 text-2xl font-bold text-gray-900">Welcome back!</h1>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <FeatureCard
        title="Brainiac"
        description="Challenge yourself with mental math exercises and improve your calculation speed."
        icon={Brain}
        linkText="Play Brainiac"
        linkHref="/brainiac"
      />
      <FeatureCard
        title="Problem Lab"
        description="Generate custom math problems tailored to your skill level and learning goals. Practice with step-by-step solutions."
        icon={FlaskConical}
        linkText="Open Problem Lab"
        linkHref="/problem-lab"
      />
    </div>
    <div className="mt-8">
      <h2 className="mb-4 text-lg font-medium text-gray-900">Quick Tips</h2>
      <ul className="space-y-2">
        <li className="flex items-start">
          <Zap className="mr-2 mt-0.5 h-4 w-4 text-indigo-600" />
          <span>Practice for at least 10 minutes daily for best results</span>
        </li>
        <li className="flex items-start">
          <Zap className="mr-2 mt-0.5 h-4 w-4 text-indigo-600" />
          <span>Try different difficulty levels to challenge yourself</span>
        </li>
        <li className="flex items-start">
          <Zap className="mr-2 mt-0.5 h-4 w-4 text-indigo-600" />
          <span>Track your progress in the Brainiac section</span>
        </li>
      </ul>
    </div>
  </div>
);

const BrainiacDashboard = ({ stats }: { stats: UserStats }) => (
  <div>
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900">Brainiac</h1>
      <p className="text-gray-600">Improve your mental math skills with fun challenges</p>
    </div>
    
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatCard title="High Score" value={stats.highScore} />
      <StatCard title="Games Played" value={stats.gamesPlayed} />
      <StatCard title="Problems Solved" value={stats.problemsSolved} />
    </div>
    
    {stats.lastPlayed && (
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-medium text-gray-900">Your Stats</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {stats.bestStreak !== undefined && (
            <StatCard title="Longest Streak" value={stats.bestStreak} />
          )}
          {stats.accuracy !== undefined && (
            <StatCard title="Accuracy" value={`${stats.accuracy}%`} />
          )}
          {stats.averageResponseTime !== undefined && (
            <StatCard title="Avg Response" value={`${stats.averageResponseTime.toFixed(2)}s`} />
          )}
          {stats.totalTimePlayed !== undefined && (
            <StatCard title="Time Played" value={`${Math.round(stats.totalTimePlayed / 60)} min`} />
          )}
        </div>
      </div>
    )}

    <div className="mb-8">
      <h2 className="mb-4 text-lg font-medium text-gray-900">Game Modes</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <GameModeCard
          title="Speed Mode"
          description="Solve as many problems as you can in 60 seconds"
          icon={Zap}
          linkText="Play Speed Mode"
          linkHref="/brainiac"
        />
        <GameModeCard
          title="Practice Mode"
          description="Practice at your own pace with no time limit"
          icon={Trophy}
          linkText="Play Practice Mode"
          linkHref="/brainiac?mode=practice"
        />
      </div>
    </div>

    <div className="rounded-lg bg-indigo-50 p-6">
      <h3 className="mb-3 text-lg font-medium text-indigo-800">Tips & Tricks</h3>
      <ul className="space-y-2 text-indigo-700">
        <li className="flex items-start">• Focus on accuracy first, then speed</li>
        <li className="flex items-start">• Practice daily for best results</li>
        <li className="flex items-start">• Try to beat your high score</li>
      </ul>
    </div>
  </div>
);

const ProblemLabDashboard = () => {
  const { user } = useAuth();
  const [savedProblems, setSavedProblems] = useState<SavedProblem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProblem, setSelectedProblem] = useState<SavedProblem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [problemStats, setProblemStats] = useState({
    problemsSolved: 0,
    popularSubjects: ['Pre-Algebra', 'Algebra I'],
    favoriteTopics: ['One-Step Equations', 'Order of Operations'],
    totalPracticeTime: 120, // in minutes
    accuracyRate: 85, // percentage
  });

  // Fetch user's saved problems from Supabase
  useEffect(() => {
    const fetchSavedProblems = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const result = await getUserProblems(user.id, 50, 'problem-lab');
        if (result.success && result.data) {
          setSavedProblems(result.data);
          
          // In a real app, you would calculate these stats from actual user data
          // For now, we're using placeholder stats that would be calculated from user data
          setProblemStats({
            problemsSolved: result.data.length + 42, // Example: saved problems + solved problems
            popularSubjects: ['Pre-Algebra', 'Algebra I'],
            favoriteTopics: ['One-Step Equations', 'Order of Operations'],
            totalPracticeTime: 120,
            accuracyRate: 85,
          });
        } else {
          setError('Failed to load your saved problems');
        }
      } catch (err) {
        console.error('Error fetching saved problems:', err);
        setError('Failed to load your saved problems');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedProblems();
  }, [user]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Problem Lab</h1>
        <p className="text-gray-600">Generate custom math problems tailored to your skill level and learning goals. Practice with step-by-step solutions.</p>
      </div>
      
      {/* Stats Section */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-medium text-gray-900">Your Progress</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard title="Problems Solved" value={problemStats.problemsSolved} />
          <StatCard title="Practice Time" value={`${problemStats.totalPracticeTime} min`} />
          <StatCard title="Accuracy Rate" value={`${problemStats.accuracyRate}%`} />
          <StatCard title="Saved Problems" value={savedProblems.length} />
        </div>
      </div>
      
      {/* Problem Modes Section */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-medium text-gray-900">Problem Modes</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <GameModeCard
            title="Problem Lab"
            description="Generate custom problems based on topic and difficulty"
            icon={FlaskConical}
            linkText="Open Lab"
            linkHref="/problem-lab"
          />
          <GameModeCard
            title="Snapshot & Solve"
            description="Take a photo of a math problem and get step-by-step solutions"
            icon={Eye}
            linkText="Try Snapshot"
            linkHref="/problem-lab/snapshot"
          />
          <GameModeCard
            title="Daily Challenge"
            description="Tackle a new set of curated problems each day"
            icon={Zap}
            linkText="Start Challenge"
            linkHref="/problem-lab/daily"
          />
        </div>
      </div>
      
      {/* Tips & Tricks Section */}
      <div className="mb-8 rounded-lg bg-indigo-50 p-6">
        <h3 className="mb-3 text-lg font-medium text-indigo-800">Tips & Tricks</h3>
        <ul className="space-y-2 text-indigo-700">
          <li className="flex items-start">• Start with topics you're comfortable with before tackling challenging ones</li>
          <li className="flex items-start">• Review the step-by-step solutions to understand problem-solving approaches</li>
          <li className="flex items-start">• Practice regularly to build and maintain your skills</li>
          <li className="flex items-start">• Try different difficulty levels to gradually improve</li>
          <li className="flex items-start">• Use the performance insights to focus on areas that need improvement</li>
        </ul>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-medium text-gray-900">Your Saved Problems</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        ) : savedProblems.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <Book className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <p className="text-sm text-gray-500">
              You haven't saved any problems yet
            </p>
            <Link href="/problem-lab">
              <Button className="mt-4" variant="outline">
                Go to Problem Lab
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {selectedProblem ? (
              <Card className="overflow-hidden">
                <CardHeader className="bg-blue-50 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {selectedProblem.subject} - {selectedProblem.topic}
                    </CardTitle>
                    <CardDescription>
                      {selectedProblem.difficulty} Difficulty
                    </CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={() => setSelectedProblem(null)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h3 className="text-md font-medium mb-2">Question</h3>
                    <div className="p-4 bg-gray-50 rounded-md">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        components={{
                          // Applying classes to the root element
                          p: ({node, ...props}) => <p className="prose max-w-none" {...props} />
                        }}
                      >
                        {selectedProblem.question}
                      </ReactMarkdown>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-md font-medium mb-2">Solution</h3>
                    <div className="p-4 bg-gray-50 rounded-md">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        components={{
                          // Applying classes to the root element
                          p: ({node, ...props}) => <p className="prose max-w-none" {...props} />
                        }}
                      >
                        {selectedProblem.solution}
                      </ReactMarkdown>
                    </div>
                  </div>

                  {selectedProblem.solution_steps && selectedProblem.solution_steps.length > 0 && (
                    <div>
                      <h3 className="text-md font-medium mb-2">Solution Steps</h3>
                      <div className="space-y-3">
                        {selectedProblem.solution_steps.map((step, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-md">
                            <ReactMarkdown
                              remarkPlugins={[remarkMath]}
                              rehypePlugins={[rehypeKatex]}
                              components={{
                                p: ({node, ...props}) => <p className="prose max-w-none" {...props} />
                              }}
                            >
                              {step}
                            </ReactMarkdown>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <Link href="/problem-lab">
                      <Button className="w-full">
                        <FlaskConical className="mr-2 h-4 w-4" />
                        Practice in Problem Lab
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {savedProblems.map((problem, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" 
                        onClick={() => setSelectedProblem(problem)}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-md">{problem.subject}</CardTitle>
                          <CardDescription>{problem.topic}</CardDescription>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                          problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {problem.difficulty}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="text-sm line-clamp-2 text-gray-700">
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                          components={{
                            p: ({node, ...props}) => <p className="prose max-w-none" {...props} />
                          }}
                        >
                          {problem.question}
                        </ReactMarkdown>
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button variant="ghost" size="sm" className="text-blue-600">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description, icon: Icon, linkText, linkHref }: FeatureCardProps) => (
  <Card className="h-full transition-all hover:shadow-md">
    <CardHeader>
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
        <Icon className="h-6 w-6 text-indigo-600" />
      </div>
      <CardTitle className="mt-4 text-xl">{title}</CardTitle>
      <CardDescription className="text-base">{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <Button asChild>
        <Link href={linkHref}>{linkText}</Link>
      </Button>
    </CardContent>
  </Card>
);

const GameModeCard = ({ title, description, icon: Icon, linkText, linkHref }: GameModeCardProps) => (
  <Card className="h-full transition-all hover:shadow-md">
    <CardHeader>
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
        <Icon className="h-6 w-6 text-indigo-600" />
      </div>
      <CardTitle className="mt-4 text-lg">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <Button asChild>
        <Link href={linkHref}>{linkText}</Link>
      </Button>
    </CardContent>
  </Card>
);

const StatCard = ({ title, value }: StatCardProps) => (
  <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
    <p className="text-sm font-medium text-gray-500">{title}</p>
    <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
  </div>
);

export default LoggedInDashboard;
