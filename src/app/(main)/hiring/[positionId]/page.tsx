
"use client";

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { mockApplicants, mockOpenPositions } from '@/lib/data';
import { Applicant } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ApplicantUploader } from './applicant-uploader';
import { ArrowLeft } from 'lucide-react';

export default function ApplicantsPage() {
    const params = useParams();
    const router = useRouter();
    const { positionId } = params;

    const [applicants, setApplicants] = useState<Applicant[]>(() => 
        mockApplicants.filter(app => app.positionId === positionId)
    );

    const position = mockOpenPositions.find(p => p.id === positionId);

    if (!position) {
        return (
             <div className="flex flex-col">
                <PageHeader title="Position Not Found" />
                <div className="p-6 lg:p-8">
                    <p>The position you are looking for does not exist.</p>
                    <Button asChild className="mt-4">
                        <Link href="/hiring">Back to Hiring</Link>
                    </Button>
                </div>
            </div>
        )
    }

    const handleNewApplicant = (newApplicantData: any) => {
        const newApplicant: Applicant = {
            id: `APP${Math.floor(Math.random() * 1000)}`,
            avatar: `https://source.unsplash.com/random/100x100/?person,${newApplicantData.name.split(' ')[0]}`,
            appliedDate: new Date(),
            stage: 'Applied',
            positionId: positionId as string,
            ...newApplicantData
        };
        setApplicants(prev => [newApplicant, ...prev]);
    }
    
    const handleRowClick = (applicantId: string) => {
        router.push(`/hiring/${positionId}/${applicantId}`);
    };

    return (
        <div className="flex flex-col">
            <PageHeader
                title={`Applicants for ${position.title}`}
                description={`Tracking ${applicants.length} candidates for this role.`}
                actions={<ApplicantUploader onUploadSuccess={handleNewApplicant} />}
            />
            <div className='p-6 lg:p-8'>
                 <Button variant="outline" size="sm" asChild className='mb-6'>
                    <Link href="/hiring">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to All Positions
                    </Link>
                </Button>
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Candidate</TableHead>
                                <TableHead>Applied</TableHead>
                                <TableHead>Stage</TableHead>
                                <TableHead>Contact</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applicants.map(applicant => (
                                <TableRow key={applicant.id} onClick={() => handleRowClick(applicant.id)} className="cursor-pointer">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={applicant.avatar} data-ai-hint="person portrait" />
                                                <AvatarFallback>{applicant.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{applicant.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {formatDistanceToNow(applicant.appliedDate, { addSuffix: true })}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{applicant.stage}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {applicant.email}
                                    </TableCell>
                                </TableRow>
                            ))}
                             {applicants.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">
                                        No applicants for this position yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </div>
    )
}
