import React from 'react';
import { FastField, FieldConfig } from 'formik';

// Using FastField with FastFieldConfig from formik
// Extend FastFieldConfig with our additional HTML props
interface CustomFastFieldProps extends FieldConfig<any> {
  type?: string;
  placeholder?: string;
}

// Now we can properly use FastFieldConfig with our extended props
const CustomFastField = (props: CustomFastFieldProps) => {
  // Explicitly using FieldConfig for validate
  const { name, validate, ...inputProps } = props;
  const fieldProps: FieldConfig<any> = {
    name,
    validate
  };
  
  // Return FastField with both the original props, the FieldConfig props, and shouldUpdate
  return <FastField 
    {...inputProps} 
    {...fieldProps} 
    shouldUpdate={(nextProps: any, currentProps: any) => {
      // Custom implementation of shouldUpdate - only update if the name changes
      return nextProps.name !== currentProps.name;
    }}
  />;
};

export default CustomFastField; 