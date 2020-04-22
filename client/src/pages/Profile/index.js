import React from 'react';

const Profile = (props) => {
  console.log('props', props);
  return (
    <div class="container">
      <h2>Курс валют</h2>
      <div class="row">
        <div class="col s12 ">
          <div class="card">
            <div class="card-content">
              <span class="card-title">Для зарегестрированных пользователей доступно больше информации</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
