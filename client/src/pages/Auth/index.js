import React, { useState } from 'react';
import axios from 'axios';

const Auth = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const changeHandler = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const signUpHandler = async () => {
    try {
      console.log('form', form);
      const resp = await axios.post('/api/auth/register', { ...form });
      console.log('resp', resp);
    } catch (e) {
      console.log('error', e);
    }
  };
  const signInHandler = async () => {
    try {
      console.log('form', form);
      const resp = await axios.post('/api/auth/login', { ...form });
      console.log('resp', resp);
    } catch (e) {
      console.log('error', e);
    }
  };

  return (
    <div class="container">
      <div class="row">
        <div class="col s6 offset-s3">
          <div class="card teal">
            <div class="card-content white-text">
              <span class="card-title">Sign in</span>
              <div class="input-field">
                <input onChange={changeHandler} placeholder="email@gmail.com" id="email" name="email" type="text" />
                <label htmlFor="email">Email</label>
              </div>
              <div class="input-field">
                <input onChange={changeHandler} placeholder="password" id="password" name="password" type="password" />
                <label htmlFor="password">Password</label>
              </div>
            </div>

            <div class="card-action">
              <button onClick={signInHandler} className="btn orange lighten-1 mr15">
                Sign in
              </button>
              <button onClick={signUpHandler} className="btn blue-grey lighten-2">
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
