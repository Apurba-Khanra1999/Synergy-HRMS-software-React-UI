// src/ai/flows/suggest-similar-skills.ts
'use server';

/**
 * @fileOverview Suggests similar skills based on an employee's current skills and job description.
 *
 * - suggestSimilarSkills - A function that takes an employee's skills and job description and suggests similar skills.
 * - SuggestSimilarSkillsInput - The input type for the suggestSimilarSkills function.
 * - SuggestSimilarSkillsOutput - The return type for the suggestSimilarSkills function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSimilarSkillsInputSchema = z.object({
  employeeSkills: z
    .string()
    .describe('A comma separated list of the employee current skills.'),
  jobDescription: z.string().describe('The job description of the employee.'),
});
export type SuggestSimilarSkillsInput = z.infer<typeof SuggestSimilarSkillsInputSchema>;

const SuggestSimilarSkillsOutputSchema = z.object({
  suggestedSkills: z
    .string()
    .describe('A comma separated list of skills that are similar to the employee skills and relevant to the job description.'),
});
export type SuggestSimilarSkillsOutput = z.infer<typeof SuggestSimilarSkillsOutputSchema>;

export async function suggestSimilarSkills(input: SuggestSimilarSkillsInput): Promise<SuggestSimilarSkillsOutput> {
  return suggestSimilarSkillsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSimilarSkillsPrompt',
  input: {schema: SuggestSimilarSkillsInputSchema},
  output: {schema: SuggestSimilarSkillsOutputSchema},
  prompt: `You are an HR expert. Given the employee's current skills and job description, suggest similar skills that could help them grow within the company.

Employee Skills: {{{employeeSkills}}}
Job Description: {{{jobDescription}}}

Suggested Similar Skills:`,
});

const suggestSimilarSkillsFlow = ai.defineFlow(
  {
    name: 'suggestSimilarSkillsFlow',
    inputSchema: SuggestSimilarSkillsInputSchema,
    outputSchema: SuggestSimilarSkillsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
