import React from 'react';
import { Formik, Form, Field } from 'formik';
import { 
  z, 
  ZodIssueOptionalMessage
} from 'zod';
import { 
  createCustomErrorMap, 
  demonstrateAddQuestionMarks
} from '../utils/zodUtils';

// Define form values using standard TypeScript
interface ExtendedFormValues {
  name: string;
  email: string;
  age?: number;
  phone: string;
  address?: string;
}

// Create Zod schemas
const baseSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  age: z.number().min(18, "Must be at least 18 years old").optional(),
});

const extendedSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  age: z.number().min(18, "Must be at least 18 years old").optional(),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  address: z.string().optional()
});

// Custom error mapping using the removed defaultErrorMap function
const customErrorMap = createCustomErrorMap({
  name: "Name is too short - please enter at least 2 characters",
  email: "Please provide a valid email address",
  phone: "Phone number must be at least 10 digits",
  age: "Age must be at least 18"
});

// Component demonstrating the ACTUAL removed Zod symbols with Formik
const handleSubmit = (values: ExtendedFormValues, actions: FormikHelpers<ExtendedFormValues>) => {
  setTimeout(() => {
    actions.setSubmitting(false);
    actions.resetForm();
  }, 1000);
};

export default ZodFormikIntegration; 