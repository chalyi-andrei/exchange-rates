import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Link } from 'react-router-dom';

import useRoutes from './Routes';
import { useAuth } from './hooks/auth.hook';
import { AuthContext } from './context/AuthContext';

const Nav = ({ isAuthenticated = false }) => (
  <nav>
    <div className="nav-wrapper teal lighten-1">
      <div className="container">
        <Link to="/" className="brand-logo">
          ExRate
        </Link>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          <li>{isAuthenticated ? <Link to="/settings">Settings</Link> : <Link to="/auth">Sign in</Link>}</li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

const Fotter = ({ isAuthenticated = false }) => (
  <footer className="page-footer footer-custom  teal lighten-1">
    <div className="footer-copyright">
      <div className="container">
        2020 ExRate
        <Link className="grey-text text-lighten-4 right" to="/about">
          About
        </Link>
      </div>
    </div>
  </footer>
);

const App = () => {
  const { email, token, userId, login, logout } = useAuth();
  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated);

  return (
    <AuthContext.Provider value={{ email, token, userId, login, logout, isAuthenticated }}>
      <Router>
        <Nav isAuthenticated={isAuthenticated} />
        <div className="main-container">
          {routes}
          <Fotter />
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
