import { getProblemById, getProblemsCountByTopic } from '@/lib/problems';
import PracticeProblem from '@/components/practice-problem';
import { notFound } from 'next/navigation';

interface PracticeProblemPageProps {
  params: {
    problemId: string;
  };
}

export default async function PracticeProblemPage({ params }: PracticeProblemPageProps) {
  const problem = await getProblemById(params.problemId);

  if (!problem || !problem.subject || !problem.topic) {
    notFound();
  }

  const totalProblems = await getProblemsCountByTopic(problem.subject, problem.topic);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <PracticeProblem problem={problem} totalProblems={totalProblems} />
      </div>
    </div>
  );
}
