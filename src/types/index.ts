// Define type for our extended form values
export interface ExtendedFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  rememberMe: boolean;
  hobbies: string[];
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
} 