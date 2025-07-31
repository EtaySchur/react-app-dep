import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Link, Redirect, RouteComponentProps } from 'react-router-dom';
import FormikComplexFormWrapper from './components/FormikComplexFormWrapper';
import ZodFormikIntegration from './components/ZodFormikIntegration';
import QueryExampleWrapper from './components/QueryExampleWrapper';
import SafeQueryExampleWrapper from './components/SafeQueryExampleWrapper';
import QueryAdvancedExampleWrapper from './components/QueryAdvancedExampleWrapper';
import Home from './components/Home';
import ParameterExample from './components/ParameterExample';
import ActionExample from './components/ActionExample';
import ChildrenExample from './components/ChildrenExample';
import StaticContextExample from './components/StaticContextExample';
import RoutesExample from './components/RoutesExample';
// import HighlightDemo from './components/HighlightDemo';
// import LanguageRegistration from './components/LanguageRegistration';
// import HighlightAPIDemo from './components/HighlightDemo';
import SimpleHighlightDemo from './components/SimpleHighlightDemo';
import AgGridExample from './components/AgGridExample';
import ReactHookFormClassValidatorExample from './components/ReactHookFormClassValidatorExample';
import LiveDataExample from './components/LiveDataExample';
import './styles.css';
import 'highlight.js/styles/github.css';

const Navigation = () => (
  <div className="navigation">
    <ul className="nav-links">
      <li><Link to="/">Home</Link></li>
      <li><Link to="/query-advanced">Query Advanced</Link></li>
      <li><Link to="/safe-query">Safe Query</Link></li>
      <li><Link to="/query">Query Example</Link></li>
      <li><Link to="/formik">Formik Form</Link></li>
      <li><Link to="/zod-formik">Zod + Formik</Link></li>
      {/* <li><Link to="/protected">Protected Route</Link></li>
      <li><Link to="/action">Action Example</Link></li>
      <li><Link to="/children">Children Function</Link></li>
      <li><Link to="/static-context">Static Context</Link></li>
      <li><Link to="/routes">Routes Example</Link></li>
      <li><Link to="/highlight">Highlight.js Legacy APIs</Link></li>
      <li><Link to="/language-registration">Language Registration</Link></li> */}
      <li><Link to="/ag-grid">AG-Grid Breaking Changes</Link></li>
      <li><Link to="/react-hook-form">React Hook Form + Class Validator</Link></li>
      <li><Link to="/live-data">Live Express API Data</Link></li>
      {/* <li><Link to="/legacy-highlight">Highlight.js Legacy APIs</Link></li> */}
      <li><Link to="/simple-highlight">Simple Highlight Demo</Link></li>
      {/* <li><Link to="/comparison">API Comparison</Link></li> */}
      <li><Link to="/react-query">React Query</Link></li>
      {/* <li><Link to="/zod">Zod</Link></li> */}
      {/* <li><Link to="/express">Express</Link></li>
      <li><Link to="/api-test">API Test</Link></li> */}
    </ul>
  </div>
);

// A component to demonstrate React Router's render prop pattern
const NoMatch: React.FC<RouteComponentProps> = ({ location }) => (
  <div className="no-match">
    <h2>Page Not Found</h2>
    <p>No match for <code>{location.pathname}</code></p>
    <Link to="/">Go to Home</Link>
  </div>
);

// TypeScript interface for protected route props
interface ProtectedRouteProps {
  component: React.ComponentType<RouteComponentProps<any>>;
  isAuthenticated: boolean;
  path: string;
  exact?: boolean;
}

// Example of a protected route using redirect - common in v4.3.1
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, isAuthenticated, ...rest }) => (
  <Route
    {...rest}
    render={(props: RouteComponentProps) =>
      isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

const App = () => {
  // Simulating authentication state - typically would come from a context or state
  const isAuthenticated = true;
  
  return (
    <div className="app-container">
      <Navigation />
      <div className="content">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/query-advanced" component={QueryAdvancedExampleWrapper} />
          {/* <Route path="/safe-query" component={SafeQueryExampleWrapper} /> */}
          <Route path="/query" component={QueryExampleWrapper} />
          <Route path="/formik" component={FormikComplexFormWrapper} />
          <Route path="/zod-formik" component={ZodFormikIntegration} />
          {/* <Route path="/highlight" component={HighlightDemo} /> */}
          <Route path="/ag-grid" component={AgGridExample} />
          <Route path="/react-hook-form" component={ReactHookFormClassValidatorExample} />
          <Route path="/live-data" component={LiveDataExample} />
          {/* <Route path="/legacy-highlight" component={HighlightAPIDemo} /> */}
          <Route path="/simple-highlight" component={SimpleHighlightDemo} />
          
          {/* Protected route example (v4.3.1 feature) */}
          <ProtectedRoute  
            path="/protected" 
            component={FormikComplexFormWrapper} 
            isAuthenticated={isAuthenticated} 
          />
          
          {/* Redirect example */}
          <Redirect from="/old-path" to="/query" />
          
          {/* 404 route - must be last */}
          <Route component={NoMatch} />
        </Switch>
      </div>
    </div>
  );
};

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
); 