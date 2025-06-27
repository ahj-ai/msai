'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { FlaskConical, HelpCircle, ArrowRight, Book, TestTube2 } from 'lucide-react';
import { subjects, difficulties, wordProblemTopics } from '@/lib/problem-constants';
import { Difficulty } from '@/types/math';
import { availableTopicsBySubject } from '@/lib/available-topics';

// Helper Components
const TestTubeMeter = ({ progress }: { progress: number }) => (
  <div className="w-10 h-10 flex items-center justify-center">
    <TestTube2 className="w-8 h-8 text-indigo-300" />
    <div className="absolute w-8 h-8 flex items-end">
      <motion.div
        className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-b-md"
        initial={{ height: 0 }}
        animate={{ height: `${progress}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  </div>
);

const ProblemCountButton = ({ count, selected, onClick }: { count: number, selected: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-10 h-10 rounded-full transition-all duration-200 flex items-center justify-center font-semibold border-2 ${selected ? 'bg-indigo-600 text-white border-indigo-600 scale-110 shadow-lg' : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50'}`}
  >
    {count}
  </button>
);

interface ProblemSetupProps {
  subject: keyof typeof subjects;
  setSubject: (value: keyof typeof subjects) => void;
  topic: string;
  setTopic: (value: string) => void;
  isTopicDropdownOpen: boolean;
  setIsTopicDropdownOpen: (value: boolean) => void;
  setComingSoonOpen: (value: boolean) => void;
  setComingSoonTopics: (value: { subject: string; topics: string[] }) => void;
  difficulty: Difficulty;
  handleDifficultyChange: (value: Difficulty) => void;
  problemCount: number;
  setProblemCount: (value: number) => void;
  wordProblems: boolean;
  setWordProblems: (value: boolean) => void;
  setupProgress: number;
  generateProblems: () => void;
  isLoading: boolean;
  isSignedIn: boolean;
}

const ProblemSetup: React.FC<ProblemSetupProps> = ({
  subject,
  setSubject,
  topic,
  setTopic,
  isTopicDropdownOpen,
  setIsTopicDropdownOpen,
  difficulty,
  handleDifficultyChange,
  problemCount,
  setProblemCount,
  wordProblems,
  setWordProblems,
  generateProblems,
  isLoading,
  isSignedIn,
}) => {
  return (
    <Card className="w-full max-w-3xl mx-auto bg-white shadow-md border border-gray-100 rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 pb-5">
        <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-3">
          <FlaskConical className="w-7 h-7" />
          The Practice Hub
        </CardTitle>
        <p className="text-indigo-100 mt-1">Strengthen your math skills through focused practice and repetition.</p>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Subject</Label>
              <Select value={subject} onValueChange={(value) => setSubject(value as keyof typeof subjects)}>
                <SelectTrigger className="mt-2 bg-white border border-gray-200 text-gray-800 h-10 hover:bg-gray-50 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-150">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-md">
                  {Object.entries(subjects).map(([key, { name }]) => (
                    <SelectItem key={key} value={key} className="text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-150">
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Topic</Label>
              <Select value={topic} onValueChange={setTopic} onOpenChange={setIsTopicDropdownOpen}>
                <SelectTrigger className="mt-2 bg-white border border-gray-200 text-gray-800 h-10 hover:bg-gray-50 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-150">
                  <SelectValue placeholder="Select a topic..." />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-md max-h-60 overflow-y-auto">
                  {Object.entries(subjects[subject].topicGroups).map(([groupName, topics]) => {
                    // Skip 'Coming Soon' topic groups
                    if (groupName === '🔜 Coming Soon') {
                      return null;
                    }
                    
                    // Filter topics to only show those that have problems available in the database
                    const availableTopicsForSubject = availableTopicsBySubject[subject] || [];
                    const filteredTopics = (topics as string[]).filter(topic => 
                      availableTopicsForSubject.includes(topic)
                    );
                    
                    // Skip empty topic groups after filtering
                    if (filteredTopics.length === 0) {
                      return null;
                    }
                    
                    return (
                      <div key={groupName}>
                        <div className="px-2 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50/70 sticky top-0 z-10">
                          {groupName}
                        </div>
                        {filteredTopics.map((t) => (
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

          <Button
            onClick={generateProblems}
            disabled={!topic || isLoading}
            className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-base tracking-wide rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:shadow-md"
          >
            {isLoading ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                Generating Problems...
              </>
            ) : (
              <>
                Try a Problem
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>

          
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
      </CardContent>
    </Card>
  );
};

export default ProblemSetup;
