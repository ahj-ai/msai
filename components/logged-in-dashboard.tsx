"use client";

import { useState, ReactNode, useEffect } from "react";
import Link from "next/link";
import { Home, Menu, X, Trophy, Zap, Lock, LucideIcon, AlertCircle, Book, Eye, Clock, RefreshCw, Target } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase, getUserProblems, getUserWeeklyGoals, updateGoalProgress, generateDefaultWeeklyGoals } from "@/lib/supabase";
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

interface WeeklyGoal {
  id: string;
  goal_type: string;
  current: number;
  target: number;
  message: string;
  unit?: string;
  completed: boolean;
}

const WeeklyGoalCard = ({ goal, onUpdate }: { goal: WeeklyGoal; onUpdate?: (goalId: string, progress: number) => void }) => {
  const progress = Math.min(100, Math.round((goal.current / goal.target) * 100));
  
  // Define gradient colors based on progress and completion
  let gradientClass = "from-indigo-500 to-blue-600";
  let progressBarClass = "bg-blue-300";
  let iconColor = "text-blue-200";
  
  if (progress >= 100) {
    gradientClass = "from-emerald-500 to-green-600";
    progressBarClass = "bg-green-300";
    iconColor = "text-green-200";
  } else if (progress >= 66) {
    gradientClass = "from-blue-500 to-indigo-600";
    progressBarClass = "bg-blue-300";
    iconColor = "text-blue-200";
  } else if (progress >= 33) {
    gradientClass = "from-violet-500 to-purple-600";
    progressBarClass = "bg-violet-300";
    iconColor = "text-violet-200";
  } else {
    gradientClass = "from-indigo-500 to-blue-600";
    progressBarClass = "bg-indigo-300";
    iconColor = "text-indigo-200";
  }
  
  // Handle manual progress update
  const handleIncrement = () => {
    if (onUpdate && !goal.completed) {
      onUpdate(goal.id, goal.current + 1);
    }
  };
  
  // Goal type to icon mapping
  const goalTypeIcons = {
    'games_played': (
      <svg className={`w-6 h-6 ${iconColor}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 10H19C21 10 22 9 22 7V5C22 3 21 2 19 2H17C15 2 14 3 14 5V7C14 9 15 10 17 10Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 22H7C9 22 10 21 10 19V17C10 15 9 14 7 14H5C3 14 2 15 2 17V19C2 21 3 22 5 22Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 10C8.20914 10 10 8.20914 10 6C10 3.79086 8.20914 2 6 2C3.79086 2 2 3.79086 2 6C2 8.20914 3.79086 10 6 10Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18 22C20.2091 22 22 20.2091 22 18C22 15.7909 20.2091 14 18 14C15.7909 14 14 15.7909 14 18C14 20.2091 15.7909 22 18 22Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    'problems_solved': (
      <svg className={`w-6 h-6 ${iconColor}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7.5 12L10.5 15L16.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    'practice_time': (
      <svg className={`w-6 h-6 ${iconColor}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15.7099 15.18L12.6099 13.33C12.0699 13.01 11.6299 12.24 11.6299 11.61V7.51001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    'default': (
      <svg className={`w-6 h-6 ${iconColor}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 16V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  };
  
  // Get appropriate icon for goal type
  const goalIcon = goalTypeIcons[goal.goal_type as keyof typeof goalTypeIcons] || goalTypeIcons.default;
  
  return (
    <Card className="overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className={`bg-gradient-to-br ${gradientClass} h-2.5`}></div>
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <div className={`mr-3 rounded-lg p-1.5 bg-opacity-10 ${goal.completed ? 'bg-green-100' : 'bg-blue-100'}`}>
              {goalIcon}
            </div>
            <h3 className="font-semibold text-gray-800">{goal.message}</h3>
          </div>
          {goal.completed && (
            <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full font-medium">
              Completed!
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 font-medium">
            {goal.current} / {goal.target} {goal.unit || ''}
          </span>
          <span className={`text-sm font-semibold ${progress >= 100 ? 'text-green-600' : 'text-blue-600'}`}>
            {progress}%
          </span>
        </div>
        
        <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4">
          <div 
            className={`h-2.5 rounded-full ${progressBarClass}`}
            style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}
          ></div>
        </div>
        
        {onUpdate && !goal.completed && (
          <Button 
            onClick={handleIncrement}
            variant="outline" 
            size="sm" 
            className="w-full mt-1 border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors font-medium"
          >
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            Add Progress
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

const MainDashboard = ({ stats }: { stats: UserStats }) => {
  const { user } = useAuth();
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>([]);
  const [isLoadingGoals, setIsLoadingGoals] = useState(true);
  const [goalError, setGoalError] = useState<string | null>(null);

  
  // Fetch weekly goals from Supabase
  useEffect(() => {
    const fetchWeeklyGoals = async () => {
      if (!user?.id) return;
      
      setIsLoadingGoals(true);
      try {
        const { data, error, success } = await getUserWeeklyGoals(user.id);
        
        if (success && data) {
          setWeeklyGoals(data);
        } else if (error) {
          console.error('Error fetching weekly goals:', error);
          setGoalError('Failed to load weekly goals');
        }
        
        // If no goals found, generate default goals
        if (success && (!data || data.length === 0)) {
          console.log('No weekly goals found, generating defaults');
          const result = await generateDefaultWeeklyGoals(user.id);
          
          if (result.success && result.data) {
            setWeeklyGoals(result.data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch weekly goals:', err);
        setGoalError('Failed to load weekly goals');
      } finally {
        setIsLoadingGoals(false);
      }
    };
    
    fetchWeeklyGoals();
  }, [user]);
  

  
  // Handle goal progress update
  const handleGoalUpdate = async (goalId: string, progress: number) => {
    if (!user?.id) return;
    
    try {
      const { success, data, error } = await updateGoalProgress(user.id, goalId, progress);
      
      if (success && data) {
        // Update the goals in state
        setWeeklyGoals(prevGoals => 
          prevGoals.map(goal => 
            goal.id === goalId ? { ...goal, current: progress, completed: progress >= goal.target } : goal
          )
        );
      } else if (error) {
        console.error('Error updating goal progress:', error);
      }
    } catch (err) {
      console.error('Failed to update goal progress:', err);
    }
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
        
        {/* Weekly Goals Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Weekly Goals</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={async () => {
                if (user?.id) {
                  setIsLoadingGoals(true);
                  try {
                    const result = await generateDefaultWeeklyGoals(user.id);
                    if (result.success && result.data) {
                      setWeeklyGoals(result.data);
                    }
                  } catch (err) {
                    console.error('Failed to refresh goals:', err);
                  } finally {
                    setIsLoadingGoals(false);
                  }
                }
              }}
            >
              <RefreshCw className="h-4 w-4 mr-1" /> Refresh Goals
            </Button>
          </div>
          
          {isLoadingGoals ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="animate-pulse flex flex-col">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="flex justify-between mb-2">
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded w-full"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : goalError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2" />
              <p className="text-sm text-red-700">{goalError}</p>
            </div>
          ) : weeklyGoals.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
              <Target className="mx-auto h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-4">No weekly goals set</p>
              <Button 
                onClick={async () => {
                  if (user?.id) {
                    setIsLoadingGoals(true);
                    try {
                      const result = await generateDefaultWeeklyGoals(user.id);
                      if (result.success && result.data) {
                        setWeeklyGoals(result.data);
                      }
                    } catch (err) {
                      console.error('Failed to generate goals:', err);
                    } finally {
                      setIsLoadingGoals(false);
                    }
                  }
                }}
              >
                Generate Goals
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {weeklyGoals.map((goal) => (
                <WeeklyGoalCard 
                  key={goal.id} 
                  goal={goal} 
                  onUpdate={handleGoalUpdate}
                />
              ))}
            </div>
          )}
        </div>
        

        
        {/* Learning Journey Stats */}
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
