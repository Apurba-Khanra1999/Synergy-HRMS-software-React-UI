import { PageHeader } from "@/components/page-header";
import { SkillSuggestionForm } from "./skill-suggestion-form";

export default function SkillsPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Skills Gap Analysis"
        description="Use AI to identify potential training opportunities for employees based on their current skills and job descriptions."
      />
      <div className="p-6 lg:p-8">
        <SkillSuggestionForm />
      </div>
    </div>
  );
}
