import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Link } from 'react-router-dom';

import useRoutes from './Routes';
import { useAuth } from './hooks/auth.hook';
import { AuthContext } from './context/AuthContext';

const Nav = ({ isAuthenticated = false }) => (
  <nav>
    <div class="nav-wrapper teal lighten-1">
      <div className="container">
        <Link to="/" class="brand-logo">
          ExRate
        </Link>
        <ul id="nav-mobile" class="right hide-on-med-and-down">
          <li>{isAuthenticated ? <Link to="/settings">Settings</Link> : <Link to="/auth">Sign in</Link>}</li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

const App = () => {
  const { email, token, userId, login, logout } = useAuth();
  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated);

  return (
    <AuthContext.Provider value={{ email, token, userId, login, logout, isAuthenticated }}>
      <Router>
        <Nav isAuthenticated={isAuthenticated} />
        {routes}
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
