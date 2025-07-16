
"use client";

import { useParams, useRouter } from 'next/navigation';
import { mockApplicants, mockOpenPositions } from '@/lib/data';
import { Applicant, ApplicantStage } from '@/types';
import { PageHeader } from '@/components/page-header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Briefcase, Building, Calendar, Check, GraduationCap, Mail, Phone, Star, User, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';


const stageIcons: Record<ApplicantStage, React.ReactNode> = {
    'Applied': <User className="h-4 w-4" />,
    'Screening': <Mail className="h-4 w-4" />,
    'Interview': <Phone className="h-4 w-4" />,
    'Offer': <Star className="h-4 w-4" />,
    'Hired': <Check className="h-4 w-4" />,
    'Rejected': <X className="h-4 w-4" />,
}

const allStages: ApplicantStage[] = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];

export default function ApplicantDetailPage() {
    const params = useParams();
    const { positionId, applicantId } = params;
    const { toast } = useToast();

    const [applicant, setApplicant] = useState<Applicant | undefined>(() => 
        mockApplicants.find(app => app.id === applicantId && app.positionId === positionId)
    );
    const position = mockOpenPositions.find(p => p.id === positionId);

    const handleStageChange = (newStage: ApplicantStage) => {
        if (applicant) {
            setApplicant({ ...applicant, stage: newStage });
            toast({
                title: "Stage Updated",
                description: `${applicant.name}'s stage has been updated to "${newStage}".`
            });
        }
    };

    if (!applicant || !position) {
         return (
             <div className="flex flex-col">
                <PageHeader title="Applicant Not Found" />
                <div className="p-6 lg:p-8">
                    <p>The applicant or position you are looking for does not exist.</p>
                    <Button asChild className="mt-4">
                        <Link href="/hiring">Back to Hiring</Link>
                    </Button>
                </div>
            </div>
        )
    }

    const currentStageIndex = allStages.indexOf(applicant.stage);
    
    return (
        <div className="flex flex-col">
            <PageHeader 
                title="Applicant Profile" 
                description={`Candidate for ${position.title}`}
            />
             <div className="p-6 lg:p-8 grid gap-8 md:grid-cols-3">
                {/* Left Column */}
                <div className="md:col-span-1 space-y-8">
                    <Card>
                        <CardContent className="pt-6 flex flex-col items-center text-center">
                            <Avatar className="h-24 w-24 mb-4">
                                <AvatarImage src={applicant.avatar} data-ai-hint="person professional" />
                                <AvatarFallback>{applicant.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h2 className="text-2xl font-bold">{applicant.name}</h2>
                             <p className="text-muted-foreground">Applied on {format(applicant.appliedDate, "MMMM d, yyyy")}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="flex items-center gap-4">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <a href={`mailto:${applicant.email}`} className="text-sm hover:underline">
                                {applicant.email}
                                </a>
                            </div>
                            <div className="flex items-center gap-4">
                                <Phone className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm">{applicant.phone}</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Recruitment Stage</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Select value={applicant.stage} onValueChange={handleStageChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select stage" />
                                </SelectTrigger>
                                <SelectContent>
                                    {allStages.map(stage => (
                                        <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <ol className="relative mt-6 border-s border-gray-200 dark:border-gray-700">                  
                                {allStages.map((stage, index) => (
                                    <li key={stage} className="mb-6 ms-6">            
                                        <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -start-3 ring-4 ring-white dark:ring-gray-900 ${index <= currentStageIndex ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                            {stageIcons[stage]}
                                        </span>
                                        <h3 className={`font-semibold ${index <= currentStageIndex ? 'text-primary' : 'text-muted-foreground'}`}>{stage}</h3>
                                    </li>
                                ))}
                            </ol>
                        </CardContent>
                    </Card>

                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/hiring/${positionId}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Applicants
                        </Link>
                    </Button>
                </div>
                
                 {/* Right Column */}
                <div className="md:col-span-2 space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>Resume Summary</CardTitle>
                            <CardDescription>AI-generated summary of the candidate's resume.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground italic">
                                "{applicant.resumeSummary}"
                            </p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Skills</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {applicant.skills.map((skill) => (
                                <Badge key={skill} variant="secondary">
                                    {skill}
                                </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Work Experience</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="space-y-6">
                             {applicant.experience.map((exp, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                        <Briefcase className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{exp.title}</p>
                                        <p className="text-sm text-muted-foreground">{exp.company}</p>
                                        <p className="text-xs text-muted-foreground">{exp.duration}</p>
                                    </div>
                                </div>
                             ))}
                           </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Education</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="space-y-6">
                             {applicant.education.map((edu, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                        <GraduationCap className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{edu.institution}</p>
                                        <p className="text-sm text-muted-foreground">{edu.degree}</p>
                                        <p className="text-xs text-muted-foreground">{edu.year}</p>
                                    </div>
                                </div>
                             ))}
                           </div>
                        </CardContent>
                    </Card>
                </div>
             </div>
        </div>
    );
}

