import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Link } from 'react-router-dom';

import useRoutes from './Routes';

const Nav = () => (
  <nav>
    <div class="nav-wrapper teal lighten-1">
      <div className="container">
        <Link to="/" class="brand-logo">
          ExRate
        </Link>
        <ul id="nav-mobile" class="right hide-on-med-and-down">
          <li>
            <Link to="/auth">Sign in</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

const App = () => {
  const routes = useRoutes(false);

  return (
    <div>
      <Router>
        <Nav />
        {routes}
      </Router>
    </div>
  );
};

export default App;
