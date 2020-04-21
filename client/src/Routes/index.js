import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import HomePage from '../pages/Home';
import AuthPage from '../pages/Auth';
import AboutPage from '../pages/About';

const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route path="/about" exact>
          <AboutPage />
        </Route>
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" exact>
        <HomePage isAuthenticated={true} />
      </Route>
      <Route path="/about" exact>
        <AboutPage />
      </Route>
      <Route path="/auth" exact>
        <AuthPage />
      </Route>
      <Redirect to="/" />
    </Switch>
  );
};

export default useRoutes;
