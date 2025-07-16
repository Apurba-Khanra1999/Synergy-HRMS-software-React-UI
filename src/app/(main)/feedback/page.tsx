
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { mockEmployees, mockFeedback } from "@/lib/data";
import { Feedback, FeedbackCategory, Employee } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Send, ThumbsUp, Lightbulb, AlertTriangle, User, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const categoryIcons: Record<FeedbackCategory, React.ReactNode> = {
  "Praise": <ThumbsUp className="h-4 w-4" />,
  "Suggestion": <Lightbulb className="h-4 w-4" />,
  "Concern": <AlertTriangle className="h-4 w-4" />,
};

const managerTitles = ['Senior Software Engineer', 'Product Manager', 'Sales Director'];
const departments = [...new Set(mockEmployees.map(e => e.department))];


function GiveFeedbackForm() {
  const { toast } = useToast();
  const [recipientType, setRecipientType] = useState<'manager' | 'employee' | 'all'>('all');
  const [fromDepartment, setFromDepartment] = useState<Employee['department'] | null>(null);

  const filteredRecipients = useMemo(() => {
    if (recipientType === 'manager') {
      return mockEmployees.filter(emp => managerTitles.includes(emp.title));
    }
    if (recipientType === 'employee') {
      return mockEmployees.filter(emp => !managerTitles.includes(emp.title));
    }
    return mockEmployees;
  }, [recipientType]);
  
  const fromEmployees = useMemo(() => {
    if (!fromDepartment) return [];
    return mockEmployees.filter(emp => emp.department === fromDepartment);
  }, [fromDepartment]);


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const isAnonymous = formData.get('anonymous') === 'on';

    toast({
      title: "Feedback Sent!",
      description: `Your ${isAnonymous ? 'anonymous ' : ''}feedback has been shared.`,
    });
    event.currentTarget.reset();
    setRecipientType('all');
    setFromDepartment(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-6 w-6 text-primary" />
            <span>Give Feedback</span>
          </CardTitle>
          <CardDescription>
            Share your thoughts, praise, or concerns with a colleague.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="space-y-2">
            <Label htmlFor="fromDepartment">From Department</Label>
            <Select onValueChange={(value: Employee['department']) => setFromDepartment(value)}>
              <SelectTrigger id="fromDepartment">
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fromEmployee">From</Label>
            <Select name="fromEmployee" required disabled={!fromDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Select an employee" />
              </SelectTrigger>
              <SelectContent>
                {fromEmployees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={emp.avatar} data-ai-hint="person" />
                        <AvatarFallback>{emp.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{emp.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
           <div className="space-y-2">
            <Label htmlFor="recipientType">To (Recipient Type)</Label>
            <Select onValueChange={(value: 'manager' | 'employee' | 'all') => setRecipientType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a recipient type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="employee">To</Label>
            <Select name="employee" required>
              <SelectTrigger>
                <SelectValue placeholder="Select an employee or manager" />
              </SelectTrigger>
              <SelectContent>
                {filteredRecipients.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={emp.avatar} data-ai-hint="person" />
                        <AvatarFallback>{emp.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{emp.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select name="category" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a feedback category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Praise">Praise</SelectItem>
                <SelectItem value="Suggestion">Suggestion</SelectItem>
                <SelectItem value="Concern">Concern</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Share your feedback..."
              rows={4}
              required
            />
          </div>
           <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="anonymous" className="text-base">Send Anonymously</Label>
                <p className="text-sm text-muted-foreground">
                  Your name will not be shared with the recipient.
                </p>
              </div>
              <Switch id="anonymous" name="anonymous" />
          </div>
          <Button type="submit" className="w-full">
            <MessageSquare className="mr-2 h-4 w-4" />
            Send Feedback
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}

export default function FeedbackPage() {
  const [feedbackItems] = useState<Feedback[]>(mockFeedback);

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Feedback Hub"
        description="Foster a culture of open communication and continuous improvement."
      />
      <div className="p-6 lg:p-8 grid gap-8 xl:grid-cols-3">
        {/* Left Column */}
        <div className="xl:col-span-1">
           <GiveFeedbackForm />
        </div>

        {/* Right Column */}
        <div className="xl:col-span-2 space-y-8">
           <Card>
            <CardHeader>
              <CardTitle>Recent Feedback</CardTitle>
              <CardDescription>
                A live feed of feedback being shared across the company.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {feedbackItems.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <Avatar>
                    {item.isAnonymous ? (
                      <AvatarFallback><EyeOff className="h-5 w-5"/></AvatarFallback>
                    ) : (
                      <>
                        <AvatarImage src={item.from.avatar} data-ai-hint="person" />
                        <AvatarFallback>{item.from.name.charAt(0)}</AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold">
                        {item.isAnonymous ? "Anonymous" : item.from.name}
                      </span>{" "}
                      gave feedback to{" "}
                      <span className="font-semibold">{item.to.name}</span>
                    </p>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 my-2 rounded-md italic">
                      "{item.message}"
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                       <Badge variant="secondary" className="text-xs">
                          {categoryIcons[item.category]}
                          <span className="ml-1.5">{item.category}</span>
                       </Badge>
                       <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(item.date, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
