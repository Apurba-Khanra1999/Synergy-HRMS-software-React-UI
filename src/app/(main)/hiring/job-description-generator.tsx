
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { generateJobDescription } from "@/ai/flows/generate-job-description-flow";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Wand2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockOpenPositions } from "@/lib/data";

const formSchema = z.object({
  jobTitle: z.string().min(3, "Job title must be at least 3 characters."),
  department: z.string().min(1, "Please select a department."),
  location: z.string().min(2, "Please enter a location."),
  keywords: z.string().min(10, "Please provide at least 10 characters of keywords."),
});

type FormData = z.infer<typeof formSchema>;

interface JobDescriptionGeneratorProps {
    onCreatePosition: (position: Omit<z.infer<typeof formSchema>, 'keywords'>) => void;
}

const departments = [...new Set(mockOpenPositions.map(p => p.department))];

export function JobDescriptionGenerator({ onCreatePosition }: JobDescriptionGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState("");
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: "",
      department: "",
      location: "",
      keywords: "",
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setGeneratedDescription("");
    try {
      const result = await generateJobDescription({
        jobTitle: values.jobTitle,
        keywords: values.keywords,
      });
      if (result && result.jobDescription) {
        setGeneratedDescription(result.jobDescription);
      } else {
        throw new Error("No description was generated.");
      }
    } catch (error) {
      console.error("Error generating job description:", error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Could not generate job description. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleCreatePosition = () => {
    const values = form.getValues();
    const { keywords, ...positionData } = values;
    onCreatePosition(positionData);
    toast({
        title: "Position Created",
        description: `The "${values.jobTitle}" position has been added.`
    });
    setIsOpen(false);
    form.reset();
    setGeneratedDescription("");
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
            form.reset();
            setGeneratedDescription("");
        }
    }}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Position
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create New Position</DialogTitle>
          <DialogDescription>
            First, use the AI generator to create a professional job description.
          </DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-8 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Senior Product Manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {departments.map(dep => <SelectItem key={dep} value={dep}>{dep}</SelectItem>)}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., Remote" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>
              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keywords / Responsibilities</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Manages product lifecycle, works with engineering, user research, agile methodologies"
                        {...field}
                        rows={6}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Generate Description
              </Button>
            </form>
          </Form>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Generated Description</h3>
            <ScrollArea className="h-96 w-full rounded-md border p-4">
              {isLoading && (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}
              {generatedDescription ? (
                <div
                  className="prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: generatedDescription.replace(/\n/g, '<br />') }}
                />
              ) : (
                !isLoading && (
                   <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                    <p>The generated job description will appear here.</p>
                  </div>
                )
              )}
            </ScrollArea>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleCreatePosition} disabled={!generatedDescription || isLoading}>
            Create Position
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
