
"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { mockEmployees, mockReferrals, mockOpenPositions, mockReferralLeaderboard } from "@/lib/data";
import { Referral, ReferralLeaderboardEntry, OpenPosition, Employee } from "@/types";
import { format } from "date-fns";
import { Gift, Send, Star, Trophy, Upload, FileText } from "lucide-react";

const departments = [...new Set(mockEmployees.map(e => e.department))];

function SubmitReferralForm() {
  const { toast } = useToast();
  const [fileName, setFileName] = useState("");
  const [selectedDept, setSelectedDept] = useState<Employee['department'] | null>(null);

  const filteredEmployees = useMemo(() => {
    if (!selectedDept) return [];
    return mockEmployees.filter(e => e.department === selectedDept);
  }, [selectedDept]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast({
      title: "Referral Submitted!",
      description: "Thank you for helping us grow our team.",
    });
    event.currentTarget.reset();
    setFileName("");
    setSelectedDept(null);
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-6 w-6 text-primary" />
            <span>Submit a Referral</span>
          </CardTitle>
          <CardDescription>
            Know someone who would be a great fit? Refer them here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="grid md:grid-cols-2 gap-4">
               <div className="space-y-2">
                <Label htmlFor="department">Referring Department</Label>
                <Select onValueChange={(val: Employee['department']) => setSelectedDept(val)}>
                    <SelectTrigger id="department">
                        <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                        {departments.map(dept => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-2">
                <Label htmlFor="employee">Referring Employee</Label>
                <Select name="employee" required disabled={!selectedDept}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredEmployees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={`https://source.unsplash.com/random/100x100/?${emp.name.split(' ')[0]}`} data-ai-hint="person" />
                            <AvatarFallback>{emp.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{emp.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
           </div>
           <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="candidateName">Candidate Name</Label>
                <Input id="candidateName" placeholder="e.g., Jane Doe" required />
            </div>
             <div className="space-y-2">
                <Label htmlFor="candidateEmail">Candidate Email</Label>
                <Input id="candidateEmail" type="email" placeholder="e.g., jane.doe@example.com" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Referred For</Label>
            <Select name="position" required>
              <SelectTrigger>
                <SelectValue placeholder="Select an open position" />
              </SelectTrigger>
              <SelectContent>
                {mockOpenPositions.filter(p => p.status !== 'Closed').map((pos) => (
                  <SelectItem key={pos.id} value={pos.id}>
                    {pos.title} - {pos.department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Candidate's Resume</Label>
            <Input id="resume-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx"/>
            <Button asChild variant="outline" className="w-full">
              <Label htmlFor="resume-upload" className="cursor-pointer">
                {fileName ? <FileText className="mr-2 h-4 w-4" /> : <Upload className="mr-2 h-4 w-4" />}
                {fileName || "Choose file"}
              </Label>
            </Button>
          </div>
          <Button type="submit" className="w-full">
            <Gift className="mr-2 h-4 w-4" />
            Submit Referral
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}

export default function ReferralsPage() {
  const [referrals] = useState<Referral[]>(mockReferrals);
  const [leaderboard] = useState<ReferralLeaderboardEntry[]>(mockReferralLeaderboard);
  
  const getStatusBadgeVariant = (status: Referral['status']) => {
    switch (status) {
        case 'Hired': return 'bg-green-500/20 text-green-700 border-green-500/20';
        case 'Interviewing': return 'bg-purple-500/20 text-purple-700 border-purple-500/20';
        case 'Screening': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/20';
        case 'Applied': return 'bg-blue-500/20 text-blue-700 border-blue-500/20';
        default: return 'bg-red-500/20 text-red-700 border-red-500/20';
    }
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Employee Referrals"
        description="Help build our team and get rewarded for it."
      />
      <div className="p-6 lg:p-8 grid gap-8 xl:grid-cols-3">
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-8">
           <SubmitReferralForm />
           <Card>
            <CardHeader>
              <CardTitle>My Referral History</CardTitle>
              <CardDescription>
                Track the status of your past referrals.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Candidate</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Reward</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {referrals.map((ref) => (
                           <TableRow key={ref.id}>
                               <TableCell className="font-medium">{ref.candidateName}</TableCell>
                               <TableCell>{ref.positionTitle}</TableCell>
                               <TableCell>{format(ref.date, "MMM d, yyyy")}</TableCell>
                               <TableCell>
                                   <Badge variant="outline" className={getStatusBadgeVariant(ref.status)}>{ref.status}</Badge>
                               </TableCell>
                               <TableCell className="font-semibold text-green-600">{ref.rewardStatus === 'Paid' ? `$${ref.rewardAmount}` : 'Pending'}</TableCell>
                           </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="xl:col-span-1 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Referral Leaderboard</CardTitle>
              <CardDescription>
                Top referrers this quarter.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {leaderboard.map((person, index) => (
                <div key={person.employeeId}>
                  <div className="flex items-center gap-4">
                    <div className="font-bold w-6 text-lg text-muted-foreground flex items-center justify-center">
                       {index < 3 ? (
                        <Trophy className={`h-6 w-6 ${
                          index === 0 ? 'text-yellow-500' :
                          index === 1 ? 'text-gray-400' :
                          'text-orange-600'
                        }`} />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={person.avatar} data-ai-hint="person" />
                      <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">{person.name}</p>
                    </div>
                    <Badge className="text-base bg-green-400/20 text-green-600 hover:bg-green-400/30 border border-green-400/30" variant="outline">
                      <Gift className="mr-2 h-4 w-4" /> {person.successfulReferrals}
                    </Badge>
                  </div>
                  {index < leaderboard.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
