"use client";

import { useState } from "react";
import { parseResume } from "@/ai/flows/parse-resume-flow";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2, FileText, CheckCircle } from "lucide-react";

interface ApplicantUploaderProps {
  onUploadSuccess: (applicantData: any) => void;
}

export function ApplicantUploader({ onUploadSuccess }: ApplicantUploaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileDataUri, setFileDataUri] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileDataUri(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleParseResume = async () => {
    if (!fileDataUri) {
        toast({ variant: "destructive", title: "No file selected", description: "Please choose a resume file to upload." });
        return;
    }
    setIsLoading(true);
    try {
      const result = await parseResume(fileDataUri);
      toast({ title: "Resume Parsed Successfully", description: `${result.name} has been added to the applicant list.` });
      onUploadSuccess(result);
      setIsOpen(false);
      resetState();
    } catch (error) {
      console.error("Error parsing resume:", error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Could not parse the resume. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setFileName("");
    setFileDataUri(null);
    setIsLoading(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if(!open) resetState(); setIsOpen(open); }}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Add Applicant
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Applicant</DialogTitle>
          <DialogDescription>
            Upload a resume (PDF) to automatically parse the candidate's information.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                 {fileName ? (
                    <>
                        <FileText className="w-10 h-10 mb-3 text-primary" />
                        <p className="mb-2 text-sm text-foreground"><span className="font-semibold">{fileName}</span></p>
                        <p className="text-xs text-muted-foreground">Click to change file</p>
                    </>
                 ) : (
                    <>
                        <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-muted-foreground">PDF (MAX. 5MB)</p>
                    </>
                 )}
              </div>
              <input id="dropzone-file" type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
            </label>
          </div>
          <Button onClick={handleParseResume} disabled={isLoading || !fileDataUri} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Parsing Resume...
              </>
            ) : (
               <>
                <CheckCircle className="mr-2 h-4 w-4" />
                 Parse and Add Applicant
               </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
