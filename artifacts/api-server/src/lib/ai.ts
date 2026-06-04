import type { ClientRequestServiceType } from "@workspace/db";

interface AnalyzeClientRequestInput {
  serviceType: ClientRequestServiceType;
  title: string;
  description: string;
  budgetRange?: string | null;
  expectedTimeline?: string | null;
}

export function analyzeClientRequest(input: AnalyzeClientRequestInput) {
  const timeline = input.expectedTimeline || "To be confirmed after admin review";
  const priceRange = input.budgetRange || "Requires admin estimate";

  return {
    summary: `${input.serviceType.replace(/_/g, " ")} request: ${input.title}. ${input.description.slice(0, 220)}`,
    suggestedPriceRange: priceRange,
    missingQuestions: [
      "What is the final delivery deadline?",
      "Who will approve milestones?",
      "Are there existing brand, content, or technical assets?",
    ],
    suggestedTimeline: timeline,
    suggestedTaskCategories: ["Discovery", "Implementation", "Review", "Deployment"],
  };
}
