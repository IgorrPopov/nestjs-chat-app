import React, { useEffect } from 'react';

const User = ({ user, handleClickOnUser }) => {
  useEffect(() => {
    // // modal
    // const elems = document.querySelectorAll('.modal');
    // console.log({ elems });
    // console.log('eff');
    // const instances = M.Modal.init(elems, {});
  }, []);

  return (
    <div className='user'>
      <div className='user__name'>{user.name}</div>
      <div className='user__call-button'>
        <a
          href='#video_call'
          onClick={() => handleClickOnUser(user)}
          className='btn btn-small modal-trigger'
        >
          <i className='material-icons'>video_call</i>
        </a>
      </div>
    </div>
  );
};

export default User;
