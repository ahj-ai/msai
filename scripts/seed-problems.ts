import { supabase } from '@/lib/supabase';
import { orderOfOperationsProblems } from '@/data/problems';

async function seedProblems() {
  // Using the imported supabase client
  
  // Convert problems to database format
  const dbProblems = orderOfOperationsProblems.map(problem => {
    // Create a metadata field to store hints and full solution text
    const metadata = {
      hints: problem.hints || [],
      solution: problem.solution || ''
    };
    
    return {
      id: problem.id,
      subject: problem.subject,
      topic: problem.topic,
      difficulty: problem.difficulty,
      question: problem.question,
      solution_steps: problem.solutionSteps || [],
      answer: problem.answer,
      source_type: 'static',
      metadata: metadata
    };
  });
  
  console.log(`Seeding ${dbProblems.length} problems...`);
  
  // Insert problems one by one to handle errors better
  for (const problem of dbProblems) {
    const { data, error } = await supabase
      .from('math_problems')
      .upsert(problem, { onConflict: 'id' })
      .select('id');
      
    if (error) {
      console.error(`Error seeding problem ${problem.id}:`, error);
    } else {
      console.log(`Seeded problem ${problem.id}`);
    }
  }
  
  console.log('Seeding complete!');
}

// Run the seed function
seedProblems()
  .catch(console.error)
  .finally(() => process.exit());
