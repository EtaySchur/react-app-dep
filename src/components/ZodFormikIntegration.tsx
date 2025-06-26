import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { z } from 'zod';
import { 
  resetToDefaultErrorMap, 
  setBusinessErrorMap, 
  setStrictErrorMap,
  setOverrideErrorMap,
  createZodArrayDefExample,
  validateWithZodArrayDef
} from '../utils/zodUtils';

const UserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  age: z.number().min(18).max(120).optional(),
  phone: z.string().min(10).optional(),
  tags: z.array(z.string()).min(2).max(5)
});

type UserFormValues = z.infer<typeof UserSchema>;

type ErrorMapMode = 'default' | 'business' | 'strict' | 'override';

const ZodFormikIntegration: React.FC = () => {
  const [errorMapMode, setErrorMapMode] = useState<ErrorMapMode>('default');

  const handleSetDefaultErrorMap = () => {
    resetToDefaultErrorMap();
    setErrorMapMode('default');
  };

  const handleSetBusinessErrorMap = () => {
    setBusinessErrorMap();
    setErrorMapMode('business');
  };

  const handleSetStrictErrorMap = () => {
    setStrictErrorMap();
    setErrorMapMode('strict');
  };

  const handleSetOverrideErrorMap = () => {
    setOverrideErrorMap();
    setErrorMapMode('override');
  };

  const validateForm = (values: UserFormValues) => {
    try {
      UserSchema.parse(values);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            formErrors[err.path[0]] = err.message;
          }
        });
        return formErrors;
      }
      return {};
    }
  };

  const getButtonStyle = (mode: ErrorMapMode) => ({
    padding: '8px 16px',
    margin: '0 8px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: errorMapMode === mode ? '#007bff' : '#6c757d',
    color: 'white',
    fontSize: '14px'
  });

  const getFormStyle = () => {
    switch (errorMapMode) {
      case 'business':
        return {
          border: '2px solid #28a745',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          padding: '20px'
        };
      case 'strict':
        return {
          border: '2px solid #dc3545',
          backgroundColor: '#fff5f5',
          borderRadius: '4px',
          padding: '20px'
        };
      case 'override':
        return {
          border: '2px solid #ffc107',
          backgroundColor: '#fffdf0',
          borderRadius: '8px',
          padding: '20px'
        };
      default:
        return {
          border: '1px solid #dee2e6',
          backgroundColor: 'white',
          padding: '20px'
        };
    }
  };

  const arrayDefInfo = createZodArrayDefExample();

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h2>Zod Error Map Implementation</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Active Mode: <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{errorMapMode}</span></h3>
        <button onClick={handleSetDefaultErrorMap} style={getButtonStyle('default')}>
          Default Map
        </button>
        <button onClick={handleSetBusinessErrorMap} style={getButtonStyle('business')}>
          Business Map
        </button>
        <button onClick={handleSetStrictErrorMap} style={getButtonStyle('strict')}>
          Strict Map
        </button>
        <button onClick={handleSetOverrideErrorMap} style={getButtonStyle('override')}>
          Override Map
        </button>
      </div>

      <div style={getFormStyle()}>
        <Formik
          initialValues={{ name: '', email: '', age: undefined, phone: '', tags: [''] }}
          validate={validateForm}
          onSubmit={(values) => {
            const tags = values.tags.filter(t => t.trim());
            const validation = validateWithZodArrayDef(arrayDefInfo, tags);
            
            if (validation.isValid) {
              alert(`Form submitted with ${errorMapMode} error mapping! Tags validation: ✅ Valid (${validation.details.length} items)`);
            } else {
              alert(`Form submitted with ${errorMapMode} error mapping! Tags validation: ❌ Invalid - ${validation.errors.join(', ')}`);
            }
          }}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
                <Field 
                  type="text" 
                  id="name" 
                  name="name" 
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
                />
                <ErrorMessage name="name">
                  {msg => <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{msg}</div>}
                </ErrorMessage>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                <Field 
                  type="email" 
                  id="email" 
                  name="email" 
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
                />
                <ErrorMessage name="email">
                  {msg => <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{msg}</div>}
                </ErrorMessage>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="age" style={{ display: 'block', marginBottom: '5px' }}>Age (optional):</label>
                <Field 
                  type="number" 
                  id="age" 
                  name="age" 
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
                />
                <ErrorMessage name="age">
                  {msg => <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{msg}</div>}
                </ErrorMessage>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="phone" style={{ display: 'block', marginBottom: '5px' }}>Phone (optional):</label>
                <Field 
                  type="text" 
                  id="phone" 
                  name="phone" 
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
                />
                <ErrorMessage name="phone">
                  {msg => <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{msg}</div>}
                </ErrorMessage>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Tags (2-5 required):</label>
                {values.tags.map((tag, index) => (
                  <div key={index} style={{ display: 'flex', marginBottom: '5px' }}>
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => {
                        const newTags = [...values.tags];
                        newTags[index] = e.target.value;
                        setFieldValue('tags', newTags);
                      }}
                      style={{ flex: 1, padding: '8px', border: '1px solid #ccc', marginRight: '8px' }}
                      placeholder={`Tag ${index + 1}`}
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newTags = values.tags.filter((_, i) => i !== index);
                          setFieldValue('tags', newTags);
                        }}
                        style={{ padding: '8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFieldValue('tags', [...values.tags, ''])}
                  style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', marginTop: '5px' }}
                >
                  Add Tag
                </button>
                <ErrorMessage name="tags">
                  {msg => <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{msg}</div>}
                </ErrorMessage>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                style={{ 
                  padding: '10px 20px', 
                  backgroundColor: '#007bff', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Submit Form
              </button>
            </Form>
          )}
        </Formik>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h4>Error Map Usage:</h4>
        <ul style={{ fontSize: '14px' }}>
          <li><strong>Default:</strong> Standard Zod error messages</li>
          <li><strong>Business:</strong> User-friendly messages with emojis</li>
          <li><strong>Strict:</strong> Formal, strict validation messages</li>
        </ul>
      </div>
    </div>
  );
};

export default ZodFormikIntegration; 