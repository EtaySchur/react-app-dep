import { 
  ZodIssueOptionalMessage, 
  defaultErrorMap,
  overrideErrorMap,
  setErrorMap,
  z,
  ZodArrayDef
} from 'zod';

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

export const businessErrorMap = (issue: ZodIssueOptionalMessage, ctx: any) => {
  switch (issue.code) {
    case 'too_small':
      if (issue.type === 'string') {
        return { message: `⚠️ Minimum ${issue.minimum} characters required for security` };
      }
      return { message: `⚠️ Value must be at least ${issue.minimum}` };
    case 'too_big':
      return { message: `⚠️ Maximum ${issue.maximum} characters allowed` };
    case 'invalid_type':
      return { message: `❌ Expected ${issue.expected}, but got ${issue.received}` };
    case 'invalid_string':
      if (issue.validation === 'email') {
        return { message: '📧 Please enter a valid email address' };
      }
      return { message: '❌ Invalid format' };
    default:
      return defaultErrorMap(issue, ctx);
  }
};

export const strictErrorMap = (issue: ZodIssueOptionalMessage, ctx: any) => {
  switch (issue.code) {
    case 'too_small':
      return { message: `STRICT: Field requires minimum ${issue.minimum} characters. No exceptions.` };
    case 'too_big':
      return { message: `STRICT: Field exceeds maximum ${issue.maximum} characters. Trim content.` };
    case 'invalid_type':
      return { message: `STRICT: Invalid data type. Expected ${issue.expected}.` };
    case 'invalid_string':
      if (issue.validation === 'email') {
        return { message: 'STRICT: Email format is invalid. Check syntax.' };
      }
      return { message: 'STRICT: String format violation.' };
    default:
      return { message: 'STRICT: Validation error occurred.' };
  }
};

export const customOverrideErrorMap = (issue: ZodIssueOptionalMessage, ctx: any) => {
  const overrideResult = overrideErrorMap(issue, ctx);
  
  switch (issue.code) {
    case 'too_small':
      return { message: `OVERRIDE: ${overrideResult.message} (Custom override applied)` };
    case 'invalid_type':
      return { message: `OVERRIDE: ${overrideResult.message} (Type mismatch detected)` };
    case 'invalid_string':
      return { message: `OVERRIDE: ${overrideResult.message} (Format validation failed)` };
    default:
      return { message: `OVERRIDE: ${overrideResult.message}` };
  }
};

export const setBusinessErrorMap = () => {
  setErrorMap(businessErrorMap);
  return { active: true, mode: 'business' };
};

export const setStrictErrorMap = () => {
  setErrorMap(strictErrorMap);
  return { active: true, mode: 'strict' };
};

export const setOverrideErrorMap = () => {
  setErrorMap(customOverrideErrorMap);
  return { active: true, mode: 'override' };
};

export const resetToDefaultErrorMap = () => {
  setErrorMap(defaultErrorMap);
  return { active: false, mode: 'default' };
};



export type ExampleFormType = {
  name: string;
  email: string;
  age?: number;
  phone?: string;
};

export const createZodArrayDefExample = (): ZodArrayDef => {
  const schema = z.array(z.string()).min(2).max(5);
  
  const customArrayDef: ZodArrayDef = {
    typeName: schema._def.typeName,
    type: schema._def.type,
    minLength: schema._def.minLength,
    maxLength: schema._def.maxLength
  };

  return customArrayDef;
};

export const validateWithZodArrayDef = (arrayDef: ZodArrayDef, data: unknown[]): {
  isValid: boolean;
  errors: string[];
  details: {
    isArray: boolean;
    length: number;
    minLength?: number;
    maxLength?: number;
    elementType: string;
  };
} => {
  const errors: string[] = [];
  const isArray = Array.isArray(data);
  
  const details = {
    isArray,
    length: isArray ? data.length : 0,
    minLength: arrayDef.minLength?.value,
    maxLength: arrayDef.maxLength?.value,
    elementType: arrayDef.type._def.typeName || 'unknown'
  };

  if (!isArray) {
    errors.push(`Expected array, got ${typeof data}`);
    return { isValid: false, errors, details };
  }

  if (arrayDef.minLength && data.length < arrayDef.minLength.value) {
    errors.push(`Array too short: ${data.length} < ${arrayDef.minLength.value}`);
  }

  if (arrayDef.maxLength && data.length > arrayDef.maxLength.value) {
    errors.push(`Array too long: ${data.length} > ${arrayDef.maxLength.value}`);
  }

  data.forEach((item, index) => {
    try {
      arrayDef.type.parse(item);
    } catch (error) {
      const message = error instanceof z.ZodError ? error.errors[0].message : 'Invalid';
      errors.push(`Element ${index}: ${message}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    details
  };
};