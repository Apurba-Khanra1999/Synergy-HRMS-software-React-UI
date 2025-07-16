
"use client";

import { useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { mockEmployees, mockRecognitions, mockLeaderboard } from "@/lib/data";
import { Recognition, RecognitionCategory } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Award, Send, Star, Trophy, Sparkles, Users, Heart } from "lucide-react";

const categoryIcons: Record<RecognitionCategory, React.ReactNode> = {
  "Team Player": <Users className="h-4 w-4" />,
  "Innovation": <Sparkles className="h-4 w-4" />,
  "Customer First": <Heart className="h-4 w-4" />,
  "Excellence": <Trophy className="h-4 w-4" />,
};

function GivePraiseForm() {
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast({
      title: "Praise Sent!",
      description: "Your recognition has been sent to your colleague.",
    });
    event.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-6 w-6 text-primary" />
            <span>Give Praise</span>
          </CardTitle>
          <CardDescription>
            Recognize a colleague for their hard work and contributions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employee">Select Employee</Label>
            <Select name="employee" required>
              <SelectTrigger>
                <SelectValue placeholder="Who do you want to praise?" />
              </SelectTrigger>
              <SelectContent>
                {mockEmployees.map((emp) => (
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
          <div className="space-y-2">
            <Label htmlFor="category">Select Category</Label>
            <Select name="category" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a recognition category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Team Player">Team Player</SelectItem>
                <SelectItem value="Innovation">Innovation</SelectItem>
                <SelectItem value="Customer First">Customer First</SelectItem>
                <SelectItem value="Excellence">Excellence</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Why are you recognizing them?"
              rows={4}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            <Award className="mr-2 h-4 w-4" />
            Send Recognition
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}

export default function RewardsPage() {
  const [recognitions] = useState<Recognition[]>(mockRecognitions);
  const [leaderboard] = useState(mockLeaderboard);

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Rewards & Recognition"
        description="Celebrate achievements and foster a positive work culture."
      />
      <div className="p-6 lg:p-8 grid gap-8 xl:grid-cols-3">
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-8">
           <GivePraiseForm />
           <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                See who's been recognized recently.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {recognitions.map((rec) => (
                <div key={rec.id} className="flex gap-4">
                  <Avatar>
                    <AvatarImage src={rec.from.avatar} data-ai-hint="person" />
                    <AvatarFallback>{rec.from.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold">{rec.from.name}</span> praised{" "}
                      <span className="font-semibold">{rec.to.name}</span>
                    </p>
                    <p className="text-sm text-muted-foreground italic">
                      "{rec.message}"
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                       <Badge variant="secondary" className="text-xs">
                          {categoryIcons[rec.category]}
                          <span className="ml-1">{rec.category}</span>
                       </Badge>
                       <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(rec.date, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="xl:col-span-1 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Leaderboard</CardTitle>
              <CardDescription>
                Top recognized employees this quarter.
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
                      <AvatarImage src={person.avatar} data-ai-hint="person portrait" />
                      <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">{person.name}</p>
                    </div>
                    <Badge className="text-base bg-amber-400/20 text-amber-600 hover:bg-amber-400/30 border border-amber-400/30" variant="outline">
                      <Star className="mr-2 h-4 w-4" /> {person.points}
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
