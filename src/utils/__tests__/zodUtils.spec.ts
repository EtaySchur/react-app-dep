import { createCustomErrorMap, demonstrateAddQuestionMarks } from '../zodUtils';
import { ZodIssueOptionalMessage } from 'zod';

describe('zodUtils', () => {
  describe('createCustomErrorMap', () => {
    it('should return a function', () => {
      const errorMap = createCustomErrorMap();
      expect(typeof errorMap).toBe('function');
    });

    it('should use custom message when field name matches', () => {
      const customMessages = {
        'email': 'Please enter a valid email address'
      };
      const errorMap = createCustomErrorMap(customMessages);
      
      const mockIssue: ZodIssueOptionalMessage = {
        code: 'invalid_type' as any,
        expected: 'string',
        received: 'number',
        path: ['email'],
        message: 'Expected string, received number'
      };
      
      const mockContext = {
        defaultError: 'Invalid input',
        data: { email: 123 }
      };

      const result = errorMap(mockIssue, mockContext);
      expect(result.message).toBe('Please enter a valid email address');
    });

    it('should fall back to default error when no custom message provided', () => {
      const errorMap = createCustomErrorMap();
      
      const mockIssue: ZodIssueOptionalMessage = {
        code: 'invalid_type' as any,
        expected: 'string',
        received: 'number',
        path: ['name'],
        message: 'Expected string, received number'
      };
      
      const mockContext = {
        defaultError: 'Invalid input',
        data: { name: 123 }
      };

      const result = errorMap(mockIssue, mockContext);
      expect(result.message).not.toBe('Please enter a valid email address');
    });

    it('should work with empty custom messages', () => {
      const errorMap = createCustomErrorMap({});
      
      const mockIssue: ZodIssueOptionalMessage = {
        code: 'invalid_type' as any,
        expected: 'string',
        received: 'number',
        path: ['test'],
        message: 'Expected string, received number'
      };
      
      const mockContext = {
        defaultError: 'Invalid input',
        data: { test: 123 }
      };

      expect(() => errorMap(mockIssue, mockContext)).not.toThrow();
    });
  });

  describe('demonstrateAddQuestionMarks', () => {
    it('should return an object with required fields', () => {
      const result = demonstrateAddQuestionMarks();
      
      expect(result).toBeDefined();
      expect(result.name).toBe('John');
      expect(result.email).toBe('john@example.com');
    });

    it('should return an object that can have optional fields undefined', () => {
      const result = demonstrateAddQuestionMarks();
      
      // Optional fields should be allowed to be undefined
      expect(result.age).toBeUndefined();
      expect(result.phone).toBeUndefined();
    });

    it('should match expected structure', () => {
      const result = demonstrateAddQuestionMarks();
      
      expect(typeof result).toBe('object');
      expect(result).toEqual(jasmine.objectContaining({
        name: jasmine.any(String),
        email: jasmine.any(String)
      }));
    });
  });
}); 