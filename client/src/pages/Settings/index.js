import React, { useContext } from 'react';

import { AuthContext } from '../../context/AuthContext';

const Settings = (props) => {
  const authData = useContext(AuthContext);

  return (
    <div class="container">
      <button class="btn waves-effect waves-light right" onClick={authData.logout}>
        logout
      </button>
      <h2>Настройки</h2>
      <div class="row">
        <div class="col s12 ">
          <div class="card">
            <div class="card-content">
              <p>Ваш email: {authData.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
