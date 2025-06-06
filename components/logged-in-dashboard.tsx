"use client";

import { useState, ReactNode, useEffect } from "react";
import Link from "next/link";
import { Home, Menu, X, Trophy, Zap, Lock, LucideIcon, AlertCircle, Book, Eye, Clock } from "lucide-react";
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
      case "saved-problems":
        return <SavedProblemsDashboard />;
      default:
        return <MainDashboard stats={userStats} />;
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
            icon={Book}
            label="Saved Problems"
            active={activeTab === "saved-problems"}
            onClick={() => setActiveTab("saved-problems")}
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

// Weekly Goal interface
interface WeeklyGoal {
  current: number;
  target: number;
  message: string;
  unit?: string;
}

// Weekly Goal Card component
const WeeklyGoalCard = ({ goal }: { goal: WeeklyGoal }) => {
  const percentComplete = Math.round((goal.current / goal.target) * 100);
  
  return (
    <div className="rounded-xl overflow-hidden mb-8">
      <div className="bg-gradient-to-r from-indigo-800/90 to-purple-600/90 p-6 text-white relative overflow-hidden">
        {/* Target icon */}
        <div className="absolute top-6 right-6 opacity-20">
          <svg className="w-32 h-32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" fill="none" />
            <circle cx="12" cy="12" r="6" stroke="white" strokeWidth="1.5" fill="none" />
            <circle cx="12" cy="12" r="2" fill="white" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Weekly Goal Progress</h2>
        <p className="mb-4 text-white/90">{goal.message}</p>
        
        <div className="mb-2 flex justify-between">
          <span>{goal.current} of {goal.target} {goal.unit || 'minutes'}</span>
          <span className="font-bold">{percentComplete}%</span>
        </div>
        
        <div className="h-3 w-full bg-white/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-300" 
            style={{ width: `${percentComplete}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const MainDashboard = ({ stats }: { stats: UserStats }) => {
  // Weekly goal data - this would typically come from an API or database
  const weeklyGoal: WeeklyGoal = {
    current: stats.problemsSolved % 50,  // Reset counter every 50 problems
    target: 50,
    message: "Complete 50 problems this week to reach your goal.",
    unit: "problems"
  };

  // Functions to determine color based on value
  const getAccuracyColor = (value: number) => {
    if (value >= 80) return "text-green-500 bg-green-50";
    if (value >= 60) return "text-yellow-500 bg-yellow-50";
    return "text-red-500 bg-red-50";
  };

  const getStreakColor = (value: number) => {
    if (value >= 10) return "text-indigo-600 bg-indigo-50";
    if (value >= 5) return "text-blue-500 bg-blue-50";
    return "text-gray-600 bg-gray-50";
  };

  // Calculate the width percentage for progress bars
  const accuracyWidth = stats.accuracy ? `${stats.accuracy}%` : "0%";
  const problemsWidth = stats.problemsSolved > 100 ? "100%" : `${stats.problemsSolved}%`;
  const timeWidth = stats.averageResponseTime ? `${Math.min(100, stats.averageResponseTime * 10)}%` : "0%";
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Welcome back!</h1>
        
        {/* Performance Overview Section */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Performance Overview</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Circular Progress for Accuracy */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm text-center">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-24 h-24">
                  <circle 
                    className="text-gray-200" 
                    strokeWidth="8" 
                    stroke="currentColor" 
                    fill="transparent" 
                    r="40" 
                    cx="48" 
                    cy="48"
                  />
                  <circle 
                    className={stats.accuracy ? (stats.accuracy >= 80 ? "text-green-500" : stats.accuracy >= 60 ? "text-yellow-500" : "text-red-500") : "text-gray-300"}
                    strokeWidth="8" 
                    strokeDasharray={`${stats.accuracy ? stats.accuracy * 2.51 : 0} 251`} 
                    strokeLinecap="round" 
                    stroke="currentColor" 
                    fill="transparent" 
                    r="40" 
                    cx="48" 
                    cy="48"
                    transform="rotate(-90 48 48)"
                  />
                </svg>
                <span className="absolute text-xl font-bold">{stats.accuracy ? `${stats.accuracy}%` : "N/A"}</span>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-500">Accuracy</p>
            </div>
            
            {/* High Score with Badge */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">High Score</p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">{stats.highScore}</p>
                </div>
                <div className={`rounded-full p-3 ${stats.highScore > 500 ? "bg-indigo-100" : "bg-gray-100"}`}>
                  <Trophy className={`h-8 w-8 ${stats.highScore > 500 ? "text-indigo-600" : "text-gray-400"}`} />
                </div>
              </div>
              {stats.highScore > 500 && (
                <div className="mt-3 inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800">
                  🏆 Elite Score
                </div>
              )}
            </div>
            
            {/* Practice Time with Clock Icon */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Practice Time</p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">
                    {stats.totalTimePlayed ? `${Math.round(stats.totalTimePlayed / 60)}` : "0"}
                  </p>
                  <p className="text-sm text-gray-500">minutes</p>
                </div>
                <div className="rounded-full p-3 bg-blue-100">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-gray-200">
                <div 
                  className="h-2 rounded-full bg-blue-500" 
                  style={{ width: stats.totalTimePlayed ? `${Math.min(100, (stats.totalTimePlayed / 60) / 3)}%` : "0%" }}
                ></div>
              </div>
              {stats.totalTimePlayed && stats.totalTimePlayed > 1800 && (
                <div className="mt-3 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                  ⏱️ {stats.totalTimePlayed > 3600 ? "Time Master" : "30+ Minutes"}
                </div>
              )}
            </div>
            
            {/* Streak with Status */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Current Streak</p>
              <div className="flex items-baseline">
                <p className="text-3xl font-semibold text-gray-900">{stats.bestStreak || 0}</p>
                <p className="ml-2 text-sm text-gray-500">days</p>
              </div>
              {stats.bestStreak && stats.bestStreak > 0 && (
                <div className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStreakColor(stats.bestStreak)}`}>
                  {stats.bestStreak >= 10 ? "🔥 On Fire!" : stats.bestStreak >= 5 ? "👍 Good Streak" : "🌱 Just Started"}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Weekly Goal Progress Card */}
        <WeeklyGoalCard goal={weeklyGoal} />

        {/* Topic Progress */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Your Learning Journey</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Brainiac Stats Card */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                  Brainiac
                </h3>
                <Link href="/brainiac" className="text-indigo-600 text-sm hover:text-indigo-800 hover:underline">
                  Practice
                </Link>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Games Played</span>
                    <span>{stats.gamesPlayed}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div 
                      className="h-2 rounded-full bg-yellow-500" 
                      style={{ width: `${Math.min(100, stats.gamesPlayed * 2)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Response Time</span>
                    <span>{stats.averageResponseTime ? `${stats.averageResponseTime.toFixed(1)}s` : "N/A"}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div 
                      className="h-2 rounded-full bg-green-500" 
                      style={{ width: timeWidth }}
                    ></div>
                  </div>
                </div>
                
                {stats.totalTimePlayed && (
                  <div className="pt-2 text-sm">
                    <span className="font-medium">Total Play Time:</span> 
                    <span className="ml-2">{Math.round(stats.totalTimePlayed / 60)} minutes</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Problem Lab Stats Card */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Book className="mr-2 h-5 w-5 text-blue-500" />
                  Problem Lab
                </h3>
                <Link href="/problem-lab" className="text-indigo-600 text-sm hover:text-indigo-800 hover:underline">
                  Browse
                </Link>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Accuracy</span>
                    <span>{stats.accuracy ? `${stats.accuracy}%` : "N/A"}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div 
                      className={`h-2 rounded-full ${stats.accuracy && stats.accuracy >= 80 ? "bg-green-500" : stats.accuracy && stats.accuracy >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                      style={{ width: accuracyWidth }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Problems</span>
                    <span>{stats.problemsSolved}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div 
                      className="h-2 rounded-full bg-blue-500" 
                      style={{ width: problemsWidth }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  {stats.problemsSolved >= 10 && (
                    <div className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      10+ Problems
                    </div>
                  )}
                  {stats.accuracy && stats.accuracy >= 80 && (
                    <div className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      High Accuracy
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Tips Section */}
        <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-6">
          <h2 className="mb-4 text-lg font-medium text-indigo-800">Quick Tips</h2>
          <ul className="space-y-2 text-indigo-700">
            <li className="flex items-start">
              <Zap className="mr-2 mt-0.5 h-4 w-4 text-indigo-600" />
              <span>Practice for at least 10 minutes daily for best results</span>
            </li>
            <li className="flex items-start">
              <Zap className="mr-2 mt-0.5 h-4 w-4 text-indigo-600" />
              <span>Challenge yourself with higher difficulty levels to improve faster</span>
            </li>
            <li className="flex items-start">
              <Zap className="mr-2 mt-0.5 h-4 w-4 text-indigo-600" />
              <span>Check your progress regularly to identify areas for improvement</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};



// Stats counter card component for SavedProblemsDashboard
const ProblemStatsCard = ({ value, label, color }: { value: number; label: string; color: string }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 text-center">
      <p className={`text-4xl font-bold ${color}`}>{value}</p>
      <p className="text-gray-500 text-sm mt-1">{label}</p>
    </div>
  );
};

const SavedProblemsDashboard = () => {
  const { user } = useAuth();
  const [savedProblems, setSavedProblems] = useState<SavedProblem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProblem, setSelectedProblem] = useState<SavedProblem | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Calculate problem stats
  const problemStats = {
    total: savedProblems.length,
    regular: savedProblems.filter(p => p.difficulty === 'Easy' || p.difficulty === 'Medium').length,
    advanced: savedProblems.filter(p => p.difficulty === 'Hard' || p.difficulty === 'Advanced').length,
    subjects: Array.from(new Set(savedProblems.map(p => p.subject))).length
  };

  // Fetch user's saved problems from Supabase
  useEffect(() => {
    const fetchSavedProblems = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        // Get all saved problems regardless of source
        const result = await getUserProblems(user.id, 50);
        if (result.success && result.data) {
          setSavedProblems(result.data);
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
        <h1 className="text-2xl font-bold text-gray-900">Saved Problems</h1>
        <p className="text-gray-600">Access your saved math problems for review and practice.</p>
      </div>
      
      {/* Problem Stats Section */}
      <div className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ProblemStatsCard value={problemStats.total} label="Total Problems" color="text-purple-600" />
          <ProblemStatsCard value={problemStats.regular} label="Regular" color="text-orange-500" />
          <ProblemStatsCard value={problemStats.advanced} label="Advanced" color="text-red-600" />
          <ProblemStatsCard value={problemStats.subjects} label="Subjects" color="text-green-600" />
        </div>
      </div>

      {/* Header with action button */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Your Saved Problems</h2>
          <Link href="/problem-lab">
            <Button variant="outline" className="flex items-center gap-2">
              <Book className="h-4 w-4" /> Find New Problems
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Saved Problems Content */}
      <div>
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
                        <Book className="mr-2 h-4 w-4" />
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
