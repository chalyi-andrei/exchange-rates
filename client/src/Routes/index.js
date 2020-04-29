import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import HomePage from '../pages/Home';
import ProfilePage from '../pages/Profile';
import SettingsPage from '../pages/Settings';
import AuthPage from '../pages/Auth';
import AboutPage from '../pages/About';

const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path="/" exact>
          <ProfilePage isAuthenticated={isAuthenticated} />
        </Route>
        <Route path="/about" exact>
          <AboutPage />
        </Route>
        <Route path="/settings" exact>
          <SettingsPage />
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
