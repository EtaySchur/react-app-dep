import { 
  ZodIssueOptionalMessage, 
  defaultErrorMap,
  objectUtil
} from 'zod';

// Utility function using the removed defaultErrorMap
export const createCustomErrorMap = (customMessages: Record<string, string> = {}) => {
  return (issue: ZodIssueOptionalMessage, ctx: { defaultError: string; data: any }) => {
    const defaultResult = defaultErrorMap(issue, ctx);
    
    const fieldName = issue.path?.[0];
    if (fieldName && customMessages[fieldName as string]) {
      return { message: customMessages[fieldName as string] };
    }
    
    return defaultResult;
  };
};

// Example type for demonstrating addQuestionMarks
export type ExampleFormType = {
  name: string;
  email: string;
  age?: number;
  phone?: string;
};

export type TransformedFormType = objectUtil.addQuestionMarks<ExampleFormType>;

// Simple demo
export const demonstrateAddQuestionMarks = (): TransformedFormType => {
  return {
    name: "John",
    email: "john@example.com"
    // age and phone are optional
  };
}; 