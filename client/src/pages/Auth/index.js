import React, { useState, useEffect, useContext } from 'react';
import M from 'materialize-css';

import { useApi } from '../../hooks/api.hook';
import { AuthContext } from '../../context/AuthContext';

const Auth = () => {
  const authData = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const { apiCall, loading, error, cleanError } = useApi();

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (error) cleanError();
  };
  const signUpHandler = async () => {
    try {
      console.log('form', form);
      const resp = await apiCall('/api/auth/register', 'post', { ...form });
    } catch (e) {
      console.log('error', e);
    }
  };

  const signInHandler = async () => {
    try {
      const resp = await apiCall('/api/auth/login', 'post', { ...form });
      console.log('resp', resp);
      authData.login(resp.token, resp.userId, resp.email);
    } catch (e) {
      console.log('error', e);
    }
  };

  useEffect(() => {
    M.updateTextFields();
  }, []);

  return (
    <div class="container">
      <div class="row">
        <div class="col s6 offset-s3">
          <h2>Create your account</h2>
          <div class="card">
            <div class="card-content white-text">
              <span class="card-title">Sign in</span>
              <div class="input-field">
                <input onChange={changeHandler} placeholder="email" id="email" name="email" type="text" />
                <label htmlFor="email">Email</label>
              </div>
              <div class="input-field">
                <input onChange={changeHandler} placeholder="password" id="password" name="password" type="password" />
                <label htmlFor="password">Password</label>
                <span class="helper-text red-text text-darken-2">{error}</span>
              </div>
            </div>

            <div class="card-action right-align">
              <button onClick={signInHandler} disabled={loading} className="btn orange mr15 lighten-1">
                Sign in
              </button>
              <button onClick={signUpHandler} disabled={loading} className="btn blue-grey darken-1">
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
