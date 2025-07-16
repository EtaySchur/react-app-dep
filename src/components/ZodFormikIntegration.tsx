import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

type FormValues = z.infer<typeof schema>;

const initialValues: FormValues = { name: '', email: '' };

function validate(values: FormValues) {
  try {
    schema.parse(values);
    return {};
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      err.errors.forEach(e => {
        errors[e.path[0] as string] = e.message;
      });
      return errors;
    }
    return {};
  }
}

const ZodFormikIntegration: React.FC = () => (
  <div style={{ maxWidth: 400, margin: '40px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
    <h2>Simple Formik + Zod Example</h2>
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        alert('Submitted: ' + JSON.stringify(values, null, 2));
        setSubmitting(false);
        resetForm();
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="name">Name</label>
            <Field id="name" name="name" type="text" />
            <ErrorMessage name="name">
              {msg => <div style={{ color: 'red', fontSize: 12 }}>{msg}</div>}
            </ErrorMessage>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="email">Email</label>
            <Field id="email" name="email" type="email" />
            <ErrorMessage name="email">
              {msg => <div style={{ color: 'red', fontSize: 12 }}>{msg}</div>}
            </ErrorMessage>
          </div>
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  </div>
);

export default ZodFormikIntegration; 