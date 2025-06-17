"use client";

import { useState, ReactNode, useEffect } from "react";
import Link from "next/link";
import { Home, Menu, X, Trophy, Zap, Lock, LucideIcon, AlertCircle, Book, Eye, Clock, RefreshCw, Target, Crown, Star } from "lucide-react";
import { CircularProgress } from "@/components/ui/circular-progress";
import { useAuth } from "@/lib/auth";
import { supabase, getUserProblems, getUserWeeklyGoals, updateGoalProgress, generateDefaultWeeklyGoals } from "@/lib/supabase";
import { useSubscription } from "@/hooks/use-subscription";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { useSearchParams } from "next/navigation";

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
  value?: number | string;
  icon?: LucideIcon;
  iconColor?: string;
  customContent?: React.ReactNode;
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

interface WeeklyGoal {
  id: string;
  goal_type: string;
  target: number;
  current: number;
  start_date: string;
  end_date: string;
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
  const [recentSavedProblems, setRecentSavedProblems] = useState<SavedProblem[]>([]);
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>([]);
  
  // Get actual user data from auth context
  const { user } = useAuth();
  
  // Get subscription status
  const { isPro, isLoading: subscriptionLoading, plan } = useSubscription();

  // Handle URL parameters for tab switching
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const tab = searchParams?.get('tab');
    if (tab && (tab === 'dashboard' || tab === 'saved-problems')) {
      setActiveTab(tab);
    }
  }, [searchParams]);

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

          // Fetch recent saved problems
          const { data: savedProblemsData } = await getUserProblems(user.id);
          if (savedProblemsData) {
            setRecentSavedProblems(savedProblemsData.slice(0, 3)); // Get last 3 problems
          }

          // Fetch weekly goals
          const { data: goalsData, success: goalsSuccess } = await getUserWeeklyGoals(user.id);
          if (goalsSuccess && goalsData) {
            setWeeklyGoals(goalsData);
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
        return (
          <div className="p-4 space-y-6">
            {/* Welcome Section - Removed Pro Badge */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back{user?.name ? `, ${user.name}` : ''}!
                </h1>
                <p className="text-gray-600 mt-1">Ready to solve some math problems?</p>
              </div>
            </div>

            {/* Performance Overview Section - Added context to metrics */}
            <div>
              <h2 className="text-base font-semibold text-gray-700 mb-4 ml-1">Performance Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-7">
                <StatCard
                  title="Accuracy (All Time)"
                  customContent={
                    <CircularProgress value={userStats.accuracy || 0} size={56} strokeWidth={6} color="#22c55e">
                      <span className="text-lg font-bold text-green-600">{userStats.accuracy || 0}%</span>
                    </CircularProgress>
                  }
                />
                <StatCard title="Brainiac High Score" value={userStats.highScore} icon={Trophy} iconColor="text-yellow-500" />
                <StatCard title="Games Played (Total)" value={userStats.gamesPlayed} icon={Star} iconColor="text-blue-500" />
                <StatCard title="Problems Solved (Total)" value={userStats.problemsSolved} icon={Zap} iconColor="text-green-500" />
              </div>
            </div>

            {/* Recent Activity & Goals Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Recent Saved Problems */}
              <Card className="bg-white shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                      <Book className="mr-2 h-5 w-5 text-blue-500" />
                      Recent Saved Problems
                    </CardTitle>
                    <Link href="/dashboard?tab=saved-problems" className="text-indigo-600 text-sm hover:text-indigo-800 hover:underline">
                      View All
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {recentSavedProblems.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-gray-500 text-sm mb-3">No saved problems yet</p>
                      <Link href="/problem-lab">
                        <Button size="sm" variant="outline">
                          Start Practicing
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentSavedProblems.map((problem, index) => (
                        <div 
                          key={index} 
                          className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          onClick={() => setActiveTab('saved-problems')}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {problem.subject} - {problem.topic}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {problem.question.substring(0, 80)}...
                            </p>
                          </div>
                          <span className={`ml-2 text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                            problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                            problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {problem.difficulty}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Weekly Goals */}
              <Card className="bg-white shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                      <Target className="mr-2 h-5 w-5 text-green-500" />
                      Weekly Goals
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {weeklyGoals.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-gray-500 text-sm">No active goals this week</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {weeklyGoals.slice(0, 2).map((goal, index) => {
                        const progress = Math.min((goal.current / goal.target) * 100, 100);
                        const goalTypeLabels: Record<string, string> = {
                          'problems_solved': 'Problems Solved',
                          'games_played': 'Games Played',
                          'practice_time': 'Practice Time (min)',
                          'accuracy': 'Accuracy Target'
                        };
                        
                        return (
                          <div key={index}>
                            <div className="flex justify-between mb-1 text-sm">
                              <span className="font-medium">{goalTypeLabels[goal.goal_type] || goal.goal_type}</span>
                              <span className="text-gray-600">{goal.current}/{goal.target}</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-gray-200">
                              <div 
                                className="h-2 rounded-full bg-green-500 transition-all duration-300" 
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            {progress >= 100 && (
                              <div className="flex items-center mt-1">
                                <Trophy className="h-3 w-3 text-yellow-500 mr-1" />
                                <span className="text-xs text-green-600 font-medium">Goal Completed!</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* What's Next Section - Improved header */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">What's Next?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FeatureCard
                  title="Brainiac Game"
                  description="Test your math skills in our fast-paced quiz game"
                  icon={Zap}
                  linkText="Play Now"
                  linkHref="/brainiac"
                />
                <FeatureCard
                  title="Problem Lab"
                  description="Practice with thousands of math problems across all levels"
                  icon={Book}
                  linkText="Start Practicing"
                  linkHref="/problem-lab"
                />
                <FeatureCard
                  title="Image Solver"
                  description="Upload photos of math problems and get instant solutions"
                  icon={Eye}
                  linkText="Upload Image"
                  linkHref="/image-solver"
                />
              </div>
            </div>
            
            {/* Game Stats Card */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                    <Zap className="mr-2 h-5 w-5 text-yellow-500" />
                    Game Stats
                  </CardTitle>
                  <Link href="/brainiac" className="text-indigo-600 text-sm hover:text-indigo-800 hover:underline">
                    Play
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Games Played</span>
                      <span>{userStats.gamesPlayed}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div 
                        className="h-2 rounded-full bg-yellow-500" 
                        style={{ width: `${Math.min(100, userStats.gamesPlayed * 2)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Response Time</span>
                      <span>{userStats.averageResponseTime ? `${userStats.averageResponseTime.toFixed(1)}s` : "N/A"}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div 
                        className="h-2 rounded-full bg-green-500" 
                        style={{ width: `${userStats.averageResponseTime ? Math.min((10 / userStats.averageResponseTime) * 100, 100) : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {userStats.totalTimePlayed && (
                    <div className="pt-2 text-sm">
                      <span className="font-medium">Total Play Time:</span> 
                      <span className="ml-2">{Math.round(userStats.totalTimePlayed / 60)} minutes</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Problem Lab Stats Card */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                    <Book className="mr-2 h-5 w-5 text-blue-500" />
                    Problem Lab
                  </CardTitle>
                  <Link href="/problem-lab" className="text-indigo-600 text-sm hover:text-indigo-800 hover:underline">
                    Browse
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Accuracy</span>
                      <span>{userStats.accuracy ? `${userStats.accuracy}%` : "N/A"}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div 
                        className={`h-2 rounded-full ${userStats.accuracy && userStats.accuracy >= 80 ? "bg-green-500" : userStats.accuracy && userStats.accuracy >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                        style={{ width: `${userStats.accuracy || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Problems</span>
                      <span>{userStats.problemsSolved}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div 
                        className="h-2 rounded-full bg-blue-500" 
                        style={{ width: `${Math.min((userStats.problemsSolved / 100) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    {userStats.problemsSolved >= 10 && (
                      <div className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                        <Trophy className="h-3.5 w-3.5 mr-1" /> 10+ Problems
                      </div>
                    )}
                    
                    {userStats.accuracy && userStats.accuracy >= 80 && (
                      <div className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                        <Target className="h-3.5 w-3.5 mr-1" /> 80%+ Accuracy
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
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

      {/* Sidebar - now more minimal with just icons */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-16 transform bg-white shadow-md rounded-r-xl transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0`}
      >
        <div className="flex h-16 items-center justify-center">
          <button
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 md:hidden"
            onClick={toggleSidebar}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-6 flex flex-col items-center space-y-4">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center justify-center p-3 rounded-md w-10 h-10 transition-all ${
              activeTab === "dashboard"
                ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Dashboard"
          >
            <Home className="h-5 w-5" />
          </button>
          <button
            onClick={() => setActiveTab("saved-problems")}
            className={`flex items-center justify-center p-3 rounded-md w-10 h-10 transition-all ${
              activeTab === "saved-problems"
                ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Saved Problems"
          >
            <Book className="h-5 w-5" />
          </button>
        </nav>
        <div className="absolute bottom-6 w-full flex justify-center">
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center shadow-sm hover:shadow transition-shadow" title={user?.name || 'User'}>
            <span className="text-sm font-medium text-indigo-700">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden bg-gray-50">
        <header className="flex h-12 items-center justify-between bg-gray-50 px-4 md:px-6">
          <div className="flex items-center space-x-2">
            {isPro && (
              <div className="hidden md:flex items-center space-x-1.5">
                <Badge variant="outline" className="border-amber-500 bg-amber-50 text-amber-700 flex items-center gap-1 py-1.5 pl-1.5 pr-2.5">
                  <Crown className="h-4 w-4 text-amber-500" />
                  <span>Pro Subscriber</span>
                </Badge>
              </div>
            )}
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 lg:hidden"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center md:hidden">
              <span className="text-sm font-medium text-indigo-700">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {renderContent()}
        </main>
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

const StatCard = ({ title, value, icon: Icon, iconColor, customContent }: StatCardProps) => (
  <div className="bg-white border border-gray-200 rounded-xl p-7 text-center shadow-md flex flex-col items-center min-h-[155px]">
    {customContent ? (
      <div className="mb-2">{customContent}</div>
    ) : (
      Icon && <Icon className={`w-8 h-8 mb-2 ${iconColor || 'text-indigo-500'}`} strokeWidth={1.5} />
    )}
    {value !== undefined && !customContent && (
      <div className={`text-3xl font-bold mb-1 ${iconColor || 'text-indigo-600'}`}>{value}</div>
    )}
    <div className="text-xs text-gray-500 font-medium tracking-wide mt-1">{title}</div>
  </div>
);

// Stats counter card component for SavedProblemsDashboard
interface ProblemStatsCardProps {
  value: number;
  label: string;
  color: string;
}

const ProblemStatsCard = ({ value, label, color }: ProblemStatsCardProps) => {
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
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedProblems();
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Problem Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ProblemStatsCard 
          value={problemStats.total} 
          label="Total Problems" 
          color="text-blue-600" 
        />
        <ProblemStatsCard 
          value={problemStats.regular} 
          label="Regular Level" 
          color="text-green-600" 
        />
        <ProblemStatsCard 
          value={problemStats.advanced} 
          label="Advanced Level" 
          color="text-red-600" 
        />
        <ProblemStatsCard 
          value={problemStats.subjects} 
          label="Subjects" 
          color="text-purple-600" 
        />
      </div>

      {/* Saved Problems List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Your Saved Problems</h3>
        
        {/* Problem Detail Modal */}
        {selectedProblem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedProblem.subject}</h2>
                    <p className="text-gray-600">{selectedProblem.topic}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      selectedProblem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      selectedProblem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedProblem.difficulty}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedProblem(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* Question */}
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-900 mb-2">Problem</h3>
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        components={{
                          // Applying classes to the root element
                          p: ({node, ...props}) => <p className="prose max-w-none text-indigo-800" {...props} />
                        }}
                      >
                        {selectedProblem.question}
                      </ReactMarkdown>
                    </div>
                  </div>
                  
                  {/* Solution */}
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Solution</h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        components={{
                          // Applying classes to the root element
                          p: ({node, ...props}) => <p className="prose max-w-none text-blue-800" {...props} />
                        }}
                      >
                        {selectedProblem.solution}
                      </ReactMarkdown>
                    </div>
                  </div>
                  
                  {/* Answer */}
                  {selectedProblem.answer && (
                    <div>
                      <h3 className="text-lg font-semibold text-green-900 mb-2">Answer</h3>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                          components={{
                            p: ({node, ...props}) => <p className="prose max-w-none text-green-800" {...props} />
                          }}
                        >
                          {selectedProblem.answer}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Problems Grid */}
        {savedProblems.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Book className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No saved problems yet</h3>
              <p className="text-gray-500 text-center mb-6">
                Start practicing in the Problem Lab to save problems for later review.
              </p>
              <div className="flex gap-4">
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
    </div>
  );
};

export default LoggedInDashboard;
