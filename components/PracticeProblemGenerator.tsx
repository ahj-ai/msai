'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProblemSetup from './ProblemSetup';
import { Difficulty } from '@/types/math';
import { subjects } from '@/lib/problem-constants';

// Props Interface
interface PracticeProblemGeneratorProps {
  noProblemsFound: boolean;
  setNoProblemsFound: (value: boolean) => void;
  problemCount: number;
  subject: keyof typeof subjects;
  setSubject: (value: keyof typeof subjects) => void;
  topic: string;
  setTopic: (value: string) => void;
  isTopicDropdownOpen: boolean;
  setIsTopicDropdownOpen: (value: boolean) => void;
  comingSoonOpen: boolean;
  setComingSoonOpen: (value: boolean) => void;
  comingSoonTopics: { subject: string; topics: string[] };
  setComingSoonTopics: (value: { subject: string; topics: string[] }) => void;
  difficulty: Difficulty;
  handleDifficultyChange: (value: Difficulty) => void;
  setProblemCount: (value: number) => void;
  wordProblems: boolean;
  setWordProblems: (value: boolean) => void;
  setupProgress: number;
  generateProblems: () => void;
  isLoading: boolean;
  isSignedIn: boolean;
}

const PracticeProblemGenerator: React.FC<PracticeProblemGeneratorProps> = ({
  noProblemsFound,
  setNoProblemsFound,
  problemCount,
  subject,
  setSubject,
  topic,
  setTopic,
  isTopicDropdownOpen,
  setIsTopicDropdownOpen,
  comingSoonOpen,
  setComingSoonOpen,
  comingSoonTopics,
  setComingSoonTopics,
  difficulty,
  handleDifficultyChange,
  setProblemCount,
  wordProblems,
  setWordProblems,
  setupProgress,
  generateProblems,
  isLoading,
  isSignedIn,
}) => {
  return (
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

      <ProblemSetup
        subject={subject}
        setSubject={setSubject}
        topic={topic}
        setTopic={setTopic}
        isTopicDropdownOpen={isTopicDropdownOpen}
        setIsTopicDropdownOpen={setIsTopicDropdownOpen}
        setComingSoonOpen={setComingSoonOpen}
        setComingSoonTopics={setComingSoonTopics}
        difficulty={difficulty}
        handleDifficultyChange={handleDifficultyChange}
        problemCount={problemCount}
        setProblemCount={setProblemCount}
        wordProblems={wordProblems}
        setWordProblems={setWordProblems}
        setupProgress={setupProgress}
        generateProblems={generateProblems}
        isLoading={isLoading}
        isSignedIn={isSignedIn}
      />
    </>
  );
};

export default PracticeProblemGenerator;
