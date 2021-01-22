import React from 'react';

const User = ({ user, handleClickOnUser }) => {
  return (
    <div className='user' key={user._id}>
      <div className='user__name' onClick={() => handleClickOnUser(user)}>
        {user.name}
      </div>
    </div>
  );
};

export default User;
