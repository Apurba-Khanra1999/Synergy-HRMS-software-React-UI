'use server';

/**
 * @fileOverview Generates a professional job description using AI.
 *
 * - generateJobDescription - A function that takes a job title and keywords to generate a job description.
 * - GenerateJobDescriptionInput - The input type for the generateJobDescription function.
 * - GenerateJobDescriptionOutput - The return type for the generateJobDescription function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateJobDescriptionInputSchema = z.object({
  jobTitle: z.string().describe('The title of the job position.'),
  keywords: z
    .string()
    .describe(
      'A comma-separated list of key responsibilities, skills, or qualifications for the job.'
    ),
});
export type GenerateJobDescriptionInput = z.infer<
  typeof GenerateJobDescriptionInputSchema
>;

const GenerateJobDescriptionOutputSchema = z.object({
  jobDescription: z
    .string()
    .describe(
      'A complete and professional job description, formatted in Markdown.'
    ),
});
export type GenerateJobDescriptionOutput = z.infer<
  typeof GenerateJobDescriptionOutputSchema
>;

export async function generateJobDescription(
  input: GenerateJobDescriptionInput
): Promise<GenerateJobDescriptionOutput> {
  return generateJobDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateJobDescriptionPrompt',
  input: { schema: GenerateJobDescriptionInputSchema },
  output: { schema: GenerateJobDescriptionOutputSchema },
  prompt: `You are an expert HR copywriter. Your task is to generate a comprehensive and appealing job description based on the provided job title and keywords.

The output should be in Markdown format and include the following sections:
- **Job Summary:** A brief, engaging overview of the role.
- **Key Responsibilities:** A bulleted list of the main duties.
- **Qualifications:** A bulleted list of required skills, experience, and education.
- **Company Bio:** A short, generic paragraph about "Synergy Corp", a dynamic and innovative company.

Job Title: {{{jobTitle}}}
Keywords: {{{keywords}}}

Generate the job description now.`,
});

const generateJobDescriptionFlow = ai.defineFlow(
  {
    name: 'generateJobDescriptionFlow',
    inputSchema: GenerateJobDescriptionInputSchema,
    outputSchema: GenerateJobDescriptionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
