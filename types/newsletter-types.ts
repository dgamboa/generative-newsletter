export interface NewsletterConfig {
  title: string;
  focus: string;
  timePeriod: string;
  tone: "Formal & Professional" | "Casual & Friendly" | "Technical & Detailed";
  structure: string;
  additionalInstructions?: string;
} 