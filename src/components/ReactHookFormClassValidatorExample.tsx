import React, { useState } from 'react';
import { 
  useForm,
  UseFormMethods,
  FormOptions,
  UseControllerMethods,
  ControllerProps,
  InputState,
  HandleChange,
  ArrayField,
  UseFieldArrayMethods,
  UseFieldArrayOptions,
  OmitResetState
} from 'react-hook-form';
import { 
  validate,
  validateOrReject,
  IsAlpha,
  IsAlphanumeric,
  MaxDate,
  MinDate,
  ValidationError,
  ValidationSchema
} from 'class-validator';

interface UserFormData {
  id: string;
  name: string;
  email: string;
  birthDate: Date;
  locale: string;
  hobbies: string[];
}

class UserDTO {
  name: string = '';
  username: string = '';
  birthDate: Date = new Date();
  validFromDate: Date = new Date();
}

const ReactHookFormClassValidatorExample: React.FC = () => {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [submitData, setSubmitData] = useState<any>(null);

  const formOptions: FormOptions<UserFormData> = {
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      id: '',
      name: '',
      email: '',
      birthDate: new Date(),
      locale: 'en-US',
      hobbies: []
    },
    shouldFocusError: true,
    shouldUnregister: false,
    criteriaMode: 'firstError'
  };

  const formMethods: UseFormMethods<UserFormData> = useForm(formOptions);
  const { register, handleSubmit, errors, formState, reset, getValues, setValue, trigger } = formMethods;

  const controllerOptions: ControllerProps<UserFormData> = {
    name: 'name',
    defaultValue: '',
    control: formMethods.control,
    onFocus: () => console.log('Field focused')
  };

  const handleFormReset = () => {
    const omitResetState: OmitResetState = {
      errors: false,
      isDirty: true,
      isSubmitted: true,
      touched: false,
      isValid: false,
      submitCount: false,
      dirtyFields: true
    };
    
    reset(undefined, omitResetState);
  };

  const handleValidationWithClassValidator = async () => {
    const user = new UserDTO();
    user.name = getValues('name');
    user.username = getValues('email');
    user.birthDate = getValues('birthDate');
    user.validFromDate = new Date('1950-01-01');

    // Use individual validation functions (breaking changes)
    const isAlphaResult = IsAlpha('en-US' as any);
    const isAlphanumericResult = IsAlphanumeric('en-US' as any);
    const maxDateResult = MaxDate(new Date() as any);
    const minDateResult = MinDate(new Date('1900-01-01') as any);
    
    console.log('Individual validators (breaking APIs):', {
      isAlphaResult,
      isAlphanumericResult, 
      maxDateResult,
      minDateResult
    });

    // Use validate function
    const validationErrors = await validate(user);
    if (validationErrors.length > 0) {
      setValidationErrors(validationErrors);
      validationErrors.forEach((error: ValidationError) => {
        const errorMessage = error.toString(true, false, '');
        console.log('Validation error (old signature):', errorMessage);
      });
    }

    try {
      await validateOrReject(user);
      console.log('Class-validator validation passed');
    } catch (errors) {
      if (Array.isArray(errors)) {
        setValidationErrors(errors as ValidationError[]);
        errors.forEach((error: ValidationError) => {
          const errorMessage = error.toString(true, false, '');
          console.log('Validation error (old signature):', errorMessage);
        });
      }
    }
  };

  const createFieldArrayMethods = (): UseFieldArrayMethods<any> => {
    const fieldArrayOptions: UseFieldArrayOptions = {
      name: 'hobbies',
      keyName: 'id'
    };
    
    console.log('Field array options:', fieldArrayOptions);
    
    const fieldArrayMethods: UseFieldArrayMethods<any> = {
      swap: (indexA: number, indexB: number) => console.log('Swap', indexA, indexB),
      move: (indexA: number, indexB: number) => console.log('Move', indexA, indexB),
      prepend: (value: any, shouldFocus?: boolean) => console.log('Prepend', value, shouldFocus),
      append: (value: any, shouldFocus?: boolean) => console.log('Append', value, shouldFocus),
      remove: (index?: number | number[]) => console.log('Remove', index),
      insert: (index: number, value: any, shouldFocus?: boolean) => console.log('Insert', index, value, shouldFocus),
      fields: []
    };
    
    return fieldArrayMethods;
  };

  const handleChange: HandleChange = async (event: Event) => {
    console.log('Handle change event:', event);
    return true;
  };

  const createArrayField = (): ArrayField => {
    const arrayField: ArrayField = {
      id: 'unique-id',
      name: 'Example Item',
      value: 'some value'
    };
    
    return arrayField;
  };



  const createControllerMethods = (): UseControllerMethods<UserFormData> => {
    const mockControllerMethods: UseControllerMethods<UserFormData> = {
      field: {
        onChange: () => {},
        onBlur: () => {},
        value: '',
        name: 'name',
        ref: { current: null }
      },
      meta: {
        invalid: false,
        isTouched: false,
        isDirty: false
      }
    };
    
    return mockControllerMethods;
  };

  const createValidationSchema = (): ValidationSchema => {
    const schema: ValidationSchema = {
      name: 'userSchema',
      properties: {
        name: [{
          type: 'isAlpha',
          constraints: ['en-US'],
          message: 'Name must contain only letters',
          each: false,
          always: false,
          groups: ['default'],
          options: {}
        }],
        email: [{
          type: 'isEmail',
          constraints: [],
          message: 'Must be a valid email',
          each: false,
          always: true,
          groups: ['default'],
          options: {}
        }]
      }
    };
    
    return schema;
  };

  const onSubmit = async (data: UserFormData) => {
    setSubmitData(data);
    await handleValidationWithClassValidator();
    
    const fieldArrayMethods = createFieldArrayMethods();
    const arrayField = createArrayField();
    const validationSchema = createValidationSchema();
    const controllerMethods = createControllerMethods();
    
    // Use setValue and trigger from formMethods
    setValue('locale', 'fr-FR');
    await trigger('name');
    
    // Use handleChange
    const mockEvent = new Event('change');
    await handleChange(mockEvent);
    
    console.log('Form submitted with breaking change APIs:', {
      data,
      fieldArrayMethods,
      arrayField,
      validationSchema,
      controllerOptions,
      controllerMethods,
      formOptions
    });
  };

  const getInputState = (fieldName: keyof UserFormData): InputState => {
    return {
      invalid: !!errors[fieldName],
      isTouched: !!formState.touched[fieldName],
      isDirty: !!formState.dirtyFields[fieldName]
    };
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>
            Name (IsAlpha with string locale - BREAKING):
          </label>
          <input
            id="name"
            name="name"
            ref={register({ required: 'Name is required' })}
            style={{ 
              width: '100%', 
              padding: '8px',
              border: errors.name ? '2px solid red' : '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          {errors.name && <span style={{ color: 'red', fontSize: '12px' }}>{errors.name.message}</span>}
          <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
            Input State: {JSON.stringify(getInputState('name'))}
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
            Email:
          </label>
          <input
            id="email"
            name="email"
            type="email"
            ref={register({ required: 'Email is required' })}
            style={{ 
              width: '100%', 
              padding: '8px',
              border: errors.email ? '2px solid red' : '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          {errors.email && <span style={{ color: 'red', fontSize: '12px' }}>{errors.email.message}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="birthDate" style={{ display: 'block', marginBottom: '5px' }}>
            Birth Date (MaxDate with Date - BREAKING):
          </label>
          <input
            id="birthDate"
            name="birthDate"
            type="date"
            ref={register({ required: 'Birth date is required' })}
            style={{ 
              width: '100%', 
              padding: '8px',
              border: errors.birthDate ? '2px solid red' : '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          {errors.birthDate && <span style={{ color: 'red', fontSize: '12px' }}>{errors.birthDate.message}</span>}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <button 
            type="submit"
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Submit (Test Breaking Changes)
          </button>
          
          <button 
            type="button"
            onClick={handleFormReset}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Reset (OmitResetState)
          </button>
          
          <button 
            type="button"
            onClick={handleValidationWithClassValidator}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Validate with Class-Validator
          </button>
        </div>
      </form>

      {validationErrors.length > 0 && (
        <div style={{ 
          backgroundColor: '#f8d7da', 
          border: '1px solid #f5c6cb', 
          borderRadius: '4px', 
          padding: '10px',
          marginTop: '20px'
        }}>
          <h4>Class-Validator Errors (using old toString signature):</h4>
          <ul>
            {validationErrors.map((error, index) => (
              <li key={index}>
                <strong>{error.property}:</strong> {Object.values(error.constraints || {}).join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}

      {submitData && (
        <div style={{ 
          backgroundColor: '#d4edda', 
          border: '1px solid #c3e6cb', 
          borderRadius: '4px', 
          padding: '10px',
          marginTop: '20px'
        }}>
          <h4>Submitted Data:</h4>
          <pre style={{ fontSize: '12px' }}>{JSON.stringify(submitData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ReactHookFormClassValidatorExample; 