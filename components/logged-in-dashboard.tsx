"use client";

import { useState, ReactNode, useEffect } from "react";
import Link from "next/link";
import { Brain, FlaskConical, Home, Menu, X, Trophy, Zap, Lock, LucideIcon, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
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
        linkText="Start Practicing"
        linkHref="/brainiac"
      />
      <FeatureCard
        title="Problem Lab"
        description="Generate custom math problems tailored to your skill level and learning goals."
        icon={FlaskConical}
        linkText="Try Problem Lab"
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
            <StatCard title="Best Streak" value={stats.bestStreak} />
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
          title="Timed Challenge"
          description="Solve as many problems as you can in 60 seconds"
          icon={Zap}
          linkText="Start Timed"
          linkHref="/brainiac/timed"
        />
        <GameModeCard
          title="Endless Mode"
          description="Practice at your own pace with no time limit"
          icon={Trophy}
          linkText="Start Endless"
          linkHref="/brainiac/endless"
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
  const subjects = ["Arithmetic", "Algebra", "Geometry", "Calculus"];
  const difficulties = ["Beginner", "Intermediate", "Advanced"];
  const problemTypes = [
    { name: "Multiple Choice", premium: false },
    { name: "Free Response", premium: false },
    { name: "Word Problems", premium: true },
    { name: "Step-by-Step Solutions", premium: true },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Problem Lab</h1>
        <p className="text-gray-600">Generate custom math problems to practice</p>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-lg font-medium text-gray-900">Subject Areas</h2>
        <div className="flex flex-wrap gap-2">
          {subjects.map((subject) => (
            <span
              key={subject}
              className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800"
            >
              {subject}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-lg font-medium text-gray-900">Difficulty Levels</h2>
        <div className="flex flex-wrap gap-2">
          {difficulties.map((difficulty) => (
            <span
              key={difficulty}
              className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800"
            >
              {difficulty}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-lg font-medium text-gray-900">Problem Types</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {problemTypes.map((type) => (
            <div
              key={type.name}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <span className="text-sm font-medium text-gray-900">{type.name}</span>
              {type.premium && (
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                  <Lock className="mr-1 h-3 w-3" />
                  Premium
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-medium text-gray-900">Recently Generated Problems</h2>
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-sm text-gray-500">
            Your recently generated problems will appear here
          </p>
          <Button className="mt-4" variant="outline">
            Generate New Problem
          </Button>
        </div>
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
