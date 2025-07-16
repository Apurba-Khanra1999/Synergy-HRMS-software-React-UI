'use server';

/**
 * @fileOverview An AI flow for parsing resumes and extracting structured data.
 *
 * - parseResume - A function that takes a resume file as a data URI and returns structured applicant data.
 * - ParseResumeOutput - The return type for the parseResume function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { ParseResumeOutputSchema, type ParseResumeOutput as ParseResumeOutputType } from '@/types';

export type ParseResumeOutput = ParseResumeOutputType;

export async function parseResume(resumeDataUri: string): Promise<ParseResumeOutput> {
  return parseResumeFlow(resumeDataUri);
}

const prompt = ai.definePrompt({
  name: 'parseResumePrompt',
  input: { schema: z.string() },
  output: { schema: ParseResumeOutputSchema },
  prompt: `You are an expert resume parser for an Applicant Tracking System. Your task is to extract structured information from the provided resume.

Analyze the resume content and extract the following information:
- Full Name
- Email Address
- Phone Number
- A list of key skills (e.g., programming languages, software, soft skills).
- Work experience, including job title, company, and duration.
- Education, including institution, degree, and year.
- A concise 2-3 sentence summary of the applicant's profile.

Resume:
{{media url=input}}

Extract the information now.`,
});

const parseResumeFlow = ai.defineFlow(
  {
    name: 'parseResumeFlow',
    inputSchema: z.string(),
    outputSchema: ParseResumeOutputSchema,
  },
  async (resumeDataUri) => {
    const { output } = await prompt(resumeDataUri);
    return output!;
  }
);
