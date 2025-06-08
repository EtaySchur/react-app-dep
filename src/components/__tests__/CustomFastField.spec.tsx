import React from 'react';
import ReactDOM from 'react-dom';
import { Formik, Form } from 'formik';
import CustomFastField from '../CustomFastField';

describe('CustomFastField Component', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    document.body.removeChild(container);
  });

  it('should render within Formik context', () => {
    const initialValues = { testField: '' };

    ReactDOM.render(
      <Formik
        initialValues={initialValues}
        onSubmit={() => {}}
      >
        <Form>
          <CustomFastField 
            name="testField" 
            type="text" 
            placeholder="Test field"
            className="test-input"
          />
        </Form>
      </Formik>, 
      container
    );

    const input = container.querySelector('input[name="testField"]');
    expect(input).toBeTruthy();
  });

  it('should pass props to FastField', () => {
    const initialValues = { email: '' };

    ReactDOM.render(
      <Formik
        initialValues={initialValues}
        onSubmit={() => {}}
      >
        <Form>
          <CustomFastField 
            name="email" 
            type="email" 
            placeholder="Enter email"
            className="email-input"
          />
        </Form>
      </Formik>, 
      container
    );

    const input = container.querySelector('input[name="email"]') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.type).toBe('email');
    expect(input.placeholder).toBe('Enter email');
    expect(input.className).toContain('email-input');
  });

  it('should handle validation function', () => {
    const initialValues = { validatedField: '' };
    const validateFn = jasmine.createSpy('validate').and.returnValue(undefined);

    ReactDOM.render(
      <Formik
        initialValues={initialValues}
        onSubmit={() => {}}
      >
        <Form>
          <CustomFastField 
            name="validatedField" 
            validate={validateFn}
          />
        </Form>
      </Formik>, 
      container
    );

    const input = container.querySelector('input[name="validatedField"]');
    expect(input).toBeTruthy();
    // Validation is typically called during form interaction
  });

  it('should render without optional props', () => {
    const initialValues = { minimalField: '' };

    ReactDOM.render(
      <Formik
        initialValues={initialValues}
        onSubmit={() => {}}
      >
        <Form>
          <CustomFastField name="minimalField" />
        </Form>
      </Formik>, 
      container
    );

    const input = container.querySelector('input[name="minimalField"]');
    expect(input).toBeTruthy();
  });
}); 