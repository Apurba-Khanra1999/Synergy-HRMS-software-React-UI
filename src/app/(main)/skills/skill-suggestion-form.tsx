"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { suggestSimilarSkills } from "@/ai/flows/suggest-similar-skills";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  employeeSkills: z.string().min(1, "Please enter at least one skill."),
  jobDescription: z.string().min(20, "Job description must be at least 20 characters."),
});

export function SkillSuggestionForm() {
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeSkills: "",
      jobDescription: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSuggestedSkills([]);
    try {
      const result = await suggestSimilarSkills(values);
      if (result && result.suggestedSkills) {
        setSuggestedSkills(result.suggestedSkills.split(",").map((s) => s.trim()).filter(s => s));
      } else {
        throw new Error("No suggestions returned.");
      }
    } catch (error) {
      console.error("Error suggesting skills:", error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Could not fetch skill suggestions. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="employeeSkills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Employee Skills</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., React, Node.js, Project Management"
                    {...field}
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="jobDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Job Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the employee's role and responsibilities..."
                    {...field}
                    rows={8}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Suggest Skills
          </Button>
        </form>
      </Form>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Suggested Skills</h3>
        <Card className="min-h-[200px]">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : suggestedSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {suggestedSkills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-base px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                <p>AI-powered skill suggestions will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
