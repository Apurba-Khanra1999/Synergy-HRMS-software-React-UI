
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, ShieldCheck, FileText, ArrowRight, CheckCircle, Award, Zap, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockHealthPlans, currentUserPlan as initialUserPlan } from "@/lib/data";
import { HealthPlan } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator";

function CoverageDetail({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="flex justify-between text-sm">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium">{typeof value === 'number' ? `$${value.toLocaleString()}`: value}</p>
    </div>
  )
}

export default function HealthPage() {
    const { toast } = useToast();
    const [currentUserPlan, setCurrentUserPlan] = useState<HealthPlan>(initialUserPlan);
    
    const handleUpgradePlan = (plan: HealthPlan) => {
        setCurrentUserPlan(plan);
        toast({
            title: "Plan Selected!",
            description: `You have selected the ${plan.name}. Changes will be effective next enrollment period.`,
        });
    };

    const handleActionClick = (message: string) => {
        toast({
            title: "Action Triggered",
            description: message,
        });
    };
  
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Health & Wellness"
        description="Your central hub for health benefits, wellness programs, and support resources."
      />
      <div className="p-6 lg:p-8 grid gap-8 xl:grid-cols-3">
        
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-8">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                  <span>Your Current Plan</span>
                </CardTitle>
                <CardDescription>
                    This is your currently enrolled health insurance plan.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-semibold text-lg">{currentUserPlan.name} ({currentUserPlan.type})</p>
                            <p className="text-sm text-muted-foreground">Provider: {currentUserPlan.provider}</p>
                        </div>
                         <Badge variant="secondary" className="text-base">${currentUserPlan.monthlyPremium}/mo</Badge>
                    </div>
                     <Separator />
                    <div className="space-y-2">
                        <h4 className="font-medium">Coverage Details</h4>
                        <CoverageDetail label="Deductible" value={currentUserPlan.coverageDetails.deductible} />
                        <CoverageDetail label="Out-of-Pocket Max" value={currentUserPlan.coverageDetails.outOfPocketMax} />
                        <CoverageDetail label="Primary Care Visit" value={currentUserPlan.coverageDetails.primaryCareVisit} />
                        <CoverageDetail label="Specialist Visit" value={currentUserPlan.coverageDetails.specialistVisit} />
                    </div>
                </div>
              </CardContent>
               <CardFooter>
                 <Button variant="outline" className="w-full" onClick={() => handleActionClick("Navigating to detailed coverage portal.")}>
                    View Full Plan Document (PDF)
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Available Health Plans</CardTitle>
                    <CardDescription>Browse other plans offered by Synergy Corp. You can change plans during the next open enrollment period.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {mockHealthPlans.filter(p => p.id !== currentUserPlan.id).map(plan => (
                        <div key={plan.id} className="border rounded-lg p-4">
                           <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-lg">{plan.name} ({plan.type})</p>
                                    <p className="text-sm text-muted-foreground">Provider: {plan.provider}</p>
                                </div>
                                <Badge variant="outline" className="text-base">${plan.monthlyPremium}/mo</Badge>
                            </div>
                            <Accordion type="single" collapsible className="w-full mt-2">
                              <AccordionItem value="item-1">
                                <AccordionTrigger className="text-sm">View Coverage Details</AccordionTrigger>
                                <AccordionContent className="space-y-2 pt-2">
                                     <CoverageDetail label="Deductible" value={plan.coverageDetails.deductible} />
                                     <CoverageDetail label="Out-of-Pocket Max" value={plan.coverageDetails.outOfPocketMax} />
                                     <CoverageDetail label="Primary Care Visit" value={plan.coverageDetails.primaryCareVisit} />
                                     <CoverageDetail label="Specialist Visit" value={plan.coverageDetails.specialistVisit} />
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                            <Button size="sm" className="w-full mt-4" onClick={() => handleUpgradePlan(plan)}>
                                <Award className="mr-2 h-4 w-4" />
                                Select this Plan
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
        
        {/* Right Column */}
        <div className="xl:col-span-1 space-y-8">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-primary" />
                  <span>Wellness Programs</span>
                </CardTitle>
                 <CardDescription>
                    Participate in company-wide wellness challenges and activities.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                 <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <p className="text-sm">Annual "Step Up" walking challenge</p>
                    </div>
                    <div className="flex items-center gap-4">
                         <CheckCircle className="h-5 w-5 text-green-500" />
                         <p className="text-sm">Monthly yoga and meditation sessions</p>
                    </div>
                     <div className="flex items-center gap-4">
                         <CheckCircle className="h-5 w-5 text-green-500" />
                         <p className="text-sm">Nutrition workshops</p>
                    </div>
                 </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleActionClick("Viewing current wellness challenges.")}>
                    Explore Challenges
                </Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BrainCircuit className="h-6 w-6 text-primary" />
                  <span>Mental Health Support</span>
                </CardTitle>
                 <CardDescription>
                    Access confidential counseling services and mental wellness resources.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                 <div className="space-y-2">
                    <p className="text-sm">Synergy Corp offers 5 free confidential therapy sessions per year through our partner, BetterMind.</p>
                 </div>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" className="w-full" onClick={() => handleActionClick("Redirecting to mental health support partner.")}>
                    Learn More & Get Support
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  <span>Medical Claims</span>
                </CardTitle>
                 <CardDescription>
                    Submit and track your medical claims for reimbursement.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="p-4 text-center border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">You have no pending claims.</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleActionClick("Opening new medical claim form.")}>
                    Submit a New Claim
                </Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-6 w-6 text-primary" />
                        <span>Join Our Community</span>
                    </CardTitle>
                    <CardDescription>Connect with colleagues in our wellness community channels.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">
                        Share tips, celebrate wins, and find support in our dedicated Slack channels for fitness, healthy eating, and mental well-being.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => handleActionClick("Opening Slack community channels.")}>
                        Connect on Slack
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
