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
  age: z.number().min(18, "Must be at least 18 years old").optional()
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
const ZodFormikIntegration: React.FC = () => {
  const [useExtendedForm, setUseExtendedForm] = React.useState(false);
  const [errorData, setErrorData] = React.useState<any[]>([]);

  const initialValues: ExtendedFormValues = {
    name: '',
    email: '',
    age: undefined,
    phone: '',
    address: ''
  };

  // Validation function using the actual removed Zod symbols
  const validateForm = (values: ExtendedFormValues) => {
    const errors: Partial<ExtendedFormValues> = {};
    const schema = useExtendedForm ? extendedSchema : baseSchema;
    
    try {
      schema.parse(values);
      setErrorData([]); // Clear errors if validation passes
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Store error data for display
        setErrorData(error.errors);
        
        // Map Zod errors to Formik errors using the custom error map (which uses defaultErrorMap)
        error.errors.forEach(err => {
          const fieldName = err.path[0] as keyof ExtendedFormValues;
          if (fieldName) {
            // Use our custom error map that leverages the removed defaultErrorMap function
            const ctx = { defaultError: err.message, data: values };
            const mappedError = customErrorMap(err as ZodIssueOptionalMessage, ctx);
            errors[fieldName] = mappedError.message as any;
          }
        });
      }
    }
    
    return errors;
  };

  const handleSubmit = (values: ExtendedFormValues, actions: any) => {
    setTimeout(() => {

      
      actions.setSubmitting(false);
      actions.resetForm();
    }, 1000);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <label>
          <input
            type="checkbox"
            checked={useExtendedForm}
            onChange={(e) => setUseExtendedForm(e.target.checked)}
          />
          Use Extended Form
        </label>
      </div>

      <Formik
        initialValues={initialValues}
        validate={validateForm}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, errors, touched }) => (
          <Form>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="name">Name (required):</label>
              <Field
                type="text"
                name="name"
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
              {errors.name && touched.name && (
                <div style={{ color: 'red', fontSize: '14px' }}>{errors.name}</div>
              )}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="email">Email (required):</label>
              <Field
                type="email"
                name="email"
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
              {errors.email && touched.email && (
                <div style={{ color: 'red', fontSize: '14px' }}>{errors.email}</div>
              )}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="age">Age (optional):</label>
              <Field
                type="number"
                name="age"
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
              {errors.age && touched.age && (
                <div style={{ color: 'red', fontSize: '14px' }}>{errors.age}</div>
              )}
            </div>

            {useExtendedForm && (
              <>
                <div style={{ marginBottom: '15px' }}>
                  <label htmlFor="phone">Phone (required in extended form):</label>
                  <Field
                    type="text"
                    name="phone"
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                  {errors.phone && touched.phone && (
                    <div style={{ color: 'red', fontSize: '14px' }}>{errors.phone}</div>
                  )}
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label htmlFor="address">Address (optional):</label>
                  <Field
                    type="text"
                    name="address"
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                  {errors.address && touched.address && (
                    <div style={{ color: 'red', fontSize: '14px' }}>{errors.address}</div>
                  )}
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </Form>
        )}
      </Formik>

      {errorData.length > 0 && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '5px' }}>
          <h3>Error Data (from Zod validation):</h3>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify(errorData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ZodFormikIntegration; 