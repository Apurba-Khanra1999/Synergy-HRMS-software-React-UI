import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-similar-skills.ts';
import '@/ai/flows/generate-job-description-flow.ts';
import '@/ai/flows/parse-resume-flow.ts';
